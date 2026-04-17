/**
 * BYTEBITE CAFE - INTERACTIVE GAME LOGIC
 * Sector: Food & Beverage
 * Technology: Vanilla JavaScript
 */

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('scoreDisplay');
const winBox = document.getElementById('winBox');

let score = 0;
let gameActive = true;
let basket = { x: 220, y: 360, w: 80, h: 20, speed: 14 };
let items = [];
let keys = {};

// Handle Input
window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);

// Stop scroll when playing
window.addEventListener("keydown", function(e) {
    if(["ArrowLeft","ArrowRight"].indexOf(e.code) > -1) e.preventDefault();
}, false);

/**
 * Custom function to draw an oval coffee bean with a center crease
 */
function drawCoffeeBean(x, y) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.PI / 4);
    
    // Outer Bean (Dark Brown)
    ctx.fillStyle = '#4b2c20';
    ctx.beginPath();
    ctx.ellipse(0, 0, 8, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Center Crease Curve
    ctx.strokeStyle = '#2d1a12';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, -10);
    ctx.bezierCurveTo(4, -5, -4, 5, 0, 10);
    ctx.stroke();

    ctx.restore();
}

function gameLoop() {
    if (!gameActive) return;

    // Basket Movement
    if (keys['ArrowLeft'] && basket.x > 0) basket.x -= basket.speed;
    if (keys['ArrowRight'] && basket.x < canvas.width - basket.w) basket.x += basket.speed;

    // Spawn Beans randomly
    if (Math.random() < 0.04) {
        items.push({ x: Math.random() * (canvas.width - 20) + 10, y: -20 });
    }

    // Update positions and check collisions
    items.forEach((item, i) => {
        item.y += 5;
        
        // Catching logic (Collision Detection)
        if (item.y > basket.y && item.x > basket.x && item.x < basket.x + basket.w) {
            items.splice(i, 1);
            score++;
            scoreDisplay.innerText = score;
            if (score >= 10) {
                gameActive = false;
                winBox.classList.remove('hidden');
            }
        }
        
        // Remove off-screen beans
        if (item.y > canvas.height) items.splice(i, 1);
    });

    // Drawing Phase
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw Basket (Player)
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(basket.x, basket.y, basket.w, basket.h);

    // Draw Falling Beans
    items.forEach(item => drawCoffeeBean(item.x, item.y));

    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();