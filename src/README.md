# 3D Animation Demos

This project contains several demonstrations of 3D model animations using Three.js.

## Project Structure

- `index.html` - Main entry page with links to all demos
- `fbx_animation_click_switch.html` - Demo showing FBX model animations switching on click
- `glb_animation_lighting_demo.html` - Demo showing GLB model animation with enhanced lighting
- `glb_animation_button_control.html` - Demo showing GLB animations switching with button control
- `3d_assets/` - Directory containing all 3D model files

## Demo Descriptions

### FBX Animation with Click Switching
This demo shows a 3D character with animations that switch when clicking on the model. It uses the FBX format and demonstrates:
- Loading FBX models
- Animation mixing and blending
- User interaction through raycasting and model clicking
- Animation state management

### GLB Animation with Optimized Lighting
A demonstration of GLB model animation with enhanced lighting effects, including:
- Directional main light (simulating sunlight)
- Fill light to reduce shadow darkness
- Ambient light for global illumination
- Back light for character outline emphasis

### GLB Animation with Button Control
This demo allows switching between animations using button controls:
- Normal idle animation (looping)
- Greeting animation (plays once)
- Smooth animation switching
- Model loading and unloading

## Technologies Used

- Three.js for 3D rendering
- GLTFLoader for loading GLB models
- FBXLoader for loading FBX models
- OrbitControls for camera manipulation
- Animations using THREE.AnimationMixer

## How to Run

Simply open any of the HTML files in a modern web browser. For best results, serve the files from a local web server. 