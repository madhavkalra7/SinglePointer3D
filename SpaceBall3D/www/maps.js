/* ============================================
   Single Point 3D - Map Configurations
   4 Themed Maps with Unique Visuals
   ============================================ */

const MAPS = {
    // Currently selected map
    current: 'party',

    // Map configurations
    configs: {
        // Party Map - Colorful & Festive
        party: {
            name: 'Party Zone',
            icon: '🎉',
            description: 'Colorful & Festive!',

            // Colors
            backgroundColor: 0x1a1a2e,
            fogColor: 0x1a1a2e,
            groundColor: 0x2d1b4e,
            gridColor1: 0x7c3aed,
            gridColor2: 0x5b2d99,

            // Player theme
            playerColor: 0xff4d4d,
            playerEmissive: 0xff4d4d,
            playerGlowColor: 0xff6b9d,

            // Environment
            ambientColor: 0x404080,
            ambientIntensity: 0.6,
            lights: [
                { color: 0xff6b9d, intensity: 0.5, position: [-15, 10, 5] },
                { color: 0x58a6ff, intensity: 0.5, position: [15, 10, -5] },
                { color: 0x7c3aed, intensity: 0.4, position: [0, -5, 10] }
            ],

            // Decorations
            hasFloatingIslands: true,
            hasClouds: true,
            hasStars: true,
            cloudColor: 0xffffff,
            cloudOpacity: 0.7,

            // Special elements
            floatingObjects: [
                { type: 'balloon', colors: [0xff6b9d, 0x58a6ff, 0x7c3aed, 0x06d6a0, 0xffd166] },
                { type: 'confetti', density: 50 }
            ],

            // Island colors
            islandColor: 0x7c3aed,
            grassColor: 0x06d6a0,
            treeColor: 0x06d6a0,
            crystalColor: 0xff6b9d
        },

        // Military Map - Tactical & Dark
        military: {
            name: 'Military Base',
            icon: '🎖️',
            description: 'Tactical & Dark',

            // Colors - Dark military green/gray
            backgroundColor: 0x0a0f0a,
            fogColor: 0x0a0f0a,
            groundColor: 0x1a2a1a,
            gridColor1: 0x2d4a2d,
            gridColor2: 0x1d3a1d,

            // Player theme - Camouflage green
            playerColor: 0x4a7c4a,
            playerEmissive: 0x3d6b3d,
            playerGlowColor: 0x5a8c5a,

            // Environment - Harsh lighting
            ambientColor: 0x1a2a1a,
            ambientIntensity: 0.4,
            lights: [
                { color: 0x4a7c4a, intensity: 0.6, position: [-15, 15, 5] },
                { color: 0xcccccc, intensity: 0.4, position: [15, 10, -5] },
                { color: 0x8b4513, intensity: 0.3, position: [0, -5, 10] }
            ],

            // Decorations
            hasFloatingIslands: true,
            hasClouds: true,
            hasStars: false,
            cloudColor: 0x555555,
            cloudOpacity: 0.5,

            // Special elements
            floatingObjects: [
                { type: 'helicopter', count: 2 },
                { type: 'crate', count: 5 }
            ],

            // Island colors - Military bunkers
            islandColor: 0x3d3d3d,
            grassColor: 0x2d4a2d,
            treeColor: 0x2a5a2a,
            crystalColor: 0x4a7c4a
        },

        // Desert Map - Sandy & Hot
        desert: {
            name: 'Desert Storm',
            icon: '🏜️',
            description: 'Hot & Sandy',

            // Colors - Sandy orange/brown
            backgroundColor: 0x2a1a0a,
            fogColor: 0x3a2a1a,
            groundColor: 0xd4a574,
            gridColor1: 0xc49664,
            gridColor2: 0xb48654,

            // Player theme - Golden/orange
            playerColor: 0xff8c00,
            playerEmissive: 0xff6600,
            playerGlowColor: 0xffa500,

            // Environment - Hot sun
            ambientColor: 0x5a4a3a,
            ambientIntensity: 0.7,
            lights: [
                { color: 0xffcc44, intensity: 0.8, position: [0, 25, 0] }, // Sun
                { color: 0xff8844, intensity: 0.4, position: [-15, 10, 5] },
                { color: 0xcc9966, intensity: 0.3, position: [15, 10, -5] }
            ],

            // Decorations
            hasFloatingIslands: true,
            hasClouds: false,
            hasStars: false,
            cloudColor: 0xddccaa,
            cloudOpacity: 0.3,

            // Special elements
            floatingObjects: [
                { type: 'cactus', count: 8 },
                { type: 'sandstorm', intensity: 0.3 }
            ],

            // Island colors - Rocky desert
            islandColor: 0xc49664,
            grassColor: 0xb48654,
            treeColor: 0x2a5a2a, // Cactus green
            crystalColor: 0xffd700 // Gold
        },

        // Jungle Map - Green & Wild
        jungle: {
            name: 'Wild Jungle',
            icon: '🌴',
            description: 'Green & Wild',

            // Colors - Deep jungle greens
            backgroundColor: 0x0a1a0f,
            fogColor: 0x0a2a0f,
            groundColor: 0x1a4a2a,
            gridColor1: 0x2d5a3d,
            gridColor2: 0x1d4a2d,

            // Player theme - Bright tropical
            playerColor: 0x00ff88,
            playerEmissive: 0x00cc66,
            playerGlowColor: 0x00ffaa,

            // Environment - Humid atmosphere
            ambientColor: 0x2a4a3a,
            ambientIntensity: 0.5,
            lights: [
                { color: 0x44ff88, intensity: 0.5, position: [-15, 10, 5] },
                { color: 0x88ffaa, intensity: 0.4, position: [15, 10, -5] },
                { color: 0x22cc66, intensity: 0.5, position: [0, 15, 0] }
            ],

            // Decorations
            hasFloatingIslands: true,
            hasClouds: true,
            hasStars: true,
            cloudColor: 0xaaffcc,
            cloudOpacity: 0.4,

            // Special elements
            floatingObjects: [
                { type: 'vine', count: 10 },
                { type: 'parrot', count: 3 },
                { type: 'waterfall', count: 2 }
            ],

            // Island colors - Lush vegetation
            islandColor: 0x2d3d2a,
            grassColor: 0x44aa44,
            treeColor: 0x228822,
            crystalColor: 0x00ffcc // Tropical cyan
        }
    },

    // Get current map config
    getCurrent() {
        return this.configs[this.current];
    },

    // Set current map
    setMap(mapName) {
        if (this.configs[mapName]) {
            this.current = mapName;
            return true;
        }
        return false;
    },

    // Get all map names
    getMapNames() {
        return Object.keys(this.configs);
    },

    // Get enemy colors based on map theme
    getEnemyColors(mapName) {
        const map = this.configs[mapName] || this.configs.party;

        return {
            basic: map.lights[1]?.color || 0x58a6ff,
            fast: map.playerGlowColor,
            giant: map.islandColor,
            tracker: 0xef476f,
            boss: 0xffd166
        };
    }
};

// Export for use in game.js
window.MAPS = MAPS;
