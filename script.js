// Obtemos o elemento <canvas> do HTML pelo seu ID
const canvas = document.getElementById('gameCanvas');

// Criamos o contexto 2D, que será usado para desenhar no canvas
const ctx = canvas.getContext('2d');

// Exibimos uma mensagem no console para confirmar que o jogo está configurado corretamente
console.log("O jogo está configurado e pronto para iniciar!");

// Variáveis para controlar a posição e o movimento do paddle
let paddleX = 350; // Posição inicial do paddle no eixo X
const paddleWidth = 100; // Largura do paddle
const paddleHeight = 10; // Altura do paddle
const paddleSpeed = 10; // Velocidade de movimento do paddle
let isMovingLeft = false; // Indicador de movimento para a esquerda
let isMovingRight = false; // Indicador de movimento para a direita

// **Configuração dos blocos**
const brickRowCount = 5; // Número de linhas de blocos
const brickColumnCount = 10; // Número de colunas de blocos
const brickWidth = 60; // Largura de cada bloco
const brickHeight = 20; // Altura de cada bloco
const brickColumnSpacing = 15; // Espaço entre as colunas
const brickRowSpacing = 7; // Espaço entre as linhas
const brickOffsetTop = 30; // Distância do topo do canvas
const brickOffsetLeft = 30; // Distância da lateral do canvas

// Variáveis da bola
let ballX = canvas.width / 2; // Posição inicial X da bola
let ballY = canvas.height - 30; // Posição inicial Y da bola
let ballRadius = 8; // Raio da bola
let ballSpeedX = 5; // Velocidade horizontal
let ballSpeedY = -5; // Velocidade vertical

// Carregar sons para os eventos do jogo aula 6
const hitBrickSound = new Audio('sounds/hit-brick.wav'); // Som ao bater em um bloco
const hitPaddleSound = new Audio('sounds/hit-paddle.wav'); // Som ao bater no paddle
const hitWallSound = new Audio('sounds/hit-wall.wav'); // Som ao bater nas bordas
const loseLifeSound = new Audio('sounds/lose-life.mp3'); // Som ao perder a bola
const winSound = new Audio('sounds/win.wav'); // Som da vitória
const backgroundMusic = new Audio('sounds/background-music.mp3'); // Música de fundo
backgroundMusic.loop = true; // Mantém a música tocando em loop
backgroundMusic.volume = 0.3; // Define volume baixo para não atrapalhar o jogo
backgroundMusic.play(); // Inicia a música

// **Array que armazenará os blocos**
// Arrays são estruturas de dados que armazenam múltiplos valores em uma única variável. 
// Aqui, estamos criando uma matriz bidimensional para organizar os blocos em linhas e colunas.
const bricks = [];

for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = []; // Cria um array para cada coluna
    for (let r = 0; r < brickRowCount; r++) {
      let brickX = brickOffsetLeft + c * (brickWidth + brickColumnSpacing);
      let brickY = brickOffsetTop + r * (brickHeight + brickRowSpacing);
      bricks[c][r] = { x: brickX, y: brickY, status: 1 }; // status 1 = bloco ativo
  }
}

// Definição de cores para cada coluna
const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A8", "#FFD700", "#00CED1", "#9400D3", "#FF4500", "#7FFF00", "#DC143C"];

// Função para desenhar os blocos na tela
function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
          if (bricks[c][r].status === 1) { // Apenas desenha os blocos ativos
              let brickX = c * (brickWidth + brickColumnSpacing) + brickOffsetLeft;
              let brickY = r * (brickHeight + brickRowSpacing) + brickOffsetTop;

              bricks[c][r].x = brickX;
              bricks[c][r].y = brickY;

              ctx.fillStyle = colors[c % colors.length]; // Escolhe uma cor com base na coluna
              ctx.fillRect(brickX, brickY, brickWidth, brickHeight);
          }
      }
  }
}

// Função para desenhar o paddle
function drawPaddle() {
    ctx.fillStyle = 'blue'; // Define a cor do paddle
    ctx.fillRect(paddleX, 530, paddleWidth, paddleHeight); // Desenha o paddle na posição atualizada
}

// Função para limpar o canvas antes de redesenhar
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa toda a área do canvas
}

// Função principal que atualiza a tela
function update() {
    if (gameWon || gameLost) return; // Se o jogo foi vencido, para a execução
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
   //clearCanvas(); // Limpa o canvas
    movePaddle(); // Atualiza a posição do paddle
    drawBricks(); // Desenha os blocos
    drawPaddle(); // Desenha o paddle
        
    moveBall();
    collisionDetection();   
    drawBall();
    requestAnimationFrame(update); // Chama a função continuamente para criar o loop de animação
   
}

// Eventos de teclado para ativar o movimento
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') { 
        isMovingLeft = true; // Ativa o movimento para a esquerda
        console.log(`Tecla pressionada: ${e.key}`); // Mostra o nome da tecla pressionada
        console.log(`isMovingLeft: ${isMovingLeft}, isMovingRight: ${isMovingRight}`);
    }
    if (e.key === 'ArrowRight' || e.key === 'd') { 
        isMovingRight = true; // Ativa o movimento para a direita
        console.log(`Tecla liberada: ${e.key}`); // Mostra o nome da tecla liberada
        console.log(`isMovingLeft: ${isMovingLeft}, isMovingRight: ${isMovingRight}`);
    }
});
  
// Eventos de teclado para desativar o movimento
document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') {
        isMovingLeft = false;
    }
    if (e.key === 'ArrowRight' || e.key === 'd') {
        isMovingRight = false;
    }
});

/* Os eventos keydown são keyup usados ​​para detectar quando uma tecla é pressionada e quando ela é solta,
permitindo controlar ações no jogo, como movimentação de personagens ou objetos. */
  
