// Effects module for handling visual effects
const Effects = (function() {
    // Private variables
    let currentShaderEffect = 'day';
    let rainEffect = false;
    let snowEffect = false;
    let rainParticles = [];
    let snowParticles = [];
    
    // Update effect buttons based on current state
    function updateEffectButtons() {
        // Update shader effect buttons
        document.querySelectorAll('.effectButton').forEach(button => {
            // Reset all buttons first
            button.style.backgroundColor = '#666';
            
            // Highlight day/night/sunset button based on current effect
            if (button.textContent === 'Day Mode' && currentShaderEffect === 'day') {
                button.style.backgroundColor = '#4CAF50';
            } else if (button.textContent === 'Night Mode' && currentShaderEffect === 'night') {
                button.style.backgroundColor = '#3F51B5';
            } else if (button.textContent === 'Sunset Mode' && currentShaderEffect === 'sunset') {
                button.style.backgroundColor = '#FF9800';
            }
            
            // Highlight weather effect buttons
            if (button.textContent === 'Toggle Rain' && rainEffect) {
                button.style.backgroundColor = '#2196F3';
            } else if (button.textContent === 'Toggle Snow' && snowEffect) {
                button.style.backgroundColor = '#9C27B0';
            }
        });
    }
    
    // Apply lighting shader effects (day, night, sunset)
    function applyShaderEffect(effectName) {
        currentShaderEffect = effectName;
        
        switch(effectName) {
            case 'night':
                App.scene.background = new THREE.Color(0x0a1a2a);
                App.scene.fog = new THREE.FogExp2(0x0a1a2a, 0.001);
                App.lights.ambientLight.intensity = 0.15;
                App.lights.hemiLight.intensity = 0.1;
                App.lights.hemiLight.groundColor.set(0x0a1a2a);
                App.lights.directionalLight.intensity = 0.2;
                App.lights.directionalLight.color.set(0xadc8ff); // Moonlight blue
                App.lights.secondaryLight.intensity = 0.1;
                App.lights.secondaryLight.color.set(0x8595bb);
                App.lights.bottomLight.intensity = 0.05;
                App.renderer.toneMappingExposure = 0.8;
                break;
            case 'day':
                App.scene.background = new THREE.Color(0x87CEFA);
                App.scene.fog = new THREE.FogExp2(0x87CEFA, 0.001);
                App.lights.ambientLight.intensity = 0.5;
                App.lights.hemiLight.intensity = 0.7;
                App.lights.hemiLight.groundColor.set(0x080820);
                App.lights.hemiLight.skyColor.set(0xfcf8e5);
                App.lights.directionalLight.intensity = 1.2;
                App.lights.directionalLight.color.set(0xfcf8e5);
                App.lights.secondaryLight.intensity = 0.7;
                App.lights.secondaryLight.color.set(0xd1e0ff);
                App.lights.bottomLight.intensity = 0.5;
                App.renderer.toneMappingExposure = 1.2;
                break;
            case 'sunset':
                App.scene.background = new THREE.Color(0xf77622);
                App.scene.fog = new THREE.FogExp2(0xf77622, 0.001);
                App.lights.ambientLight.intensity = 0.2;
                App.lights.hemiLight.intensity = 0.4;
                App.lights.hemiLight.groundColor.set(0x553311);
                App.lights.hemiLight.skyColor.set(0xffaa55);
                App.lights.directionalLight.intensity = 1.1;
                App.lights.directionalLight.color.set(0xff9955);
                App.lights.secondaryLight.intensity = 0.3;
                App.lights.secondaryLight.color.set(0xff9955);
                App.lights.bottomLight.intensity = 0.2;
                App.renderer.toneMappingExposure = 1.1;
                break;
        }
        
        // Update effect buttons
        updateEffectButtons();
    }
    
    // Toggle rain effect on/off
    function toggleRainEffect() {
        rainEffect = !rainEffect;
        
        if (rainEffect) {
            // Create rain particles
            createRainEffect();
        } else {
            // Remove rain particles
            removeRainEffect();
        }
        
        // Update effect buttons
        updateEffectButtons();
    }
    
    // Toggle snow effect on/off
    function toggleSnowEffect() {
        snowEffect = !snowEffect;
        
        if (snowEffect) {
            // Create snow particles
            createSnowEffect();
        } else {
            // Remove snow particles
            removeSnowEffect();
        }
        
        // Update effect buttons
        updateEffectButtons();
    }
    
    // Reset all effects to default
    function resetAllEffects() {
        // Reset shaders to default day mode
        applyShaderEffect('day');
        
        // Clear weather effects
        removeRainEffect();
        removeSnowEffect();
        rainEffect = false;
        snowEffect = false;
        
        // Update effect buttons
        updateEffectButtons();
    }
    
    // Create rain particle system
    function createRainEffect() {
        const rainGeometry = new THREE.BufferGeometry();
        const rainCount = 15000;
        const positions = new Float32Array(rainCount * 3);
        const velocities = [];
        
        for (let i = 0; i < rainCount * 3; i += 3) {
            // Random positions within a 200x200x200 cube
            positions[i] = Math.random() * 400 - 200;
            positions[i+1] = Math.random() * 200 + 50;
            positions[i+2] = Math.random() * 400 - 200;
            
            // Random velocities for varied rain speeds
            velocities.push({
                x: 0,
                y: -10 - Math.random() * 10,
                z: -3 - Math.random() * 2
            });
        }
        
        rainGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const rainMaterial = new THREE.PointsMaterial({
            color: 0xaaaaaa,
            size: 0.1,
            transparent: true,
            opacity: 0.6
        });
        
        const rain = new THREE.Points(rainGeometry, rainMaterial);
        App.scene.add(rain);
        
        rainParticles.push({
            points: rain,
            velocities: velocities
        });
    }
    
    // Remove rain particles from scene
    function removeRainEffect() {
        // Remove all rain particles from the scene
        rainParticles.forEach(rain => {
            App.scene.remove(rain.points);
        });
        rainParticles = [];
    }
    
    // Create snow particle system
    function createSnowEffect() {
        const snowGeometry = new THREE.BufferGeometry();
        const snowCount = 10000;
        const positions = new Float32Array(snowCount * 3);
        const velocities = [];
        
        for (let i = 0; i < snowCount * 3; i += 3) {
            // Random positions within a 200x200x200 cube
            positions[i] = Math.random() * 400 - 200;
            positions[i+1] = Math.random() * 200 + 50;
            positions[i+2] = Math.random() * 400 - 200;
            
            // Random velocities for varied snow speeds and movement
            velocities.push({
                x: Math.random() * 0.5 - 0.25,
                y: -1 - Math.random() * 2,
                z: Math.random() * 0.5 - 0.25
            });
        }
        
        snowGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const snowMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.5,
            transparent: true,
            opacity: 0.8
        });
        
        const snow = new THREE.Points(snowGeometry, snowMaterial);
        App.scene.add(snow);
        
        snowParticles.push({
            points: snow,
            velocities: velocities
        });
    }
    
    // Remove snow particles from scene
    function removeSnowEffect() {
        // Remove all snow particles from the scene
        snowParticles.forEach(snow => {
            App.scene.remove(snow.points);
        });
        snowParticles = [];
    }
    
    // Update weather particle positions
    function updateWeatherEffects() {
        // Update rain particles
        rainParticles.forEach(rain => {
            const positions = rain.points.geometry.attributes.position.array;
            
            for (let i = 0; i < positions.length; i += 3) {
                const index = i / 3;
                
                positions[i] += rain.velocities[index].x;
                positions[i+1] += rain.velocities[index].y;
                positions[i+2] += rain.velocities[index].z;
                
                // Reset particles that reach the ground
                if (positions[i+1] < -10) {
                    positions[i] = Math.random() * 400 - 200;
                    positions[i+1] = 200;
                    positions[i+2] = Math.random() * 400 - 200;
                }
            }
            
            rain.points.geometry.attributes.position.needsUpdate = true;
        });
        
        // Update snow particles
        snowParticles.forEach(snow => {
            const positions = snow.points.geometry.attributes.position.array;
            
            for (let i = 0; i < positions.length; i += 3) {
                const index = i / 3;
                
                positions[i] += snow.velocities[index].x;
                positions[i+1] += snow.velocities[index].y;
                positions[i+2] += snow.velocities[index].z;
                
                // Gentle swaying motion for snow
                snow.velocities[index].x += Math.random() * 0.1 - 0.05;
                snow.velocities[index].x *= 0.98;
                
                // Reset particles that reach the ground
                if (positions[i+1] < -10) {
                    positions[i] = Math.random() * 400 - 200;
                    positions[i+1] = 200;
                    positions[i+2] = Math.random() * 400 - 200;
                    snow.velocities[index].x = Math.random() * 0.5 - 0.25;
                }
            }
            
            snow.points.geometry.attributes.position.needsUpdate = true;
        });
    }
    
    // Public API
    return {
        updateEffectButtons,
        applyShaderEffect,
        toggleRainEffect,
        toggleSnowEffect,
        resetAllEffects,
        updateWeatherEffects
    };
})(); 