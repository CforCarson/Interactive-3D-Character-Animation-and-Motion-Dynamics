// Global variables
const App = {
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    clock: new THREE.Clock(),
    loadingManager: null,
    hokageOffice: null,
    characterModel: null,
    mixer: null,
    currentAction: null,
    isCharacterView: true,
    isPlayingGreet: false,
    cloudParticles: [],
    ground: null,
    shadowGround: null,
    currentGLBModel: null
};

// Initialize the scene
function initScene() {
    // Set up the scene
    App.scene = new THREE.Scene();
    App.scene.background = new THREE.Color(0x87CEFA);
    
    // Set up the camera
    const aspect = window.innerWidth / window.innerHeight;
    App.camera = new THREE.PerspectiveCamera(65, aspect, 0.1, 2000);
    
    // Set up the renderer
    App.renderer = new THREE.WebGLRenderer({ antialias: true });
    App.renderer.setSize(window.innerWidth, window.innerHeight);
    App.renderer.shadowMap.enabled = true;
    App.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(App.renderer.domElement);
    
    // Set up physically correct lighting model
    App.renderer.physicallyCorrectLights = true;
    App.renderer.outputEncoding = THREE.sRGBEncoding;
    App.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    App.renderer.toneMappingExposure = 1.2;
    
    // Set up loading manager
    setupLoadingManager();
    
    // Add lighting
    setupLighting();
    
    // Add ground
    createGround();
    
    // Create subtle fog effect
    App.scene.fog = new THREE.FogExp2(0x336633, 0.001);
    
    // Setup camera position and controls
    App.camera.position.set(20, 15, 20);
    App.camera.lookAt(0, 10, 0);
    
    // Add orbit controls
    setupControls();
    
    // Fix texture paths for FBX loader
    fixFBXTexturePaths();
    
    // Create sky and clouds
    createSkyAndClouds();
    
    // Initialize effect buttons
    Effects.updateEffectButtons();
    
    // Load Character by default
    Character.loadCharacter();
}

function setupLoadingManager() {
    App.loadingManager = new THREE.LoadingManager();
    App.loadingManager.onProgress = function(url, itemsLoaded, itemsTotal) {
        var loadingElement = document.getElementById('loading');
        loadingElement.textContent = 'Loading: ' + Math.round(itemsLoaded / itemsTotal * 100) + '%';
    };
    
    App.loadingManager.onLoad = function() {
        document.getElementById('loading').style.display = 'none';
        console.log('All resources loaded');
    };
    
    App.loadingManager.onError = function(url) {
        console.error('Error loading ' + url);
        document.getElementById('loading').textContent = 'Error loading ' + url;
    };
}

