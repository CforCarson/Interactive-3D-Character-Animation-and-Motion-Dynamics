# Tobirama Character Animation Module

An interactive 3D character animation system featuring Tobirama Senju from the Naruto series, with multiple animations and AI-powered conversational capabilities.

![Tobirama Preview](normal.glb)

## Overview

This module provides a fully interactive 3D character (Tobirama Senju) with multiple animation states, AI-powered conversation, and natural language command processing. The character integrates seamlessly with the scene viewer module to create an immersive experience.

## Features

### Character Model
- Detailed 3D model of Tobirama Senju
- High-quality textures and materials
- Optimized for web performance

### Animation System
- Multiple animation states:
  - Normal/Idle animation
  - Greeting animation
  - Dancing animation
  - Boxing/fighting animation
  - Jumping animation
  - Spinning animation
  - Speaking animation (synchronized with AI responses)
- Smooth transitions between animations
- Single-play animations with automatic return to idle state

### AI Integration
- Conversational AI with character-appropriate responses
- Natural language processing for command detection
- Context-aware responses that maintain conversation history
- Command recognition for triggering animations, scene changes, and visual effects

### User Interaction
- Button controls for triggering animations
- Chat interface for direct communication with the character
- Natural language commands within conversations

## Integration

The character module integrates with the scene viewer module to provide:
- Seamless switching between character view and scene exploration
- Character-controlled scene navigation through natural language
- Unified visual effects system
- Consistent UI/UX across both modules

## Project Structure

The primary character files are organized as follows:

```
tobirama/
├── normal.glb        # Base character model with idle animation
├── greet.glb         # Greeting animation
├── dance.glb         # Dancing animation
├── boxing.glb        # Boxing/fighting animation
├── jump.glb          # Jumping animation
├── spin.glb          # Spinning animation
├── Speaking.glb      # Speaking animation for chat responses
└── README.md         # Documentation
```

## Technical Implementation

### Animation System
The character animations are implemented using GLB files with embedded animations. Each animation is loaded dynamically when triggered, with the system handling the proper cleanup and state management.

### AI System
The conversational AI uses a GPT-based language model with custom system prompts to maintain character authenticity. All responses are processed through the character's perspective.

### Command Processing
Natural language commands are processed using keyword detection with a sophisticated categorization system:
- Animation commands (greet, dance, box, jump, spin)
- Scene navigation commands (switch to different scenes)
- Visual effect commands (day/night modes, weather effects)

## Usage

The character responds to both button clicks and natural language commands. Example commands include:

- "Hello" or "Greet me" - Triggers greeting animation
- "Dance for me" - Triggers dancing animation
- "Show me your fighting skills" - Triggers boxing animation
- "Jump" - Triggers jumping animation
- "Spin around" - Triggers spinning animation
- "Take me to the village" - Changes to the Naruto Village scene
- "Show me the hot spring" - Changes to the Hot Spring scene
- "Make it night" - Applies night lighting effect
- "Can you make it rain?" - Toggles rain effect

## License

This project is for educational purposes only.

## Acknowledgments

- Three.js for the 3D rendering and animation capabilities
- The Naruto series for the Tobirama Senju character 