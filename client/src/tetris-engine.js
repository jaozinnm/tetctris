/**
 * TECTRIS - Tetris Engine
 * 
 * Motor do jogo Tetris com mecânicas completas:
 * - Tabuleiro
 * - Peças (Tetrominoes)
 * - Colisão
 * - Limpeza de linhas
 * - Queda automática
 */

import { clone2DArray, rotateMatrix, isInBounds } from './utils.js';

// Definição das peças (Tetrominoes)
const PIECES = {
  I: {
    shape: [[1, 1, 1, 1]],
    color: '#00d9ff' // ciano
  },
  O: {
    shape: [[1, 1], [1, 1]],
    color: '#ffbe0b' // amarelo
  },
  T: {
    shape: [[0, 1, 0], [1, 1, 1]],
    color: '#ff006e' // magenta
  },
  S: {
    shape: [[0, 1, 1], [1, 1, 0]],
    color: '#00ff88' // verde
  },
  Z: {
    shape: [[1, 1, 0], [0, 1, 1]],
    color: '#ff006e' // magenta
  },
  J: {
    shape: [[1, 0, 0], [1, 1, 1]],
    color: '#00d9ff' // ciano
  },
  L: {
    shape: [[0, 0, 1], [1, 1, 1]],
    color: '#ffbe0b' // amarelo
  }
};

const PIECE_TYPES = Object.keys(PIECES);

export class TetrisEngine {
  constructor(width = 10, height = 20) {
    this.width = width;
    this.height = height;
    this.board = this.createBoard();
    this.currentPiece = null;
    this.nextPiece = null;
    this.score = 0;
    this.linesCleared = 0;
    this.level = 1;
    this.gameOver = false;
    this.piecesPlaced = 0;
    
    // Sistema de linha objetivo
    this.objectiveLineRow = this.height - 8; // Começa a 8 linhas do fundo
    this.objectiveLineReached = false;
    this.objectiveLineReachedCount = 0; // Quantas vezes alcançou
    
    // Inicializa primeira peça
    this.spawnNewPiece();
  }

  /**
   * Cria um tabuleiro vazio
   */
  createBoard() {
    return Array(this.height)
      .fill(null)
      .map(() => Array(this.width).fill(0));
  }

