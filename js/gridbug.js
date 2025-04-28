
import { playEffect, sounds } from './soundManager.js';

const TILE_SIZE = 32;
const GRID_WIDTH = 20;
const GRID_HEIGHT = 15;
const MOVE_INTERVAL = 200;
const BUG_MOVE_INTERVAL = 400;
const BUG_SPAWN_INTERVAL = 5000;
const ZAP_COOLDOWN = 1000;

let lastMoveTime = 0;
let lastBugMoveTime = 0;
let lastBugSpawnTime = 0;
let lastZapTime = 0;
let startTime = 0;
let elapsedTime = 0;

let inputBoundGridbug = false;

let sceneCallbackGridbug = null;
function setSceneCallback(callback) {
    sceneCallbackGridbug = callback;
}

let playerGridbug = { x: 10, y: 7 };

let gridbugs = [
    { x: 0, y: 0 },
    { x: 19, y: 0 },
    { x: 0, y: 14 },
    { x: 19, y: 14 }
];

function handleGridbugInput(event) {
    const currentTime = performance.now();
    if (currentTime - lastMoveTime < MOVE_INTERVAL) return;

    if (event.key === "ArrowLeft" || event.key === "a") {
        playerGridbug.x = Math.max(0, playerGridbug.x - 1);
    } else if (event.key === "ArrowRight" || event.key === "d") {
        playerGridbug.x = Math.min(GRID_WIDTH - 1, playerGridbug.x + 1);
    } else if (event.key === "ArrowUp" || event.key === "w") {
        playerGridbug.y = Math.max(0, playerGridbug.y - 1);
    } else if (event.key === "ArrowDown" || event.key === "s") {
        playerGridbug.y = Math.min(GRID_HEIGHT - 1, playerGridbug.y + 1);
    } else if (event.key === " " || event.key === "Enter") {
        attemptZap();
    }

    lastMoveTime = currentTime;
}

function attemptZap() {
    const currentTime = performance.now();
    if (currentTime - lastZapTime < ZAP_COOLDOWN) return;

    playEffect(sounds.zapEffect);
    gridbugs = gridbugs.filter(bug => {
        const dx = Math.abs(bug.x - playerGridbug.x);
        const dy = Math.abs(bug.y - playerGridbug.y);
        return !(dx <= 1 && dy <= 1);
    });

    lastZapTime = currentTime;
}

function updateGridbugs() {
    const currentTime = performance.now();
    if (currentTime - lastBugMoveTime < BUG_MOVE_INTERVAL) return;
    lastBugMoveTime = currentTime;

    for (let bug of gridbugs) {
        if (Math.random() < 0.5) {
            if (playerGridbug.x > bug.x) bug.x++;
            else if (playerGridbug.x < bug.x) bug.x--;
        } else {
            if (playerGridbug.y > bug.y) bug.y++;
            else if (playerGridbug.y < bug.y) bug.y--;
        }
    }
}

function spawnNewGridbug() {
    const currentTime = performance.now();
    if (currentTime - lastBugSpawnTime < BUG_SPAWN_INTERVAL) return;
    lastBugSpawnTime = currentTime;

    let edge = Math.floor(Math.random() * 4);
    let newBug = { x: 0, y: 0 };

    if (edge === 0) {
        newBug.x = Math.floor(Math.random() * GRID_WIDTH);
        newBug.y = 0;
    } else if (edge === 1) {
        newBug.x = Math.floor(Math.random() * GRID_WIDTH);
        newBug.y = GRID_HEIGHT - 1;
    } else if (edge === 2) {
        newBug.x = 0;
        newBug.y = Math.floor(Math.random() * GRID_HEIGHT);
    } else if (edge === 3) {
        newBug.x = GRID_WIDTH - 1;
        newBug.y = Math.floor(Math.random() * GRID_HEIGHT);
    }

    gridbugs.push(newBug);
}

function checkGridbugCollision() {
    for (let bug of gridbugs) {
        if (bug.x === playerGridbug.x && bug.y === playerGridbug.y) {
            console.log("You were caught by a Gridbug!");
            if (sceneCallbackGridbug) sceneCallbackGridbug('endgame');
        }
    }
}

function checkWinCondition() {
    if (elapsedTime >= 60) {
        console.log("You survived the Gridbugs!");
        if (sceneCallbackGridbug) sceneCallbackGridbug('endgame');
    }
}

function resetGame() {
    playerGridbug = { x: 10, y: 7 };
    gridbugs = [
        { x: 0, y: 0 },
        { x: 19, y: 0 },
        { x: 0, y: 14 },
        { x: 19, y: 14 }
    ];
    startTime = performance.now();
    elapsedTime = 0;
}

function gridbugGameLoop(context) {
    if (!inputBoundGridbug) {
        document.addEventListener("keydown", handleGridbugInput);
        inputBoundGridbug = true;
        resetGame();
    }

    elapsedTime = Math.floor((performance.now() - startTime) / 1000);

    updateGridbugs();
    spawnNewGridbug();
    checkGridbugCollision();
    checkWinCondition();

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    context.fillStyle = "cyan";
    context.fillRect(playerGridbug.x * TILE_SIZE, playerGridbug.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);

    context.fillStyle = "yellow";
    for (let bug of gridbugs) {
        context.fillRect(bug.x * TILE_SIZE, bug.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }

    context.fillStyle = "white";
    context.font = "20px Arial";
    context.fillText(`Time: ${elapsedTime}s`, 10, 20);
}

export { gridbugGameLoop, setSceneCallback, resetGame };