function setupLighting() {
    // Directional light (sun)
    var directionalLight = new THREE.DirectionalLight(0xfcf8e5, 1.2);
    directionalLight.position.set(50, 100, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 4096;
    directionalLight.shadow.mapSize.height = 4096;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.bias = -0.0008;
    directionalLight.shadow.normalBias = 0.02;

    // Improve shadow camera frustum
    directionalLight.shadow.camera.left = -100;
    directionalLight.shadow.camera.right = 100;
    directionalLight.shadow.camera.top = 100;
    directionalLight.shadow.camera.bottom = -100;
    App.scene.add(directionalLight);
    
    // Hemisphere light for ambient lighting
    var hemiLight = new THREE.HemisphereLight(0xfcf8e5, 0x080820, 0.7);
    hemiLight.position.set(0, 50, 0);
    App.scene.add(hemiLight);
    
    // Secondary directional light
    var secondaryLight = new THREE.DirectionalLight(0xd1e0ff, 0.7);
    secondaryLight.position.set(-80, 60, -50);
    App.scene.add(secondaryLight);
    
    // Bottom light
    var bottomLight = new THREE.DirectionalLight(0xffffeb, 0.5);
    bottomLight.position.set(0, -60, 0);
    bottomLight.castShadow = false;
    App.scene.add(bottomLight);
    
    // Subtle ambient light
    var ambientLight = new THREE.AmbientLight(0x222222, 0.5);
    App.scene.add(ambientLight);

    // Store lights in App for later access
    App.lights = {
        directionalLight,
        hemiLight,
        secondaryLight,
        bottomLight,
        ambientLight
    };
}

function createGround() {
    // Main ground plane
    var groundGeometry = new THREE.PlaneGeometry(200, 200);
    var groundTexture = new THREE.TextureLoader().load('hokage-office/hokage-office/textures/Ground_Texture.png', function(texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(10, 10);
    });
    var groundMaterial = new THREE.MeshStandardMaterial({
        color: 0xE6D2B5,
        map: groundTexture,
        roughness: 0.9,
        metalness: 0.1,
        side: THREE.DoubleSide
    });
    App.ground = new THREE.Mesh(groundGeometry, groundMaterial);
    App.ground.rotation.x = -Math.PI / 2;
    App.ground.position.y = -0.1;
    App.ground.receiveShadow = true;
    
    // Shadow-catching plane for character mode
    var shadowGroundGeometry = new THREE.PlaneGeometry(10, 10);
    var shadowGroundMaterial = new THREE.ShadowMaterial({
        opacity: 0.5
    });
    App.shadowGround = new THREE.Mesh(shadowGroundGeometry, shadowGroundMaterial);
    App.shadowGround.rotation.x = -Math.PI / 2;
    App.shadowGround.position.y = -0.09;
    App.shadowGround.receiveShadow = true;
    App.scene.add(App.shadowGround);
    
    App.scene.add(App.ground);
}

function setupControls() {
    App.controls = new THREE.OrbitControls(App.camera, App.renderer.domElement);
    App.controls.enableDamping = true;
    App.controls.dampingFactor = 0.05;
    App.controls.enableZoom = true;
    App.controls.zoomSpeed = 1.2;
    App.controls.autoRotate = false;
    App.controls.maxPolarAngle = Math.PI;
    App.controls.minPolarAngle = 0;
    App.controls.minDistance = 1;
    App.controls.maxDistance = 1000;
    App.controls.rotateSpeed = 1.2;
    App.controls.panSpeed = 1.2;
    App.controls.enablePan = true;
    App.controls.update();
}

function fixFBXTexturePaths() {
    THREE.Loader.Handlers = THREE.Loader.Handlers || {};
    THREE.Loader.Handlers.add(/hokage-office\/source\/(.+)\.png$/, function(url) {
        const textureName = url.split('/').pop();
        const correctedUrl = 'hokage-office/hokage-office/textures/' + textureName;
        console.log('Redirecting texture:', url, 'to', correctedUrl);
        return new THREE.TextureLoader(App.loadingManager).load(correctedUrl);
    });
}

function createSkyAndClouds() {
    // Add subtle clouds using particle system
    let cloudTexture = new THREE.TextureLoader().load('hokage-office/hokage-office/textures/Ground_Texture.png');
    let cloudGeometry = new THREE.PlaneGeometry(50, 50);
    let cloudMaterial = new THREE.MeshLambertMaterial({
        map: cloudTexture,
        transparent: true,
        opacity: 0.3
    });
    
    // Create a number of clouds at random positions
    for(let i = 0; i < 20; i++) {
        let cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
        cloud.position.set(
            Math.random() * 500 - 250,
            150 + Math.random() * 50,
            Math.random() * 500 - 250
        );
        cloud.rotation.x = Math.PI / 2;
        cloud.rotation.z = Math.random() * Math.PI;
        cloud.material.opacity = 0.2 + Math.random() * 0.3;
        App.cloudParticles.push(cloud);
        App.scene.add(cloud);
    }
}

// Animate clouds in the scene
function animateClouds() {
    App.cloudParticles.forEach(cloud => {
        cloud.position.x -= 0.05;
        if (cloud.position.x < -250) {
            cloud.position.x = 250;
        }
    });
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Update controls
    App.controls.update();
    
    // Update character animations if active
    if (App.mixer) {
        App.mixer.update(App.clock.getDelta());
    }
    
    // Keep shadow ground aligned with character if visible
    if (App.shadowGround && App.shadowGround.visible && App.characterModel) {
        // Only update X and Z to keep Y at the ground level
        App.shadowGround.position.x = App.characterModel.position.x;
        App.shadowGround.position.z = App.characterModel.position.z;
    }
    
    // Animate clouds
    animateClouds();
    
    // Update weather effects
    Effects.updateWeatherEffects();
    
    // Render the scene
    App.renderer.render(App.scene, App.camera);
}

// Handle window resize
function handleResize() {
    App.camera.aspect = window.innerWidth / window.innerHeight;
    App.camera.updateProjectionMatrix();
    App.renderer.setSize(window.innerWidth, window.innerHeight);
}

// Initialize when the window loads
window.addEventListener('load', function() {
    initScene();
    animate();
    
    // Setup event handlers
    window.addEventListener('resize', handleResize);
});

// Helper function for texture application
function applyTexture(mesh, texturePath) {
    const textureLoader = new THREE.TextureLoader(App.loadingManager);
    
    // Try loading with primary path
    textureLoader.load(
        texturePath,
        function(texture) {
            console.log('Successfully applied texture:', texturePath, 'to mesh:', mesh.name);
            applyTextureToMesh(mesh, texture);
        },
        // onProgress callback
        function(xhr) {
            console.log('Texture loading progress:', texturePath, Math.round(xhr.loaded / xhr.total * 100) + '%');
        },
        // onError callback
        function(error) {
            console.error('Error loading texture:', texturePath, error);
            
            // Try alternate path format as fallback
            const fileName = texturePath.split('/').pop();
            const altPath = 'hokage-office/hokage-office/textures/' + fileName;
            
            if (altPath !== texturePath) {
                console.log('Trying alternate path:', altPath);
                textureLoader.load(
                    altPath,
                    function(texture) {
                        console.log('Successfully applied texture from alternate path:', altPath);
                        applyTextureToMesh(mesh, texture);
                    },
                    undefined,
                    function(error) {
                        console.error('Error loading texture from alternate path:', altPath, error);
                        // Apply default material as last resort
                        mesh.material = new THREE.MeshPhongMaterial({
                            color: 0xDDDDDD,
                            shininess: 10,
                            side: THREE.DoubleSide
                        });
                    }
                );
            } else {
                // Apply default material
                mesh.material = new THREE.MeshPhongMaterial({
                    color: 0xDDDDDD,
                    shininess: 10,
                    side: THREE.DoubleSide
                });
            }
        }
    );
}

// Helper function to apply texture with appropriate settings
function applyTextureToMesh(mesh, texture) {
    // Improve texture quality and appearance
    texture.encoding = THREE.sRGBEncoding;
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    
    // Adjust texture repeats based on mesh type
    const meshName = mesh.name.toLowerCase();
    
    if (meshName.includes('entrance') && meshName.includes('roof') || 
        meshName.includes('entranceroof') || 
        meshName === 'roof_entrance') {
        texture.repeat.set(1, 1);
        mesh.material = new THREE.MeshPhongMaterial({ 
            map: texture,
            shininess: 5,
            side: THREE.DoubleSide,
            bumpScale: 0.1
        });
    } else if (meshName.includes('entrance') && meshName.includes('wall') || 
              meshName.includes('entrancewall') || 
              meshName === 'wall_entrance') {
        texture.repeat.set(1, 1);
        mesh.material = new THREE.MeshPhongMaterial({ 
            map: texture,
            shininess: 10,
            side: THREE.DoubleSide
        });
    } else if (meshName.includes('ground') || 
              meshName === 'floor' || 
              meshName === 'terrain') {
        // Increase repeat for ground texture to avoid stretching
        texture.repeat.set(5, 5);
        mesh.material = new THREE.MeshStandardMaterial({ 
            map: texture,
            roughness: 0.9,
            metalness: 0.1,
            side: THREE.DoubleSide
        });
    } else {
        // Default material for other meshes
        mesh.material = new THREE.MeshPhongMaterial({ 
            map: texture,
            shininess: 10,
            side: THREE.DoubleSide
        });
    }
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