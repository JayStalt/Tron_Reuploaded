
let sceneCallback = null;
let endGameData = { score: 0, bonus: 0, won: false };
let hasSetTimeout = false;

function setSceneCallback(callback) {
    sceneCallback = callback;
}

function setEndGameDetails(score, bonus, won) {
    endGameData.score = score;
    endGameData.bonus = bonus;
    endGameData.won = won;
}

function drawEndGame(context) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    context.fillStyle = "white";
    context.font = "28px Arial";
    context.textAlign = "center";

    let resultText = "GAME OVER";
    if (endGameData.score >= 2000) {
        resultText = "TOTAL VICTORY!";
    } else if (endGameData.won) {
        resultText = "VICTORY!";
    }

    context.fillText(resultText, context.canvas.width / 2, 100);
    context.fillText(`Score: ${endGameData.score}`, context.canvas.width / 2, 160);
    context.fillText(`Bonus: ${endGameData.bonus}`, context.canvas.width / 2, 220);
    context.fillText("Returning to Menu...", context.canvas.width / 2, 320);

    if (!hasSetTimeout) {
        hasSetTimeout = true;
        setTimeout(() => {
            if (sceneCallback) {
                console.log("Returning to menu...");
                sceneCallback('menu');
                hasSetTimeout = false;
            }
        }, 5000);
    }
}

export { drawEndGame, setSceneCallback, setEndGameDetails };
