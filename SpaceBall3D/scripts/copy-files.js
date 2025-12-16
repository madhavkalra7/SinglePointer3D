/**
 * Build script to copy game files to www folder for Capacitor
 */
const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '..');
const destDir = path.join(__dirname, '..', 'www');

// Files to copy
const files = [
    'index.html',
    'styles.css',
    'game.js',
    'levels.js',
    'maps.js'
];

// Ensure www directory exists
if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

// Copy each file
files.forEach(file => {
    const src = path.join(sourceDir, file);
    const dest = path.join(destDir, file);

    if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        console.log(`✓ Copied ${file}`);
    } else {
        console.log(`✗ File not found: ${file}`);
    }
});

console.log('\n✅ Build complete! Files copied to www/');
console.log('Run "npm run cap:sync" to sync with Android project');
