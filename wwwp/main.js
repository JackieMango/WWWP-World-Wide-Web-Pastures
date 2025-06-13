import HomeScene from './home.js';
import TownScene from './town-square.js';

const params = new URLSearchParams(window.location.search);
let startSceneKey = params.get("scene");

// If no scene parameter provided, guess based on current page name
if (!startSceneKey) {
    const path = window.location.pathname;
    if (path.includes("town-square")) {
        startSceneKey = "town";
    } else {
        startSceneKey = "home";
    }
}

const config = {
    type: Phaser.AUTO,
    width: 512,
    height: 384,
    parent: "phaser-canvas",
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 0 }, debug: false }
    },
    scene: [HomeScene, TownScene],
    scale: {
        zoom: 2,
        parent: 'phaser-canvas',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    }
};

const game = new Phaser.Game(config);

// Start the scene based on determined key
if (startSceneKey === 'town') {
    game.scene.start('TownScene');
} else if (startSceneKey === 'home') {
    game.scene.start('HomeScene');
}