# 🎮 Single Point 3D

## ⚡ A Cartoonish 3D Survival Adventure Game ⚡

![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=threedotjs&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Capacitor](https://img.shields.io/badge/Capacitor-119EFF?style=for-the-badge&logo=capacitor&logoColor=white)
![Android](https://img.shields.io/badge/Android-3DDC84?style=for-the-badge&logo=android&logoColor=white)

![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)
![Version](https://img.shields.io/badge/Version-1.0.0-green.svg?style=flat-square)
![Status](https://img.shields.io/badge/Status-Active-success.svg?style=flat-square)

---

**Slide to survive! Dodge enemies through 9 thrilling levels across 4 unique themed arenas!**

---

## 🎯 About

**Single Point 3D** is an addictive survival game built with **Three.js** where you control a cute bouncy ball navigating through waves of enemies. With beautiful 3D graphics, multiple themed maps, power-ups, and progressively challenging levels — can you survive all 9 levels?

---

## ✨ Features

### 🎮 Core Gameplay
- 🎯 **9 Challenging Levels** — Progressive difficulty with unique enemy patterns
- 🗺️ **4 Themed Maps** — Party Zone, Military Base, Desert Storm & Wild Jungle
- 👾 **Multiple Enemy Types** — Basic, Fast, Tank, Splitter, Ghost & Boss enemies
- ⚡ **Power-ups** — Shield, Speed Boost, Slow-Mo, Extra Life & Bomb
- 🏆 **Score System** — Track your best scores with local storage

### 🎨 Visual Excellence
- 🌈 **Gorgeous 3D Graphics** — Cartoonish style with vibrant colors
- ✨ **Particle Effects** — Explosions, glows & dynamic animations
- ☁️ **Environmental Details** — Floating islands, clouds, balloons & more
- 🌟 **Theme-based Aesthetics** — Each map has unique colors, lighting & decorations

### 🕹️ Controls

| Platform | Controls |
|----------|----------|
| 🖱️ Mouse | Slide to move |
| ⌨️ Keyboard | WASD / Arrow keys |
| 📱 Touch | Swipe & drag |

### 📱 Cross-Platform
- ✅ Web Browser (Desktop & Mobile)
- ✅ Android APK ready
- ✅ Progressive Web App support

---

## 🗺️ Game Maps

| Map | Theme | Difficulty | Description |
|-----|-------|------------|-------------|
| 🎉 Party Zone | Festive | Easy | Colorful balloons & confetti |
| 🎖️ Military Base | Tactical | Medium | Dark & intense atmosphere |
| 🏜️ Desert Storm | Extreme | Hard | Hot sandy battlefield |
| 🌴 Wild Jungle | Adventure | Expert | Dense greenery & wildlife |

---

## 👾 Enemy Types

| Enemy | Speed | Size | Special Ability |
|-------|-------|------|-----------------|
| 🔴 Basic | Normal | Medium | Standard homing |
| ⚡ Fast | Very Fast | Small | Quick but weak |
| 🛡️ Tank | Slow | Large | High health points |
| 💥 Splitter | Normal | Medium | Splits on destroy |
| 👻 Ghost | Medium | Medium | Phasing movement |
| 💀 Boss | Slow | Huge | Extremely tough |

---

## ⚡ Power-ups

| Power-up | Effect | Duration |
|----------|--------|----------|
| 🛡️ Shield | Invincibility | 5 seconds |
| 💨 Speed | Move faster | 3 seconds |
| ⏰ Slow-Mo | Slows enemies | 4 seconds |
| ❤️ Life | +1 Extra life | Instant |
| 💣 Bomb | Destroy all enemies | Instant |

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/madhavkalra7/SinglePointer3D.git

# Navigate to project
cd SinglePointer3D/SpaceBall3D

# Install dependencies
npm install

# Start development server
npm start
```

Open http://localhost:8080 in your browser and start playing! 🎮

---

## 📱 Building Android APK

### Prerequisites
- Android Studio installed
- Java JDK 17+
- Android SDK

### Build Steps

```bash
# Navigate to project
cd SpaceBall3D

# Install dependencies
npm install

# Build web assets
npm run build

# Sync with Capacitor
npm run cap:sync

# Build debug APK
npm run android:build
```

📦 **APK Location:** `android/app/build/outputs/apk/debug/app-debug.apk`

### Or Full Build (One Command)

```bash
npm run full-build
```

---

## 📁 Project Structure

```
SinglePointer3D/
├── SpaceBall3D/
│   ├── index.html          # Main HTML file
│   ├── game.js             # Game engine (Three.js)
│   ├── levels.js           # Level configurations
│   ├── maps.js             # Map themes & colors
│   ├── styles.css          # UI styling
│   ├── www/                # Web build output
│   └── android/            # Android project
│       ├── app/
│       │   └── src/main/
│       ├── gradle/
│       └── build.gradle
├── .gitignore
└── README.md
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| Three.js | 3D Graphics Rendering |
| JavaScript | Game Logic |
| CSS3 | UI Styling & Animations |
| Capacitor | Native Android Wrapper |
| Gradle | Android Build System |

---

## 🎮 How to Play

1. **Select your arena** from the 4 themed maps
2. **Press PLAY** to start the game
3. **Dodge enemies** by sliding/moving around
4. **Collect power-ups** for advantages
5. **Survive the timer** to complete each level
6. **Beat all 9 levels** to achieve VICTORY! 🏆

### Pro Tips 💡

- Keep moving — standing still = death!
- Shield power-up is your best friend
- Watch out for Splitter enemies
- Boss enemies appear in later levels
- Edge of map spawns enemies — stay center!

---

## 📊 Scoring System

| Action | Points |
|--------|--------|
| Enemy destroyed | +10 to +50 |
| Level complete | +100 |
| Power-up collected | +5 |
| All 9 levels cleared | +500 bonus |

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the **MIT License** — see the LICENSE file for details.

---

## 👨‍💻 Author

**Madhav Kalra**
**Manekas Singh**

GitHub: [@madhavkalra7](https://github.com/madhavkalra7)
Github: [@manekas2005](https://github.com/manekas2005)

---

### ⭐ Star this repo if you enjoyed the game! ⭐

![Stars](https://img.shields.io/github/stars/madhavkalra7/SinglePointer3D?style=social)
![Forks](https://img.shields.io/github/forks/madhavkalra7/SinglePointer3D?style=social)

**Made with ❤️ and Three.js**
