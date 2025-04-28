
import { unlockNextGame } from './menu.js';
import { setEndGameDetails } from './endGame.js';

let sceneCallback = null;

function setSceneCallback(callback) {
    sceneCallback = callback;
}

const GRID_WIDTH = 20;
const GRID_HEIGHT = 15;
const TILE_SIZE = 32;
const MOVE_INTERVAL = 200;

let player = {
    x: 5,
    y: 7,
    direction: 'right',
    trail: [],
    hasMoved: false
};

let enemy = {
    x: 14,
    y: 7,
    direction: 'left',
    trail: [],
    alive: true
};

let grid = Array.from({ length: GRID_HEIGHT }, () => Array(GRID_WIDTH).fill(0));
let lastMoveTime = 0;
let lastEnemyMoveTime = 0;

function getNextPosition(x, y, direction) {
    switch (direction) {
        case 'up':    return { x, y: y - 1 };
        case 'down':  return { x, y: y + 1 };
        case 'left':  return { x: x - 1, y };
        case 'right': return { x: x + 1, y };
    }
    return { x, y };
}

function isNextTileBlocked(x, y, direction) {
    const { x: nx, y: ny } = getNextPosition(x, y, direction);
    return (
        nx < 0 || nx >= GRID_WIDTH ||
        ny < 0 || ny >= GRID_HEIGHT ||
        grid[ny][nx] !== 0
    );
}

function getSafeDirections(x, y) {
    return ['up', 'down', 'left', 'right'].filter(dir => !isNextTileBlocked(x, y, dir));
}

function getDistance(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function chooseAggressiveDirection(x, y) {
    const safeDirs = getSafeDirections(x, y);
    if (safeDirs.length === 0) return null;
    const dirScores = safeDirs.map(dir => {
        const { x: nx, y: ny } = getNextPosition(x, y, dir);
        const distToPlayer = getDistance(nx, ny, player.x, player.y);
        return { dir, score: -distToPlayer };
    });
    dirScores.sort((a, b) => b.score - a.score);
    return dirScores[0].dir;
}

function updateEnemyPosition() {
    if (!enemy.alive) return;
    const currentTime = performance.now();
    if (currentTime - lastEnemyMoveTime < MOVE_INTERVAL) return;
    lastEnemyMoveTime = currentTime;

    const newDir = chooseAggressiveDirection(enemy.x, enemy.y);
    if (newDir) enemy.direction = newDir;

    const { x: nextX, y: nextY } = getNextPosition(enemy.x, enemy.y, enemy.direction);

    if (nextX === player.x && nextY === player.y) {
        console.log("Enemy collided with player!");
        setEndGameDetails(999, 12, false);
        if (sceneCallback) sceneCallback('endgame');
        return;
    }

    enemy.trail.push({ x: enemy.x, y: enemy.y });
    grid[enemy.y][enemy.x] = 'E';
    enemy.x = nextX;
    enemy.y = nextY;

    if (
        enemy.x < 0 || enemy.x >= GRID_WIDTH ||
        enemy.y < 0 || enemy.y >= GRID_HEIGHT ||
        grid[enemy.y]?.[enemy.x] !== 0
    ) {
        enemy.alive = false;
        console.log("Enemy crashed!");
    }
}

function updatePlayerPosition() {
    if (!player.hasMoved) return;
    const currentTime = performance.now();
    if (currentTime - lastMoveTime < MOVE_INTERVAL) return;
    lastMoveTime = currentTime;

    const { x: nextX, y: nextY } = getNextPosition(player.x, player.y, player.direction);

    if (nextX === enemy.x && nextY === enemy.y) {
        console.log("Player collided with enemy!");
        setEndGameDetails(650, 15, false);
        if (sceneCallback) sceneCallback('endgame');
        return;
    }

    player.trail.push({ x: player.x, y: player.y });
    grid[player.y][player.x] = 'P';
    player.x = nextX;
    player.y = nextY;

    if (
        player.x < 0 || player.x >= GRID_WIDTH ||
        player.y < 0 || player.y >= GRID_HEIGHT ||
        grid[player.y]?.[player.x] !== 0
    ) {
        console.log("You crashed! Game Over.");
        setEndGameDetails(750, 13, false);
        if (sceneCallback) sceneCallback('endgame');
    }
}

function resetGame() {
    player.x = 5;
    player.y = 7;
    player.direction = 'right';
    player.trail = [];
    player.hasMoved = false;
    enemy.x = 14;
    enemy.y = 7;
    enemy.direction = 'left';
    enemy.trail = [];
    enemy.alive = true;
    grid = Array.from({ length: GRID_HEIGHT }, () => Array(GRID_WIDTH).fill(0));
    lastMoveTime = 0;
    lastEnemyMoveTime = 0;
}

function handleInput(event) {
    player.hasMoved = true;
    switch (event.key) {
        case 'ArrowUp': if (player.direction !== 'down') player.direction = 'up'; break;
        case 'ArrowDown': if (player.direction !== 'up') player.direction = 'down'; break;
        case 'ArrowLeft': if (player.direction !== 'right') player.direction = 'left'; break;
        case 'ArrowRight': if (player.direction !== 'left') player.direction = 'right'; break;
    }
}

function drawGrid(context) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    for (let y = 0; y < GRID_HEIGHT; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {
            if (grid[y][x] === 'P') {
                context.fillStyle = 'cyan';
                context.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            } else if (grid[y][x] === 'E') {
                context.fillStyle = 'orangered';
                context.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
        }
    }
    context.fillStyle = 'yellow';
    context.fillRect(player.x * TILE_SIZE, player.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    if (enemy.alive) {
        context.fillStyle = 'red';
        context.fillRect(enemy.x * TILE_SIZE, enemy.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }
}

function gameLoop(context) {
    updatePlayerPosition();
    updateEnemyPosition();
    drawGrid(context);
    if (!enemy.alive) {
        console.log("You Win!");
        unlockNextGame('lightcycle');
        setEndGameDetails(1000, 11, true);
        if (sceneCallback) sceneCallback('endgame');
    }
}

document.addEventListener('keydown', handleInput);

export { gameLoop, resetGame, setSceneCallback };
