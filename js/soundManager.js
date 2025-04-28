
// soundManager.js – Manage all background music and sound effects

const sounds = {
    menuMusic: new Audio('./sounds/start.mp3'),
    lightcycleMusic: new Audio('./sounds/lightcycle-background.mp3'),
    tanksMusic: new Audio('./sounds/tanks-background.mp3'),
    gridbugMusic: new Audio('./sounds/gridbug-background.mp3'),
    mcpMusic: new Audio('./sounds/MCP-background.mp3'),
    victoryMusic: new Audio('./sounds/victory-endgame.mp3'),
    failMusic: new Audio('./sounds/fail.mp3'),
    miniGameSuccess: new Audio('./sounds/minigame-success.mp3'),
    zapEffect: new Audio('./sounds/gridbug attack.mp3'),
    tankShootEffect: new Audio('./sounds/tank-attack.mp3')
};

let currentMusic = null;

// Play background music
function playMusic(music) {
    if (currentMusic) {
        currentMusic.pause();
        currentMusic.currentTime = 0;
    }
    currentMusic = music;
    currentMusic.loop = true;
    currentMusic.volume = 0.5;
    currentMusic.play().catch(e => console.log('Music play interrupted:', e));
}

// Play a one-time sound effect
function playEffect(effect) {
    if (!effect) return;
    effect.volume = 0.7;
    effect.currentTime = 0;
    effect.play().catch(e => console.log('Effect play interrupted:', e));
}

// Stop music
function stopMusic() {
    if (currentMusic) {
        currentMusic.pause();
        currentMusic.currentTime = 0;
    }
}

export { sounds, playMusic, playEffect, stopMusic };
