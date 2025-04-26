
// menu.js

const menuOptions = ["Lightcycle", "Gridbug", "Tank", "MCP Cone"];
let selectedOption = 0;

// Initially only Lightcycle is unlocked
let unlockedGames = [true, false, false, false];

function drawMenu(context) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    context.fillStyle = "black";
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);

    context.fillStyle = "cyan";
    context.font = "28px monospace";
    context.textAlign = "center";
    context.fillText("TRON: REUPLOADED", context.canvas.width / 2, 60);

    menuOptions.forEach((option, index) => {
        const isSelected = index === selectedOption;
        const isUnlocked = unlockedGames[index];

        context.fillStyle = isSelected ? "yellow" : isUnlocked ? "white" : "gray";
        context.fillText(
            isUnlocked ? option : "???",
            context.canvas.width / 2,
            140 + index * 40
        );
    });
}

// Handle input to move selection or start game
function handleMenuInput(event, changeSceneCallback) {
    switch (event.key) {
        case "ArrowUp":
        case "w":
            selectedOption = (selectedOption - 1 + menuOptions.length) % menuOptions.length;
            break;
        case "ArrowDown":
        case "s":
            selectedOption = (selectedOption + 1) % menuOptions.length;
            break;
        case "Enter":
        case " ":
            if (unlockedGames[selectedOption]) {
                const selected = menuOptions[selectedOption].toLowerCase().replace(" ", "");
                changeSceneCallback(selected); // Call back to main.js to switch scene
            }
            break;
    }
}

// Unlock the next game in the sequence
function unlockNextGame(current) {
    const index = menuOptions.findIndex(opt => opt.toLowerCase().replace(" ", "") === current);
    if (index < unlockedGames.length - 1) {
        unlockedGames[index + 1] = true;
    }
}

export { drawMenu, handleMenuInput, unlockNextGame };
