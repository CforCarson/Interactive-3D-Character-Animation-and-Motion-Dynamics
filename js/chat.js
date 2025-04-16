// Chat module for handling chat and NLP commands
const Chat = (function() {
    // Private variables
    let chatContext = []; // Store conversation history for context
    const characterName = "Tobirama"; // Character name
    
    // OpenAI API configuration
    const openaiApiKey = "sk-nqtowru7qRRut0ST1056C083DeEf45958b47Ea8d53C79f87";
    const openaiBaseUrl = "https://api.gpt.ge/v1/";
    
    // Speech synthesis configuration
    let speechSynthesis = window.speechSynthesis;
    let isSpeechEnabled = true;
    let availableVoices = [];
    
    // Function to populate available voices
    function loadVoices() {
        availableVoices = speechSynthesis.getVoices();
        console.log("Speech synthesis voices loaded:", availableVoices.length);
    }
    
    // Load voices when they become available
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices;
    }
    
    // Initial load of voices (might already be available)
    loadVoices();
    
    // Function to speak text with a deep male voice
    function speakText(text) {
        if (!isSpeechEnabled) return;
        
        // Stop any current speech
        speechSynthesis.cancel();
        
        // Create a new speech utterance
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Set voice properties for a deep male voice
        utterance.pitch = 0.8;      // Lower pitch for deeper voice
        utterance.rate = 0.9;       // Slightly slower rate
        utterance.volume = 1.0;     // Full volume
        
        // Try to find a suitable male voice
        if (availableVoices.length > 0) {
            // First try to find deep male voices
            const maleVoices = availableVoices.filter(voice => 
                voice.name.toLowerCase().includes('male') || 
                voice.name.toLowerCase().includes('man') ||
                voice.name.toLowerCase().includes('guy') ||
                voice.name.toLowerCase().includes('david') ||
                voice.name.toLowerCase().includes('tom') ||
                voice.name.toLowerCase().includes('daniel') ||
                voice.name.toLowerCase().includes('james')
            );
            
            // If male voices are found, use the first one
            if (maleVoices.length > 0) {
                utterance.voice = maleVoices[0];
                console.log("Using male voice:", maleVoices[0].name);
            } else {
                // If no male voice found, try to use a voice with lower pitch
                // Default to first voice if none matching
                utterance.pitch = 0.5; // Even lower pitch to compensate
            }
        }
        
        // Speak the text
        speechSynthesis.speak(utterance);
        
        // Ensure character continues speaking animation while audio plays
        utterance.onstart = function() {
            Character.playSpeakingAnimation();
        };
        
        // Stop animation when speech ends
        utterance.onend = function() {
            // Reset to idle animation if speech ends
            if (App.currentAction && App.currentAction.getClip().name === "Speaking") {
                Character.playIdleAnimation();
            }
        };
    }
    
    // Toggle speech on/off
    function toggleSpeech() {
        isSpeechEnabled = !isSpeechEnabled;
        return isSpeechEnabled;
    }
    
    // Function to send a message to the OpenAI API
    async function sendMessageToLLM(message) {
        try {
            // Show loading indicator
            document.getElementById('loading').style.display = 'block';
            document.getElementById('loading').textContent = 'Tobirama is thinking...';
            
            // Prepare messages array with context for the API
            let messages = [
                {
                    "role": "system",
                    "content": `You are ${characterName} 千手扉间 from the Naruto universe. You are the Second Hokage of the Hidden Leaf Village, known for your serious demeanor, intelligence, and water-style jutsu. Respond as this character would, with brief, focused answers that match the character's personality.`
                }
            ];
            
            // Add conversation history for context
            chatContext.forEach(item => {
                messages.push(item);
            });
            
            // Add the current user message
            messages.push({
                "role": "user",
                "content": message
            });
            
            // Make the API request
            const response = await axios({
                method: 'post',
                url: openaiBaseUrl + 'chat/completions',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${openaiApiKey}`,
                    'x-foo': 'true'
                },
                data: {
                    model: 'gpt-3.5-turbo',
                    messages: messages
                }
            });
            
            // Get the response text
            const responseText = response.data.choices[0].message.content;
            
            // Update chat context (store up to 10 messages for context)
            chatContext.push({ role: "user", content: message });
            chatContext.push({ role: "assistant", content: responseText });
            
            // Keep context size manageable (last 10 messages)
            if (chatContext.length > 20) {
                chatContext = chatContext.slice(chatContext.length - 20);
            }
            
            // Hide loading indicator
            document.getElementById('loading').style.display = 'none';
            
            // Trigger speaking animation for chat responses
            Character.playSpeakingAnimation();
            
            // Speak the response text
            speakText(responseText);
            
            return responseText;
        } catch (error) {
            console.error("Error communicating with LLM API:", error);
            document.getElementById('loading').style.display = 'none';
            return "I'm having trouble responding right now. Please try again later.";
        }
    }
    
    // Function to add a message to the chat history UI
    function addMessageToChat(message, isUser) {
        const chatHistory = document.getElementById('chatHistory');
        const messageElement = document.createElement('div');
        messageElement.className = isUser ? 'message user-message' : 'message character-message';
        messageElement.textContent = message;
        chatHistory.appendChild(messageElement);
        
        // Scroll to the bottom to show the newest message
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }
    
    // NLP command processor for interpreting chat messages
    function processNLPCommands(message) {
        const lowercaseMsg = message.toLowerCase();
        let commandExecuted = false;
        
        // Handle voice commands
        if (lowercaseMsg.includes('stop speaking') || lowercaseMsg.includes('mute voice') || 
            lowercaseMsg.includes('turn off voice') || lowercaseMsg.includes('disable speech')) {
            isSpeechEnabled = false;
            commandExecuted = true;
        } else if (lowercaseMsg.includes('start speaking') || lowercaseMsg.includes('unmute voice') || 
                   lowercaseMsg.includes('turn on voice') || lowercaseMsg.includes('enable speech')) {
            isSpeechEnabled = true;
            commandExecuted = true;
        }
        
        // Character animation commands
        if (lowercaseMsg.includes('greet') || lowercaseMsg.includes('hello') || lowercaseMsg.includes('hi')) {
            setTimeout(() => Character.playGreetAnimation(), 500);
            commandExecuted = true;
        } else if (lowercaseMsg.includes('dance') || lowercaseMsg.includes('dancing')) {
            setTimeout(() => Character.playDanceAnimation(), 500);
            commandExecuted = true;
        } else if (lowercaseMsg.includes('box') || lowercaseMsg.includes('boxing') || lowercaseMsg.includes('fight')) {
            setTimeout(() => Character.playBoxingAnimation(), 500);
            commandExecuted = true;
        } else if (lowercaseMsg.includes('jump')) {
            setTimeout(() => Character.playJumpAnimation(), 500);
            commandExecuted = true;
        } else if (lowercaseMsg.includes('spin') || lowercaseMsg.includes('turn around')) {
            setTimeout(() => Character.playSpinAnimation(), 500);
            commandExecuted = true;
        }
        
        // Scene change commands
        if (lowercaseMsg.includes('hokage office') || lowercaseMsg.includes('hokage room')) {
            setTimeout(() => Scenes.loadScene('Scenes/scene1_HokageRoom.glb'), 500);
            commandExecuted = true;
        } else if (lowercaseMsg.includes('village') || lowercaseMsg.includes('naruto village')) {
            setTimeout(() => Scenes.loadScene('Scenes/scene2_NarutoVillage.glb'), 500);
            commandExecuted = true;
        } else if (lowercaseMsg.includes('resort')) {
            setTimeout(() => Scenes.loadScene('Scenes/scene3_Resort.glb'), 500);
            commandExecuted = true;
        } else if (lowercaseMsg.includes('hot spring') || lowercaseMsg.includes('onsen')) {
            setTimeout(() => Scenes.loadScene('Scenes/scene4_HotSpring.glb'), 500);
            commandExecuted = true;
        } else if (lowercaseMsg.includes('character view') || lowercaseMsg.includes('show character')) {
            setTimeout(() => {
                App.isCharacterView = true;
                Character.loadCharacter();
            }, 500);
            commandExecuted = true;
        }
        
        // Shader/visual effect commands
        if (lowercaseMsg.includes('night mode') || lowercaseMsg.includes('dark mode') || lowercaseMsg.includes('make it night')) {
            Effects.applyShaderEffect('night');
            commandExecuted = true;
        } else if (lowercaseMsg.includes('day mode') || lowercaseMsg.includes('light mode') || lowercaseMsg.includes('make it day')) {
            Effects.applyShaderEffect('day');
            commandExecuted = true;
        } else if (lowercaseMsg.includes('sunset') || lowercaseMsg.includes('orange sky')) {
            Effects.applyShaderEffect('sunset');
            commandExecuted = true;
        } else if (lowercaseMsg.includes('rain') || lowercaseMsg.includes('make it rain')) {
            Effects.toggleRainEffect();
            commandExecuted = true;
        } else if (lowercaseMsg.includes('snow') || lowercaseMsg.includes('make it snow')) {
            Effects.toggleSnowEffect();
            commandExecuted = true;
        } else if (lowercaseMsg.includes('reset effects') || lowercaseMsg.includes('clear effects')) {
            Effects.resetAllEffects();
            commandExecuted = true;
        }
        
        return commandExecuted;
    }
    
    // Function to handle sending a chat message
    async function handleSendMessage() {
        const chatInput = document.getElementById('chatInput');
        const userMessage = chatInput.value.trim();
        
        if (userMessage) {
            // Add user message to chat
            addMessageToChat(userMessage, true);
            
            // Clear input field
            chatInput.value = '';
            
            // Process for NLP commands
            const commandExecuted = processNLPCommands(userMessage);
            
            // Get response from LLM
            const response = await sendMessageToLLM(userMessage);
            
            // Process LLM response for potential command triggers
            processNLPCommands(response);
            
            // Add character response to chat
            addMessageToChat(response, false);
        }
    }
    
    // Initialize chat event listeners
    function initChatListeners() {
        document.getElementById('sendBtn').addEventListener('click', handleSendMessage);
        
        // Allow sending message with Enter key
        document.getElementById('chatInput').addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                handleSendMessage();
            }
        });
    }
    
    // Public API
    return {
        addMessageToChat,
        processNLPCommands,
        handleSendMessage,
        sendMessageToLLM,
        initChatListeners,
        toggleSpeech,
        isSpeechEnabled: function() { return isSpeechEnabled; }
    };
})(); 