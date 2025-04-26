// tank.js – Player tank movement, rotation, firing, and wall collision

const TILE_SIZE = 32;
const GRID_WIDTH = 20;
const GRID_HEIGHT = 15;
const MOVE_INTERVAL = 200;

let lastMoveTime = 0;
let lastShotTime = 0;
const SHOT_COOLDOWN = 400;

let sceneCallback = null;
function setSceneCallback(callback) {
    sceneCallback = callback;
}

// Directions: 0 = up, 1 = right, 2 = down, 3 = left
let player = {
    x: 1,
    y: 1,
    dir: 0,
    bullets: []
};

// Simple static maze for now: 0 = empty, 1 = wall
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

// Get movement offset based on facing direction
function getDirOffset(dir) {
    return [
        { x: 0, y: -1 }, // up
        { x: 1, y: 0 },  // right
        { x: 0, y: 1 },  // down
        { x: -1, y: 0 }  // left
    ][dir];
}

// Handle movement and shooting input
function handleInput(event) {
    const currentTime = performance.now();
    if (currentTime - lastMoveTime < MOVE_INTERVAL) return;

    if (event.key === "ArrowLeft" || event.key === "a") {
        player.dir = (player.dir + 3) % 4; // rotate left
        lastMoveTime = currentTime;
    } else if (event.key === "ArrowRight" || event.key === "d") {
        player.dir = (player.dir + 1) % 4; // rotate right
        lastMoveTime = currentTime;
    } else if (event.key === "ArrowUp" || event.key === "w") {
        const { x: dx, y: dy } = getDirOffset(player.dir);
        const nx = player.x + dx;
        const ny = player.y + dy;
        if (maze[ny][nx] === 0) {
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

// Update bullets — movement and wall collision
function updateBullets() {
    player.bullets = player.bullets.filter(bullet => {
        bullet.x += bullet.dx * 0.2;
        bullet.y += bullet.dy * 0.2;
        const gx = Math.floor(bullet.x);
        const gy = Math.floor(bullet.y);
        return gx >= 0 && gx < GRID_WIDTH && gy >= 0 && gy < GRID_HEIGHT && maze[gy][gx] === 0;
    });
}

// Draw everything
function tankGameLoop(context) {
    updateBullets();
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    // Draw walls
    for (let y = 0; y < GRID_HEIGHT; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {
            if (maze[y][x] === 1) {
                context.fillStyle = "gray";
                context.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
        }
    }

    // Draw player tank
    context.fillStyle = "green";
    context.fillRect(player.x * TILE_SIZE, player.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);

    // Draw bullets
    context.fillStyle = "red";
    for (let bullet of player.bullets) {
        context.beginPath();
        context.arc(bullet.x * TILE_SIZE + TILE_SIZE / 2, bullet.y * TILE_SIZE + TILE_SIZE / 2, 4, 0, Math.PI * 2);
        context.fill();
    }
}

document.addEventListener("keydown", handleInput);

export { tankGameLoop, setSceneCallback };
