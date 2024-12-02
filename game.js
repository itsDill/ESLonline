const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gameState = {
    player: { x: 400, y: 550 },
    bullets: [],
    targets: [],
    currentSentence: { text: "I ___ a book yesterday", correctWord: "read" },
    score: 0,
    isRunning: true,
};

function startGame() {
    generateTargets();
    gameLoop();
}

function generateTargets() {
    const words = ["read", "am", "have"];
    gameState.targets = words.map((word, index) => ({
        word,
        x: Math.random() * (canvas.width - 50),
        y: Math.random() * 200,
        width: 50,
        height: 30,
        speed: Math.random() * 2 + 1,
    }));
}

function drawPlayer() {
    ctx.fillStyle = "blue";
    ctx.fillRect(gameState.player.x, gameState.player.y, 50, 50);
}

function drawTargets() {
    gameState.targets.forEach(target => {
        ctx.fillStyle = "red";
        ctx.fillRect(target.x, target.y, target.width, target.height);
        ctx.fillStyle = "white";
        ctx.fillText(target.word, target.x + 5, target.y + 20);
    });
}

function drawBullets() {
    gameState.bullets.forEach(bullet => {
        ctx.fillStyle = "green";
        ctx.fillRect(bullet.x, bullet.y, 10, 20);
    });
}

function moveTargets() {
    gameState.targets.forEach(target => {
        target.y += target.speed;
        if (target.y > canvas.height) {
            target.y = 0;
            target.x = Math.random() * (canvas.width - 50);
        }
    });
}

function moveBullets() {
    gameState.bullets = gameState.bullets.filter(bullet => bullet.y > 0);
    gameState.bullets.forEach(bullet => {
        bullet.y -= 5;
    });
}

function checkCollisions() {
    gameState.bullets.forEach((bullet, bulletIndex) => {
        gameState.targets.forEach((target, targetIndex) => {
            if (
                bullet.x < target.x + target.width &&
                bullet.x + 10 > target.x &&
                bullet.y < target.y + target.height &&
                bullet.y + 20 > target.y
            ) {
                if (target.word === gameState.currentSentence.correctWord) {
                    gameState.score++;
                }
                gameState.bullets.splice(bulletIndex, 1);
                gameState.targets.splice(targetIndex, 1);
            }
        });
    });
}

function drawScore() {
    ctx.fillStyle = "black";
    ctx.fillText(`Score: ${gameState.score}`, 10, 20);
}

function gameLoop() {
    if (!gameState.isRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawTargets();
    drawBullets();
    drawScore();
    moveTargets();
    moveBullets();
    checkCollisions();

    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' && gameState.player.x > 0) {
        gameState.player.x -= 20;
    } else if (event.key === 'ArrowRight' && gameState.player.x < canvas.width - 50) {
        gameState.player.x += 20;
    } else if (event.key === ' ') {
        gameState.bullets.push({ x: gameState.player.x + 20, y: gameState.player.y });
    }
});

startGame();
