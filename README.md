# Interactive 3D Character Animation and Motion Dynamics

A feature-rich 3D web application with interactive character animations, scene exploration, and dynamic visual effects built with Three.js.

## Overview

This project combines character animation, scene exploration, and interactive elements to create an immersive Naruto-themed 3D web experience. Users can interact with a character model (Tobirama Senju), explore multiple detailed scenes from the Naruto universe, and apply various visual effects.

## Client-Server Architecture

The application now features a client-server architecture:

### Server Component
- Express.js based API server
- Handles chat message processing via OpenAI-compatible API
- Stores and synchronizes scene state information
- Enables potential for multi-user interactions

### Client Component
- Three.js based 3D rendering
- Communicates with server for chat and scene synchronization
- Falls back to local mode when server is unavailable

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
- AI-powered character responses via server API
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
- Server status indicator

## Installation

### Client
The client is a static web application that can be hosted on any web server.

### Server
Server setup instructions are available in the [server README](server/README.md).

## Running the Application

### Development Mode

1. Start the server:
   ```
   cd server
   npm install
   npm run dev
   ```

2. Open the client in your browser:
   - If running locally, navigate to `http://localhost:3000`
   - The application will also work without the server in a fallback local mode

### Production Deployment

1. Deploy the server on your preferred hosting platform
2. Configure the client's server API URL if necessary
3. Host the static client files on a web server

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
- Express.js for the server framework
