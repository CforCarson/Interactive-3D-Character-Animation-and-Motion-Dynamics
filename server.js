const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Define routes for each demo page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/fbx-animation', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'fbx_animation_click_switch.html'));
});

app.get('/glb-lighting', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'glb_animation_lighting_demo.html'));
});

app.get('/glb-button', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'glb_animation_button_control.html'));
});

// API endpoint example - could be expanded for dynamic content
app.get('/api/models', (req, res) => {
  const models = [
    { id: 1, name: 'Character 1', type: 'FBX', path: '3d_assets/Standing1.fbx' },
    { id: 2, name: 'Character 2', type: 'GLB', path: '3d_assets/111.glb' },
    { id: 3, name: 'Normal', type: 'GLB', path: '3d_assets/normal.glb' },
    { id: 4, name: 'Greet', type: 'GLB', path: '3d_assets/greet.glb' }
  ];
  
  res.json(models);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 