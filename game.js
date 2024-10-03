const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const box = 20;
let score = 0;
let snake = [{ x: 9 * box, y: 9 * box }];
let food = {};
let direction = '';
let game;
let isGameRunning = false;
let record = 0;
let playerName = 'Ninguém';

const eatSound = new Audio('sounds/comida_music.ogg'); // Carrega o som
eatSound.preload = 'auto'; // Precarrega o som

let isSoundPlaying = false; // Controle para evitar múltiplos sons

function createFood() {
    food.x = Math.floor(Math.random() * 20) * box;
    food.y = Math.floor(Math.random() * 20) * box;
}

function collision(head, array) {
    return array.some(segment => segment.x === head.x && segment.y === head.y);
}

function draw() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? 'green' : 'white';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, box, box);

    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('Pontuação: ' + score, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === 'LEFT') snakeX -= box;
    if (direction === 'UP') snakeY -= box;
    if (direction === 'RIGHT') snakeX += box;
    if (direction === 'DOWN') snakeY += box;

    // Permite que a cobra passe pelas bordas
    if (snakeX < 0) snakeX = canvas.width - box;
    if (snakeY < 0) snakeY = canvas.height - box;
    if (snakeX >= canvas.width) snakeX = 0;
    if (snakeY >= canvas.height) snakeY = 0;

    if (snakeX === food.x && snakeY === food.y) {
        score++;
        if (!isSoundPlaying) {
            eatSound.currentTime = 0; // Reinicia o som
            eatSound.play(); // Toca o som ao comer
            isSoundPlaying = true;

            eatSound.onended = function() {
                isSoundPlaying = false; // Permite tocar o som novamente quando terminar
            };
        }
        createFood();

        // Atualiza o recorde se a nova pontuação for maior
        if (score > record) {
            record = score;
            document.getElementById('recordValue').innerText = record;
            document.getElementById('playerName').innerText = playerName;
        }
    } else {
        snake.pop();
    }

    const newHead = { x: snakeX, y: snakeY };

    if (collision(newHead, snake)) {
        clearInterval(game);
        alert('Game Over! Sua pontuação: ' + score);
        isGameRunning = false;
        setTimeout(() => {
            window.location.href = 'index.html'; // Redireciona para a página inicial
        }, 1000);
    }

    snake.unshift(newHead);
}

document.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' && direction !== 'RIGHT') {
        direction = 'LEFT';
    } else if (event.key === 'ArrowUp' && direction !== 'DOWN') {
        direction = 'UP';
    } else if (event.key === 'ArrowRight' && direction !== 'LEFT') {
        direction = 'RIGHT';
    } else if (event.key === 'ArrowDown' && direction !== 'UP') {
        direction = 'DOWN';
    }
});

// Função para iniciar o jogo
function startGame() {
    playerName = prompt("Digite seu nome:") || "Ninguém"; // Solicita o nome do jogador
    resetGame(); // Reinicia o jogo
}

// Função para reiniciar o jogo
function resetGame() {
    document.getElementById('scoreValue').innerText = 0;
    score = 0;
    snake = [{ x: 9 * box, y: 9 * box }];
    createFood();
    if (!isGameRunning) {
        isGameRunning = true;
        game = setInterval(draw, 100);
    }
}

// Inicia o jogo automaticamente ao carregar a página
window.onload = function() {
    startGame();
    eatSound.play(); // Força o carregamento do som
};

// Inicializa a comida
createFood();
