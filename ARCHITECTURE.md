# Arquitetura do Tectris

## Visão Geral da Arquitetura

O Tectris foi desenvolvido com uma arquitetura modular e bem separada, facilitando manutenção, testes e evolução futura. O projeto segue o padrão **MVC (Model-View-Controller)** adaptado para um jogo em JavaScript puro.

## Camadas da Arquitetura

```
┌─────────────────────────────────────────────────────┐
│                  UI LAYER (main.js)                 │
│         Renderização, Input, Transição Telas        │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│              GAME LOGIC LAYER (game-logic.js)       │
│      Integração Tetris + Perguntas + Recompensas    │
└─────────────────────────────────────────────────────┘
         ↓                              ↓
┌──────────────────────┐    ┌────────────────────────┐
│  TETRIS ENGINE       │    │  QUESTIONS SYSTEM      │
│  (tetris-engine.js)  │    │  (questions.js)        │
│                      │    │                        │
│ - Tabuleiro         │    │ - Banco de Perguntas   │
│ - Peças             │    │ - Validação            │
│ - Colisão           │    │ - Seleção Aleatória    │
│ - Limpeza Linhas    │    │                        │
└──────────────────────┘    └────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────┐
│           UTILITIES LAYER (utils.js)                │
│    Funções Auxiliares, Cálculos, Formatação         │
└─────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────┐
│           PRESENTATION LAYER (CSS)                  │
│      index.css (Global) + styles.css (Componentes)  │
└─────────────────────────────────────────────────────┘
```

## Módulos Detalhados

### 1. **tetris-engine.js** - Motor do Tetris

**Responsabilidade**: Implementar a lógica pura do Tetris.

**Classe Principal**: `TetrisEngine`

**Atributos**:
```javascript
{
  width: 10,              // Largura do tabuleiro
  height: 20,             // Altura do tabuleiro
  board: [],              // Matriz do tabuleiro
  currentPiece: {},       // Peça atual
  nextPiece: {},          // Próxima peça
  score: 0,               // Pontuação
  linesCleared: 0,        // Linhas limpas
  level: 1,               // Nível atual
  gameOver: false,        // Estado do jogo
  piecesPlaced: 0         // Peças colocadas
}
```

**Métodos Principais**:
- `moveLeft()` / `moveRight()` / `moveDown()` - Movimentação
- `hardDrop()` - Queda rápida
- `rotate()` - Rotação com wall-kick
- `fixPiece()` - Fixa peça no tabuleiro
- `clearLines()` - Detecta e limpa linhas completas
- `hasCollision()` - Verifica colisão
- `getDisplayBoard()` - Retorna tabuleiro com peça atual
- `getState()` - Retorna estado completo

**Peças (Tetrominoes)**:
```javascript
{
  I: { shape: [[1,1,1,1]], color: '#00d9ff' },    // Ciano
  O: { shape: [[1,1],[1,1]], color: '#ffbe0b' },  // Amarelo
  T: { shape: [[0,1,0],[1,1,1]], color: '#ff006e' }, // Magenta
  S: { shape: [[0,1,1],[1,1,0]], color: '#00ff88' }, // Verde
  Z: { shape: [[1,1,0],[0,1,1]], color: '#ff006e' }, // Magenta
  J: { shape: [[1,0,0],[1,1,1]], color: '#00d9ff' }, // Ciano
  L: { shape: [[0,0,1],[1,1,1]], color: '#ffbe0b' }  // Amarelo
}
```

### 2. **game-logic.js** - Lógica do Jogo

**Responsabilidade**: Integrar o motor Tetris com sistema de perguntas e recompensas.

**Classe Principal**: `GameLogic`

**Atributos**:
```javascript
{
  engine: TetrisEngine,           // Instância do motor
  currentQuestion: {},            // Pergunta atual
  questionActive: false,          // Pergunta ativa?
  questionInterval: 15000,        // Intervalo de perguntas (ms)
  piecesUntilQuestion: 5,         // Peças até próxima pergunta
  gameTime: 0,                    // Tempo decorrido
  isPaused: false,                // Jogo pausado?
  stats: {                        // Estatísticas
    questionsAnswered: 0,
    questionsCorrect: 0,
    questionsWrong: 0,
    linesCleared: 0,
    bonusPointsEarned: 0,
    penaltyPointsLost: 0
  }
}
```

**Métodos Principais**:
- `startGame()` - Inicia partida
- `shouldShowQuestion()` - Verifica se deve mostrar pergunta
- `showQuestion()` - Exibe nova pergunta
- `answerQuestion(index)` - Processa resposta
- `processPieceFall()` - Processa queda de peça
- `moveLeft()` / `moveRight()` / `hardDrop()` / `rotate()` - Controles
- `getGameState()` - Retorna estado completo
- `getGameStats()` - Retorna estatísticas finais

**Fluxo de Pergunta**:
```
shouldShowQuestion() → showQuestion() → renderiza → answerQuestion() → aplica recompensa/penalidade
```

### 3. **questions.js** - Sistema de Perguntas

**Responsabilidade**: Gerenciar banco de perguntas e validação.

**Estrutura de Pergunta**:
```javascript
{
  id: 1,
  question: "Qual é a saída?",
  options: ["A", "B", "C"],
  correct: 1,              // Índice da resposta correta
  difficulty: "easy"       // "easy" ou "medium"
}
```

**Funções**:
- `getRandomQuestion()` - Retorna pergunta aleatória
- `getRandomQuestions(count)` - Retorna N perguntas
- `validateAnswer(question, index)` - Valida resposta
- `getCorrectAnswer(question)` - Retorna resposta correta

**Banco de Perguntas**: 20 perguntas sobre lógica em C

### 4. **utils.js** - Utilitários

