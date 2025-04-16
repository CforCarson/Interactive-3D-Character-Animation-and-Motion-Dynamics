// UI module for handling user interface events and interactions
const UI = (function() {
    // Initialize UI event handlers
    function init() {
        // Character animation buttons
        document.getElementById('greetBtn').addEventListener('click', Character.playGreetAnimation);
        document.getElementById('danceBtn').addEventListener('click', Character.playDanceAnimation);
        document.getElementById('boxingBtn').addEventListener('click', Character.playBoxingAnimation);
        document.getElementById('jumpBtn').addEventListener('click', Character.playJumpAnimation);
        document.getElementById('spinBtn').addEventListener('click', Character.playSpinAnimation);
        
        // Scene buttons (done with inline onclick in HTML)
        
        // Return to character button
        document.getElementById('returnToCharacterBtn').addEventListener('click', Scenes.returnToCharacter);
        
        // Effect buttons (done with inline onclick in HTML)
        
        // Chat features
        document.getElementById('sendBtn').addEventListener('click', Chat.handleSendMessage);
        document.getElementById('chatInput').addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                Chat.handleSendMessage();
            }
        });
        
        // Speech toggle
        document.getElementById('toggleSpeechBtn').addEventListener('click', toggleSpeech);
        
        // Fullscreen button
        document.getElementById('fullscreenBtn').addEventListener('click', toggleFullscreen);
        
        // Add window resize handler
        window.addEventListener('resize', handleResize);
    }
    
    // Toggle speech on/off
    function toggleSpeech() {
        const isSpeechEnabled = Chat.toggleSpeech();
        const speechIcon = document.getElementById('speechIcon');
        const toggleBtn = document.getElementById('toggleSpeechBtn');
        
        if (isSpeechEnabled) {
            speechIcon.textContent = '🔊';
            toggleBtn.style.backgroundColor = '#4CAF50';
            toggleBtn.title = 'Disable Speech';
        } else {
            speechIcon.textContent = '🔇';
            toggleBtn.style.backgroundColor = '#F44336';
            toggleBtn.title = 'Enable Speech';
        }
    }
    
    // Toggle fullscreen mode
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }
    
    // Handle window resize
    function handleResize() {
        App.camera.aspect = window.innerWidth / window.innerHeight;
        App.camera.updateProjectionMatrix();
        App.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    // Update scene buttons to use module functions
    function updateSceneButtons() {
        // Update inline onclick handlers to use the module functions
        const sceneButtons = document.querySelectorAll('.sceneButton');
        sceneButtons.forEach(button => {
            if (button.id !== 'returnToCharacterBtn') {
                const scenePath = button.getAttribute('onclick').match(/'([^']+)'/)[1];
                button.onclick = function() {
                    Scenes.loadScene(scenePath);
                };
            }
        });
    }
    
    // Update effect buttons to use module functions
    function updateEffectButtons() {
        // Day/Night/Sunset buttons
        const dayButton = document.querySelector('.effectButton[onclick="applyShaderEffect(\'day\')"]');
        if (dayButton) dayButton.onclick = function() { Effects.applyShaderEffect('day'); };
        
        const nightButton = document.querySelector('.effectButton[onclick="applyShaderEffect(\'night\')"]');
        if (nightButton) nightButton.onclick = function() { Effects.applyShaderEffect('night'); };
        
        const sunsetButton = document.querySelector('.effectButton[onclick="applyShaderEffect(\'sunset\')"]');
        if (sunsetButton) sunsetButton.onclick = function() { Effects.applyShaderEffect('sunset'); };
        
        // Weather effect buttons
        const rainButton = document.querySelector('.effectButton[onclick="toggleRainEffect()"]');
        if (rainButton) rainButton.onclick = Effects.toggleRainEffect;
        
        const snowButton = document.querySelector('.effectButton[onclick="toggleSnowEffect()"]');
        if (snowButton) snowButton.onclick = Effects.toggleSnowEffect;
        
        const resetButton = document.querySelector('.effectButton[onclick="resetAllEffects()"]');
        if (resetButton) resetButton.onclick = Effects.resetAllEffects;
    }
    
    // Public API
    return {
        init,
        toggleFullscreen,
        handleResize,
        updateSceneButtons,
        updateEffectButtons,
        toggleSpeech
    };
})(); 