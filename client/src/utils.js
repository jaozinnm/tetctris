/**
 * TECTRIS - Utils Module
 * 
 * Funções utilitárias para o jogo
 */

/**
 * Formata o tempo em MM:SS
 */
export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/**
 * Formata números com separador de milhares
 */
export function formatScore(score) {
  return score.toLocaleString('pt-BR');
}

/**
 * Gera um ID único
 */
export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Debounce para evitar múltiplos cliques
 */
export function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Throttle para limitar execução
 */
export function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Calcula a velocidade de queda das peças baseado no nível
 * Nível 1 = 1000ms, aumenta conforme nível
 */
export function getDropSpeed(level) {
  const baseSpeed = 1000;
  const speedIncrease = 50;
  return Math.max(200, baseSpeed - (level - 1) * speedIncrease);
}

/**
 * Calcula pontos ganhos por linha limpa
 */
export function calculateLinePoints(linesCleared, level) {
  const basePoints = {
    1: 100,
    2: 300,
    3: 500,
    4: 800
  };
  const points = basePoints[Math.min(linesCleared, 4)] || 0;
  return points * level;
}

/**
 * Calcula pontos de bônus por acertar pergunta
 */
export function calculateQuestionBonus(difficulty) {
  const bonusMap = {
    easy: 50,
    medium: 100,
    hard: 150
  };
  return bonusMap[difficulty] || 50;
}

/**
 * Calcula penalidade por errar pergunta
 */
export function calculateQuestionPenalty(difficulty) {
  const penaltyMap = {
    easy: 25,
    medium: 50,
    hard: 75
  };
  return penaltyMap[difficulty] || 25;
}

/**
 * Determina o nível baseado na pontuação
 */
export function getLevelFromScore(score) {
  if (score < 1000) return 1;
  if (score < 3000) return 2;
  if (score < 6000) return 3;
  if (score < 10000) return 4;
  return 5;
}

/**
 * Clona um array 2D
 */
export function clone2DArray(arr) {
  return arr.map(row => [...row]);
}

/**
 * Verifica se uma posição está dentro dos limites
 */
export function isInBounds(row, col, rows, cols) {
  return row >= 0 && row < rows && col >= 0 && col < cols;
}

/**
 * Rotaciona uma matriz 90 graus no sentido horário
 */
export function rotateMatrix(matrix) {
  const n = matrix.length;
  const rotated = Array(n).fill(null).map(() => Array(n).fill(0));
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      rotated[j][n - 1 - i] = matrix[i][j];
    }
  }
  
  return rotated;
}

/**
 * Cria um delay assíncrono
 */
export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Toca um som visual (feedback sem áudio real)
 */
export function playVisualSound(type) {
  // Será implementado na UI com animações
  // Tipos: 'success', 'error', 'move', 'clear'
  return type;
}

/**
 * Valida se um score é válido
 */
export function isValidScore(score) {
  return typeof score === 'number' && score >= 0 && isFinite(score);
}

/**
 * Retorna uma cor baseada no nível
 */
export function getLevelColor(level) {
  const colors = {
    1: '#00ff88', // verde neon
    2: '#00d9ff', // ciano
    3: '#ff006e', // magenta
    4: '#ffbe0b', // amarelo
    5: '#ff006e'  // magenta
  };
  return colors[Math.min(level, 5)] || '#00ff88';
}
