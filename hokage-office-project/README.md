# Hokage Office 3D Viewer

A web-based 3D viewer for the Hokage Office building from the Naruto series, built with Three.js.

![Hokage Office Preview](hokage-office/textures/Office_TEXTURE.png)

## Overview

This project provides an interactive 3D viewer that allows users to explore the Hokage Office building in a web browser. The application features:

- Realistic 3D model of the Hokage Office loaded from FBX format
- Detailed textures for all parts of the building
- Orbit controls for navigation (rotate, pan, zoom)
- Fallback stylized model if the FBX cannot be loaded
- Atmospheric elements including sky, clouds, and proper lighting
- Responsive design that works on various screen sizes
- Fullscreen mode support

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- Local web server for development

### Installation

1. Clone this repository or download the files
2. Download the required Three.js files as specified in SETUP_INSTRUCTIONS.md
3. Place the files in the appropriate directories:
   ```
   hokage-office-project/
   ├── index.html
   ├── js/
   │   ├── three.min.js
   │   └── loaders/
   │       ├── GLTFLoader.js
   │       ├── FBXLoader.js
   │       └── OrbitControls.js
   ├── hokage-office/
   │   ├── source/
   │   │   └── Hokage_Office.fbx
   │   └── textures/
   │       ├── EntranceRoof_Texture.png
   │       ├── EntranceWall_Texture.png
   │       ├── Ground_Texture.png
   │       ├── Office_TEXTURE.png
   │       ├── Pole_Texture.png
   │       ├── Silo_Texture.png
   │       ├── Tree_texture.png
   │       └── Wall_Texture.png
   └── README.md
   ```

### Running the Project

Due to browser security restrictions when loading external files, you need to run the project using a local web server:

#### Using Python's built-in HTTP server
```
# Python 3
python -m http.server

# Python 2
python -m SimpleHTTPServer
```

#### Using Node.js
```
# Install http-server
npm install -g http-server

# Run server
http-server
```

After starting your local server, navigate to `http://localhost:8000` (or the port specified by your server) in your web browser.

## Usage

- **Rotate**: Click and drag with the left mouse button
- **Pan**: Click and drag with the right mouse button or CTRL + left mouse button
- **Zoom**: Scroll the mouse wheel or use pinch gestures on touchscreens
- **Fullscreen**: Click the "Fullscreen" button in the bottom-right corner

## Features

### 3D Model Rendering
The application attempts to load a detailed FBX model of the Hokage Office. If loading fails, it automatically falls back to a stylized version created with Three.js geometric primitives.

### Realistic Lighting
The scene includes multiple light sources for realistic illumination:
- Directional lights simulating sunlight
- Ambient light for overall scene brightness
- Shadows for depth and realism

### Environmental Effects
- Sky background with subtle gradient
- Animated cloud particles
- Ground plane with texture

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
- The Naruto series for the iconic Hokage Office building 