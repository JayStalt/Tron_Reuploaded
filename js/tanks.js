
import { resetUnlocks, unlockNextGame } from './menu.js';

const TILE_SIZE = 32;
const GRID_WIDTH = 20;
const GRID_HEIGHT = 15;
const MOVE_INTERVAL = 200;
const ENEMY_MOVE_INTERVAL = 500;
const ENEMY_SHOT_COOLDOWN = 300;

let lastMoveTime = 0;
let lastShotTime = 0;
let lastEnemyMoveTime = 0;
let lastEnemyShotTime = 0;
const SHOT_COOLDOWN = 400;

let inputBound = false;
let playerAlive = true;

let sceneCallback = null;
function setSceneCallback(callback) {
    sceneCallback = callback;
}

let player = {
    x: 1,
    y: 1,
    dir: 0,
    bullets: []
};

let enemies = [
    { x: 18, y: 1, dir: 2, alive: true, bullets: [] },
    { x: 1, y: 13, dir: 0, alive: true, bullets: [] },
    { x: 18, y: 13, dir: 3, alive: true, bullets: [] }
];

const maze = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,0,0,1,0,0,0,1,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,1,0,1,0,1,0,1,0,1,0,1],
    [1,0,0,0,1,0,0,0,1,0,0,1,0,1,0,0,0,1,0,1],
    [1,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,0,1],
    [1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,1,0,0,1],
    [1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,1],
    [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1],
    [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,1],
    [1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

function getDirOffset(dir) {
    return [
        { x: 0, y: -1 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: -1, y: 0 }
    ][dir];
}

function handleInput(event) {
    const currentTime = performance.now();
    if (currentTime - lastMoveTime < MOVE_INTERVAL) return;

    if (event.key === "ArrowLeft" || event.key === "a") {
        player.dir = (player.dir + 3) % 4;
        lastMoveTime = currentTime;
    } else if (event.key === "ArrowRight" || event.key === "d") {
        player.dir = (player.dir + 1) % 4;
        lastMoveTime = currentTime;
    } else if (event.key === "ArrowUp" || event.key === "w") {
        const { x: dx, y: dy } = getDirOffset(player.dir);
        const nx = player.x + dx;
        const ny = player.y + dy;
        if (maze[ny] && maze[ny][nx] === 0) {
            player.x = nx;
            player.y = ny;
        }
        lastMoveTime = currentTime;
    } else if (event.key === " " || event.key === "Enter") {
        if (currentTime - lastShotTime > SHOT_COOLDOWN) {
            const { x: dx, y: dy } = getDirOffset(player.dir);
            player.bullets.push({ x: player.x, y: player.y, dx, dy });
            lastShotTime = currentTime;
        }
    }
}

function updateBullets() {
    player.bullets = player.bullets.filter(bullet => {
        bullet.x += bullet.dx * 0.2;
        bullet.y += bullet.dy * 0.2;
        const gx = Math.floor(bullet.x);
        const gy = Math.floor(bullet.y);

        if (gx < 0 || gx >= GRID_WIDTH || gy < 0 || gy >= GRID_HEIGHT) return false;
        if (maze[gy][gx] !== 0) return false;

        for (let enemy of enemies) {
            if (enemy.alive && Math.floor(enemy.x) === gx && Math.floor(enemy.y) === gy) {
                enemy.alive = false;
                console.log("Enemy destroyed!");
                return false;
            }
        }

        return true;
    });

    for (let enemy of enemies) {
        enemy.bullets = enemy.bullets.filter(bullet => {
            bullet.x += bullet.dx * 0.2;
            bullet.y += bullet.dy * 0.2;
            const gx = Math.floor(bullet.x);
            const gy = Math.floor(bullet.y);

            if (gx < 0 || gx >= GRID_WIDTH || gy < 0 || gy >= GRID_HEIGHT) return false;
            if (maze[gy][gx] !== 0) return false;

            if (Math.floor(player.x) === gx && Math.floor(player.y) === gy) {
                console.log("You were hit!");
                playerAlive = false;
                resetUnlocks();
                if (sceneCallback) sceneCallback('endgame');
                return false;
            }

            return true;
        });
    }
}

function updateEnemies() {
    const currentTime = performance.now();
    if (currentTime - lastEnemyMoveTime > ENEMY_MOVE_INTERVAL) {
        lastEnemyMoveTime = currentTime;
        for (let enemy of enemies) {
            if (!enemy.alive) continue;
            const dx = player.x - enemy.x;
            const dy = player.y - enemy.y;
            if (Math.abs(dx) > Math.abs(dy)) {
                enemy.dir = dx > 0 ? 1 : 3;
            } else {
                enemy.dir = dy > 0 ? 2 : 0;
            }
            const { x: ox, y: oy } = getDirOffset(enemy.dir);
            const nx = enemy.x + ox;
            const ny = enemy.y + oy;
            if (maze[ny] && maze[ny][nx] === 0) {
                enemy.x = nx;
                enemy.y = ny;
            } else {
                enemy.dir = Math.floor(Math.random() * 4);
            }
        }
    }

    if (currentTime - lastEnemyShotTime > ENEMY_SHOT_COOLDOWN) {
        lastEnemyShotTime = currentTime;
        for (let enemy of enemies) {
            if (enemy.alive && canSeePlayer(enemy)) {
                const { x: dx, y: dy } = getDirOffset(enemy.dir);
                enemy.bullets.push({ x: enemy.x, y: enemy.y, dx, dy });
            }
        }
    }
}

function canSeePlayer(enemy) {
    if (enemy.x === player.x) {
        const step = enemy.y < player.y ? 1 : -1;
        for (let y = enemy.y + step; y !== player.y; y += step) {
            if (maze[y][enemy.x] !== 0) return false;
        }
        return true;
    } else if (enemy.y === player.y) {
        const step = enemy.x < player.x ? 1 : -1;
        for (let x = enemy.x + step; x !== player.x; x += step) {
            if (maze[enemy.y][x] !== 0) return false;
        }
        return true;
    }
    return false;
}

function tankGameLoop(context) {
    if (!inputBound) {
        document.addEventListener("keydown", handleInput);
        inputBound = true;
    }

    if (!playerAlive) return;

    updateBullets();
    updateEnemies();

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    for (let y = 0; y < GRID_HEIGHT; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {
            if (maze[y][x] === 1) {
                context.fillStyle = "gray";
                context.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
        }
    }

    context.fillStyle = "green";
    context.fillRect(player.x * TILE_SIZE, player.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);

    context.strokeStyle = "black";
    context.lineWidth = 2;
    context.beginPath();
    let centerX = player.x * TILE_SIZE + TILE_SIZE / 2;
    let centerY = player.y * TILE_SIZE + TILE_SIZE / 2;
    switch (player.dir) {
        case 0: context.moveTo(centerX, centerY); context.lineTo(centerX, centerY - TILE_SIZE / 2); break;
        case 1: context.moveTo(centerX, centerY); context.lineTo(centerX + TILE_SIZE / 2, centerY); break;
        case 2: context.moveTo(centerX, centerY); context.lineTo(centerX, centerY + TILE_SIZE / 2); break;
        case 3: context.moveTo(centerX, centerY); context.lineTo(centerX - TILE_SIZE / 2, centerY); break;
    }
    context.stroke();

    for (let enemy of enemies) {
        if (enemy.alive) {
            context.fillStyle = "purple";
            context.fillRect(enemy.x * TILE_SIZE, enemy.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
    }

    context.fillStyle = "red";
    for (let bullet of player.bullets) {
        context.beginPath();
        context.arc(bullet.x * TILE_SIZE + TILE_SIZE / 2, bullet.y * TILE_SIZE + TILE_SIZE / 2, 4, 0, Math.PI * 2);
        context.fill();
    }

    context.fillStyle = "orange";
    for (let enemy of enemies) {
        for (let bullet of enemy.bullets) {
            context.beginPath();
            context.arc(bullet.x * TILE_SIZE + TILE_SIZE / 2, bullet.y * TILE_SIZE + TILE_SIZE / 2, 4, 0, Math.PI * 2);
            context.fill();
        }
    }

    if (enemies.every(e => !e.alive)) {
        console.log("You Win!");
        unlockNextGame('tank'); // <--- add this line
        if (sceneCallback) sceneCallback('endgame');
    }


}

export { tankGameLoop, setSceneCallback };


