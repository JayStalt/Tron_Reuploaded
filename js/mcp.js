
// mcp.js – MCP Cone mini-game upgraded with multiple moving barriers and timer

const TILE_SIZE = 32;
const GRID_WIDTH = 20;
const GRID_HEIGHT = 15;
const MOVE_INTERVAL = 200;
const BARRIER_MOVE_INTERVAL = 300;

let lastMoveTime = 0;
let lastBarrierMoveTime = 0;
let startTimeMCP = 0;
let elapsedTimeMCP = 0;

let inputBoundMCP = false;

let sceneCallbackMCP = null;
function setSceneCallbackMCP(callback) {
    sceneCallbackMCP = callback;
}

// Player
let playerMCP = {
    x: 10,
    y: 14
};

// Obstacles (Barriers)
let barriers = [
    { x: 0, y: 5, dir: 1, moveType: 'horizontal' },
    { x: 19, y: 8, dir: 3, moveType: 'horizontal' },
    { x: 0, y: 10, dir: 1, moveType: 'horizontal' },
    { x: 5, y: 0, dir: 2, moveType: 'vertical' },
    { x: 15, y: 14, dir: 0, moveType: 'vertical' }
];

function handleMCPInput(event) {
    const currentTime = performance.now();
    if (currentTime - lastMoveTime < MOVE_INTERVAL) return;

    if (event.key === "ArrowLeft" || event.key === "a") {
        playerMCP.x = Math.max(0, playerMCP.x - 1);
    } else if (event.key === "ArrowRight" || event.key === "d") {
        playerMCP.x = Math.min(GRID_WIDTH - 1, playerMCP.x + 1);
    } else if (event.key === "ArrowUp" || event.key === "w") {
        playerMCP.y = Math.max(0, playerMCP.y - 1);
    } else if (event.key === "ArrowDown" || event.key === "s") {
        playerMCP.y = Math.min(GRID_HEIGHT - 1, playerMCP.y + 1);
    }

    lastMoveTime = currentTime;
}

function updateBarriers() {
    const currentTime = performance.now();
    if (currentTime - lastBarrierMoveTime < BARRIER_MOVE_INTERVAL) return;
    lastBarrierMoveTime = currentTime;

    for (let barrier of barriers) {
        if (barrier.moveType === 'horizontal') {
            if (barrier.dir === 1) {
                barrier.x++;
                if (barrier.x >= GRID_WIDTH) {
                    barrier.x = GRID_WIDTH - 1;
                    barrier.dir = 3; // switch to left
                }
            } else if (barrier.dir === 3) {
                barrier.x--;
                if (barrier.x < 0) {
                    barrier.x = 0;
                    barrier.dir = 1; // switch to right
                }
            }
        } else if (barrier.moveType === 'vertical') {
            if (barrier.dir === 0) {
                barrier.y--;
                if (barrier.y < 0) {
                    barrier.y = 0;
                    barrier.dir = 2; // switch to down
                }
            } else if (barrier.dir === 2) {
                barrier.y++;
                if (barrier.y >= GRID_HEIGHT) {
                    barrier.y = GRID_HEIGHT - 1;
                    barrier.dir = 0; // switch to up
                }
            }
        }
    }
}

function checkBarrierCollision() {
    for (let barrier of barriers) {
        if (barrier.x === playerMCP.x && barrier.y === playerMCP.y) {
            console.log("Hit by barrier!");
            if (sceneCallbackMCP) sceneCallbackMCP('endgame');
        }
    }
}

function checkMCPWin() {
    if (playerMCP.y === 0) {
        console.log("You beat the MCP!");
        if (sceneCallbackMCP) sceneCallbackMCP('endgame');
    }
}

function mcpGameLoop(context) {
    if (!inputBoundMCP) {
        document.addEventListener("keydown", handleMCPInput);
        inputBoundMCP = true;
        startTimeMCP = performance.now();
    }

    elapsedTimeMCP = Math.floor((performance.now() - startTimeMCP) / 1000);

    updateBarriers();
    checkBarrierCollision();
    checkMCPWin();

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    // Draw player
    context.fillStyle = "lime";
    context.fillRect(playerMCP.x * TILE_SIZE, playerMCP.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);

    // Draw barriers
    context.fillStyle = "magenta";
    for (let barrier of barriers) {
        context.fillRect(barrier.x * TILE_SIZE, barrier.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }

    // Draw survival timer
    context.fillStyle = "white";
    context.font = "20px Arial";
    context.fillText(`Time: ${elapsedTimeMCP}s`, 10, 20);
}

export { mcpGameLoop, setSceneCallbackMCP as setSceneCallback };


