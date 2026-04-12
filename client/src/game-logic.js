/**
 * TECTRIS - Game Logic
 * 
 * Sistema de perguntas, recompensas e penalidades
 * Integra o motor Tetris com mecânicas educacionais
 */

import { TetrisEngine } from './tetris-engine.js';
import { getRandomQuestion, validateAnswer, getCorrectAnswer } from './questions.js';
import {
  calculateLinePoints,
  calculateQuestionBonus,
  calculateQuestionPenalty,
  getLevelFromScore,
  getDropSpeed
} from './utils.js';

export class GameLogic {
  constructor() {
    this.engine = new TetrisEngine(10, 20);
    this.currentQuestion = null;
    this.questionActive = false;
    this.questionAnswered = false;
    this.selectedOptionIndex = 0; // Índice da opção selecionada durante pergunta
    this.lastQuestionTime = 0;
    this.questionInterval = 15000; // Pergunta a cada 15 segundos
    this.piecesUntilQuestion = 5; // Pergunta a cada 5 peças
    this.piecesPlacedSinceQuestion = 0;
    this.gameTime = 0;
    this.gameStartTime = null;
    this.isPaused = false;
    this.objectiveLineSpeedBonus = 0; // Bônus de velocidade ao alcançar linha
    this.stats = {
      questionsAnswered: 0,
      questionsCorrect: 0,
      questionsWrong: 0,
      linesCleared: 0,
      bonusPointsEarned: 0,
      penaltyPointsLost: 0,
      objectiveLinesReached: 0
    };
  }

  /**
   * Inicia o jogo
   */
  startGame() {
    this.engine.reset();
    this.gameStartTime = Date.now();
    this.gameTime = 0;
    this.stats = {
      questionsAnswered: 0,
      questionsCorrect: 0,
      questionsWrong: 0,
      linesCleared: 0,
      bonusPointsEarned: 0,
      penaltyPointsLost: 0,
      objectiveLinesReached: 0
    };
    this.piecesPlacedSinceQuestion = 0;
    this.lastQuestionTime = Date.now();
    this.objectiveLineSpeedBonus = 0;
  }

  /**
   * Atualiza o tempo do jogo
   */
  updateGameTime() {
    if (!this.isPaused && this.gameStartTime) {
      this.gameTime = Math.floor((Date.now() - this.gameStartTime) / 1000);
    }
  }

  /**
   * Verifica se deve aparecer uma pergunta
   */
  shouldShowQuestion() {
    if (this.questionActive || this.engine.gameOver) {
      return false;
    }

    const timeSinceLastQuestion = Date.now() - this.lastQuestionTime;
    const piecesPlaced = this.engine.piecesPlaced - this.piecesPlacedSinceQuestion;

    // Pergunta aparece quando: tempo passou OU peças foram colocadas
    return timeSinceLastQuestion >= this.questionInterval || piecesPlaced >= this.piecesUntilQuestion;
  }

  /**
   * Mostra uma nova pergunta
   */
  showQuestion() {
    this.currentQuestion = getRandomQuestion();
    this.questionActive = true;
    this.questionAnswered = false;
    this.selectedOptionIndex = 0; // Reseta seleção
    this.lastQuestionTime = Date.now();
    this.piecesPlacedSinceQuestion = this.engine.piecesPlaced;
    return this.currentQuestion;
  }

  /**
   * Navega entre opções da pergunta (esquerda/direita)
   */
  navigateOption(direction) {
    if (!this.questionActive || !this.currentQuestion) return;
    
    const optionCount = this.currentQuestion.options.length;
    if (direction === 'left') {
      this.selectedOptionIndex = (this.selectedOptionIndex - 1 + optionCount) % optionCount;
    } else if (direction === 'right') {
      this.selectedOptionIndex = (this.selectedOptionIndex + 1) % optionCount;
    }
  }

  /**
   * Retorna o índice da opção selecionada
   */
  getSelectedOptionIndex() {
    return this.selectedOptionIndex;
  }

  /**
   * Responde uma pergunta
   */
  answerQuestion(selectedIndex) {
    if (!this.questionActive || this.questionAnswered) {
      return null;
    }

    this.questionAnswered = true;
    this.stats.questionsAnswered++;

    const isCorrect = validateAnswer(this.currentQuestion, selectedIndex);
    const correctAnswer = getCorrectAnswer(this.currentQuestion);

    if (isCorrect) {
      this.stats.questionsCorrect++;
      const bonus = calculateQuestionBonus(this.currentQuestion.difficulty);
      this.engine.score += bonus;
      this.stats.bonusPointsEarned += bonus;

      return {
        correct: true,
        message: `Acertou! +${bonus} pontos`,
        bonus: bonus,
        correctAnswer: correctAnswer
      };
    } else {
      this.stats.questionsWrong++;
      const penalty = calculateQuestionPenalty(this.currentQuestion.difficulty);
      
      // Aplica penalidade no jogo
      this.engine.score = Math.max(0, this.engine.score - penalty);
      this.stats.penaltyPointsLost += penalty;

      // Adiciona uma linha de blocos como penalidade
      this.engine.addPenaltyLine();

      return {
        correct: false,
        message: `Errou! -${penalty} pontos`,
        penalty: penalty,
        correctAnswer: correctAnswer,
        userAnswer: this.currentQuestion.options[selectedIndex]
      };
    }
  }