  /**
   * Retorna uma peça aleatória
   */
  getRandomPiece() {
    const type = PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)];
    const piece = PIECES[type];
    return {
      type,
      shape: piece.shape.map(row => [...row]),
      color: piece.color,
      row: 0,
      col: Math.floor((this.width - piece.shape[0].length) / 2)
    };
  }

  /**
   * Gera uma nova peça
   */
  spawnNewPiece() {
    if (this.nextPiece) {
      this.currentPiece = this.nextPiece;
      this.currentPiece.row = 0;
      this.currentPiece.col = Math.floor((this.width - this.currentPiece.shape[0].length) / 2);
    } else {
      this.currentPiece = this.getRandomPiece();
    }

    this.nextPiece = this.getRandomPiece();

    // Verifica se há colisão na spawn (game over)
    if (this.hasCollision(this.currentPiece.row, this.currentPiece.col, this.currentPiece.shape)) {
      this.gameOver = true;
    }

    this.piecesPlaced++;
  }

  /**
   * Verifica colisão
   */
  hasCollision(row, col, shape) {
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c] === 0) continue;

        const newRow = row + r;
        const newCol = col + c;

        // Fora dos limites
        if (newRow < 0 || newRow >= this.height || newCol < 0 || newCol >= this.width) {
          if (newRow >= this.height) return true; // Colidiu com chão
          if (newCol < 0 || newCol >= this.width) return true; // Colidiu com parede
          continue;
        }

        // Colidiu com bloco fixo
        if (this.board[newRow][newCol] !== 0) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Move a peça para esquerda
   */
  moveLeft() {
    if (!this.currentPiece || this.gameOver) return false;
    
    if (!this.hasCollision(this.currentPiece.row, this.currentPiece.col - 1, this.currentPiece.shape)) {
      this.currentPiece.col--;
      return true;
    }
    return false;
  }

  /**
   * Move a peça para direita
   */
  moveRight() {
    if (!this.currentPiece || this.gameOver) return false;
    
    if (!this.hasCollision(this.currentPiece.row, this.currentPiece.col + 1, this.currentPiece.shape)) {
      this.currentPiece.col++;
      return true;
    }
    return false;
  }

  /**
   * Move a peça para baixo (queda suave)
   */
  moveDown() {
    if (!this.currentPiece || this.gameOver) return false;
    
    if (!this.hasCollision(this.currentPiece.row + 1, this.currentPiece.col, this.currentPiece.shape)) {
      this.currentPiece.row++;
      return true;
    } else {
      // Fixa a peça
      this.fixPiece();
      return false;
    }
  }

  /**
   * Queda rápida (drop)
   */
  hardDrop() {
    if (!this.currentPiece || this.gameOver) return 0;
    
    let dropDistance = 0;
    while (this.moveDown()) {
      dropDistance++;
    }
    return dropDistance;
  }

  /**
   * Rotaciona a peça
   */
  rotate() {
    if (!this.currentPiece || this.gameOver) return false;
    
    const rotated = rotateMatrix(this.currentPiece.shape);
    
    if (!this.hasCollision(this.currentPiece.row, this.currentPiece.col, rotated)) {
      this.currentPiece.shape = rotated;
      return true;
    }
    
    // Tenta ajuste de parede (wall kick)
    for (let offset = 1; offset <= 2; offset++) {
      if (!this.hasCollision(this.currentPiece.row, this.currentPiece.col - offset, rotated)) {
        this.currentPiece.col -= offset;
        this.currentPiece.shape = rotated;
        return true;
      }
      if (!this.hasCollision(this.currentPiece.row, this.currentPiece.col + offset, rotated)) {
        this.currentPiece.col += offset;
        this.currentPiece.shape = rotated;
        return true;
      }
    }
    
    return false;
  }

  /**
   * Fixa a peça no tabuleiro
   */
  fixPiece() {
    if (!this.currentPiece) return;

    const { row, col, shape, color } = this.currentPiece;

    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c] === 1) {
          const boardRow = row + r;
          const boardCol = col + c;

          if (boardRow >= 0 && boardRow < this.height && boardCol >= 0 && boardCol < this.width) {
            this.board[boardRow][boardCol] = color;
          }
        }
      }
    }

    this.clearLines();
    this.spawnNewPiece();
  }

  /**
   * Limpa linhas completas
   */
  clearLines() {
    const linesToClear = [];

    for (let r = this.height - 1; r >= 0; r--) {
      if (this.board[r].every(cell => cell !== 0)) {
        linesToClear.push(r);
      }
    }

    if (linesToClear.length > 0) {
      // Remove linhas completas
      for (let i = linesToClear.length - 1; i >= 0; i--) {
        this.board.splice(linesToClear[i], 1);
        this.board.unshift(Array(this.width).fill(0));
      }

      this.linesCleared += linesToClear.length;
      this.updateLevel();
      
      return linesToClear.length;
    }

    return 0;
  }

  /**
   * Atualiza o nível baseado em linhas limpas
   */
  updateLevel() {
    const newLevel = Math.floor(this.linesCleared / 10) + 1;
    this.level = Math.min(newLevel, 15); // Máximo nível 15
  }

  /**
   * Retorna o estado atual do tabuleiro com a peça atual
   */
  getDisplayBoard() {
    const display = clone2DArray(this.board);

    if (this.currentPiece) {
      const { row, col, shape, color } = this.currentPiece;

      for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
          if (shape[r][c] === 1) {
            const boardRow = row + r;
            const boardCol = col + c;

            if (boardRow >= 0 && boardRow < this.height && boardCol >= 0 && boardCol < this.width) {
              display[boardRow][boardCol] = color;
            }
          }
        }
      }
    }

    return display;
  }

  /**
   * Verifica se a linha objetivo foi alcançada
   */
  checkObjectiveLineReached() {
    if (this.objectiveLineRow < 0) return false;
    
    const line = this.board[this.objectiveLineRow];
    const isReached = line && line.every(cell => cell !== 0);
    
    if (isReached && !this.objectiveLineReached) {
      this.objectiveLineReached = true;
      this.objectiveLineReachedCount++;
      return true;
    }
    
    return false;
  }

  /**
   * Avança a linha objetivo para cima
   */
  advanceObjectiveLine() {
    this.objectiveLineReached = false;
    // Move linha para cima (diminui row)
    this.objectiveLineRow -= 5; // Sobe 5 linhas
    
    // Se saiu do tabuleiro, reinicia
    if (this.objectiveLineRow < 2) {
      this.objectiveLineRow = this.height - 8;
    }
  }

  /**
   * Retorna informações do estado do jogo
   */
  getState() {
    return {
      board: this.getDisplayBoard(),
      currentPiece: this.currentPiece,
      nextPiece: this.nextPiece,
      score: this.score,
      linesCleared: this.linesCleared,
      level: this.level,
      gameOver: this.gameOver,
      piecesPlaced: this.piecesPlaced,
      objectiveLineRow: this.objectiveLineRow,
      objectiveLineReached: this.objectiveLineReached,
      objectiveLineReachedCount: this.objectiveLineReachedCount
    };
  }

  /**
   * Adiciona uma linha de blocos como penalidade
   */
  addPenaltyLine() {
    if (this.board.length > 0) {
      // Remove a primeira linha
      this.board.shift();
      
      // Adiciona uma linha com blocos aleatórios na base
      const penaltyLine = Array(this.width)
        .fill(null)
        .map((_, i) => i < this.width - 2 ? '#666666' : 0); // Deixa 2 espaços vazios
      
      this.board.push(penaltyLine);
    }
  }

  /**
   * Reseta o jogo
   */
  reset() {
    this.board = this.createBoard();
    this.currentPiece = null;
    this.nextPiece = null;
    this.score = 0;
    this.linesCleared = 0;
    this.level = 1;
    this.gameOver = false;
    this.piecesPlaced = 0;
    this.objectiveLineRow = this.height - 8;
    this.objectiveLineReached = false;
    this.objectiveLineReachedCount = 0;
    this.spawnNewPiece();
  }
}
