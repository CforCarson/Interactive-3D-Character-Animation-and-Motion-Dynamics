# 3D Animation Demos - Client-Server Architecture

This project contains several demonstrations of 3D model animations using Three.js, now implemented with a client-server architecture.

## Project Structure

- `server.js` - Express server for serving the application
- `package.json` - Node.js dependencies and scripts
- `public/` - Client-side files
  - `index.html` - Main entry page with links to all demos
  - `fbx_animation_click_switch.html` - Demo showing FBX model animations switching on click
  - `glb_animation_lighting_demo.html` - Demo showing GLB model animation with enhanced lighting
  - `glb_animation_button_control.html` - Demo showing GLB animations switching with button control
  - `3d_assets/` - Directory containing all 3D model files

## Client-Server Features

- **Express Server**: Handles routing and serves static content
- **RESTful API**: Provides model metadata through `/api/models` endpoint
- **Static File Serving**: Efficiently serves 3D models and web assets
- **Centralized Routing**: All demo pages accessible through clean URLs

## Demo Descriptions

### FBX Animation with Click Switching
This demo shows a 3D character with animations that switch when clicking on the model. It uses the FBX format and demonstrates:
- Loading FBX models
- Animation mixing and blending
- User interaction through raycasting and model clicking
- Animation state management
- API integration for model information

### GLB Animation with Optimized Lighting
A demonstration of GLB model animation with enhanced lighting effects, including:
- Directional main light (simulating sunlight)
- Fill light to reduce shadow darkness
- Ambient light for global illumination
- Back light for character outline emphasis
- Server-side model metadata retrieval

### GLB Animation with Button Control
This demo allows switching between animations using button controls:
- Normal idle animation (looping)
- Greeting animation (plays once)
- Smooth animation switching
- Model loading and unloading
- Integration with server API

## Technologies Used

- **Client Side**:
  - Three.js for 3D rendering
  - GLTFLoader for loading GLB models
  - FBXLoader for loading FBX models
  - Fetch API for server communication

- **Server Side**:
  - Node.js runtime
  - Express.js framework
  - RESTful API architecture

## How to Run

1. Install dependencies:
   ```
   npm install
   ```

2. Start the server:
   ```
   npm start
   ```

3. For development with auto-restart:
   ```
   npm run dev
   ```

4. Open a browser and navigate to:
   ```
   http://localhost:3000
   ```

## Future Enhancements

- User authentication
- Dynamic model loading based on server configuration
- Analytics for tracking model/animation usage
- Server-side rendering for improved SEO 