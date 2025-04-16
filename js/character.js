// Character module for handling character loading and animations
const Character = (function() {
    // Load character and play normal animation
    async function loadCharacter() {
        // Remove Hokage Office if present
        if (App.hokageOffice) {
            App.scene.remove(App.hokageOffice);
            App.hokageOffice = null;
        }
        
        // Make sure to clean up any existing character model
        if (App.characterModel) {
            App.scene.remove(App.characterModel);
            App.characterModel = null;
        }
        
        // Clean up any existing animation mixer
        if (App.mixer) {
            App.mixer = null;
        }
        
        if (App.currentAction) {
            App.currentAction = null;
        }
        
        document.getElementById('loading').style.display = 'block';
        document.getElementById('loading').textContent = 'Loading Character...';
        document.getElementById('characterControls').style.display = 'block';
        document.getElementById('chatContainer').style.display = 'flex'; // Show chat when in character view
        document.getElementById('effectsControls').style.display = 'block'; // Show effects controls
        
        // Set camera and controls for character view
        App.camera.position.set(0, 1.5, 4);
        App.controls.target.set(0, 1, 0);
        App.controls.update();
        
        // Ensure the ground is visible and receiving shadows
        if (App.ground) {
            App.ground.visible = true;
            App.ground.receiveShadow = true;
        }
        
        // Update shadow ground for character view
        updateShadowGround(true);
        
        // Reset directional light position for character view
        App.lights.directionalLight.position.set(2, 4, 3);
        App.lights.directionalLight.shadow.camera.left = -5;
        App.lights.directionalLight.shadow.camera.right = 5;
        App.lights.directionalLight.shadow.camera.top = 5;
        App.lights.directionalLight.shadow.camera.bottom = -5;
        App.lights.directionalLight.shadow.bias = -0.0005;
        App.lights.directionalLight.shadow.camera.updateProjectionMatrix();
        
        try {
            // Load the character model
            var gltfLoader = new THREE.GLTFLoader(App.loadingManager);
            gltfLoader.load('tobirama/normal.glb', function(gltf) {
                // If another model was loaded in the meantime, clean it up
                if (App.characterModel) {
                    App.scene.remove(App.characterModel);
                }
                
                App.characterModel = gltf.scene;
                App.characterModel.position.y = 0;
                App.characterModel.scale.set(1, 1, 1);
                
                // Apply shadows to the model
                App.characterModel.traverse(function(child) {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                        
                        // Improve shadow quality on character materials
                        if (child.material) {
                            if (Array.isArray(child.material)) {
                                child.material.forEach(mat => {
                                    mat.shadowSide = THREE.FrontSide;
                                });
                            } else {
                                child.material.shadowSide = THREE.FrontSide;
                            }
                        }
                    }
                });
                
                App.scene.add(App.characterModel);
                
                // Set up animation mixer
                App.mixer = new THREE.AnimationMixer(App.characterModel);
                
                // Play the first animation
                if (gltf.animations && gltf.animations.length > 0) {
                    App.currentAction = App.mixer.clipAction(gltf.animations[0]);
                    App.currentAction.reset();
                    App.currentAction.setLoop(THREE.LoopRepeat);
                    App.currentAction.play();
                }
                
                document.getElementById('loading').style.display = 'none';
            });
        } catch (error) {
            console.error('Error loading character model:', error);
            document.getElementById('loading').textContent = 'Error loading character model.';
        }
    }
    
    // Function to play greeting animation
    function playGreetAnimation() {
        if (App.isPlayingGreet || !App.characterModel) return;
        
        App.isPlayingGreet = true;
        document.getElementById('loading').style.display = 'block';
        document.getElementById('loading').textContent = 'Loading Greeting Animation...';
        
        // Store current position, rotation and scale
        const currentPosition = App.characterModel.position.clone();
        const currentRotation = App.characterModel.rotation.clone();
        const currentScale = App.characterModel.scale.clone();
        
        // Stop current animation
        if (App.currentAction) {
            App.currentAction.stop();
            App.currentAction = null;
        }
        
        // Clean up the mixer
        if (App.mixer) {
            App.mixer = null;
        }
        
        // Remove current character
        if (App.characterModel) {
            App.scene.remove(App.characterModel);
            App.characterModel = null;
        }
        
        // Load greet model and animation
        var gltfLoader = new THREE.GLTFLoader(App.loadingManager);
        gltfLoader.load('tobirama/greet.glb', function(gltf) {
            // Check if we switched views while loading
            if (!App.isCharacterView) {
                App.isPlayingGreet = false;
                return;
            }
            
            // If another model was loaded in the meantime, clean it up
            if (App.characterModel) {
                App.scene.remove(App.characterModel);
            }
            
            App.characterModel = gltf.scene;
            
            // Apply stored position, rotation and scale
            App.characterModel.position.copy(currentPosition);
            App.characterModel.rotation.copy(currentRotation);
            App.characterModel.scale.copy(currentScale);
            
            // Apply shadows to the model
            App.characterModel.traverse(function(child) {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            
            App.scene.add(App.characterModel);
            
            // Set up animation mixer
            App.mixer = new THREE.AnimationMixer(App.characterModel);
            
            // Play the greeting animation once
            if (gltf.animations && gltf.animations.length > 0) {
                App.currentAction = App.mixer.clipAction(gltf.animations[0]);
                App.currentAction.reset();
                App.currentAction.setLoop(THREE.LoopOnce);
                App.currentAction.clampWhenFinished = true;
                App.currentAction.play();
                
                // Get animation duration
                var duration = gltf.animations[0].duration;
                
                // After animation completes, go back to normal
                setTimeout(function() {
                    // Only switch back if we're still in character view
                    if (App.isCharacterView) {
                        App.isPlayingGreet = false;
                        
                        // Load character but preserve position, rotation and scale
                        reloadCharacterWithPreservedTransform(currentPosition, currentRotation, currentScale);
                    }
                }, duration * 1000);
            }
            
            document.getElementById('loading').style.display = 'none';
        });
    }
    
    // Function to play idle animation (return to normal state)
    function playIdleAnimation() {
        if (!App.characterModel || !App.isCharacterView) return;
        
        // Store current position, rotation and scale
        const currentPosition = App.characterModel.position.clone();
        const currentRotation = App.characterModel.rotation.clone();
        const currentScale = App.characterModel.scale.clone();
        
        // Reset flag
        App.isPlayingGreet = false;
        
        // Load character but preserve position, rotation and scale
        reloadCharacterWithPreservedTransform(currentPosition, currentRotation, currentScale);
    }
    
    // Function to play speaking animation
    function playSpeakingAnimation() {
        if (App.isPlayingGreet || !App.characterModel) return;
        
        App.isPlayingGreet = true;
        document.getElementById('loading').style.display = 'block';
        document.getElementById('loading').textContent = 'Loading Speaking Animation...';
        
        // Store current position, rotation and scale
        const currentPosition = App.characterModel.position.clone();
        const currentRotation = App.characterModel.rotation.clone();
        const currentScale = App.characterModel.scale.clone();
        
        // Stop current animation
        if (App.currentAction) {
            App.currentAction.stop();
            App.currentAction = null;
        }
        
        // Clean up the mixer
        if (App.mixer) {
            App.mixer = null;
        }
        
        // Remove current character
        if (App.characterModel) {
            App.scene.remove(App.characterModel);
            App.characterModel = null;
        }
        
        // Load speaking model and animation
        var gltfLoader = new THREE.GLTFLoader(App.loadingManager);
        gltfLoader.load('tobirama/Speaking.glb', function(gltf) {
            // Check if we switched views while loading
            if (!App.isCharacterView) {
                App.isPlayingGreet = false;
                return;
            }
            
            // If another model was loaded in the meantime, clean it up
            if (App.characterModel) {
                App.scene.remove(App.characterModel);
            }
            
            App.characterModel = gltf.scene;
            
            // Apply stored position, rotation and scale
            App.characterModel.position.copy(currentPosition);
            App.characterModel.rotation.copy(currentRotation);
            App.characterModel.scale.copy(currentScale);
            
            // Apply shadows to the model
            App.characterModel.traverse(function(child) {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            
            App.scene.add(App.characterModel);
            
            // Set up animation mixer
            App.mixer = new THREE.AnimationMixer(App.characterModel);
            
            // Play the speaking animation
            if (gltf.animations && gltf.animations.length > 0) {
                App.currentAction = App.mixer.clipAction(gltf.animations[0]);
                App.currentAction.reset();
                App.currentAction.setLoop(THREE.LoopRepeat); // Use repeat instead of once
                App.currentAction.play();
                
                // Store animation clip name for identification
                if (App.currentAction.getClip()) {
                    App.currentAction.getClip().name = "Speaking";
                }
            }
            
            document.getElementById('loading').style.display = 'none';
            
            // Note: We don't set a timeout here anymore, as speech end will trigger playIdleAnimation
        });
    }
    
    // Function to play dance animation
    function playDanceAnimation() {
        if (App.isPlayingGreet || !App.characterModel) return;
        
        App.isPlayingGreet = true;
        document.getElementById('loading').style.display = 'block';
        document.getElementById('loading').textContent = 'Loading Dance Animation...';
        
        // Store current position, rotation and scale
        const currentPosition = App.characterModel.position.clone();
        const currentRotation = App.characterModel.rotation.clone();
        const currentScale = App.characterModel.scale.clone();
        
        // Stop current animation
        if (App.currentAction) {
            App.currentAction.stop();
            App.currentAction = null;
        }
        
        // Clean up the mixer
        if (App.mixer) {
            App.mixer = null;
        }
        
        // Remove current character
        if (App.characterModel) {
            App.scene.remove(App.characterModel);
            App.characterModel = null;
        }
        
        // Load dance model and animation
        var gltfLoader = new THREE.GLTFLoader(App.loadingManager);
        gltfLoader.load('tobirama/dance.glb', function(gltf) {
            // Check if we switched views while loading
            if (!App.isCharacterView) {
                App.isPlayingGreet = false;
                return;
            }
            
            // If another model was loaded in the meantime, clean it up
            if (App.characterModel) {
                App.scene.remove(App.characterModel);
            }
            
            App.characterModel = gltf.scene;
            
            // Apply stored position, rotation and scale
            App.characterModel.position.copy(currentPosition);
            App.characterModel.rotation.copy(currentRotation);
            App.characterModel.scale.copy(currentScale);
            
            // Apply shadows to the model
            App.characterModel.traverse(function(child) {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            
            App.scene.add(App.characterModel);
            
            // Set up animation mixer
            App.mixer = new THREE.AnimationMixer(App.characterModel);
            
            // Play the dance animation once
            if (gltf.animations && gltf.animations.length > 0) {
                App.currentAction = App.mixer.clipAction(gltf.animations[0]);
                App.currentAction.reset();
                App.currentAction.setLoop(THREE.LoopOnce);
                App.currentAction.clampWhenFinished = true;
                App.currentAction.play();
                
                // Get animation duration
                var duration = gltf.animations[0].duration;
                
                // After animation completes, go back to normal
                setTimeout(function() {
                    // Only switch back if we're still in character view
                    if (App.isCharacterView) {
                        App.isPlayingGreet = false;
                        
                        // Load character but preserve position, rotation and scale
                        reloadCharacterWithPreservedTransform(currentPosition, currentRotation, currentScale);
                    }
                }, duration * 1000);
            }
            
            document.getElementById('loading').style.display = 'none';
        });
    }
    
    // Function to play boxing animation
    function playBoxingAnimation() {
        if (App.isPlayingGreet || !App.characterModel) return;
        
        App.isPlayingGreet = true;
        document.getElementById('loading').style.display = 'block';
        document.getElementById('loading').textContent = 'Loading Boxing Animation...';
        
        // Store current position, rotation and scale
        const currentPosition = App.characterModel.position.clone();
        const currentRotation = App.characterModel.rotation.clone();
        const currentScale = App.characterModel.scale.clone();
        
        // Stop current animation
        if (App.currentAction) {
            App.currentAction.stop();
            App.currentAction = null;
        }
        
        // Clean up the mixer
        if (App.mixer) {
            App.mixer = null;
        }
        
        // Remove current character
        if (App.characterModel) {
            App.scene.remove(App.characterModel);
            App.characterModel = null;
        }
        
        // Load boxing model and animation
        var gltfLoader = new THREE.GLTFLoader(App.loadingManager);
        gltfLoader.load('tobirama/boxing.glb', function(gltf) {
            // Check if we switched views while loading
            if (!App.isCharacterView) {
                App.isPlayingGreet = false;
                return;
            }
            
            // If another model was loaded in the meantime, clean it up
            if (App.characterModel) {
                App.scene.remove(App.characterModel);
            }
            
            App.characterModel = gltf.scene;
            
            // Apply stored position, rotation and scale
            App.characterModel.position.copy(currentPosition);
            App.characterModel.rotation.copy(currentRotation);
            App.characterModel.scale.copy(currentScale);
            
            // Apply shadows to the model
            App.characterModel.traverse(function(child) {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            
            App.scene.add(App.characterModel);
            
            // Set up animation mixer
            App.mixer = new THREE.AnimationMixer(App.characterModel);
            
            // Play the boxing animation once
            if (gltf.animations && gltf.animations.length > 0) {
                App.currentAction = App.mixer.clipAction(gltf.animations[0]);
                App.currentAction.reset();
                App.currentAction.setLoop(THREE.LoopOnce);
                App.currentAction.clampWhenFinished = true;
                App.currentAction.play();
                
                // Get animation duration
                var duration = gltf.animations[0].duration;
                
                // After animation completes, go back to normal
                setTimeout(function() {
                    // Only switch back if we're still in character view
                    if (App.isCharacterView) {
                        App.isPlayingGreet = false;
                        
                        // Load character but preserve position, rotation and scale
                        reloadCharacterWithPreservedTransform(currentPosition, currentRotation, currentScale);
                    }
                }, duration * 1000);
            }
            
            document.getElementById('loading').style.display = 'none';
        });
    }
    
    // Function to play jump animation
    function playJumpAnimation() {
        if (App.isPlayingGreet || !App.characterModel) return;
        
        App.isPlayingGreet = true;
        document.getElementById('loading').style.display = 'block';
        document.getElementById('loading').textContent = 'Loading Jump Animation...';
        
        // Store current position, rotation and scale
        const currentPosition = App.characterModel.position.clone();
        const currentRotation = App.characterModel.rotation.clone();
        const currentScale = App.characterModel.scale.clone();
        
        // Stop current animation
        if (App.currentAction) {
            App.currentAction.stop();
            App.currentAction = null;
        }
        
        // Clean up the mixer
        if (App.mixer) {
            App.mixer = null;
        }
        
        // Remove current character
        if (App.characterModel) {
            App.scene.remove(App.characterModel);
            App.characterModel = null;
        }
        
        // Load jump model and animation
        var gltfLoader = new THREE.GLTFLoader(App.loadingManager);
        gltfLoader.load('tobirama/jump.glb', function(gltf) {
            // Check if we switched views while loading
            if (!App.isCharacterView) {
                App.isPlayingGreet = false;
                return;
            }
            
            // If another model was loaded in the meantime, clean it up
            if (App.characterModel) {
                App.scene.remove(App.characterModel);
            }
            
            App.characterModel = gltf.scene;
            
            // Apply stored position, rotation and scale
            App.characterModel.position.copy(currentPosition);
            App.characterModel.rotation.copy(currentRotation);
            App.characterModel.scale.copy(currentScale);
            
            // Apply shadows to the model
            App.characterModel.traverse(function(child) {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            
            App.scene.add(App.characterModel);
            
            // Set up animation mixer
            App.mixer = new THREE.AnimationMixer(App.characterModel);
            
            // Play the jump animation once
            if (gltf.animations && gltf.animations.length > 0) {
                App.currentAction = App.mixer.clipAction(gltf.animations[0]);
                App.currentAction.reset();
                App.currentAction.setLoop(THREE.LoopOnce);
                App.currentAction.clampWhenFinished = true;
                App.currentAction.play();
                
                // Get animation duration
                var duration = gltf.animations[0].duration;
                
                // After animation completes, go back to normal
                setTimeout(function() {
                    // Only switch back if we're still in character view
                    if (App.isCharacterView) {
                        App.isPlayingGreet = false;
                        
                        // Load character but preserve position, rotation and scale
                        reloadCharacterWithPreservedTransform(currentPosition, currentRotation, currentScale);
                    }
                }, duration * 1000);
            }
            
            document.getElementById('loading').style.display = 'none';
        });
    }
    
    // Function to play spin animation
    function playSpinAnimation() {
        if (App.isPlayingGreet || !App.characterModel) return;
        
        App.isPlayingGreet = true;
        document.getElementById('loading').style.display = 'block';
        document.getElementById('loading').textContent = 'Loading Spin Animation...';
        
        // Store current position, rotation and scale
        const currentPosition = App.characterModel.position.clone();
        const currentRotation = App.characterModel.rotation.clone();
        const currentScale = App.characterModel.scale.clone();
        
        // Stop current animation
        if (App.currentAction) {
            App.currentAction.stop();
            App.currentAction = null;
        }
        
        // Clean up the mixer
        if (App.mixer) {
            App.mixer = null;
        }
        
        // Remove current character
        if (App.characterModel) {
            App.scene.remove(App.characterModel);
            App.characterModel = null;
        }
        
        // Load spin model and animation
        var gltfLoader = new THREE.GLTFLoader(App.loadingManager);
        gltfLoader.load('tobirama/spin.glb', function(gltf) {
            // Check if we switched views while loading
            if (!App.isCharacterView) {
                App.isPlayingGreet = false;
                return;
            }
            
            // If another model was loaded in the meantime, clean it up
            if (App.characterModel) {
                App.scene.remove(App.characterModel);
            }
            
            App.characterModel = gltf.scene;
            
            // Apply stored position, rotation and scale
            App.characterModel.position.copy(currentPosition);
            App.characterModel.rotation.copy(currentRotation);
            App.characterModel.scale.copy(currentScale);
            
            // Apply shadows to the model
            App.characterModel.traverse(function(child) {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            
            App.scene.add(App.characterModel);
            
            // Set up animation mixer
            App.mixer = new THREE.AnimationMixer(App.characterModel);
            
            // Play the spin animation once
            if (gltf.animations && gltf.animations.length > 0) {
                App.currentAction = App.mixer.clipAction(gltf.animations[0]);
                App.currentAction.reset();
                App.currentAction.setLoop(THREE.LoopOnce);
                App.currentAction.clampWhenFinished = true;
                App.currentAction.play();
                
                // Get animation duration
                var duration = gltf.animations[0].duration;
                
                // After animation completes, go back to normal
                setTimeout(function() {
                    // Only switch back if we're still in character view
                    if (App.isCharacterView) {
                        App.isPlayingGreet = false;
                        
                        // Load character but preserve position, rotation and scale
                        reloadCharacterWithPreservedTransform(currentPosition, currentRotation, currentScale);
                    }
                }, duration * 1000);
            }
            
            document.getElementById('loading').style.display = 'none';
        });
    }
    
    // Function to reload character but preserve position, rotation and scale
    function reloadCharacterWithPreservedTransform(position, rotation, scale) {
        document.getElementById('loading').style.display = 'block';
        document.getElementById('loading').textContent = 'Loading Character...';
        
        // Clean up any existing animation
        if (App.currentAction) {
            App.currentAction.stop();
            App.currentAction = null;
        }
        if (App.mixer) {
            App.mixer = null;
        }
        
        // Remove current character
        if (App.characterModel) {
            App.scene.remove(App.characterModel);
            App.characterModel = null;
        }
        
        // Load character again but apply stored transforms
        var gltfLoader = new THREE.GLTFLoader(App.loadingManager);
        gltfLoader.load('tobirama/normal.glb', function(gltf) {
            App.characterModel = gltf.scene;
            
            // Apply saved position, rotation and scale
            App.characterModel.position.copy(position);
            App.characterModel.rotation.copy(rotation);
            App.characterModel.scale.copy(scale);
            
            // Apply shadows to the model
            App.characterModel.traverse(function(child) {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            
            App.scene.add(App.characterModel);
            
            // Set up animation mixer
            App.mixer = new THREE.AnimationMixer(App.characterModel);
            
            // Play the default animation
            if (gltf.animations && gltf.animations.length > 0) {
                App.currentAction = App.mixer.clipAction(gltf.animations[0]);
                App.currentAction.reset();
                App.currentAction.setLoop(THREE.LoopRepeat);
                App.currentAction.play();
            }
            
            document.getElementById('loading').style.display = 'none';
        });
    }
    
    // Function to position character in a scene
    function positionCharacterInScene(sceneCenter, config) {
        if (!App.characterModel) return;
        
        // Position character based on scene type
        const sceneName = config.sceneName || "";
        
        if (sceneName.includes("HokageRoom")) {
            App.characterModel.scale.set(5, 5, 5);
            // Position in front of the desk
            App.characterModel.position.set(sceneCenter.x - 25, sceneCenter.y - 9, sceneCenter.z - 0);
            // Fix character facing 90 degrees left by rotating 270 degrees clockwise
            App.characterModel.rotation.set(0, Math.PI * 0.5, 0);
        } else if (sceneName.includes("NarutoVillage")) {
            App.characterModel.scale.set(4, 4, 4);
            // Position on the street
            App.characterModel.position.set(sceneCenter.x - 35, sceneCenter.y - 34.5, sceneCenter.z + 20);
            // Fix character facing 45 degrees right by rotating 315 degrees clockwise
            App.characterModel.rotation.set(0, Math.PI * 1.75, 0); // Rotate 315 degrees around Y axis
        } else if (sceneName.includes("Resort")) {
            App.characterModel.scale.set(12.5, 12.5, 12.5);
            // Position near the resort entrance
            App.characterModel.position.set(sceneCenter.x - 270, sceneCenter.y - 844.25, sceneCenter.z + 50);
            // Set default forward orientation
            App.characterModel.rotation.set(0, 0, 0);
        } else if (sceneName.includes("HotSpring")) {
            App.characterModel.scale.set(4, 4, 4);
            // Position near the hot spring
            App.characterModel.position.set(sceneCenter.x - 20, sceneCenter.y - 9.75, sceneCenter.z);
            // Fix character facing 90 degrees right by rotating 270 degrees counter-clockwise
            App.characterModel.rotation.set(0, -Math.PI / 2, 0); // Rotate 270 degrees counter-clockwise around Y axis
        } else {
            // Default positioning relative to scene center
            App.characterModel.position.set(sceneCenter.x, sceneCenter.y, sceneCenter.z);
            // Default forward orientation
            App.characterModel.rotation.set(0, 0, 0);
        }
        
        // Update shadow ground to match character position in the scene
        updateShadowGround(true, App.characterModel.position);
        
        // Ensure the character has proper shadow settings
        App.characterModel.traverse(function(child) {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
    }
    
    // Function to load character into a scene
    function loadCharacterIntoScene(sceneCenter, config) {
        document.getElementById('loading').style.display = 'block';
        document.getElementById('loading').textContent = 'Loading Character into Scene...';
        
        // Load the character model
        var gltfLoader = new THREE.GLTFLoader(App.loadingManager);
        gltfLoader.load('tobirama/normal.glb', function(gltf) {
            // If another model was loaded in the meantime, clean it up
            if (App.characterModel) {
                App.scene.remove(App.characterModel);
            }
            
            App.characterModel = gltf.scene;
            
            // Position character in the scene
            positionCharacterInScene(sceneCenter, config);
            
            // Apply shadows to the model
            App.characterModel.traverse(function(child) {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            
            App.scene.add(App.characterModel);
            
            // Set up animation mixer
            App.mixer = new THREE.AnimationMixer(App.characterModel);
            
            // Play the first animation
            if (gltf.animations && gltf.animations.length > 0) {
                App.currentAction = App.mixer.clipAction(gltf.animations[0]);
                App.currentAction.reset();
                App.currentAction.setLoop(THREE.LoopRepeat);
                App.currentAction.play();
            }
            
            document.getElementById('loading').style.display = 'none';
        });
    }
    
    // Function to update the shadow ground visibility and position
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
        loadCharacter,
        playGreetAnimation,
        playSpeakingAnimation,
        playIdleAnimation,
        playDanceAnimation,
        playBoxingAnimation,
        playJumpAnimation,
        playSpinAnimation,
        positionCharacterInScene,
        loadCharacterIntoScene,
        updateShadowGround
    };
})(); 