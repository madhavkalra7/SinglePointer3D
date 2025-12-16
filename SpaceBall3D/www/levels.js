/* ============================================
   Single Point 3D - Level Configuration
   9 Levels with Increasing Difficulty
   ============================================ */

const LEVELS = {
  // Level duration in seconds to complete
  levelDuration: 30,
  
  // Total number of levels
  totalLevels: 9,
  
  // Level configurations
  configs: [
    // Level 1 - Tutorial (Easy)
    {
      level: 1,
      name: "Tutorial",
      enemySpeedMultiplier: 0.6,
      spawnInterval: 2.5,
      maxEnemies: 5,
      homingStrength: 1.5,
      enemyTypes: ['basic'],
      powerupChance: 0,
      backgroundColor: 0x1a1a2e,
      description: "Learn the basics! Slide to avoid enemies."
    },
    
    // Level 2 - Getting Started
    {
      level: 2,
      name: "Getting Started",
      enemySpeedMultiplier: 0.7,
      spawnInterval: 2.0,
      maxEnemies: 8,
      homingStrength: 1.8,
      enemyTypes: ['basic'],
      powerupChance: 0.1,
      backgroundColor: 0x16213e,
      description: "Enemies are spawning faster now!"
    },
    
    // Level 3 - Speed Demons
    {
      level: 3,
      name: "Speed Demons",
      enemySpeedMultiplier: 0.8,
      spawnInterval: 1.8,
      maxEnemies: 10,
      homingStrength: 2.0,
      enemyTypes: ['basic', 'fast'],
      powerupChance: 0.15,
      backgroundColor: 0x0f3460,
      description: "Watch out for fast enemies!"
    },
    
    // Level 4 - Chaos Begins
    {
      level: 4,
      name: "Chaos Begins",
      enemySpeedMultiplier: 0.9,
      spawnInterval: 1.5,
      maxEnemies: 12,
      homingStrength: 2.2,
      enemyTypes: ['basic', 'fast', 'giant'],
      powerupChance: 0.2,
      backgroundColor: 0x1e3a5f,
      description: "Giant enemies have appeared!"
    },
    
    // Level 5 - Boss Battle
    {
      level: 5,
      name: "Boss Battle",
      enemySpeedMultiplier: 1.0,
      spawnInterval: 1.3,
      maxEnemies: 15,
      homingStrength: 2.5,
      enemyTypes: ['basic', 'fast', 'giant'],
      hasBoss: true,
      powerupChance: 0.25,
      backgroundColor: 0x2d1b4e,
      description: "Defeat the BOSS to continue!"
    },
    
    // Level 6 - Frenzy
    {
      level: 6,
      name: "Frenzy",
      enemySpeedMultiplier: 1.1,
      spawnInterval: 1.1,
      maxEnemies: 18,
      homingStrength: 2.8,
      enemyTypes: ['basic', 'fast', 'giant'],
      powerupChance: 0.2,
      backgroundColor: 0x3d1f5c,
      description: "Things are getting intense!"
    },
    
    // Level 7 - Nightmare
    {
      level: 7,
      name: "Nightmare",
      enemySpeedMultiplier: 1.2,
      spawnInterval: 0.9,
      maxEnemies: 22,
      homingStrength: 3.0,
      enemyTypes: ['basic', 'fast', 'giant', 'tracker'],
      powerupChance: 0.15,
      backgroundColor: 0x4a1942,
      description: "Tracker enemies lock on tight!"
    },
    
    // Level 8 - Double Trouble
    {
      level: 8,
      name: "Double Trouble",
      enemySpeedMultiplier: 1.3,
      spawnInterval: 0.7,
      maxEnemies: 28,
      homingStrength: 3.5,
      enemyTypes: ['basic', 'fast', 'giant', 'tracker'],
      hasBoss: true,
      bossCount: 2,
      powerupChance: 0.2,
      backgroundColor: 0x5c1a3d,
      description: "TWO BOSSES await you!"
    },
    
    // Level 9 - Final Challenge
    {
      level: 9,
      name: "Final Challenge",
      enemySpeedMultiplier: 1.5,
      spawnInterval: 0.5,
      maxEnemies: 35,
      homingStrength: 4.0,
      enemyTypes: ['basic', 'fast', 'giant', 'tracker'],
      hasBoss: true,
      bossCount: 3,
      powerupChance: 0.25,
      backgroundColor: 0x6b1a35,
      description: "The FINAL CHALLENGE! Good luck!"
    }
  ],
  
  // Get level config by level number (1-indexed)
  getLevel(levelNum) {
    const index = Math.max(0, Math.min(levelNum - 1, this.configs.length - 1));
    return this.configs[index];
  },
  
  // Get enemy base stats by type
  getEnemyStats(type) {
    const stats = {
      basic: {
        speed: 80,
        size: 0.8,
        color: 0x58a6ff,
        homing: 1.0,
        points: 10
      },
      fast: {
        speed: 150,
        size: 0.5,
        color: 0xff6b9d,
        homing: 0.8,
        points: 15
      },
      giant: {
        speed: 50,
        size: 1.5,
        color: 0x7c3aed,
        homing: 1.2,
        points: 25
      },
      tracker: {
        speed: 100,
        size: 0.7,
        color: 0xef476f,
        homing: 2.0,
        points: 20
      },
      boss: {
        speed: 40,
        size: 3.0,
        color: 0xffd166,
        homing: 1.5,
        points: 100,
        health: 5
      }
    };
    return stats[type] || stats.basic;
  },
  
  // Power-up types
  powerups: {
    shield: {
      icon: '🛡️',
      name: 'Shield',
      duration: 5,
      color: 0x06d6a0
    },
    speed: {
      icon: '⚡',
      name: 'Speed Boost',
      duration: 3,
      color: 0xffd166
    },
    bomb: {
      icon: '💥',
      name: 'Bomb',
      duration: 0,
      color: 0xef476f
    },
    life: {
      icon: '❤️',
      name: 'Extra Life',
      duration: 0,
      color: 0xff6b9d
    }
  },
  
  // Get random power-up type
  getRandomPowerup() {
    const types = Object.keys(this.powerups);
    return types[Math.floor(Math.random() * types.length)];
  }
};

// Export for use in game.js
window.LEVELS = LEVELS;