// Função para mover o paddle
function movePaddle() {
    if (isMovingLeft && paddleX > 0) {
        paddleX -= paddleSpeed; // Move o paddle para a esquerda
    }
    if (isMovingRight && paddleX < canvas.width - paddleWidth) {
        paddleX += paddleSpeed; // Move o paddle para a direita
    }
    console.log("Posição X do Paddle:", paddleX); // Exibe a posição X no console
}

// Função para desenhar a bola
function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
} 

// Função para detectar colisão entre a bola e os blocos
function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r]; 
            if (b.status === 1) { 
                if (
                    ballX > b.x && 
                    ballX < b.x + brickWidth &&
                    ballY > b.y && 
                    ballY < b.y + brickHeight
                ) {
                    ballSpeedY = -ballSpeedY; // Inverte a direção da bola
                    b.status = 0; // Remove o bloco ao acertar
                    hitBrickSound.play(); // Reproduz o som da colisão
                    if (checkWin()) return; // Verifica se venceu após destruir o bloco
                }
            }
        }
    }
}

// Função para atualizar a posição da bola e verificar colisões aula 6 ou 7
function moveBall() {
    if (gameLost) return; // Se o jogo estiver perdido, para a movimentação da bola

    // Previsão da próxima posição da bola
    let nextBallX = ballX + ballSpeedX;
    let nextBallY = ballY + ballSpeedY;

    // Verificação de colisão com as paredes laterais (esquerda e direita)
    if (nextBallX + ballRadius > canvas.width) { // Se a bola atingir o lado direito
        ballX = canvas.width - ballRadius; // Ajusta a posição para ficar dentro da tela
        ballSpeedX = -Math.abs(ballSpeedX); // Inverte a direção horizontal
        hitWallSound.play(); // Reproduz o som da colisão
    } 
    if (nextBallX - ballRadius < 0) { // Se a bola atingir o lado esquerdo
        ballX = ballRadius; // Ajusta a posição para ficar dentro da tela
        ballSpeedX = Math.abs(ballSpeedX); // Inverte a direção horizontal
        hitWallSound.play(); // Reproduz o som da colisão
    }

    // Verificação de colisão com o topo da tela
    if (nextBallY - ballRadius < 0) { // Se a bola atingir o topo
        ballY = ballRadius; // Ajusta a posição para não ultrapassar o topo
        ballSpeedY = Math.abs(ballSpeedY); // Inverte a direção vertical
        hitWallSound.play(); // Reproduz o som da colisão
    }

    // Verificação de colisão com o paddle usando interpolação (evita atravessar o paddle)
    if (
        ballY + ballRadius <= 530 &&  // A bola ainda não passou pelo paddle
        nextBallY + ballRadius >= 530 && // A próxima posição da bola cruzaria o paddle
        ballX > paddleX &&  // A bola está dentro da largura do paddle
        ballX < paddleX + paddleWidth
    ) {
        ballY = 530 - ballRadius; // Ajusta a posição da bola para cima do paddle
        ballSpeedY = -Math.abs(ballSpeedY); // Inverte a direção para cima

        // Efeito angular no rebote (faz a bola mudar de direção dependendo de onde bateu no paddle)
        let impactPoint = ballX - (paddleX + paddleWidth / 2); // Distância do centro do paddle
        let normalizedImpact = impactPoint / (paddleWidth / 2); // Normaliza o impacto (-1 a 1)
        ballSpeedX = normalizedImpact * 5; // Define nova velocidade horizontal

        hitPaddleSound.play(); // Reproduz o som da colisão com o paddle
    }

    // Verificação se a bola caiu abaixo do paddle (perda de vida ou game over)
    if (nextBallY + ballRadius > canvas.height) {
        loseGame(); // Chama a função que trata o fim do jogo
    }

    // 🔹 Atualiza a posição da bola com os valores previstos
    ballX = nextBallX;
    ballY = nextBallY;
}


// Variável para controlar o estado do jogo
let gameLost = false;

// **Função para verificar derrota**
function loseGame() {
    backgroundMusic.pause(); // Para a música de fundo
    loseLifeSound.play(); // Toca som de derrota
    gameLost = true; // Define que o jogo acabou

    // Limpa a tela e exibe mensagem de derrota
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#FF0000"; // Cor do texto
    ctx.font = "40px Arial";
    ctx.fillText("Você perdeu!", canvas.width / 2 - 100, canvas.height / 2);
    ctx.fillText("Tente novamente!", canvas.width / 2 - 130, canvas.height / 2 + 50);
  
}

// Variável para indicar se o jogo foi vencido
let gameWon = false;

// **Função para exibir tela de vitória**
function winGame() {
    backgroundMusic.pause(); // Para a música de fundo
    winSound.play(); // Toca som de vitória
    gameWon = true; // Marca o jogo como vencido

    // Limpa a tela e exibe mensagem de vitória
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#00FF00"; // Cor do texto
    ctx.font = "40px Arial";
    ctx.fillText("Você venceu!", canvas.width / 2 - 100, canvas.height / 2);
    ctx.fillText("Parabéns!", canvas.width / 2 - 100, canvas.height / 2 + 50);
}
// **Função para verificar vitória**
function checkWin() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                return false; // Ainda há blocos ativos, o jogo continua
            }
        }
    }
    winGame(); // Chama a função de vitória se todos os blocos foram destruídos
    return true;
}

document.addEventListener("click", function() {
    backgroundMusic.play().catch(error => console.log("Reprodução de áudio bloqueada:", error));
}, { once: true }); // Ouvinte de evento acionado apenas uma vez

// Inicia o loop de atualização
update();

// https://github.com/Guba531/Jogo-Bricks.git
// https://github.com/Guba531/Jogo-De-Ping-Pong.git
