/**
 * TECTRIS - Main Game Loop & Renderer
 * 
 * Gerencia o loop principal do jogo, entrada do usuário e renderização
 */

import { GameLogic } from './game-logic.js';
import { formatTime, formatScore, getDropSpeed } from './utils.js';

// ==================== ESTADO GLOBAL ====================

const game = new GameLogic();
let gameRunning = false;
let dropInterval = null;
let questionCheckInterval = null;
let gameTimeInterval = null;
let currentScreen = 'start'; // 'start', 'game', 'gameover'

// ==================== ELEMENTOS DO DOM ====================

const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const gameOverScreen = document.getElementById('gameover-screen');

const boardCanvas = document.getElementById('board-canvas');
const nextPieceCanvas = document.getElementById('next-piece-canvas');
const boardCtx = boardCanvas.getContext('2d');
const nextPieceCtx = nextPieceCanvas.getContext('2d');

const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');
const linesDisplay = document.getElementById('lines');
const timeDisplay = document.getElementById('time');
const questionsDisplay = document.getElementById('questions');
const objectiveLinesDisplay = document.getElementById('objective-lines');

const questionCard = document.getElementById('question-card');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');

const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const restartBtn = document.getElementById('restart-btn');
const restartGameOverBtn = document.getElementById('restart-gameover-btn');

const finalScoreDisplay = document.getElementById('final-score');
const finalStatsDisplay = document.getElementById('final-stats');

// ==================== CONFIGURAÇÕES DE RENDERIZAÇÃO ====================

const CELL_SIZE = 20;
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const NEXT_PIECE_SIZE = 15;

// ==================== FUNÇÕES DE RENDERIZAÇÃO ====================

/**
 * Renderiza o tabuleiro do jogo
 */
function renderBoard() {
  const state = game.getGameState();
  const board = state.board;

  // Limpa o canvas
  boardCtx.fillStyle = '#050812';
  boardCtx.fillRect(0, 0, boardCanvas.width, boardCanvas.height);

  // Desenha grid de scanlines
  boardCtx.strokeStyle = 'rgba(0, 255, 136, 0.05)';
  boardCtx.lineWidth = 1;
  for (let i = 0; i < BOARD_HEIGHT; i++) {
    boardCtx.beginPath();
    boardCtx.moveTo(0, i * CELL_SIZE);
    boardCtx.lineTo(BOARD_WIDTH * CELL_SIZE, i * CELL_SIZE);
    boardCtx.stroke();
  }

  // Desenha as células
  for (let row = 0; row < BOARD_HEIGHT; row++) {
    for (let col = 0; col < BOARD_WIDTH; col++) {
      const cell = board[row][col];

      if (cell !== 0) {
        // Desenha bloco
        boardCtx.fillStyle = cell;
        boardCtx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE - 1, CELL_SIZE - 1);

        // Desenha borda com glow
        boardCtx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        boardCtx.lineWidth = 1;
        boardCtx.strokeRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE - 1, CELL_SIZE - 1);
      }
    }
  }

  // Desenha linha objetivo
  const objectiveLineRow = state.objectiveLineRow;
  if (objectiveLineRow >= 0 && objectiveLineRow < BOARD_HEIGHT) {
    const y = objectiveLineRow * CELL_SIZE;
    
    // Linha pulsante com glow
    const pulseOpacity = 0.5 + 0.5 * Math.sin(Date.now() / 300);
    boardCtx.strokeStyle = `rgba(255, 190, 11, ${pulseOpacity})`;
    boardCtx.lineWidth = 3;
    boardCtx.beginPath();
    boardCtx.moveTo(0, y);
    boardCtx.lineTo(BOARD_WIDTH * CELL_SIZE, y);
    boardCtx.stroke();
    
    // Glow adicional
    boardCtx.strokeStyle = `rgba(255, 190, 11, ${pulseOpacity * 0.5})`;
    boardCtx.lineWidth = 6;
    boardCtx.beginPath();
    boardCtx.moveTo(0, y);
    boardCtx.lineTo(BOARD_WIDTH * CELL_SIZE, y);
    boardCtx.stroke();
  }

  // Desenha borda do tabuleiro
  boardCtx.strokeStyle = '#00d9ff';
  boardCtx.lineWidth = 2;
  boardCtx.strokeRect(0, 0, BOARD_WIDTH * CELL_SIZE, BOARD_HEIGHT * CELL_SIZE);
}

/**
 * Renderiza a próxima peça
 */
