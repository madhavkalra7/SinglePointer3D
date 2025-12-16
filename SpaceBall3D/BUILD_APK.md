# Single Point 3D - APK Build Guide

## 📱 Build Your Android APK

This guide will help you build an APK file that you can install on any Android device.

---

## Prerequisites

Before building, you need to install:

### 1. Node.js (Required)
Download and install from: https://nodejs.org/
- Click "Download LTS version"
- Run the installer

### 2. Android Studio (Required)
Download from: https://developer.android.com/studio
- Install Android Studio
- During setup, install Android SDK

### 3. Java JDK 17+ (Required)
Usually comes with Android Studio, but if needed:
https://adoptium.net/

---

## 🚀 Quick Build Steps

Open **Command Prompt** or **PowerShell** in the game folder (`d:\game`) and run these commands:

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Initialize Capacitor
```bash
npx cap init "Single Point 3D" com.singlepoint3d.game --web-dir www
```

### Step 3: Add Android Platform
```bash
npx cap add android
```

### Step 4: Sync Web Files to Android
```bash
npx cap sync
```

### Step 5: Open in Android Studio
```bash
npx cap open android
```

### Step 6: Build APK in Android Studio
1. Wait for Gradle to sync (loading bar at bottom)
2. Go to **Build → Build Bundle(s) / APK(s) → Build APK(s)**
3. Wait for build to complete
4. Click **"locate"** in the notification to find your APK

---

## 📦 APK Location

After building, your APK will be at:
```
d:\game\android\app\build\outputs\apk\debug\app-debug.apk
```

---

## 🔧 One-Command Build (After First Setup)

After the initial setup, you can rebuild with:
```bash
npm run build
npx cap sync
cd android && .\gradlew assembleDebug
```

---

## 📲 Installing the APK

1. Copy the `app-debug.apk` to your phone
2. Open the file on your phone
3. Allow installation from unknown sources if prompted
4. Install and play!

---

## ⚠️ Troubleshooting

### "npm not found"
- Restart your terminal after installing Node.js
- Or reinstall Node.js

### "cap not found"
```bash
npm install @capacitor/cli @capacitor/core @capacitor/android
```

### Gradle build fails
- Make sure Android Studio has finished downloading SDK
- Check that JAVA_HOME is set correctly

### App crashes on launch
- Make sure all game files are in the `www` folder
- Run `npx cap sync` again

---

## 📂 Project Structure

```
d:\game\
├── www/                    ← Web app files (for APK)
│   ├── index.html
│   ├── styles.css
│   ├── game.js
│   ├── levels.js
│   └── maps.js
├── android/                ← Android project (auto-generated)
├── package.json            ← npm configuration
├── capacitor.config.json   ← Capacitor settings
└── BUILD_APK.md            ← This file
```

---

## 🎮 Game Features in APK

- Full 3D Three.js game
- 4 themed maps (Party, Military, Desert, Jungle)
- 9 levels with increasing difficulty
- Touch slide controls
- Power-ups (Shield, Speed, Bomb, Life)
- High score saving

**Enjoy your mobile game!** 🎉
