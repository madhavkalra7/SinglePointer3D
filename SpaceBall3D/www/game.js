/* ============================================
   Single Point 3D - Main Game Engine
   Three.js Cartoonish 3D Survival Game
   With Map Theme Support
   ============================================ */

(function () {
    'use strict';

    // ============================================
    // DOM Elements
    // ============================================
    const container = document.getElementById('game-container');
    const hud = document.getElementById('hud');
    const levelDisplay = document.getElementById('level-display');
    const scoreDisplay = document.getElementById('score-display');
    const livesDisplay = document.getElementById('lives-display');
    const timeDisplay = document.getElementById('time-display');
    const mapDisplay = document.getElementById('map-display');
    const progressBarContainer = document.getElementById('progress-bar-container');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const powerupIndicator = document.getElementById('powerup-indicator');
    const powerupIcon = document.getElementById('powerup-icon');
    const powerupTimer = document.getElementById('powerup-timer');
    const homeBestScore = document.getElementById('home-best-score');

    // Screens
    const startScreen = document.getElementById('start-screen');
    const levelCompleteScreen = document.getElementById('level-complete-screen');
    const gameOverScreen = document.getElementById('game-over-screen');
    const victoryScreen = document.getElementById('victory-screen');

    // Buttons
    const startBtn = document.getElementById('start-btn');
    const startNoSoundBtn = document.getElementById('start-no-sound-btn');
    const nextLevelBtn = document.getElementById('next-level-btn');
    const restartBtn = document.getElementById('restart-btn');
    const playAgainBtn = document.getElementById('play-again-btn');

    // Map selection
    const mapCards = document.querySelectorAll('.map-card');

    // ============================================
    // Three.js Setup
    // ============================================
    let scene, camera, renderer;
    let playerMesh, playerGlow;
    let enemies = [];
    let powerups = [];
    let particles = [];
    let clouds = [];
    let stars = [];
    let environmentObjects = [];
    let lights = [];

    // ============================================
    // Game State
    // ============================================
    const state = {
        running: false,
        paused: false,
        currentLevel: 1,
        score: 0,
        lives: 3,
        levelTime: 0,
        lastTime: 0,
        spawnTimer: 0,
        soundEnabled: true,

        // Player slide movement
        targetX: 0,
        targetY: 0,

        // Active power-up
        activePowerup: null,
        powerupEndTime: 0,

        // Keyboard state
        keys: {}
    };

    // Player configuration
    const player = {
        x: 0,
        y: 0,
        z: 0,
        radius: 0.5,
        slideSpeed: 8,
        keyboardSpeed: 12
    };

    // ============================================
    // Initialization
    // ============================================
    function init() {
        // Scene
        scene = new THREE.Scene();

        // Camera
        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 15, 20);
        camera.lookAt(0, 0, 0);

        // Renderer
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // Initial map theme
        applyMapTheme();

        // Create player
        createPlayer();

        // Center target position
        state.targetX = 0;
        state.targetY = 0;

        // Load high score
        if (homeBestScore) {
            homeBestScore.textContent = localStorage.getItem('sp3d_highscore') || '0';
        }

        // Event listeners
        setupEventListeners();

        // Start render loop
        requestAnimationFrame(gameLoop);
    }

    // ============================================
    // Map Theme Application
    // ============================================
    function applyMapTheme() {
        const mapConfig = MAPS.getCurrent();

        // Clear existing environment
        clearEnvironment();

        // Update scene colors
        scene.background = new THREE.Color(mapConfig.backgroundColor);
        scene.fog = new THREE.Fog(mapConfig.fogColor, 20, 80);
        renderer.setClearColor(mapConfig.backgroundColor, 1);

        // Setup lighting
        setupLighting(mapConfig);

        // Create environment based on map
        createEnvironment(mapConfig);

        // Update player colors
        if (playerMesh) {
            playerMesh.material.color.setHex(mapConfig.playerColor);
            playerMesh.material.emissive.setHex(mapConfig.playerEmissive);
            playerGlow.material.color.setHex(mapConfig.playerGlowColor);
        }

        // Update HUD icon
        if (mapDisplay) {
            mapDisplay.textContent = mapConfig.icon;
        }
    }

    function clearEnvironment() {
        // Remove clouds
        clouds.forEach(c => scene.remove(c));
        clouds = [];

        // Remove stars
        stars.forEach(s => scene.remove(s));
        stars = [];

        // Remove environment objects
        environmentObjects.forEach(o => scene.remove(o));
        environmentObjects = [];

        // Remove lights
        lights.forEach(l => scene.remove(l));
        lights = [];
    }

    // ============================================
    // Lighting
    // ============================================
    function setupLighting(mapConfig) {
        // Ambient light
        const ambient = new THREE.AmbientLight(mapConfig.ambientColor, mapConfig.ambientIntensity);
        scene.add(ambient);
        lights.push(ambient);

        // Main directional light
        const mainLight = new THREE.DirectionalLight(0xffffff, 0.6);
        mainLight.position.set(10, 20, 10);
        scene.add(mainLight);
        lights.push(mainLight);

        // Map-specific colored point lights
        mapConfig.lights.forEach(light => {
            const pointLight = new THREE.PointLight(light.color, light.intensity, 40);
            pointLight.position.set(...light.position);
            scene.add(pointLight);
            lights.push(pointLight);
        });
    }

    // ============================================
    // Environment Creation
    // ============================================
    function createEnvironment(mapConfig) {
        // Ground plane
        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: mapConfig.groundColor,
            roughness: 0.8,
            metalness: 0.1
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -2;
        scene.add(ground);
        environmentObjects.push(ground);

        // Grid
        const gridHelper = new THREE.GridHelper(60, 30, mapConfig.gridColor1, mapConfig.gridColor2);
        gridHelper.position.y = -1.98;
        scene.add(gridHelper);
        environmentObjects.push(gridHelper);

        // Clouds
        if (mapConfig.hasClouds) {
            for (let i = 0; i < 12; i++) {
                createCloud(mapConfig);
            }
        }

        // Stars
        if (mapConfig.hasStars) {
            createStars(mapConfig);
        }

        // Floating islands
        if (mapConfig.hasFloatingIslands) {
            createFloatingIslands(mapConfig);
        }

        // Map-specific decorations
        createMapDecorations(mapConfig);
    }

    function createCloud(mapConfig) {
        const cloudGroup = new THREE.Group();

        const cloudMaterial = new THREE.MeshStandardMaterial({
            color: mapConfig.cloudColor,
            transparent: true,
            opacity: mapConfig.cloudOpacity,
            roughness: 1,
            metalness: 0
        });

        const numBalls = 3 + Math.floor(Math.random() * 3);
        for (let i = 0; i < numBalls; i++) {
            const size = 1 + Math.random() * 1.5;
            const ballGeometry = new THREE.SphereGeometry(size, 12, 12);
            const ball = new THREE.Mesh(ballGeometry, cloudMaterial);
            ball.position.set(
                (Math.random() - 0.5) * 3,
                (Math.random() - 0.5) * 0.5,
                (Math.random() - 0.5) * 2
            );
            cloudGroup.add(ball);
        }

        cloudGroup.position.set(
            (Math.random() - 0.5) * 80,
            10 + Math.random() * 15,
            (Math.random() - 0.5) * 60 - 20
        );

        cloudGroup.userData = {
            speed: 0.5 + Math.random() * 1,
            startX: cloudGroup.position.x
        };

        scene.add(cloudGroup);
        clouds.push(cloudGroup);
    }

    function createStars(mapConfig) {
        const starGeometry = new THREE.BufferGeometry();
        const starPositions = [];

        for (let i = 0; i < 400; i++) {
            starPositions.push(
                (Math.random() - 0.5) * 200,
                30 + Math.random() * 50,
                (Math.random() - 0.5) * 200 - 50
            );
        }

        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));

        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.3,
            transparent: true,
            opacity: 0.8
        });

        const starField = new THREE.Points(starGeometry, starMaterial);
        scene.add(starField);
        stars.push(starField);
    }

    function createFloatingIslands(mapConfig) {
        const islandPositions = [
            { x: -25, y: 5, z: -15 },
            { x: 25, y: 8, z: -20 },
            { x: -30, y: 3, z: 10 },
            { x: 30, y: 6, z: 5 },
            { x: 0, y: 10, z: -35 }
        ];

        islandPositions.forEach(pos => {
            const islandGroup = new THREE.Group();

            // Main island body
            const islandGeometry = new THREE.CylinderGeometry(3, 2, 2, 8);
            const islandMaterial = new THREE.MeshStandardMaterial({
                color: mapConfig.islandColor,
                roughness: 0.6,
                metalness: 0.2
            });
            const island = new THREE.Mesh(islandGeometry, islandMaterial);
            islandGroup.add(island);

            // Top layer
            const grassGeometry = new THREE.CylinderGeometry(3.2, 3, 0.5, 8);
            const grassMaterial = new THREE.MeshStandardMaterial({
                color: mapConfig.grassColor,
                roughness: 0.8
            });
            const grass = new THREE.Mesh(grassGeometry, grassMaterial);
            grass.position.y = 1;
            islandGroup.add(grass);

            // Decoration on top
            if (Math.random() > 0.5) {
                const treeGeometry = new THREE.ConeGeometry(0.8, 2.5, 6);
                const treeMaterial = new THREE.MeshStandardMaterial({ color: mapConfig.treeColor });
                const tree = new THREE.Mesh(treeGeometry, treeMaterial);
                tree.position.set(0, 2.5, 0);
                islandGroup.add(tree);
            } else {
                const crystalGeometry = new THREE.OctahedronGeometry(0.8);
                const crystalMaterial = new THREE.MeshStandardMaterial({
                    color: mapConfig.crystalColor,
                    emissive: mapConfig.crystalColor,
                    emissiveIntensity: 0.3
                });
                const crystal = new THREE.Mesh(crystalGeometry, crystalMaterial);
                crystal.position.set(0, 2.5, 0);
                crystal.rotation.y = Math.random() * Math.PI;
                islandGroup.add(crystal);
            }

            islandGroup.position.set(pos.x, pos.y, pos.z);
            islandGroup.userData = { floatOffset: Math.random() * Math.PI * 2 };
            scene.add(islandGroup);
            environmentObjects.push(islandGroup);
        });
    }

    function createMapDecorations(mapConfig) {
        const mapName = MAPS.current;

        if (mapName === 'military') {
            // Military crates
            for (let i = 0; i < 5; i++) {
                const crateGeometry = new THREE.BoxGeometry(1, 1, 1);
                const crateMaterial = new THREE.MeshStandardMaterial({
                    color: 0x4a5a3a,
                    roughness: 0.9
                });
                const crate = new THREE.Mesh(crateGeometry, crateMaterial);
                crate.position.set(
                    (Math.random() - 0.5) * 50,
                    5 + Math.random() * 10,
                    (Math.random() - 0.5) * 40 - 15
                );
                crate.rotation.set(Math.random(), Math.random(), Math.random());
                scene.add(crate);
                environmentObjects.push(crate);
            }
        } else if (mapName === 'desert') {
            // Desert cacti
            for (let i = 0; i < 8; i++) {
                const cactusGroup = new THREE.Group();

                const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.4, 2, 8);
                const cactusMaterial = new THREE.MeshStandardMaterial({ color: 0x2d5a2d });
                const body = new THREE.Mesh(bodyGeometry, cactusMaterial);
                cactusGroup.add(body);

                // Arms
                const armGeometry = new THREE.CylinderGeometry(0.15, 0.2, 0.8, 6);
                const leftArm = new THREE.Mesh(armGeometry, cactusMaterial);
                leftArm.position.set(-0.4, 0.3, 0);
                leftArm.rotation.z = Math.PI / 3;
                cactusGroup.add(leftArm);

                const rightArm = new THREE.Mesh(armGeometry, cactusMaterial);
                rightArm.position.set(0.4, 0.5, 0);
                rightArm.rotation.z = -Math.PI / 3;
                cactusGroup.add(rightArm);

                cactusGroup.position.set(
                    (Math.random() - 0.5) * 50,
                    6 + Math.random() * 8,
                    (Math.random() - 0.5) * 40 - 15
                );
                scene.add(cactusGroup);
                environmentObjects.push(cactusGroup);
            }
        } else if (mapName === 'jungle') {
            // Jungle vines
            for (let i = 0; i < 10; i++) {
                const vineGeometry = new THREE.CylinderGeometry(0.05, 0.05, 8, 8);
                const vineMaterial = new THREE.MeshStandardMaterial({ color: 0x228822 });
                const vine = new THREE.Mesh(vineGeometry, vineMaterial);
                vine.position.set(
                    (Math.random() - 0.5) * 60,
                    20 + Math.random() * 5,
                    (Math.random() - 0.5) * 50 - 10
                );
                scene.add(vine);
                environmentObjects.push(vine);
            }

            // Parrots (simple colored spheres)
            for (let i = 0; i < 3; i++) {
                const parrotGeometry = new THREE.SphereGeometry(0.3, 16, 16);
                const parrotMaterial = new THREE.MeshStandardMaterial({
                    color: [0xff0000, 0x0000ff, 0xffff00][i],
                    emissive: [0xff0000, 0x0000ff, 0xffff00][i],
                    emissiveIntensity: 0.3
                });
                const parrot = new THREE.Mesh(parrotGeometry, parrotMaterial);
                parrot.position.set(
                    (Math.random() - 0.5) * 40,
                    12 + Math.random() * 8,
                    (Math.random() - 0.5) * 30
                );
                parrot.userData = {
                    startX: parrot.position.x,
                    flyOffset: Math.random() * Math.PI * 2
                };
                scene.add(parrot);
                environmentObjects.push(parrot);
            }
        } else if (mapName === 'party') {
            // Balloons
            const balloonColors = [0xff6b9d, 0x58a6ff, 0x7c3aed, 0x06d6a0, 0xffd166];
            for (let i = 0; i < 15; i++) {
                const balloonGeometry = new THREE.SphereGeometry(0.5, 16, 16);
                const balloonMaterial = new THREE.MeshStandardMaterial({
                    color: balloonColors[i % balloonColors.length],
                    emissive: balloonColors[i % balloonColors.length],
                    emissiveIntensity: 0.2
                });
                const balloon = new THREE.Mesh(balloonGeometry, balloonMaterial);

                // String
                const stringGeometry = new THREE.CylinderGeometry(0.02, 0.02, 2, 4);
                const stringMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc });
                const string = new THREE.Mesh(stringGeometry, stringMaterial);
                string.position.y = -1.2;
                balloon.add(string);

                balloon.position.set(
                    (Math.random() - 0.5) * 60,
                    8 + Math.random() * 15,
                    (Math.random() - 0.5) * 50 - 10
                );
                balloon.userData = { floatOffset: Math.random() * Math.PI * 2 };
                scene.add(balloon);
                environmentObjects.push(balloon);
            }
        }
    }

    // ============================================
    // Player
    // ============================================
    function createPlayer() {
        const mapConfig = MAPS.getCurrent();

        const playerGeometry = new THREE.SphereGeometry(player.radius, 32, 32);
        const playerMaterial = new THREE.MeshStandardMaterial({
            color: mapConfig.playerColor,
            roughness: 0.3,
            metalness: 0.5,
            emissive: mapConfig.playerEmissive,
            emissiveIntensity: 0.2
        });
        playerMesh = new THREE.Mesh(playerGeometry, playerMaterial);
        playerMesh.position.set(0, 0, 0);
        scene.add(playerMesh);

        // Glow effect
        const glowGeometry = new THREE.SphereGeometry(player.radius * 1.5, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: mapConfig.playerGlowColor,
            transparent: true,
            opacity: 0.3
        });
        playerGlow = new THREE.Mesh(glowGeometry, glowMaterial);
        playerMesh.add(playerGlow);

        // Face
        addPlayerFace();
    }

    function addPlayerFace() {
        const eyeGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.15, 0.1, 0.4);
        playerMesh.add(leftEye);

        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.15, 0.1, 0.4);
        playerMesh.add(rightEye);

        const pupilGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const pupilMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
        leftPupil.position.set(0, 0, 0.05);
        leftEye.add(leftPupil);

        const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
        rightPupil.position.set(0, 0, 0.05);
        rightEye.add(rightPupil);
    }

    // ============================================
    // Enemies
    // ============================================
    function createEnemy(type = 'basic') {
        const config = LEVELS.getLevel(state.currentLevel);
        const stats = LEVELS.getEnemyStats(type);
        const mapConfig = MAPS.getCurrent();

        const enemyGroup = new THREE.Group();

        // Get themed color
        const enemyColors = MAPS.getEnemyColors(MAPS.current);
        const enemyColor = enemyColors[type] || stats.color;

        const enemyGeometry = new THREE.SphereGeometry(stats.size * 0.5, 24, 24);
        const enemyMaterial = new THREE.MeshStandardMaterial({
            color: enemyColor,
            roughness: 0.4,
            metalness: 0.3,
            emissive: enemyColor,
            emissiveIntensity: 0.15
        });
        const enemyMesh = new THREE.Mesh(enemyGeometry, enemyMaterial);
        enemyGroup.add(enemyMesh);

        const glowGeometry = new THREE.SphereGeometry(stats.size * 0.7, 12, 12);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: enemyColor,
            transparent: true,
            opacity: 0.2
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        enemyGroup.add(glow);

        addEnemyFace(enemyMesh, stats.size);

        // Spawn from edge
        const bounds = 18;
        const side = Math.floor(Math.random() * 4);
        let x, z;

        if (side === 0) { x = -bounds; z = (Math.random() - 0.5) * bounds * 2; }
        else if (side === 1) { x = bounds; z = (Math.random() - 0.5) * bounds * 2; }
        else if (side === 2) { x = (Math.random() - 0.5) * bounds * 2; z = -bounds; }
        else { x = (Math.random() - 0.5) * bounds * 2; z = bounds; }

        enemyGroup.position.set(x, 0, z);

        enemyGroup.userData = {
            type: type,
            speed: stats.speed * config.enemySpeedMultiplier,
            homing: stats.homing * config.homingStrength,
            radius: stats.size * 0.5,
            points: stats.points,
            health: stats.health || 1,
            vx: 0,
            vz: 0,
            bobOffset: Math.random() * Math.PI * 2
        };

        scene.add(enemyGroup);
        enemies.push(enemyGroup);
    }

    function addEnemyFace(mesh, size) {
        const scale = size * 0.4;

        const eyeGeometry = new THREE.SphereGeometry(0.08 * scale, 8, 8);
        const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.12 * scale, 0.05 * scale, 0.45 * scale);
        leftEye.rotation.z = 0.3;
        mesh.add(leftEye);

        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.12 * scale, 0.05 * scale, 0.45 * scale);
        rightEye.rotation.z = -0.3;
        mesh.add(rightEye);

        const pupilGeometry = new THREE.SphereGeometry(0.04 * scale, 6, 6);
        const pupilMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

        const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
        leftPupil.position.z = 0.05;
        leftEye.add(leftPupil);

        const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
        rightPupil.position.z = 0.05;
        rightEye.add(rightPupil);

        const browGeometry = new THREE.BoxGeometry(0.15 * scale, 0.02 * scale, 0.02 * scale);
        const browMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

        const leftBrow = new THREE.Mesh(browGeometry, browMaterial);
        leftBrow.position.set(-0.12 * scale, 0.15 * scale, 0.47 * scale);
        leftBrow.rotation.z = -0.4;
        mesh.add(leftBrow);

        const rightBrow = new THREE.Mesh(browGeometry, browMaterial);
        rightBrow.position.set(0.12 * scale, 0.15 * scale, 0.47 * scale);
        rightBrow.rotation.z = 0.4;
        mesh.add(rightBrow);
    }

    function getRandomEnemyType() {
        const config = LEVELS.getLevel(state.currentLevel);
        const types = config.enemyTypes;
        return types[Math.floor(Math.random() * types.length)];
    }

    // ============================================
    // Power-ups
    // ============================================
    function createPowerup() {
        const type = LEVELS.getRandomPowerup();
        const powerupData = LEVELS.powerups[type];

        const powerupGroup = new THREE.Group();

        const orbGeometry = new THREE.SphereGeometry(0.4, 24, 24);
        const orbMaterial = new THREE.MeshStandardMaterial({
            color: powerupData.color,
            emissive: powerupData.color,
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.9
        });
        const orb = new THREE.Mesh(orbGeometry, orbMaterial);
        powerupGroup.add(orb);

        const ringGeometry = new THREE.TorusGeometry(0.6, 0.05, 8, 32);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.5
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2;
        powerupGroup.add(ring);

        const bounds = 12;
        powerupGroup.position.set(
            (Math.random() - 0.5) * bounds * 2,
            0.5,
            (Math.random() - 0.5) * bounds * 2
        );

        powerupGroup.userData = {
            type: type,
            data: powerupData,
            bobOffset: Math.random() * Math.PI * 2
        };

        scene.add(powerupGroup);
        powerups.push(powerupGroup);
    }

    function activatePowerup(type) {
        const powerupData = LEVELS.powerups[type];

        if (type === 'bomb') {
            enemies.forEach(enemy => {
                createExplosion(enemy.position.x, enemy.position.y, enemy.position.z, 0xef476f);
                scene.remove(enemy);
                state.score += enemy.userData.points;
            });
            enemies = [];
            playSound(300, 0.3, 'sawtooth');
        } else if (type === 'life') {
            state.lives = Math.min(state.lives + 1, 5);
            updateLivesDisplay();
            playSound(880, 0.2, 'sine');
        } else {
            state.activePowerup = type;
            state.powerupEndTime = performance.now() + powerupData.duration * 1000;

            powerupIcon.textContent = powerupData.icon;
            powerupIndicator.classList.remove('hidden');
            playSound(660, 0.2, 'sine');
        }
    }

    // ============================================
    // Particles & Effects
    // ============================================
    function createExplosion(x, y, z, color) {
        const particleCount = 20;

        for (let i = 0; i < particleCount; i++) {
            const particleGeometry = new THREE.SphereGeometry(0.1 + Math.random() * 0.1, 8, 8);
            const particleMaterial = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 1
            });
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            particle.position.set(x, y, z);

            particle.userData = {
                vx: (Math.random() - 0.5) * 10,
                vy: Math.random() * 8,
                vz: (Math.random() - 0.5) * 10,
                life: 1,
                decay: 0.02 + Math.random() * 0.02
            };

            scene.add(particle);
            particles.push(particle);
        }
    }

    function updateParticles(dt) {
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];

            p.position.x += p.userData.vx * dt;
            p.position.y += p.userData.vy * dt;
            p.position.z += p.userData.vz * dt;
            p.userData.vy -= 15 * dt;

            p.userData.life -= p.userData.decay;
            p.material.opacity = p.userData.life;

            if (p.userData.life <= 0) {
                scene.remove(p);
                particles.splice(i, 1);
            }
        }
    }

    // ============================================
    // Audio
    // ============================================
    let audioCtx = null;

    function ensureAudio() {
        if (audioCtx || !state.soundEnabled) return;
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    function playSound(freq, duration = 0.1, type = 'sine') {
        if (!audioCtx || !state.soundEnabled) return;

        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        o.type = type;
        o.frequency.value = freq;
        g.gain.value = 0.0001;
        o.connect(g);
        g.connect(audioCtx.destination);

        const now = audioCtx.currentTime;
        g.gain.exponentialRampToValueAtTime(0.1, now + 0.01);
        o.start(now);
        g.gain.exponentialRampToValueAtTime(0.0001, now + duration);
        o.stop(now + duration + 0.02);
    }

    // ============================================
    // Game Loop
    // ============================================
    function gameLoop(now) {
        requestAnimationFrame(gameLoop);

        const dt = Math.min(0.05, (now - state.lastTime) / 1000);
        state.lastTime = now;

        if (state.running && !state.paused) {
            update(dt);
        }

        updateEnvironment(dt);

        renderer.render(scene, camera);
    }

    function update(dt) {
        state.levelTime += dt;
        const timeRemaining = Math.max(0, LEVELS.levelDuration - state.levelTime);
        timeDisplay.textContent = Math.ceil(timeRemaining);

        const progress = (state.levelTime / LEVELS.levelDuration) * 100;
        progressBar.style.width = Math.min(100, progress) + '%';

        if (state.levelTime >= LEVELS.levelDuration) {
            levelComplete();
            return;
        }

        handleKeyboard(dt);
        slidePlayer(dt);

        const config = LEVELS.getLevel(state.currentLevel);
        state.spawnTimer += dt;
        if (state.spawnTimer >= config.spawnInterval && enemies.length < config.maxEnemies) {
            state.spawnTimer = 0;
            createEnemy(getRandomEnemyType());
        }

        if (Math.random() < config.powerupChance * dt) {
            createPowerup();
        }

        updateEnemies(dt);
        updatePowerups(dt);
        updateParticles(dt);

        if (state.activePowerup && performance.now() >= state.powerupEndTime) {
            state.activePowerup = null;
            powerupIndicator.classList.add('hidden');
        } else if (state.activePowerup) {
            const remaining = Math.ceil((state.powerupEndTime - performance.now()) / 1000);
            powerupTimer.textContent = remaining + 's';
        }

        scoreDisplay.textContent = state.score;
        updatePlayerEffects(dt);
    }

    function handleKeyboard(dt) {
        const speed = player.keyboardSpeed * dt;
        const bounds = 14;

        if (state.keys['ArrowUp'] || state.keys['w'] || state.keys['W']) {
            state.targetY = Math.max(-bounds, state.targetY - speed);
        }
        if (state.keys['ArrowDown'] || state.keys['s'] || state.keys['S']) {
            state.targetY = Math.min(bounds, state.targetY + speed);
        }
        if (state.keys['ArrowLeft'] || state.keys['a'] || state.keys['A']) {
            state.targetX = Math.max(-bounds, state.targetX - speed);
        }
        if (state.keys['ArrowRight'] || state.keys['d'] || state.keys['D']) {
            state.targetX = Math.min(bounds, state.targetX + speed);
        }
    }

    function slidePlayer(dt) {
        const speedMultiplier = state.activePowerup === 'speed' ? 2 : 1;
        const lerpFactor = player.slideSpeed * speedMultiplier * dt;

        player.x += (state.targetX - player.x) * Math.min(1, lerpFactor);
        player.z += (state.targetY - player.z) * Math.min(1, lerpFactor);

        playerMesh.position.x = player.x;
        playerMesh.position.z = player.z;

        const dx = state.targetX - player.x;
        const dz = state.targetY - player.z;
        playerMesh.rotation.z = -dx * 0.1;
        playerMesh.rotation.x = dz * 0.1;
    }

    function updatePlayerEffects(dt) {
        const bounce = Math.sin(performance.now() * 0.005) * 0.1;
        playerMesh.position.y = bounce;

        const glowPulse = 0.25 + Math.sin(performance.now() * 0.003) * 0.1;
        playerGlow.material.opacity = glowPulse;

        const mapConfig = MAPS.getCurrent();

        if (state.activePowerup === 'shield') {
            playerGlow.material.color.setHex(0x06d6a0);
            playerGlow.material.opacity = 0.5;
            playerGlow.scale.setScalar(1.5);
        } else {
            playerGlow.material.color.setHex(mapConfig.playerGlowColor);
            playerGlow.scale.setScalar(1);
        }
    }

    function updateEnemies(dt) {
        for (let i = enemies.length - 1; i >= 0; i--) {
            const enemy = enemies[i];
            const data = enemy.userData;

            const dx = player.x - enemy.position.x;
            const dz = player.z - enemy.position.z;
            const dist = Math.hypot(dx, dz) || 1;

            const desiredVx = (dx / dist) * data.speed;
            const desiredVz = (dz / dist) * data.speed;

            const alpha = Math.min(1, data.homing * dt);
            data.vx += (desiredVx - data.vx) * alpha;
            data.vz += (desiredVz - data.vz) * alpha;

            enemy.position.x += data.vx * dt;
            enemy.position.z += data.vz * dt;

            enemy.position.y = Math.sin(performance.now() * 0.003 + data.bobOffset) * 0.2;
            enemy.rotation.y = Math.atan2(dx, dz);

            if (Math.abs(enemy.position.x) > 30 || Math.abs(enemy.position.z) > 30) {
                scene.remove(enemy);
                enemies.splice(i, 1);
                continue;
            }

            const collisionDist = data.radius + player.radius;
            if (dist < collisionDist) {
                if (state.activePowerup === 'shield') {
                    createExplosion(enemy.position.x, enemy.position.y, enemy.position.z, 0x06d6a0);
                    scene.remove(enemy);
                    enemies.splice(i, 1);
                    state.score += data.points;
                    playSound(440, 0.1, 'sine');
                } else {
                    playerHit();
                }
            }
        }
    }

    function updatePowerups(dt) {
        for (let i = powerups.length - 1; i >= 0; i--) {
            const powerup = powerups[i];

            powerup.position.y = 0.5 + Math.sin(performance.now() * 0.003 + powerup.userData.bobOffset) * 0.3;
            powerup.rotation.y += dt * 2;

            const dx = player.x - powerup.position.x;
            const dz = player.z - powerup.position.z;
            const dist = Math.hypot(dx, dz);

            if (dist < 1) {
                activatePowerup(powerup.userData.type);
                createExplosion(powerup.position.x, powerup.position.y, powerup.position.z, powerup.userData.data.color);
                scene.remove(powerup);
                powerups.splice(i, 1);
            }
        }
    }

    function updateEnvironment(dt) {
        clouds.forEach(cloud => {
            cloud.position.x += cloud.userData.speed * dt;
            if (cloud.position.x > 50) {
                cloud.position.x = -50;
            }
        });

        stars.forEach(star => {
            star.rotation.y += dt * 0.02;
        });

        // Animate floating decorations
        environmentObjects.forEach(obj => {
            if (obj.userData && obj.userData.floatOffset !== undefined) {
                obj.position.y += Math.sin(performance.now() * 0.001 + obj.userData.floatOffset) * 0.002;
            }
            if (obj.userData && obj.userData.flyOffset !== undefined) {
                obj.position.x = obj.userData.startX + Math.sin(performance.now() * 0.002 + obj.userData.flyOffset) * 5;
            }
        });
    }

    // ============================================
    // Game Events
    // ============================================
    function playerHit() {
        state.lives--;
        updateLivesDisplay();

        createExplosion(player.x, 0, player.z, MAPS.getCurrent().playerColor);
        playSound(150, 0.3, 'sawtooth');

        if (state.lives <= 0) {
            gameOver();
        } else {
            state.activePowerup = 'shield';
            state.powerupEndTime = performance.now() + 1500;
            powerupIcon.textContent = '💫';
            powerupIndicator.classList.remove('hidden');
        }
    }

    function levelComplete() {
        state.running = false;

        state.score += state.currentLevel * 100;

        playSound(880, 0.15, 'sine');
        setTimeout(() => playSound(1100, 0.15, 'sine'), 150);
        setTimeout(() => playSound(1320, 0.2, 'sine'), 300);

        if (state.currentLevel >= LEVELS.totalLevels) {
            showVictory();
        } else {
            document.getElementById('level-score').textContent = state.score;
            document.getElementById('next-level').textContent = 'Level ' + (state.currentLevel + 1);
            levelCompleteScreen.classList.remove('hidden');
        }
    }

    function nextLevel() {
        state.currentLevel++;
        levelDisplay.textContent = state.currentLevel;

        enemies.forEach(e => scene.remove(e));
        enemies = [];
        powerups.forEach(p => scene.remove(p));
        powerups = [];

        state.levelTime = 0;
        state.spawnTimer = 0;
        state.activePowerup = null;
        powerupIndicator.classList.add('hidden');

        const config = LEVELS.getLevel(state.currentLevel);
        progressText.textContent = config.name;

        levelCompleteScreen.classList.add('hidden');
        state.running = true;
    }

    function gameOver() {
        state.running = false;

        playSound(120, 0.4, 'sawtooth');

        const bestScore = Number(localStorage.getItem('sp3d_highscore') || 0);
        if (state.score > bestScore) {
            localStorage.setItem('sp3d_highscore', state.score);
        }

        document.getElementById('final-level').textContent = state.currentLevel;
        document.getElementById('final-score').textContent = state.score;
        document.getElementById('best-score').textContent = Math.max(bestScore, state.score);

        gameOverScreen.classList.remove('hidden');
    }

    function showVictory() {
        const bestScore = Number(localStorage.getItem('sp3d_highscore') || 0);
        if (state.score > bestScore) {
            localStorage.setItem('sp3d_highscore', state.score);
        }

        document.getElementById('victory-score').textContent = state.score;
        document.getElementById('victory-best').textContent = Math.max(bestScore, state.score);

        victoryScreen.classList.remove('hidden');

        playSound(523, 0.15, 'sine');
        setTimeout(() => playSound(659, 0.15, 'sine'), 150);
        setTimeout(() => playSound(784, 0.15, 'sine'), 300);
        setTimeout(() => playSound(1047, 0.3, 'sine'), 450);
    }

    function updateLivesDisplay() {
        livesDisplay.textContent = '❤️'.repeat(state.lives);
    }

    function startGame(withSound) {
        state.soundEnabled = withSound;
        if (withSound) ensureAudio();

        // Reset game state
        state.currentLevel = 1;
        state.score = 0;
        state.lives = 3;
        state.levelTime = 0;
        state.spawnTimer = 0;
        state.activePowerup = null;
        state.running = true;

        // Reset player position
        player.x = 0;
        player.z = 0;
        state.targetX = 0;
        state.targetY = 0;
        playerMesh.position.set(0, 0, 0);

        // Apply selected map theme
        applyMapTheme();

        // Clear enemies and power-ups
        enemies.forEach(e => scene.remove(e));
        enemies = [];
        powerups.forEach(p => scene.remove(p));
        powerups = [];
        particles.forEach(p => scene.remove(p));
        particles = [];

        // Update UI
        levelDisplay.textContent = '1';
        scoreDisplay.textContent = '0';
        updateLivesDisplay();
        progressBar.style.width = '0%';
        powerupIndicator.classList.add('hidden');

        const config = LEVELS.getLevel(1);
        progressText.textContent = config.name;

        // Show HUD
        hud.classList.remove('hidden');
        progressBarContainer.classList.remove('hidden');

        // Hide all screens
        startScreen.classList.add('hidden');
        levelCompleteScreen.classList.add('hidden');
        gameOverScreen.classList.add('hidden');
        victoryScreen.classList.add('hidden');
    }

    // ============================================
    // Event Listeners
    // ============================================
    function setupEventListeners() {
        // Window resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Keyboard
        window.addEventListener('keydown', e => { state.keys[e.key] = true; });
        window.addEventListener('keyup', e => { state.keys[e.key] = false; });

        // Mouse/Touch input
        const getWorldPosition = (clientX, clientY) => {
            const rect = renderer.domElement.getBoundingClientRect();
            const mouse = new THREE.Vector2(
                ((clientX - rect.left) / rect.width) * 2 - 1,
                -((clientY - rect.top) / rect.height) * 2 + 1
            );

            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, camera);

            const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
            const intersection = new THREE.Vector3();
            raycaster.ray.intersectPlane(plane, intersection);

            const bounds = 14;
            return {
                x: Math.max(-bounds, Math.min(bounds, intersection.x)),
                z: Math.max(-bounds, Math.min(bounds, intersection.z))
            };
        };

        renderer.domElement.addEventListener('mousemove', e => {
            if (!state.running) return;
            const pos = getWorldPosition(e.clientX, e.clientY);
            state.targetX = pos.x;
            state.targetY = pos.z;
        });

        renderer.domElement.addEventListener('mousedown', e => {
            if (!state.running) return;
            const pos = getWorldPosition(e.clientX, e.clientY);
            state.targetX = pos.x;
            state.targetY = pos.z;
        });

        renderer.domElement.addEventListener('touchmove', e => {
            if (!state.running) return;
            e.preventDefault();
            const touch = e.touches[0];
            if (touch) {
                const pos = getWorldPosition(touch.clientX, touch.clientY);
                state.targetX = pos.x;
                state.targetY = pos.z;
            }
        }, { passive: false });

        renderer.domElement.addEventListener('touchstart', e => {
            if (!state.running) return;
            const touch = e.touches[0];
            if (touch) {
                const pos = getWorldPosition(touch.clientX, touch.clientY);
                state.targetX = pos.x;
                state.targetY = pos.z;
            }
        });

        // Map selection
        mapCards.forEach(card => {
            card.addEventListener('click', () => {
                // Remove selected from all
                mapCards.forEach(c => c.classList.remove('selected'));
                // Add selected to clicked
                card.classList.add('selected');
                // Set map
                MAPS.setMap(card.dataset.map);
            });
        });

        // Button events
        startBtn.addEventListener('click', () => startGame(true));
        startNoSoundBtn.addEventListener('click', () => startGame(false));
        nextLevelBtn.addEventListener('click', nextLevel);
        restartBtn.addEventListener('click', () => {
            gameOverScreen.classList.add('hidden');
            startScreen.classList.remove('hidden');
            hud.classList.add('hidden');
            progressBarContainer.classList.add('hidden');
        });
        playAgainBtn.addEventListener('click', () => {
            victoryScreen.classList.add('hidden');
            startScreen.classList.remove('hidden');
            hud.classList.add('hidden');
            progressBarContainer.classList.add('hidden');
        });
    }

    // ============================================
    // Initialize Game
    // ============================================
    init();

})();
