
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

    const resultText = endGameData.won ? "VICTORY!" : "GAME OVER";

    context.fillText(resultText, context.canvas.width / 2, 100);
    context.fillText(`Score: ${endGameData.score}`, context.canvas.width / 2, 160);
    context.fillText(`Bonus: ${endGameData.bonus}`, context.canvas.width / 2, 220);
    context.fillText("Returning to Menu...", context.canvas.width / 2, 320);

    // Only set the timeout once!
    if (!hasSetTimeout && sceneCallback) {
        hasSetTimeout = true;
        console.log("Endgame: Timer started, will return to menu in 5 seconds...");
        setTimeout(() => {
            console.log("Endgame: Switching to menu now!");
            sceneCallback('menu');
            hasSetTimeout = false; // Reset for future endgames
        }, 5000); // 5 second delay
    }
}

export { drawEndGame, setSceneCallback, setEndGameDetails };
