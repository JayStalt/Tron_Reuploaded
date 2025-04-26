import { gameLoop, resetGame, setSceneCallback } from './lightcycle.js';
import { drawMenu, handleMenuInput, unlockNextGame } from './menu.js';
import { tankGameLoop, setSceneCallback as setTankScene } from './tank.js';
import { drawEndGame } from './endGame.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let currentScene = 'menu';

function changeScene(sceneName) {
    if (sceneName === 'lightcycle') {
        resetGame();
    }
    currentScene = sceneName;
}

// Register scene switching callbacks
setSceneCallback(changeScene);
setTankScene(changeScene);

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
    } else if (currentScene === 'endgame') {
        drawEndGame(ctx);
    }

    requestAnimationFrame(runGame);
}

runGame();