function renderNextPiece() {
  const state = game.getGameState();
  const nextPiece = state.nextPiece;

  // Limpa o canvas
  nextPieceCtx.fillStyle = '#050812';
  nextPieceCtx.fillRect(0, 0, nextPieceCanvas.width, nextPieceCanvas.height);

  if (nextPiece) {
    const shape = nextPiece.shape;
    const color = nextPiece.color;

    // Calcula offset para centralizar
    const offsetX = (4 - shape[0].length) * NEXT_PIECE_SIZE / 2;
    const offsetY = (4 - shape.length) * NEXT_PIECE_SIZE / 2;

    // Desenha peça
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col] === 1) {
          const x = offsetX + col * NEXT_PIECE_SIZE;
          const y = offsetY + row * NEXT_PIECE_SIZE;

          nextPieceCtx.fillStyle = color;
          nextPieceCtx.fillRect(x, y, NEXT_PIECE_SIZE - 1, NEXT_PIECE_SIZE - 1);

          nextPieceCtx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
          nextPieceCtx.lineWidth = 1;
          nextPieceCtx.strokeRect(x, y, NEXT_PIECE_SIZE - 1, NEXT_PIECE_SIZE - 1);
        }
      }
    }
  }

  // Desenha borda
  nextPieceCtx.strokeStyle = '#00ff88';
  nextPieceCtx.lineWidth = 1;
  nextPieceCtx.strokeRect(0, 0, nextPieceCanvas.width, nextPieceCanvas.height);
}

/**
 * Atualiza os displays de UI
 */
function updateUI() {
  const state = game.getGameState();

  scoreDisplay.textContent = formatScore(state.score);
  levelDisplay.textContent = state.level;
  linesDisplay.textContent = state.linesCleared;
  timeDisplay.textContent = formatTime(state.gameTime);
  questionsDisplay.textContent = `${state.stats.questionsCorrect}/${state.stats.questionsAnswered}`;
  objectiveLinesDisplay.textContent = state.stats.objectiveLinesReached;
}

/**
 * Mostra a pergunta na tela
 */
function showQuestion(question) {
  questionCard.style.display = 'flex';
  questionCard.classList.add('animate-fade-in');

  questionText.textContent = question.question;
  optionsContainer.innerHTML = '';

  question.options.forEach((option, index) => {
    const btn = document.createElement('button');
    btn.className = 'btn btn-primary option-btn';
    btn.textContent = option;
    btn.dataset.index = index;
    btn.onclick = () => answerQuestion(index);
    optionsContainer.appendChild(btn);
  });
  
  updateOptionSelection();
}

/**
 * Atualiza a seleção visual de alternativas
 */
function updateOptionSelection() {
  const selectedIndex = game.getSelectedOptionIndex();
  const buttons = document.querySelectorAll('.option-btn');
  
  buttons.forEach((btn, index) => {
    if (index === selectedIndex) {
      btn.classList.add('option-selected');
      btn.classList.remove('btn-primary');
      btn.classList.add('btn-success');
    } else {
      btn.classList.remove('option-selected');
      btn.classList.remove('btn-success');
      btn.classList.add('btn-primary');
    }
  });
}

/**
 * Responde uma pergunta
 */
function answerQuestion(selectedIndex) {
  const result = game.answerQuestion(selectedIndex);

  if (result) {
    // Desabilita botões
    document.querySelectorAll('.option-btn').forEach(btn => btn.disabled = true);

    // Mostra resultado
    const resultDiv = document.createElement('div');
    resultDiv.className = `question-result ${result.correct ? 'success' : 'error'} animate-fade-in`;
    resultDiv.innerHTML = `
      <div class="result-message ${result.correct ? 'text-neon-green' : 'text-neon-magenta'}">
        ${result.message}
      </div>
      <div class="result-answer text-muted">
        Resposta correta: ${result.correctAnswer}
      </div>
    `;

    questionCard.appendChild(resultDiv);

    // Fecha a pergunta após 2 segundos
    setTimeout(() => {
      game.closeQuestion();
      questionCard.style.display = 'none';
      questionCard.classList.remove('animate-fade-in');
      resultDiv.remove();
    }, 2000);
  }
}

/**
 * Renderiza a tela inicial
 */
function renderStartScreen() {
  currentScreen = 'start';
  startScreen.style.display = 'flex';
  gameScreen.style.display = 'none';
  gameOverScreen.style.display = 'none';
}

/**
 * Renderiza a tela do jogo
 */
function renderGameScreen() {
  currentScreen = 'game';
  startScreen.style.display = 'none';
  gameScreen.style.display = 'grid';
  gameOverScreen.style.display = 'none';
  renderBoard();
  renderNextPiece();
  updateUI();
}

/**
 * Renderiza a tela de game over
 */
