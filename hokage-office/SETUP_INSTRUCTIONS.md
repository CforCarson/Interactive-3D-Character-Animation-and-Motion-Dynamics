# Setup Instructions for Hokage Office 3D Viewer

## Step 1: Download the Required Three.js Files

Download the following files and place them in the correct directories:

### Main Three.js Library
- Download from: https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js
- Save to: `js/three.min.js`

### Loaders
- FBXLoader: https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/FBXLoader.js
  - Save to: `js/loaders/FBXLoader.js`
- GLTFLoader: https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js
  - Save to: `js/loaders/GLTFLoader.js`
- OrbitControls: https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js
  - Save to: `js/loaders/OrbitControls.js`

## Step 2: Run the Project

Once all files are in place, you need to run the project using a local web server due to browser security restrictions when loading external files.

### Option 1: Using Python's built-in HTTP server
If you have Python installed:

```
# Python 3
python -m http.server

# Python 2
python -m SimpleHTTPServer
```

### Option 2: Using Node.js
If you have Node.js installed:
1. Install http-server: `npm install -g http-server`
2. Run: `http-server`

After starting your local server, navigate to `http://localhost:8000` (or the port specified by your server) in your web browser.

## Project Structure
The final structure should look like this:
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
└── SETUP_INSTRUCTIONS.md 