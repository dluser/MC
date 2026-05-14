window.onload = function() {
    // Canvas setup
    var canvas = document.getElementById('gameCanvas');
    var ctx = canvas.getContext('2d');

    // Game variables
    var tileSize = 32;

    // Adjusted player size
    var playerSize = 28; // Reduced size for player

    var player = {
        x: 1 * tileSize + (tileSize - playerSize) / 2,
        y: 1 * tileSize + (tileSize - playerSize) / 2,
        width: playerSize,
        height: playerSize,
        speed: 3,
        image: new Image()
    };
    player.image.src = 'assets/images/player.png';

    // Adjusted enemy size
    var enemySize = 28; // Reduced size for enemy

    var enemyImage = new Image();
    enemyImage.src = 'assets/images/enemy.png';

    var wallImage = new Image();
    wallImage.src = 'assets/images/wall.png'; // Ensure wall.png exists in assets/images/

    var starImage = new Image();
    starImage.src = 'assets/images/star.png';

    var enemies = [];
    var score = 0;
    var gameOver = false;
    var timer = 60; // Timer in seconds

    // Get references to UI elements
    var timerElement = document.getElementById('timer');
    var scoreElement = document.getElementById('score');
    var gameOverMessage = document.getElementById('gameOverMessage');

    // Load sounds
    var backgroundMusic = new Audio('assets/sounds/background.mp3');
    var eatSound = new Audio('assets/sounds/eat.mp3');
    var hitSound = new Audio('assets/sounds/hit.mp3');

    backgroundMusic.loop = true;

    var musicStarted = false;
    var gameStarted = false;

    // Event listeners
    var keys = {};

    window.addEventListener('keydown', function(e) {
        keys[e.keyCode] = true;

        if (!musicStarted && gameStarted) {
            backgroundMusic.play();
            musicStarted = true;
        }
    });

    window.addEventListener('keyup', function(e) {
        delete keys[e.keyCode];
    });

    document.getElementById('startButton').addEventListener('click', function() {
        gameStarted = true;
        this.style.display = 'none';
        backgroundMusic.play(); // Start music when game starts
        musicStarted = true;
        gameLoop();
    });

    // Timer interval
    var timerInterval = setInterval(function() {
        if (!gameOver && timer > 0 && gameStarted) {
            timer--;
            timerElement.textContent = 'Time: ' + timer + 's';
        }
        if (timer === 0) {
            gameOver = true;
            clearInterval(timerInterval);
            backgroundMusic.pause();
            gameOverMessage.style.display = 'block';
        }
    }, 1000);

    // Maze layout
    var maze = [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,2,2,2,1,2,2,2,2,2,2,1,2,2,2,2,2,0,1],
        [1,2,1,1,2,1,2,1,1,1,1,2,1,2,1,1,2,1,2,1],
        [1,0,1,2,2,2,2,2,1,1,2,2,2,2,2,1,2,1,2,1],
        [1,2,1,2,1,1,1,2,2,2,2,1,1,1,2,1,2,1,0,1],
        [1,2,2,2,1,0,1,2,1,1,2,1,0,1,2,2,2,1,2,1],
        [1,1,1,0,1,1,1,2,1,1,2,1,1,1,0,1,1,1,2,1],
        [1,2,2,2,2,2,2,0,2,2,2,2,2,0,2,2,2,2,2,1],
        [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,1,1,1,2,1],
        [1,0,2,2,2,1,2,2,2,0,0,2,2,1,2,2,2,2,0,1],
        [1,1,1,1,2,1,1,1,1,0,0,1,1,1,2,1,1,1,1,1],
        [1,2,2,2,0,2,2,2,2,0,0,2,2,2,2,2,2,2,2,1],
        [1,2,1,1,1,1,2,1,1,1,1,1,0,1,1,1,1,1,2,1],
        [1,0,2,2,2,1,2,2,2,2,2,2,2,1,2,2,2,2,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ];

    // Initialize enemies
    initializeEnemies();

    function initializeEnemies() {
        enemies.push(createEnemy(18 * tileSize, 1 * tileSize));
        enemies.push(createEnemy(1 * tileSize, 13 * tileSize));
        enemies.push(createEnemy(18 * tileSize, 13 * tileSize));
        enemies.push(createEnemy(9 * tileSize, 7 * tileSize));
    }

    function createEnemy(x, y) {
        return {
            x: x + (tileSize - enemySize) / 2,
            y: y + (tileSize - enemySize) / 2,
            width: enemySize,
            height: enemySize,
            speed: 1, // Slower speed
            image: enemyImage
        };
    }

    function isWalkable(x, y, width, height) {
        // Check all four corners of the rectangle
        var corners = [
            { x: x, y: y },
            { x: x + width - 1, y: y },
            { x: x, y: y + height - 1 },
            { x: x + width - 1, y: y + height - 1 }
        ];

        for (var i = 0; i < corners.length; i++) {
            var col = Math.floor(corners[i].x / tileSize);
            var row = Math.floor(corners[i].y / tileSize);

            if (maze[row] && maze[row][col] === 1) {
                return false; // Collision with wall
            }
        }

        return true; // All corners are in walkable tiles
    }

    function movePlayer() {
        var moveX = 0;
        var moveY = 0;

        if (37 in keys) { // Left
            moveX = -player.speed;
        }
        if (39 in keys) { // Right
            moveX = player.speed;
        }
        if (38 in keys) { // Up
            moveY = -player.speed;
        }
        if (40 in keys) { // Down
            moveY = player.speed;
        }

        // Move on x-axis
        var newX = player.x + moveX;
        if (isWalkable(newX, player.y, player.width, player.height)) {
            player.x = newX;
        }

        // Move on y-axis
        var newY = player.y + moveY;
        if (isWalkable(player.x, newY, player.width, player.height)) {
            player.y = newY;
        }
    }

    function moveEnemies() {
        enemies.forEach(function(enemy) {
            var angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
            var moveX = Math.cos(angle) * enemy.speed;
            var moveY = Math.sin(angle) * enemy.speed;

            // Move on x-axis
            var newX = enemy.x + moveX;
            if (isWalkable(newX, enemy.y, enemy.width, enemy.height)) {
                enemy.x = newX;
            }

            // Move on y-axis
            var newY = enemy.y + moveY;
            if (isWalkable(enemy.x, newY, enemy.width, enemy.height)) {
                enemy.y = newY;
            }
        });
    }

    function checkCollisions() {
        // Check collision with stars
        var playerCenterX = player.x + player.width / 2;
        var playerCenterY = player.y + player.height / 2;
        var playerCol = Math.floor(playerCenterX / tileSize);
        var playerRow = Math.floor(playerCenterY / tileSize);

        if (maze[playerRow][playerCol] === 2) {
            maze[playerRow][playerCol] = 0; // Remove the star from the maze
            score += 10;
            eatSound.play();
            scoreElement.textContent = 'Score: ' + score;
        }

        // Check collision with enemies
        for (var i = 0; i < enemies.length; i++) {
            var enemy = enemies[i];
            if (isColliding(player, enemy)) {
                gameOver = true;
                backgroundMusic.pause();
                hitSound.play();
                clearInterval(timerInterval);
                gameOverMessage.style.display = 'block';
                break;
            }
        }
    }

    function isColliding(a, b) {
        return a.x < b.x + b.width && a.x + a.width > b.x &&
               a.y < b.y + b.height && a.y + a.height > b.y;
    }

    function drawMaze() {
        for (var row = 0; row < maze.length; row++) {
            for (var col = 0; col < maze[row].length; col++) {
                var tile = maze[row][col];
                var x = col * tileSize;
                var y = row * tileSize;

                if (tile === 1) {
                    // Draw wall
                    ctx.drawImage(wallImage, x, y, tileSize, tileSize);
                } else if (tile === 2) {
                    // Draw star (candy)
                    ctx.drawImage(starImage, x + (tileSize - 16) / 2, y + (tileSize - 16) / 2, 16, 16);
                }
            }
        }
    }

    function update() {
        if (!gameOver) {
            movePlayer();
            moveEnemies();
            checkCollisions();
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawMaze();

        // Draw player
        ctx.drawImage(
            player.image,
            player.x,
            player.y,
            player.width,
            player.height
        );

        // Draw enemies
        enemies.forEach(function(enemy) {
            ctx.drawImage(
                enemy.image,
                enemy.x,
                enemy.y,
                enemy.width,
                enemy.height
            );
        });
    }

    function gameLoop() {
        if (gameStarted) {
            update();
            draw();
            if (!gameOver) {
                requestAnimationFrame(gameLoop);
            }
        }
    }
};