**Responsabilidade**: Fornecer funções auxiliares reutilizáveis.

**Categorias de Funções**:

**Formatação**:
- `formatTime(seconds)` - Converte segundos em MM:SS
- `formatScore(score)` - Formata número com separador

**Cálculos**:
- `getDropSpeed(level)` - Velocidade baseada em nível
- `calculateLinePoints(lines, level)` - Pontos por linhas
- `calculateQuestionBonus(difficulty)` - Bônus por pergunta
- `calculateQuestionPenalty(difficulty)` - Penalidade por erro
- `getLevelFromScore(score)` - Nível baseado em pontuação

**Utilitários**:
- `clone2DArray(arr)` - Clona matriz 2D
- `rotateMatrix(matrix)` - Rotaciona matriz 90°
- `isInBounds(row, col, rows, cols)` - Verifica limites
- `delay(ms)` - Promise com delay

### 5. **main.js** - Loop Principal e Renderização

**Responsabilidade**: Gerenciar loop do jogo, entrada do usuário e renderização.

**Componentes**:

**Renderização**:
- `renderBoard()` - Desenha tabuleiro com Canvas
- `renderNextPiece()` - Desenha próxima peça
- `updateUI()` - Atualiza displays de pontuação
- `showQuestion()` - Exibe card de pergunta
- `renderStartScreen()` / `renderGameScreen()` / `renderGameOverScreen()` - Telas

**Game Loop**:
```javascript
gameLoop() {
  1. Atualiza tempo
  2. Processa queda de peça
  3. Verifica se deve mostrar pergunta
  4. Renderiza tabuleiro e UI
  5. Repete a cada X ms (velocidade de queda)
}
```

**Controles**:
- Teclado: Setas, Espaço, Z
- Botões: Pausar, Reiniciar

**Transição de Telas**:
```
Start Screen → Game Screen → Game Over Screen → Start Screen
```

## Fluxo de Dados

### Fluxo de Movimento de Peça

```
Input (Teclado)
    ↓
main.js (event listener)
    ↓
game-logic.js (moveLeft/Right/Down/rotate)
    ↓
tetris-engine.js (hasCollision, moveDown, etc)
    ↓
Atualiza engine.board
    ↓
main.js (renderBoard)
    ↓
Canvas (desenha)
```

### Fluxo de Pergunta

```
game-logic.shouldShowQuestion()
    ↓
game-logic.showQuestion()
    ↓
questions.getRandomQuestion()
    ↓
main.js (showQuestion - renderiza card)
    ↓
Usuário clica em opção
    ↓
main.js (answerQuestion)
    ↓
game-logic.answerQuestion()
    ↓
questions.validateAnswer()
    ↓
Aplica recompensa/penalidade
    ↓
main.js (renderiza resultado)
    ↓
Fecha pergunta após 2s
```

## Padrões de Design Utilizados

### 1. **Separação de Responsabilidades**
Cada módulo tem uma função clara e bem definida.

### 2. **Encapsulamento**
Cada classe mantém seu estado interno protegido.

### 3. **Composição**
`GameLogic` compõe `TetrisEngine` e `questions`.

### 4. **Factory Pattern**
`getRandomPiece()` cria peças aleatórias.

### 5. **Observer Pattern** (Implícito)
Event listeners monitoram entrada do usuário.

## Pontos de Extensão

### Adicionar Novas Perguntas
```javascript
// Em questions.js, adicionar ao array:
{
  id: 21,
  question: "Nova pergunta",
  options: ["A", "B", "C"],
  correct: 0,
  difficulty: "medium"
}
```

### Adicionar Novas Peças
```javascript
// Em tetris-engine.js, adicionar ao PIECES:
NEWPIECE: {
  shape: [[...]],
  color: '#color'
}
```

### Adicionar Novo Efeito Visual
```javascript
// Em styles.css, adicionar animação:
@keyframes new-effect {
  // ...
}

// Em main.js, aplicar classe:
element.classList.add('animate-new-effect');
```

### Adicionar Novo Controle
```javascript
// Em main.js, adicionar ao event listener:
case 'newKey':
  game.newAction();
  break;
```

## Performance

### Otimizações Implementadas

1. **Canvas Rendering**: Renderização eficiente com Canvas API
2. **Intervalo de Atualização**: Loop ajustável conforme nível
3. **Clonagem de Arrays**: Evita mutação de estado
4. **Event Delegation**: Listeners centralizados

### Possíveis Melhorias

1. **RequestAnimationFrame**: Usar RAF em vez de setInterval
2. **Web Workers**: Processar lógica em thread separada
3. **Memoization**: Cachear cálculos repetidos
4. **Lazy Loading**: Carregar perguntas sob demanda

## Testes

### Testes Sugeridos

```javascript
// Teste do motor Tetris
describe('TetrisEngine', () => {
  it('deve detectar colisão corretamente', () => {});
  it('deve limpar linhas completas', () => {});
  it('deve rotacionar peça com wall-kick', () => {});
});

// Teste da lógica do jogo
describe('GameLogic', () => {
  it('deve aplicar recompensa por acerto', () => {});
  it('deve aplicar penalidade por erro', () => {});
  it('deve mostrar pergunta no intervalo correto', () => {});
});

// Teste de perguntas
describe('Questions', () => {
  it('deve validar resposta corretamente', () => {});
  it('deve retornar pergunta aleatória', () => {});
});
```

## Conclusão

A arquitetura do Tectris foi projetada para ser:
- **Modular**: Fácil de entender e modificar
- **Escalável**: Pronta para novos recursos
- **Mantível**: Código bem organizado e documentado
- **Testável**: Componentes isolados e independentes

Esta estrutura permite que o projeto evolua de um MVP para um jogo completo com multiplayer, leaderboard, mais perguntas e recursos avançados.
