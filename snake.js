function startSnakeGame(canvas, onGameOver) {
    const ctx = canvas.getContext('2d');
    const box = 20; // Size of each square in the grid
    let snake = [];
    snake[0] = { x: 9 * box, y: 10 * box };

    let food = {
        x: Math.floor(Math.random() * 19 + 1) * box,
        y: Math.floor(Math.random() * 19 + 1) * box
    };

    let score = 0;
    let d; // Direction

    document.addEventListener("keydown", direction);

    function direction(event) {
        if (event.keyCode == 37 && d != "RIGHT") {
            d = "LEFT";
        } else if (event.keyCode == 38 && d != "DOWN") {
            d = "UP";
        } else if (event.keyCode == 39 && d != "LEFT") {
            d = "RIGHT";
        } else if (event.keyCode == 40 && d != "UP") {
            d = "DOWN";
        }
    }

    function collision(head, array) {
        for (let i = 0; i < array.length; i++) {
            if (head.x == array[i].x && head.y == array[i].y) {
                return true;
            }
        }
        return false;
    }

    function draw() {
        ctx.fillStyle = "#0f0f0f"; // hackerDark
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < snake.length; i++) {
            ctx.fillStyle = (i == 0) ? "#0e6b0e" : "#0a4a0a"; // hackerGreen
            ctx.fillRect(snake[i].x, snake[i].y, box, box);

            ctx.strokeStyle = "#0f0f0f";
            ctx.strokeRect(snake[i].x, snake[i].y, box, box);
        }

        ctx.fillStyle = "red";
        ctx.fillRect(food.x, food.y, box, box);

        // old head position
        let snakeX = snake[0].x;
        let snakeY = snake[0].y;

        // which direction
        if (d == "LEFT") snakeX -= box;
        if (d == "UP") snakeY -= box;
        if (d == "RIGHT") snakeX += box;
        if (d == "DOWN") snakeY += box;

        // if the snake eats the food
        if (snakeX == food.x && snakeY == food.y) {
            score++;
            food = {
                x: Math.floor(Math.random() * 19 + 1) * box,
                y: Math.floor(Math.random() * 19 + 1) * box
            };
        } else {
            // remove the tail
            snake.pop();
        }

        let newHead = {
            x: snakeX,
            y: snakeY
        };

        // game over
        if (snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || collision(newHead, snake)) {
            clearInterval(game);
            document.removeEventListener("keydown", direction);
            onGameOver();
        }

        snake.unshift(newHead);

        ctx.fillStyle = "white";
        ctx.font = "20px Changa one";
        ctx.fillText("Score: " + score, box, 1.6 * box);
    }

    let game = setInterval(draw, 100);
}