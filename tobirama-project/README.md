# Tobirama Project

A 3D character animation demo project featuring various animation techniques using Three.js.

## Project Structure

The project has been organized for better readability and maintainability:

```
src/
├── assets/
│   ├── animations/     # Animation files (.fbx)
│   ├── models/         # 3D model files (.glb, .obj)
│   └── textures/       # Texture images
├── pages/              # Individual demo pages
│   ├── character-animation-fbx.html           # FBX animation demo
│   ├── character-animation-glb.html           # GLB model with enhanced lighting
│   └── character-animation-interactive.html   # Interactive animation control demo
└── index.html          # Main entry point with links to all demos
```

## Available Demos

1. **FBX Animation Demo** - Demonstrates loading and switching between two FBX animations. Click on the character to trigger an animation switch.

2. **GLB Animation with Enhanced Lighting** - Shows a GLB model with optimized lighting setup to enhance character visualization.

3. **Interactive Character Animation** - Features an interactive button to switch between normal idle animation and a greeting animation.

## Running the Project

Simply open the `src/index.html` file in a modern web browser to access all demos.

## Technical Stack

- Three.js for 3D rendering
- GLTFLoader for GLB models
- FBXLoader for FBX animations
- OrbitControls for camera control

## Notes

This project demonstrates various techniques for 3D character animation on the web, including:

- Loading and displaying 3D models
- Playing animations from model files
- Switching between different animations
- Optimizing lighting for better visualization
- Interactive animation control 