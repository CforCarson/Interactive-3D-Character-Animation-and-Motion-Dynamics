// SceneState module for handling scene state synchronization with the server
const SceneState = (function() {
    // Private variables
    let isConnected = false;
    let userId = null;
    let currentScene = null;
    let lastSyncTime = 0;
    
    // Server API configuration
    const serverApiUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? 'http://localhost:3000/api' // Development
        : '/api'; // Production
    
    // Initialize connection with server
    async function init() {
        try {
            const response = await axios.get(`${serverApiUrl}/status`);
            if (response.data.status === 'online') {
                isConnected = true;
                userId = generateUserId();
                console.log("Connected to server, user ID:", userId);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Failed to connect to server:", error);
            return false;
        }
    }
    
    // Generate a unique user ID
    function generateUserId() {
        return 'user_' + Math.random().toString(36).substring(2, 15);
    }
    
    // Update scene state on the server
    async function updateSceneState(sceneName, characterPosition, characterRotation, timeOfDay, weatherEffects) {
        if (!isConnected || !userId) {
            console.warn("Not connected to server, can't update scene state");
            return false;
        }
        
        // Don't send updates too frequently (limit to one per second)
        const now = Date.now();
        if (now - lastSyncTime < 1000) {
            return false;
        }
        
        lastSyncTime = now;
        currentScene = sceneName;
        
        try {
            const sceneState = {
                userId,
                timestamp: now,
                sceneName,
                characterPosition,
                characterRotation,
                timeOfDay,
                weatherEffects
            };
            
            const response = await axios.post(`${serverApiUrl}/scene-state`, sceneState);
            return response.data.status === 'received';
        } catch (error) {
            console.error("Failed to update scene state:", error);
            return false;
        }
    }
    
    // Get the connection status
    function getConnectionStatus() {
        return {
            isConnected,
            userId,
            currentScene
        };
    }
    
    // Public API
    return {
        init,
        updateSceneState,
        getConnectionStatus
    };
})(); 