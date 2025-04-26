Tron_Reuploaded 🎮
A custom-built recreation of the classic TRON Arcade experience using JavaScript, HTML5 Canvas, and modular scene management.

🚀 Features
Main Menu System
Choose between classic mini-games:

Lightcycle

Tank

(Gridbug and MCP Cone coming soon!)

Lightcycle Mini-Game

Grid-based movement

Enemy AI that aggressively chases the player

Collision detection and endgame screen

Tank Mini-Game

Player-controlled tank

Rotation, movement, and bullet firing

Maze wall collision

Bullet physics and simple cooldown system

Endgame Screen

Retro-style score and ranking display

Auto-returns to the main menu after 10 seconds

🎮 Controls
Menu Navigation

Arrow Up / W – Move up

Arrow Down / S – Move down

Enter or Space – Select game

Lightcycle Controls

Arrow Keys – Move

Tank Controls

Arrow Left / A – Rotate tank left

Arrow Right / D – Rotate tank right

Arrow Up / W – Move forward

Space / Enter – Fire bullet

📂 Project Structure
css
Copy
Edit
/Tron_Reuploaded/
├── index.html
└── js/
├── main.js
├── menu.js
├── lightcycle.js
├── tank.js
└── endGame.js
⚙️ How to Run Locally
Clone the repository:

bash
Copy
Edit
git clone https://github.com/JayStalt/Tron_Reuploaded.git
cd Tron_Reuploaded
Start a local server:

Using Python:

nginx
Copy
Edit
python -m http.server
Or use VS Code's Live Server extension

Open http://localhost:8000/index.html in your browser.