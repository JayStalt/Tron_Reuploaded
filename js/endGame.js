
// endGame.js

let endMessage = "END OF GAME";
let finalScore = 0;
let finalRank = 1;
let timeoutID = null;

function setEndGameDetails(score = 0, rank = 1, win = false) {
    endMessage = win ? "CONGRATULATIONS" : "END OF GAME";
    finalScore = score;
    finalRank = rank;

    // Automatically return to menu after 10 seconds
    clearTimeout(timeoutID);
    timeoutID = setTimeout(() => {
        window.location.reload();
    }, 10000);
}

function drawEndGame(context) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    context.fillStyle = "black";
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);

    context.textAlign = "center";
    context.font = "28px monospace";
    context.fillStyle = "yellow";
    context.fillText("TRON", context.canvas.width / 2, 60);

    context.font = "22px monospace";
    context.fillStyle = "red";
    context.fillText(finalScore.toString().padStart(4, "0"), context.canvas.width / 2, 100);

    context.fillStyle = "yellow";
    context.fillText(endMessage, context.canvas.width / 2, 160);
    context.fillText("YOUR SCORE", context.canvas.width / 2, 220);
    context.fillText("RANKING IS", context.canvas.width / 2, 260);
    context.fillText("NUMBER " + finalRank, context.canvas.width / 2, 300);
}

export { drawEndGame, setEndGameDetails };
