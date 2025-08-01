function startSnakeGame(canvas, onGameOver) {
    const ctx = canvas.getContext('2d');

    // Set canvas dimensions to match its display size
    const style = getComputedStyle(canvas);
    canvas.width = parseInt(style.width);
    canvas.height = parseInt(style.height);

    const box = 20; // Size of each square in the grid
    const canvasWidthInBoxes = Math.floor(canvas.width / box);
    const canvasHeightInBoxes = Math.floor(canvas.height / box);
    
    let snake = [];
    snake[0] = { 
        x: Math.floor(canvasWidthInBoxes / 2) * box, 
        y: Math.floor(canvasHeightInBoxes / 2) * box 
    };

    function getRandomFoodPosition() {
        return {
            x: Math.floor(Math.random() * canvasWidthInBoxes) * box,
            y: Math.floor(Math.random() * canvasHeightInBoxes) * box
        };
    }

    let food = getRandomFoodPosition();

    let score = 0;
    let d; // Direction
    let game; // Game loop interval

    const directionListener = (event) => direction(event);
    document.addEventListener("keydown", directionListener);

    function direction(event) {
        const key = event.keyCode;
        if (key >= 37 && key <= 40) { // Arrow keys
            event.preventDefault();
        }
        
        if (key == 37 && d != "RIGHT") {
            d = "LEFT";
        } else if (key == 38 && d != "DOWN") {
            d = "UP";
        } else if (key == 39 && d != "LEFT") {
            d = "RIGHT";
        } else if (key == 40 && d != "UP") {
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

        let snakeX = snake[0].x;
        let snakeY = snake[0].y;

        if (d == "LEFT") snakeX -= box;
        if (d == "UP") snakeY -= box;
        if (d == "RIGHT") snakeX += box;
        if (d == "DOWN") snakeY += box;

        if (snakeX == food.x && snakeY == food.y) {
            score++;
            food = getRandomFoodPosition();
        } else {
            snake.pop();
        }

        let newHead = {
            x: snakeX,
            y: snakeY
        };

        if (snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || collision(newHead, snake)) {
            clearInterval(game);
            document.removeEventListener("keydown", directionListener);
            if(onGameOver) onGameOver();
            return;
        }

        snake.unshift(newHead);

        ctx.fillStyle = "white";
        ctx.font = "20px 'Changa one', sans-serif";
        ctx.fillText("Score: " + score, box, 1.6 * box);
    }

    game = setInterval(draw, 100);
}