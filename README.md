# Interactive 3D Character Animation and Motion Dynamics

A feature-rich 3D web application with interactive character animations, scene exploration, and dynamic visual effects built with Three.js.

## Overview

This project combines character animation, scene exploration, and interactive elements to create an immersive Naruto-themed 3D web experience. Users can interact with a character model (Tobirama Senju), explore multiple detailed scenes from the Naruto universe, and apply various visual effects.

## Features

### Character Animation
- Interactive 3D character (Tobirama Senju) with multiple animations:
  - Greeting animation
  - Dancing animation
  - Boxing/fighting animation  
  - Jumping animation
  - Spinning animation
- Smooth animation transitions
- Natural idle animation state

### Scene Exploration
- Multiple detailed 3D environments from the Naruto universe:
  - Hokage Room - The official office of the Hokage
  - Naruto Village - Explore the Hidden Leaf Village
  - Resort - A peaceful vacation spot
  - Hot Spring - Traditional Japanese onsen
- Scene-specific camera positioning and scaling for optimal viewing
- Ability to seamlessly switch between scenes

### Interactive Chat System
- AI-powered character responses
- Natural language processing for command detection
- Command-triggered animations and scene changes
- Contextual conversation history

### Visual Effects
- Dynamic weather systems:
  - Rain effects with thousands of particles
  - Snow effects with realistic swaying motion
- Time-of-day lighting changes:
  - Day mode with bright, natural lighting
  - Night mode with moody, atmospheric lighting
  - Sunset mode with warm orange hues
- Atmospheric elements including clouds and fog

### User Interface
- Intuitive controls for character animations
- Scene selection panel
- Chat interface for character interaction
- Responsive design for various screen sizes
- Fullscreen mode support

## Implementation Status

### Fully Implemented
- 3D rendering with Three.js PerspectiveCamera and OrbitControls
- Material system with MeshStandardMaterial and MeshPhongMaterial
- Lighting system with multiple light types (ambient, directional, hemisphere)
- Scene management and switching between environments
- Character animation controls through buttons and chat commands
- Visual weather effects (rain and snow particle systems)
- Time-of-day lighting changes (day, night, sunset modes)
- UI controls for animation, scene selection, and visual effects
- Chat interface with natural language processing

### Partially Implemented
- Shadow rendering (implemented for character but not all objects)
- Hierarchical modeling (limited to scene structure and model loading)
- Tone mapping (implemented but with limited configuration)
- Server-side components and multiplayer interaction
- Audio and sound effects

### Not Yet Implemented
- Physical simulations (physics, gravity, collision detection)
- Reflections and advanced visual elements
- Alternative input methods beyond mouse and text input

## Usage

### Character Controls
- Use the control buttons to trigger character animations
- Type natural language commands in the chat to control the character
  - Examples: "Do a dance", "Show me your fighting moves", "Jump!"

### Scene Navigation
- Select scenes from the scene selection panel
- Use the "Return to Character" button to go back to character view
- Use natural language in chat to change scenes
  - Examples: "Show me the village", "Take me to the hot spring"

### Visual Effects
- Use natural language commands in chat to change visual effects
  - Examples: "Make it night", "Can you make it rain?", "Show me a sunset"
- Use visual effects buttons to toggle between day, night, and sunset modes
- Toggle weather effects like rain and snow

### Chat Interaction
- Type messages in the chat input
- The character will respond naturally using AI
- Include commands within natural conversation

## Browser Compatibility

The application has been tested and works on:
- Google Chrome (latest)
- Mozilla Firefox (latest)
- Microsoft Edge (latest)
- Safari (latest)

## License

This project is for educational purposes only.

## Acknowledgments

- Three.js for the 3D rendering capabilities
- The Naruto series for the character and scene inspiration
