import { gameLoop, resetGame, setSceneCallback } from './lightcycle.js';
import { drawMenu, handleMenuInput, unlockNextGame } from './menu.js';
import { tankGameLoop, setSceneCallback as setTankScene } from './tanks.js';
import { gridbugGameLoop, setSceneCallback as setGridbugScene } from './gridbug.js';
import { mcpGameLoop, setSceneCallback as setMCPScene } from './mcp.js';
import { drawEndGame, setSceneCallback as setEndSceneCallback } from './endGame.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let currentScene = 'menu';

function changeScene(sceneName) {
    if (sceneName === 'lightcycle') {
        resetGame();
    }
    currentScene = sceneName;
}

// Connect changeScene to all scenes
setSceneCallback(changeScene);
setTankScene(changeScene);
setGridbugScene(changeScene);
setMCPScene(changeScene);
setEndSceneCallback(changeScene); // THIS LINE IS CRITICAL

document.addEventListener('keydown', (event) => {
    if (currentScene === 'menu') {
        handleMenuInput(event, changeScene);
    }
});

function runGame() {
    if (currentScene === 'menu') {
        drawMenu(ctx);
    } else if (currentScene === 'lightcycle') {
        gameLoop(ctx);
    } else if (currentScene === 'tank') {
        tankGameLoop(ctx);
    } else if (currentScene === 'gridbug') {
        gridbugGameLoop(ctx);
    } else if (currentScene === 'mcp') {
        mcpGameLoop(ctx);
    } else if (currentScene === 'endgame') {
        drawEndGame(ctx);
    }

    requestAnimationFrame(runGame);
}

runGame();
