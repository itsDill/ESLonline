document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const restartButton = document.getElementById('restart');
    const targetWordDisplay = document.getElementById('target-word');

    // Game variables
    const targets = ['apple', 'banana', 'cat', 'dog', 'elephant'];
    let targetWord = '';
    let ball = { x: 100, y: 300, radius: 10, dx: 0, dy: 0 };
    let power = 0;
    let angle = 0;
    let isShooting = false;
    const targetPositions = [];

    // Initialize the game
    function initializeGame() {
        targetWord = targets[Math.floor(Math.random() * targets.length)];
        targetWordDisplay.textContent = targetWord;

        ball.x = 100;
        ball.y = 300;
        ball.dx = 0;
        ball.dy = 0;
        isShooting = false;

        generateTargets();
        draw();
    }

    // Generate target positions
    function generateTargets() {
        targetPositions.length = 0;
        const spacing = canvas.width / targets.length;
        targets.forEach((word, index) => {
            const x = spacing * index + spacing / 2;
            const y = Math.random() * (canvas.height - 150) + 50; // Random y-position
            targetPositions.push({ word, x, y });
        });
    }

    // Draw the game
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw ball
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'blue';
        ctx.fill();
        ctx.closePath();

        // Draw targets
        targetPositions.forEach(target => {
            ctx.beginPath();
            ctx.arc(target.x, target.y, 30, 0, Math.PI * 2);
            ctx.fillStyle = 'green';
            ctx.fill();
            ctx.closePath();

            ctx.font = '16px Arial';
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'center';
            ctx.fillText(target.word, target.x, target.y + 5);
        });

        // Draw power and angle indicators
        ctx.font = '14px Arial';
        ctx.fillStyle = '#000';
        ctx.fillText(`Power: ${power}`, 10, 20);
        ctx.fillText(`Angle: ${angle}°`, 10, 40);
    }

    // Shoot the ball
    function shootBall() {
        ball.dx = power * Math.cos((angle * Math.PI) / 180);
        ball.dy = -power * Math.sin((angle * Math.PI) / 180);
        isShooting = true;
    }

    // Update game state
    function update() {
        if (isShooting) {
            ball.x += ball.dx;
            ball.y += ball.dy;

            // Simulate gravity
            ball.dy += 0.2;

            // Check for collisions
            targetPositions.forEach(target => {
                const dist = Math.hypot(ball.x - target.x, ball.y - target.y);
                if (dist < ball.radius + 30) {
                    if (target.word === targetWord) {
                        alert('Correct! You hit the target!');
                    } else {
                        alert(`Wrong target! You hit ${target.word}.`);
                    }
                    initializeGame();
                }
            });

            // Check if ball goes off screen
            if (ball.y > canvas.height || ball.x > canvas.width || ball.x < 0) {
                alert('You missed!');
                initializeGame();
            }
        }

        draw();
        requestAnimationFrame(update);
    }

    // Handle keyboard input
    document.addEventListener('keydown', (e) => {
        if (!isShooting) {
            if (e.key === 'ArrowUp' && angle < 90) angle += 5;
            if (e.key === 'ArrowDown' && angle > 0) angle -= 5;
            if (e.key === 'ArrowRight' && power < 20) power += 1;
            if (e.key === 'ArrowLeft' && power > 0) power -= 1;
            if (e.key === ' ') shootBall();
        }
    });

    // Restart the game
    restartButton.addEventListener('click', initializeGame);

    // Start the game loop
    initializeGame();
    update();
});
