// Scenes module for handling scene loading and configuration
const Scenes = (function() {
    // Scene-specific configurations
    const sceneConfigurations = {
        'Scenes/scene1_HokageRoom.glb': {
            sceneName: "HokageRoom",
            scale: 5,
            cameraPosition: {
                x: 7,
                y: 1,
                z: 0
            },
            cameraTarget: {
                x: 0,
                y: 1,
                z: 0
            }
        },
        'Scenes/scene2_NarutoVillage.glb': {
            sceneName: "NarutoVillage",
            scale: 0.8,  // Increased scale
            cameraPosition: {
                x: -45,  // Left or right
                y: -30,  // vertical position
                z: 32.5  // distance
            },
            cameraTarget: {
                x: 0,
                y: -30,
                z: 0
            }
        },
        'Scenes/scene3_Resort.glb': {
            sceneName: "Resort",
            scale: 16,
            cameraPosition: {
                x: -270,
                y: -820,
                z: 100
            },
            cameraTarget: {
                x: -270,
                y: -850,
                z: 0
            }
        },
        'Scenes/scene4_HotSpring.glb': {
            sceneName: "HotSpring",
            scale: 5,
            cameraPosition: {
                x: -35,
                y: -7,
                z: 5
            },
            cameraTarget: {
                x: 0,
                y: 2,
                z: 0
            }
        }
    };
    
    // Function to load Hokage Office (FBX model)
    function loadHokageOffice() {
        // Clear any character models if present
        if (App.characterModel) {
            App.scene.remove(App.characterModel);
            App.characterModel = null;
            if (App.mixer) {
                App.mixer = null;
            }
            if (App.currentAction) {
                App.currentAction = null;
            }
        }
        
        // Update shadow ground
        updateShadowGround(false);
        
        document.getElementById('loading').style.display = 'block';
        document.getElementById('loading').textContent = 'Loading Hokage Office...';
        document.getElementById('characterControls').style.display = 'none';
        document.getElementById('chatContainer').style.display = 'none'; // Hide chat when in office view
        document.getElementById('effectsControls').style.display = 'none'; // Hide effects controls
        
        // Set camera and controls for office view
        App.camera.position.set(20, 15, 20);
        App.controls.target.set(0, 10, 0);
        App.controls.update();
        
        // Load the Hokage Office FBX model
        var fbxLoader = new THREE.FBXLoader(App.loadingManager);
        // Override the resource path to look in textures folder
        fbxLoader.setResourcePath('hokage-office/hokage-office/textures/');
        
        fbxLoader.load('hokage-office/hokage-office/source/Hokage_Office.fbx', function(object) {
            App.hokageOffice = object;
            App.hokageOffice.scale.set(10, 10, 10);
            App.hokageOffice.position.y = 0;
            
            // Apply shadows and textures to the model
            App.hokageOffice.traverse(function(child) {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    
                    // Ensure all materials render both sides of faces
                    if (child.material) {
                        if (Array.isArray(child.material)) {
                            child.material.forEach(mat => {
                                mat.side = THREE.DoubleSide;
                            });
                        } else {
                            child.material.side = THREE.DoubleSide;
                        }
                    }
                    
                    // Log mesh names for debugging
                    console.log('Full mesh name:', child.name);
                    
                    // Try to find and apply the texture based on name matching
                    const meshName = child.name.toLowerCase();
                    
                    // Enhanced matching for problematic textures
                    if ((meshName.includes('entrance') && meshName.includes('roof')) || 
                        meshName.includes('entranceroof') || 
                        meshName === 'roof_entrance') {
                        applyTexture(child, 'hokage-office/hokage-office/textures/EntranceRoof_Texture.png');
                    } else if ((meshName.includes('entrance') && meshName.includes('wall')) || 
                               meshName.includes('entrancewall') || 
                               meshName === 'wall_entrance') {
                        applyTexture(child, 'hokage-office/hokage-office/textures/EntranceWall_Texture.png');
                    } else if (meshName.includes('ground') || 
                              meshName === 'floor' || 
                              meshName === 'terrain') {
                        applyTexture(child, 'hokage-office/hokage-office/textures/Ground_Texture.png');
                    } else if (meshName.includes('office')) {
                        applyTexture(child, 'hokage-office/hokage-office/textures/Office_TEXTURE.png');
                    } else if (meshName.includes('pole')) {
                        applyTexture(child, 'hokage-office/hokage-office/textures/Pole_Texture.png');
                    } else if (meshName.includes('silo')) {
                        applyTexture(child, 'hokage-office/hokage-office/textures/Silo_Texture.png');
                    } else if (meshName.includes('tree')) {
                        applyTexture(child, 'hokage-office/hokage-office/textures/Tree_texture.png');
                    } else if (meshName.includes('wall')) {
                        applyTexture(child, 'hokage-office/hokage-office/textures/Wall_Texture.png');
                    } else {
                        // For any unmatched meshes, apply a default material
                        child.material = new THREE.MeshPhongMaterial({
                            color: 0xDDDDDD,
                            shininess: 10,
                            side: THREE.DoubleSide
                        });
                    }
                }
            });
            
            App.scene.add(App.hokageOffice);
            document.getElementById('loading').style.display = 'none';
            
        }, undefined, function(error) {
            console.error('Error loading Hokage Office model:', error);
            document.getElementById('loading').textContent = 'Error loading Hokage Office model. Creating fallback.';
            createFallbackHokageOffice();
        });
    }
    
    // Function to create fallback Hokage Office
    function createFallbackHokageOffice() {
        // Simple building representation
        var buildingGroup = new THREE.Group();
        
        // Main building
        var mainGeometry = new THREE.BoxGeometry(20, 16, 20);
        var mainMaterial = new THREE.MeshStandardMaterial({ color: 0xF5DEB3 });
        var mainBuilding = new THREE.Mesh(mainGeometry, mainMaterial);
        mainBuilding.position.y = 8;
        mainBuilding.castShadow = true;
        mainBuilding.receiveShadow = true;
        buildingGroup.add(mainBuilding);
        
        // Roof
        var roofGeometry = new THREE.ConeGeometry(16, 8, 4);
        var roofMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
        var roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.y = 20;
        roof.castShadow = true;
        roof.receiveShadow = true;
        buildingGroup.add(roof);
        
        App.hokageOffice = buildingGroup;
        App.scene.add(App.hokageOffice);
        document.getElementById('loading').style.display = 'none';
    }
    
    // Function to load GLB scene
    function loadScene(scenePath) {
        // Remove Hokage Office if present
        if (App.hokageOffice) {
            App.scene.remove(App.hokageOffice);
            App.hokageOffice = null;
        }
        
        // Remove current GLB model if it exists
        if (App.currentGLBModel) {
            App.scene.remove(App.currentGLBModel);
        }
        
        document.getElementById('loading').style.display = 'block';
        document.getElementById('loading').textContent = 'Loading Scene...';
        
        // Keep character controls and chat visible in scene
        document.getElementById('characterControls').style.display = 'block';
        document.getElementById('chatContainer').style.display = 'flex';
        document.getElementById('effectsControls').style.display = 'block'; // Show effects controls
        
        // Load the GLB scene
        var gltfLoader = new THREE.GLTFLoader(App.loadingManager);
        gltfLoader.load(
            scenePath,
            (gltf) => {
                document.getElementById('loading').textContent = 'Loading complete';
                
                const model = gltf.scene;
                App.currentGLBModel = model;
                
                // Ensure all meshes in the scene cast and receive shadows
                model.traverse(function(child) {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });
                
                App.scene.add(model);
                
                // Apply scene-specific configuration
                const config = sceneConfigurations[scenePath] || { 
                    scale: 5,
                    cameraPosition: { x: 0, y: 1, z: 3 },
                    cameraTarget: { x: 0, y: 1, z: 0 }
                };
                
                // Apply custom scale
                model.scale.set(config.scale, config.scale, config.scale);
                
                // Get model bounding box for reference
                const box = new THREE.Box3().expandByObject(model);
                const center = box.getCenter(new THREE.Vector3());
                
                // Adjust directional light position based on scene size and center
                App.lights.directionalLight.position.set(
                    center.x + 100,
                    center.y + 200,
                    center.z + 100
                );
                
                // Adjust shadow camera to match scene scale
                const sceneSize = box.getSize(new THREE.Vector3());
                const maxSize = Math.max(sceneSize.x, sceneSize.y, sceneSize.z) * config.scale;
                
                App.lights.directionalLight.shadow.camera.left = -maxSize * 0.5;
                App.lights.directionalLight.shadow.camera.right = maxSize * 0.5;
                App.lights.directionalLight.shadow.camera.top = maxSize * 0.5;
                App.lights.directionalLight.shadow.camera.bottom = -maxSize * 0.5;
                App.lights.directionalLight.shadow.camera.far = maxSize * 2;
                
                // Adjust shadow bias based on scene scale
                App.lights.directionalLight.shadow.bias = -0.0005 / config.scale;
                
                // Update the shadow camera
                App.lights.directionalLight.shadow.camera.updateProjectionMatrix();
                
                // Set camera position based on configuration
                App.camera.position.set(
                    center.x + config.cameraPosition.x,
                    center.y + config.cameraPosition.y,
                    center.z + config.cameraPosition.z
                );
                
                // Set camera target
                App.controls.target.set(
                    center.x + config.cameraTarget.x,
                    center.y + config.cameraTarget.y,
                    center.z + config.cameraTarget.z
                );
                
                App.controls.update();
                document.getElementById('loading').style.display = 'none';
                
                // If character is not already present, load it into the scene
                if (!App.characterModel) {
                    Character.loadCharacterIntoScene(center, config);
                } else {
                    // Position existing character in the scene
                    Character.positionCharacterInScene(center, config);
                    
                    // Apply scene-specific lighting adjustments
                    if (scenePath === 'Scenes/scene1_HokageRoom.glb') {
                        // Enhanced lighting specifically for Hokage Room
                        App.lights.directionalLight.intensity = 1.5;
                        App.lights.directionalLight.color.set(0xfffaf0); // Warm white light
                        
                        // Add a spot light to illuminate the room from above
                        const spotLight = new THREE.SpotLight(0xfffaf0, 1.0);
                        spotLight.position.set(center.x, center.y + 50, center.z);
                        spotLight.angle = Math.PI / 4;
                        spotLight.penumbra = 0.3;
                        spotLight.decay = 1.5;
                        spotLight.distance = 200;
                        spotLight.castShadow = true;
                        spotLight.shadow.bias = -0.0005;
                        spotLight.shadow.mapSize.width = 1024;
                        spotLight.shadow.mapSize.height = 1024;
                        App.scene.add(spotLight);
                        
                        // Target the spotlight at the center of the room
                        spotLight.target.position.set(center.x, center.y, center.z);
                        App.scene.add(spotLight.target);
                        
                        // Add point lights around the room for even illumination
                        const roomLights = [
                            { x: center.x + 15, y: center.y + 15, z: center.z + 15 },
                            { x: center.x - 15, y: center.y + 15, z: center.z + 15 },
                            { x: center.x + 15, y: center.y + 15, z: center.z - 15 },
                            { x: center.x - 15, y: center.y + 15, z: center.z - 15 }
                        ];
                        
                        roomLights.forEach((pos, i) => {
                            const pointLight = new THREE.PointLight(0xfffcf0, 0.6, 80);
                            pointLight.position.set(pos.x, pos.y, pos.z);
                            pointLight.name = `hokageRoomLight_${i}`;
                            App.scene.add(pointLight);
                        });
                        
                        // Increase ambient lighting
                        App.lights.ambientLight.intensity = 0.5;
                        App.lights.hemiLight.intensity = 0.8;
                    } else {
                        // Reset lighting to default for other scenes
                        App.lights.directionalLight.intensity = 1.0;
                        App.lights.directionalLight.color.set(0xfcf8e5);
                        App.lights.ambientLight.intensity = 0.3;
                        App.lights.hemiLight.intensity = 0.5;
                        
                        // Remove any Hokage Room specific lights if they exist
                        for (let i = 0; i < 4; i++) {
                            const lightName = `hokageRoomLight_${i}`;
                            const light = App.scene.getObjectByName(lightName);
                            if (light) {
                                App.scene.remove(light);
                            }
                        }
                    }
                }
            },
            undefined,
            (error) => {
                console.error('Loading failed:', error);
                document.getElementById('loading').textContent = 'Loading failed: ' + error.message;
            }
        );
        
        // We're still in character view even when in a scene
        App.isCharacterView = true;
        
        // Update shadow ground
        updateShadowGround(false);
    }
    
    // Function to return to character view
    function returnToCharacter() {
        // Cancel any pending animations
        if (App.isPlayingGreet) {
            App.isPlayingGreet = false;
        }
        
        // Remove GLB scene if present
        if (App.currentGLBModel) {
            App.scene.remove(App.currentGLBModel);
            App.currentGLBModel = null;
        }
        
        App.isCharacterView = true;
        Character.loadCharacter(); // Load character in default environment
    }
    
    // Helper function to update shadow ground
    function updateShadowGround(isCharView, position) {
        if (App.shadowGround) {
            if (isCharView) {
                App.shadowGround.visible = true;
                
                if (position) {
                    // Position the shadow ground under the character
                    App.shadowGround.position.x = position.x;
                    App.shadowGround.position.z = position.z;
                } else {
                    // Default character position when no position is provided
                    App.shadowGround.position.x = 0;
                    App.shadowGround.position.z = 0;
                }
            } else {
                // Hide shadow ground in scene views
                App.shadowGround.visible = false;
            }
        }
    }
    
    // Public API
    return {
        loadHokageOffice,
        loadScene,
        returnToCharacter,
        sceneConfigurations
    };
})(); 