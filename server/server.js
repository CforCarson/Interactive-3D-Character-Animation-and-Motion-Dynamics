const express = require('express');
const path = require('path');
const cors = require('cors');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..'))); // Serve static files from the root directory

// API routes
// Chat endpoint - proxy to OpenAI compatible API
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, mode } = req.body;
    
    // OpenAI API configuration
    const openaiApiKey = "sk-nqtowru7qRRut0ST1056C083DeEf45958b47Ea8d53C79f87";
    const openaiBaseUrl = "https://api.gpt.ge/v1/";
    
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
    
    // Return the response to the client
    res.json(response.data);
  } catch (error) {
    console.error('Error processing chat:', error.message);
    res.status(500).json({ error: 'Error processing chat request' });
  }
});

// Scene state endpoint (for future multiplayer functionality)
app.post('/api/scene-state', (req, res) => {
  // This could be used to track scene state for multiple users
  // For now, just echo back the state to confirm it was received
  res.json({ status: 'received', data: req.body });
});

// Server status endpoint
app.get('/api/status', (req, res) => {
  res.json({ status: 'online', version: '1.0' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 