  /**
   * Fecha a pergunta
   */
  closeQuestion() {
    this.questionActive = false;
    this.currentQuestion = null;
  }

  /**
   * Processa a queda de uma peça
   */
  processPieceFall() {
    if (this.engine.gameOver) {
      return;
    }

    const moved = this.engine.moveDown();

    if (!moved) {
      // Peça foi fixada
      const linesCleared = this.engine.linesCleared - this.stats.linesCleared;
      if (linesCleared > 0) {
        const points = calculateLinePoints(linesCleared, this.engine.level);
        this.engine.score += points;
        this.stats.linesCleared += linesCleared;
      }

      // Verifica se alcançou a linha objetivo
      if (this.engine.checkObjectiveLineReached()) {
        this.onObjectiveLineReached();
      }
    }
  }

  /**
   * Chamado quando a linha objetivo é alcançada
   */
  onObjectiveLineReached() {
    this.stats.objectiveLinesReached++;
    
    // Recompensa: 500 pontos + reduz velocidade por 5 segundos
    const rewardPoints = 500;
    this.engine.score += rewardPoints;
    this.stats.bonusPointsEarned += rewardPoints;
    
    // Aplica bônus de velocidade (reduz velocidade = mais tempo para jogar)
    this.objectiveLineSpeedBonus = 5000; // 5 segundos de bônus
    
    // Avança a linha objetivo
    this.engine.advanceObjectiveLine();
  }

  /**
   * Controla movimento para esquerda
   */
  moveLeft() {
    if (this.questionActive) return false; // Bloqueado durante pergunta
    return this.engine.moveLeft();
  }

  /**
   * Controla movimento para direita
   */
  moveRight() {
    if (this.questionActive) return false; // Bloqueado durante pergunta
    return this.engine.moveRight();
  }

  /**
   * Controla queda rápida
   */
  hardDrop() {
    if (this.questionActive) return; // Bloqueado durante pergunta
    const distance = this.engine.hardDrop();
    if (distance > 0) {
      this.engine.score += distance * 2; // 2 pontos por célula caída
    }
  }

  /**
   * Controla rotação
   */
  rotate() {
    if (this.questionActive) return false; // Bloqueado durante pergunta
    return this.engine.rotate();
  }

  /**
   * Pausa/retoma o jogo
   */
  togglePause() {
    this.isPaused = !this.isPaused;
    return this.isPaused;
  }

  /**
   * Retorna o estado completo do jogo
   */
  getGameState() {
    // Calcula velocidade com bônus
    let dropSpeed = getDropSpeed(this.engine.level);
    if (this.objectiveLineSpeedBonus > 0) {
      dropSpeed = Math.max(300, dropSpeed + 200); // Aumenta delay (reduz velocidade)
    }
    
    return {
      ...this.engine.getState(),
      gameTime: this.gameTime,
      questionActive: this.questionActive,
      currentQuestion: this.currentQuestion,
      selectedOptionIndex: this.selectedOptionIndex,
      isPaused: this.isPaused,
      stats: this.stats,
      dropSpeed: dropSpeed,
      objectiveLineSpeedBonus: this.objectiveLineSpeedBonus
    };
  }

  /**
   * Retorna estatísticas finais
   */
  getGameStats() {
    const accuracy = this.stats.questionsAnswered > 0
      ? Math.round((this.stats.questionsCorrect / this.stats.questionsAnswered) * 100)
      : 0;

    return {
      finalScore: this.engine.score,
      gameTime: this.gameTime,
      level: this.engine.level,
      linesCleared: this.stats.linesCleared,
      questionsAnswered: this.stats.questionsAnswered,
      questionsCorrect: this.stats.questionsCorrect,
      questionsWrong: this.stats.questionsWrong,
      accuracy: accuracy,
      bonusPointsEarned: this.stats.bonusPointsEarned,
      penaltyPointsLost: this.stats.penaltyPointsLost,
      piecesPlaced: this.engine.piecesPlaced,
      objectiveLinesReached: this.stats.objectiveLinesReached
    };
  }

  /**
   * Reseta o jogo
   */
  reset() {
    this.engine.reset();
    this.currentQuestion = null;
    this.questionActive = false;
    this.questionAnswered = false;
    this.selectedOptionIndex = 0;
    this.lastQuestionTime = 0;
    this.piecesPlacedSinceQuestion = 0;
    this.gameTime = 0;
    this.gameStartTime = null;
    this.isPaused = false;
    this.objectiveLineSpeedBonus = 0;
    this.stats = {
      questionsAnswered: 0,
      questionsCorrect: 0,
      questionsWrong: 0,
      linesCleared: 0,
      bonusPointsEarned: 0,
      penaltyPointsLost: 0,
      objectiveLinesReached: 0
    };
  }

  /**
   * Atualiza o bônus de velocidade
   */
  updateSpeedBonus() {
    if (this.objectiveLineSpeedBonus > 0) {
      this.objectiveLineSpeedBonus -= 100; // Decrementa 100ms a cada atualização
    }
  }
}