function renderGameOverScreen() {
  currentScreen = 'gameover';
  startScreen.style.display = 'none';
  gameScreen.style.display = 'none';
  gameOverScreen.style.display = 'flex';

  const stats = game.getGameStats();
  finalScoreDisplay.textContent = formatScore(stats.finalScore);

  finalStatsDisplay.innerHTML = `
    <div class="stat-row">
      <span>Tempo:</span>
      <span>${formatTime(stats.gameTime)}</span>
    </div>
    <div class="stat-row">
      <span>Nível:</span>
      <span>${stats.level}</span>
    </div>
    <div class="stat-row">
      <span>Linhas Limpas:</span>
      <span>${stats.linesCleared}</span>
    </div>
    <div class="stat-row">
      <span>Peças Colocadas:</span>
      <span>${stats.piecesPlaced}</span>
    </div>
    <div class="stat-row">
      <span>Perguntas Respondidas:</span>
      <span>${stats.questionsAnswered}</span>
    </div>
    <div class="stat-row">
      <span>Acurácia:</span>
      <span class="text-neon-green">${stats.accuracy}%</span>
    </div>
    <div class="stat-row">
      <span>Pontos Bônus:</span>
      <span class="text-neon-green">+${formatScore(stats.bonusPointsEarned)}</span>
    </div>
      <div class="stat-row">
        <span>Pontos Perdidos:</span>
        <span class="text-neon-magenta">-${formatScore(stats.penaltyPointsLost)}</span>
      </div>
      <div class="stat-row">
        <span>Linhas Objetivo Alcançadas:</span>
        <span class="text-neon-yellow">${stats.objectiveLinesReached}</span>
      </div>
    `;
}

// ==================== GAME LOOP ====================

/**
 * Loop principal do jogo
 */
function gameLoop() {
  if (!gameRunning || game.engine.gameOver) {
    if (game.engine.gameOver) {
      stopGame();
    }
    return;
  }

  // Atualiza tempo
  game.updateGameTime();

  // Atualiza bônus de velocidade
  game.updateSpeedBonus();

  // Processa queda de peça
  game.processPieceFall();

  // Verifica se deve mostrar pergunta
  if (game.shouldShowQuestion()) {
    const question = game.showQuestion();
    showQuestion(question);
  }

  // Renderiza
  renderBoard();
  renderNextPiece();
  updateUI();
}

/**
 * Inicia o jogo
 */
function startGame() {
  game.startGame();
  gameRunning = true;
  renderGameScreen();

  // Limpa intervalos anteriores
  if (dropInterval) clearInterval(dropInterval);
  if (questionCheckInterval) clearInterval(questionCheckInterval);
  if (gameTimeInterval) clearInterval(gameTimeInterval);

  // Configura intervalos
  const dropSpeed = getDropSpeed(game.engine.level);
  dropInterval = setInterval(gameLoop, dropSpeed);
  gameTimeInterval = setInterval(() => game.updateGameTime(), 1000);

  pauseBtn.textContent = 'PAUSAR';
}

/**
 * Para o jogo
 */
function stopGame() {
  gameRunning = false;
  clearInterval(dropInterval);
  clearInterval(questionCheckInterval);
  clearInterval(gameTimeInterval);
  renderGameOverScreen();
}

/**
 * Pausa/retoma o jogo
 */
function togglePause() {
  const isPaused = game.togglePause();
  pauseBtn.textContent = isPaused ? 'RETOMAR' : 'PAUSAR';

  if (isPaused) {
    clearInterval(dropInterval);
  } else {
    const dropSpeed = getDropSpeed(game.engine.level);
    dropInterval = setInterval(gameLoop, dropSpeed);
  }
}

/**
 * Reinicia o jogo
 */
function restartGame() {
  game.reset();
  startGame();
}

// ==================== EVENT LISTENERS ====================

startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', togglePause);
restartBtn.addEventListener('click', restartGame);
restartGameOverBtn.addEventListener('click', () => {
  renderStartScreen();
});

/**
 * Controles do teclado
 */
document.addEventListener('keydown', (e) => {
  if (!gameRunning || game.isPaused || currentScreen !== 'game') return;

  // Se pergunta está ativa, reutiliza controles para navegação
  if (game.questionActive) {
    switch (e.key) {
      case 'ArrowLeft':
        game.navigateOption('left');
        updateOptionSelection();
        e.preventDefault();
        break;
      case 'ArrowRight':
        game.navigateOption('right');
        updateOptionSelection();
        e.preventDefault();
        break;
      case ' ':
      case 'Enter':
        answerQuestion(game.getSelectedOptionIndex());
        e.preventDefault();
        break;
    }
    return; // Não processa outros controles durante pergunta
  }

  // Controles normais do jogo
  switch (e.key) {
    case 'ArrowLeft':
      game.moveLeft();
      e.preventDefault();
      break;
    case 'ArrowRight':
      game.moveRight();
      e.preventDefault();
      break;
    case 'ArrowDown':
      game.processPieceFall();
      e.preventDefault();
      break;
    case ' ':
      game.hardDrop();
      e.preventDefault();
      break;
    case 'ArrowUp':
    case 'z':
    case 'Z':
      game.rotate();
      e.preventDefault();
      break;
  }

  renderBoard();
  renderNextPiece();
  updateUI();
});

// ==================== INICIALIZAÇÃO ====================

window.addEventListener('load', () => {
  renderStartScreen();
});

// Exporta para testes
window.game = game;
