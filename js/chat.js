// Chat module for handling chat and NLP commands
const Chat = (function() {
    // Private variables
    let characterChatContext = []; // Store conversation history for character mode
    let systemChatContext = [];    // Store conversation history for system mode
    const characterName = "Tobirama"; // Character name
    let chatMode = "character"; // Default chat mode: "character" or "system"
    
    // Server API configuration
    const serverApiUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? 'http://localhost:3000/api' // Development
        : '/api'; // Production
    
    // Speech synthesis configuration
    let speechSynthesis = window.speechSynthesis;
    let isSpeechEnabled = true;
    let availableVoices = [];
    let selectedVoiceIndex = -1; // Default: auto-select
    
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
    
    // Function to get all available voices
    function getAvailableVoices() {
        return availableVoices.length > 0 ? availableVoices : speechSynthesis.getVoices();
    }
    
    // Function to set a specific voice by index
    function setVoiceByIndex(index) {
        const voices = getAvailableVoices();
        if (voices && index >= 0 && index < voices.length) {
            selectedVoiceIndex = index;
            console.log("Voice set to:", voices[index].name);
            return true;
        }
        return false;
    }
    
    // Display available voices in the console and return them
    function showAvailableVoices() {
        const voices = getAvailableVoices();
        console.log("Available voices:");
        
        if (voices && voices.length > 0) {
            voices.forEach((voice, index) => {
                console.log(`${index}: ${voice.name} (${voice.lang})`);
            });
            return voices;
        } else {
            console.log("No voices available");
            return [];
        }
    }
    
    // Function to speak text with a deep male voice
    function speakText(text) {
        if (!isSpeechEnabled) return;
        
        // Stop any current speech
        speechSynthesis.cancel();
        
        // Create a new speech utterance
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Set voice properties for a deep male voice - start with these defaults
        utterance.pitch = 0.5;       // Very low pitch for deeper voice
        utterance.rate = 0.9;        // Slightly slower rate
        utterance.volume = 1.0;      // Full volume
        
        // Get available voices
        const voices = getAvailableVoices();
        
        // If user has manually selected a voice, use that
        if (selectedVoiceIndex >= 0 && voices && selectedVoiceIndex < voices.length) {
            utterance.voice = voices[selectedVoiceIndex];
            console.log("Using user-selected voice:", utterance.voice.name);
        }
        // Otherwise, try to find a suitable male voice
        else if (voices && voices.length > 0) {
            let voiceFound = false;
            console.log("Available voices:", voices.length);
            
            // APPROACH 1: Try to find explicit male voices
            const explicitMaleVoices = voices.filter(voice => 
                voice.name.toLowerCase().includes('male') || 
                voice.name.toLowerCase().includes(' man') ||
                voice.name.toLowerCase().includes('guy')
            );
            
            if (explicitMaleVoices.length > 0) {
                utterance.voice = explicitMaleVoices[0];
                console.log("Using explicit male voice:", utterance.voice.name);
                voiceFound = true;
            }
            
            // APPROACH 2: Try to find common male name voices
            if (!voiceFound) {
                const maleNameVoices = voices.filter(voice => 
                    voice.name.toLowerCase().includes('david') ||
                    voice.name.toLowerCase().includes('james') ||
                    voice.name.toLowerCase().includes('john') ||
                    voice.name.toLowerCase().includes('tom') ||
                    voice.name.toLowerCase().includes('bruce') ||
                    voice.name.toLowerCase().includes('fred') ||
                    voice.name.toLowerCase().includes('eric') ||
                    voice.name.toLowerCase().includes('paul') ||
                    voice.name.toLowerCase().includes('daniel') ||
                    voice.name.toLowerCase().includes('victor') ||
                    voice.name.toLowerCase().includes('george')
                );
                
                if (maleNameVoices.length > 0) {
                    utterance.voice = maleNameVoices[0];
                    console.log("Using male name voice:", utterance.voice.name);
                    voiceFound = true;
                }
            }
            
            // APPROACH 3: Try Microsoft David specifically (common in Windows)
            if (!voiceFound) {
                const microsoftDavid = voices.find(voice => 
                    voice.name.includes('David') && voice.name.includes('Microsoft')
                );
                
                if (microsoftDavid) {
                    utterance.voice = microsoftDavid;
                    console.log("Using Microsoft David voice");
                    voiceFound = true;
                }
            }
            
            // APPROACH 4: Try English male voices generally
            if (!voiceFound) {
                const englishVoices = voices.filter(voice => 
                    (voice.lang === 'en-US' || voice.lang === 'en-GB') &&
                    !voice.name.toLowerCase().includes('female') &&
                    !voice.name.toLowerCase().includes('woman') &&
                    !voice.name.toLowerCase().includes('girl')
                );
                
                if (englishVoices.length > 0) {
                    utterance.voice = englishVoices[0];
                    console.log("Using English voice:", utterance.voice.name);
                    voiceFound = true;
                }
            }
            
            // APPROACH 5: Last resort - choose the first English voice
            if (!voiceFound) {
                const englishVoices = voices.filter(voice => 
                    voice.lang === 'en-US' || voice.lang === 'en-GB'
                );
                
                if (englishVoices.length > 0) {
                    utterance.voice = englishVoices[0];
                    // Force very low pitch to try to make any voice deeper
                    utterance.pitch = 0.3;
                    console.log("Using fallback English voice with reduced pitch:", utterance.voice.name);
                    voiceFound = true;
                }
            }
            
            // Last fallback - if still no voice found, browser will use default
            if (!voiceFound) {
                console.log("No suitable voice found. Using browser default with low pitch.");
                utterance.pitch = 0.3; // Very low pitch as last resort
            }
        }
        
        // Log the voice being used
        if (utterance.voice) {
            console.log("Selected voice:", utterance.voice.name, utterance.voice.lang);
        } else {
            console.log("Using default voice with pitch:", utterance.pitch);
        }
        
        // Only use speaking animation in character mode
        if (chatMode === "character") {
            // Speak the text
            speechSynthesis.speak(utterance);
            
            // Ensure character continues speaking animation while audio plays
            utterance.onstart = function() {
                Character.playSpeakingAnimation();
            };
            
            // Stop animation when speech ends
            utterance.onend = function() {
                // This call will properly restore the idle animation with preserved position
                Character.playIdleAnimation();
            };
            
            // Also handle cases where speech might be interrupted or canceled
            utterance.onerror = function() {
                Character.playIdleAnimation();
            };
        } else {
            // In system mode, just speak without animation
            speechSynthesis.speak(utterance);
        }
    }
    
    // Toggle speech on/off
    function toggleSpeech() {
        isSpeechEnabled = !isSpeechEnabled;
        return isSpeechEnabled;
    }
    
    // Toggle chat mode between character and system
    function toggleChatMode() {
        chatMode = chatMode === "character" ? "system" : "character";
        
        // Update the chat input placeholder based on the mode
        const chatInput = document.getElementById('chatInput');
        if (chatMode === "character") {
            chatInput.placeholder = "Talk to the character...";
        } else {
            chatInput.placeholder = "System commands for visual effects...";
        }
        
        return chatMode;
    }
    
    // Get current chat mode
    function getChatMode() {
        return chatMode;
    }
    
    // Get the appropriate chat context based on current mode
    function getCurrentChatContext() {
        return chatMode === "character" ? characterChatContext : systemChatContext;
    }
    
    // Function to send a message to the server API
    async function sendMessageToLLM(message) {
        try {
            // Show loading indicator
            document.getElementById('loading').style.display = 'block';
            
            if (chatMode === "character") {
                document.getElementById('loading').textContent = 'Tobirama is thinking...';
            } else {
                document.getElementById('loading').textContent = 'System is processing...';
            }
            
            // Prepare messages array with context for the API
            let messages = [];
            
            if (chatMode === "character") {
                // Character mode system message
                messages.push({
                    "role": "system",
                    "content": `You are ${characterName} 千手扉间 from the Naruto universe. You are the Second Hokage of the Hidden Leaf Village, known for your serious demeanor, intelligence, and water-style jutsu. Respond as this character would, with brief, focused answers that match the character's personality.`
                });
                
                // Add character conversation history for context
                characterChatContext.forEach(item => {
                    messages.push(item);
                });
            } else {
                // System mode system message
                messages.push({
                    "role": "system",
                    "content": "You are a helpful system assistant managing visual effects for a 3D viewer application. Help the user with visual effect commands such as lighting changes (day, night, sunset) and weather effects (rain, snow). Keep responses brief and professional."
                });
                
                // Add system conversation history for context
                systemChatContext.forEach(item => {
                    messages.push(item);
                });
            }
            
            // Add the current user message
            messages.push({
                "role": "user",
                "content": message
            });
            
            // Make the API request to our server instead of directly to OpenAI
            const response = await axios({
                method: 'post',
                url: `${serverApiUrl}/chat`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    messages: messages,
                    mode: chatMode
                }
            });
            
            // Get the response text
            const responseText = response.data.choices[0].message.content;
            
            // Update the appropriate chat context based on current mode
            if (chatMode === "character") {
                characterChatContext.push({ role: "user", content: message });
                characterChatContext.push({ role: "assistant", content: responseText });
                
                // Keep context size manageable (last 10 message pairs)
                if (characterChatContext.length > 20) {
                    characterChatContext = characterChatContext.slice(characterChatContext.length - 20);
                }
            } else {
                systemChatContext.push({ role: "user", content: message });
                systemChatContext.push({ role: "assistant", content: responseText });
                
                // Keep context size manageable (last 10 message pairs)
                if (systemChatContext.length > 20) {
                    systemChatContext = systemChatContext.slice(systemChatContext.length - 20);
                }
            }
            
            // Hide loading indicator
            document.getElementById('loading').style.display = 'none';
            
            // Trigger speaking animation for chat responses in character mode
            if (chatMode === "character") {
                Character.playSpeakingAnimation();
            }
            
            // Speak the response text
            speakText(responseText);
            
            return responseText;
        } catch (error) {
            console.error("Error communicating with server API:", error);
            document.getElementById('loading').style.display = 'none';
            return "I'm having trouble responding right now. Please try again later.";
        }
    }
    
    // Function to add a message to the chat history UI
    function addMessageToChat(message, isUser) {
        const chatHistory = document.getElementById('chatHistory');
        const messageElement = document.createElement('div');
        
        if (isUser) {
            messageElement.className = 'message user-message';
        } else {
            // Use different class for system vs character messages
            messageElement.className = chatMode === "character" ? 
                'message character-message' : 'message system-message';
        }
        
        messageElement.textContent = message;
        chatHistory.appendChild(messageElement);
        
        // Scroll to the bottom to show the newest message
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }
    
    // NLP command processor for interpreting chat messages
    function processNLPCommands(message) {
        const lowercaseMsg = message.toLowerCase();
        let commandExecuted = false;
        
        // Voice control commands (available in both modes)
        // Voice on/off commands
        if (lowercaseMsg.includes('stop speaking') || lowercaseMsg.includes('mute voice') || 
            lowercaseMsg.includes('turn off voice') || lowercaseMsg.includes('disable speech')) {
            isSpeechEnabled = false;
            commandExecuted = true;
        } else if (lowercaseMsg.includes('start speaking') || lowercaseMsg.includes('unmute voice') || 
                   lowercaseMsg.includes('turn on voice') || lowercaseMsg.includes('enable speech')) {
            isSpeechEnabled = true;
            commandExecuted = true;
        }
        
        // Voice selection commands
        if (lowercaseMsg.includes('list voices') || lowercaseMsg.includes('show voices') || 
            lowercaseMsg.includes('available voices')) {
            const voices = showAvailableVoices();
            
            // Add the voice list to the chat as a system message
            if (voices.length > 0) {
                let voiceMessage = "Available voices:\n";
                voices.forEach((voice, index) => {
                    voiceMessage += `${index}: ${voice.name} (${voice.lang})\n`;
                });
                voiceMessage += "\nUse 'set voice [number]' to select a voice.";
                
                // Custom message to chat - don't send to LLM
                addMessageToChat(voiceMessage, false);
            } else {
                addMessageToChat("No voices available.", false);
            }
            commandExecuted = true;
        } 
        // Set voice command - pattern: "set voice 3" or "use voice 3"
        else if ((lowercaseMsg.includes('set voice') || lowercaseMsg.includes('use voice')) && 
                 /\d+/.test(lowercaseMsg)) {
            // Extract the number from the command
            const match = lowercaseMsg.match(/\d+/);
            if (match) {
                const voiceIndex = parseInt(match[0]);
                if (setVoiceByIndex(voiceIndex)) {
                    addMessageToChat(`Voice set to index ${voiceIndex}.`, false);
                    
                    // Test the voice
                    speakText("Voice has been changed. This is how I sound now.");
                } else {
                    addMessageToChat(`Invalid voice index ${voiceIndex}.`, false);
                }
                commandExecuted = true;
            }
        }
        // Voice pitch controls
        else if (lowercaseMsg.includes('deeper voice') || lowercaseMsg.includes('lower pitch')) {
            const voices = getAvailableVoices();
            if (selectedVoiceIndex >= 0 && voices && selectedVoiceIndex < voices.length) {
                // Using manual selected voice, just confirm we'll make it deeper
                addMessageToChat("I'll speak with a deeper voice.", false);
                
                // Test with deeper voice
                const utterance = new SpeechSynthesisUtterance("My voice is now deeper.");
                utterance.voice = voices[selectedVoiceIndex];
                utterance.pitch = 0.3; // Very low
                speechSynthesis.speak(utterance);
            } else {
                // Try to find a deeper voice
                const maleVoices = voices.filter(voice => 
                    voice.name.toLowerCase().includes('male') || 
                    voice.name.toLowerCase().includes('david')
                );
                
                if (maleVoices.length > 0) {
                    selectedVoiceIndex = voices.indexOf(maleVoices[0]);
                    addMessageToChat(`Switched to deeper voice: ${maleVoices[0].name}`, false);
                    
                    // Test the voice
                    speakText("My voice is now deeper.");
                } else {
                    addMessageToChat("I'll try to speak with a deeper voice.", false);
                    // Test with current voice but deeper pitch
                    const utterance = new SpeechSynthesisUtterance("My voice is now deeper.");
                    utterance.pitch = 0.3; // Very low
                    speechSynthesis.speak(utterance);
                }
            }
            commandExecuted = true;
        }
        
        // Process commands based on current chat mode
        if (chatMode === "character") {
            // Character animation commands - only in character mode
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
            
            // Scene change commands - only in character mode
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
        } else if (chatMode === "system") {
            // Shader/visual effect commands - only in system mode
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
            
            // Cancel any ongoing speech
            if (isSpeechEnabled) {
                speechSynthesis.cancel();
            }
            
            // Reset to idle state before processing new commands if in character mode
            if (chatMode === "character" && App.isPlayingGreet && App.isCharacterView) {
                Character.playIdleAnimation();
            }
            
            // Process for NLP commands
            const commandExecuted = processNLPCommands(userMessage);
            
            // Get response from LLM
            const response = await sendMessageToLLM(userMessage);
            
            // Process LLM response for potential command triggers - only needed in character mode
            if (chatMode === "character") {
                processNLPCommands(response);
            }
            
            // Add character/system response to chat
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
        toggleChatMode,
        getChatMode,
        isSpeechEnabled: function() { return isSpeechEnabled; },
        getAvailableVoices,
        setVoiceByIndex,
        showAvailableVoices
    };
})(); 