
const games = ["Lightcycle", "Tank", "Gridbug", "MCP"];
const scenes = ["lightcycle", "tank", "gridbug", "mcp"];

let unlockedGames = [true, false, false, false];
let selectedIndex = 0;

function drawMenu(context) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    context.fillStyle = "white";
    context.font = "28px Arial";
    context.textAlign = "center";

    context.fillText("TRON_REUPLOADED", context.canvas.width / 2, 60);

    for (let i = 0; i < games.length; i++) {
        if (i === selectedIndex) {
            context.fillStyle = "cyan";
        } else {
            context.fillStyle = "gray";
        }

        const displayName = unlockedGames[i] ? games[i] : "???";
        context.fillText(displayName, context.canvas.width / 2, 150 + i * 60);
    }
}

function handleMenuInput(event, changeSceneCallback) {
    if (event.key === "ArrowUp" || event.key === "w") {
        selectedIndex = (selectedIndex - 1 + games.length) % games.length;
    } else if (event.key === "ArrowDown" || event.key === "s") {
        selectedIndex = (selectedIndex + 1) % games.length;
    } else if (event.key === "Enter" || event.key === " ") {
        if (unlockedGames[selectedIndex]) {
            changeSceneCallback(scenes[selectedIndex]);
        }
    }
}

function unlockNextGame(currentGame) {
    if (currentGame === 'lightcycle') {
        unlockedGames[1] = true;
    } else if (currentGame === 'tank') {
        unlockedGames[2] = true;
    } else if (currentGame === 'gridbug') {
        unlockedGames[3] = true;
    }
}

function resetUnlocks() {
    unlockedGames = [true, false, false, false];
}

export { drawMenu, handleMenuInput, unlockNextGame, resetUnlocks };
