# TECTRIS - Aprenda C Jogando

Um protótipo jogável e visualmente atrativo de um jogo educacional que combina as mecânicas clássicas do Tetris com desafios de lógica de programação em C.

## 🎮 Visão Geral

**Tectris** é um jogo educacional inovador que une **aprendizado + gameplay + desafio + feedback visual**. Durante a partida, o jogador controla peças que caem (como em Tetris) e, em momentos específicos, deve responder perguntas de lógica de programação em C. As respostas corretas geram recompensas (pontos bônus), enquanto erros resultam em penalidades (perda de pontos e adição de blocos ao tabuleiro).

## ✨ Características Principais

### 🎯 Mecânicas do Jogo
- **Engine Tetris Completo**: Tabuleiro 10x20, 7 tipos de peças (Tetrominoes), colisão, rotação com wall-kick, limpeza de linhas
- **Sistema de Perguntas**: 20 perguntas de lógica em C (nível iniciante/intermediário)
- **Recompensas & Penalidades**:
  - ✅ Acerto: +50-150 pontos (conforme dificuldade)
  - ❌ Erro: -25-75 pontos + adição de linha de blocos
- **Progressão de Nível**: Velocidade aumenta a cada 10 linhas limpas
- **Sistema de Pontuação**: Pontos por linhas limpas, bônus por queda rápida, bônus por perguntas

### 🎨 Interface Visual
- **Estilo Cyberpunk Neon**: Cores vibrantes (verde #00ff88, magenta #ff006e, ciano #00d9ff) sobre fundo escuro
- **Tipografia Diferenciada**: Courier Prime (títulos), Roboto (corpo)
- **Animações Elegantes**: Glow effects, fade-in/out, scanlines sutis, efeitos de shake
- **Telas Completas**:
  - Tela inicial com instruções
  - Tela de jogo com painel de stats
  - Tela de game over com estatísticas detalhadas

### 📱 Responsividade
- Design adaptável para desktop, tablet e mobile
- Controles via teclado (setas, espaço, rotação)

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- pnpm (ou npm/yarn)

### Instalação e Execução

```bash
# Clonar/acessar o projeto
cd tectris-game

# Instalar dependências
pnpm install

# Iniciar servidor de desenvolvimento
pnpm dev

# Abrir no navegador
# http://localhost:3000
```

### Build para Produção

```bash
pnpm build
pnpm start
```

## 🎮 Controles

| Ação | Tecla |
|------|-------|
| Mover Esquerda | ← (Seta Esquerda) |
| Mover Direita | → (Seta Direita) |
| Descer Rápido | ↓ (Seta Baixo) |
| Queda Livre (Drop) | Espaço |
| Rotacionar | ↑ (Seta Acima) ou Z |
| Pausar/Retomar | Botão "PAUSAR" |
| Reiniciar | Botão "REINICIAR" |

## 📁 Estrutura do Projeto

```
tectris-game/
├── client/
│   ├── index.html              # Estrutura HTML principal
│   ├── src/
│   │   ├── index.css           # Estilos globais (tema neon/cyber)
│   │   ├── styles.css          # Estilos de componentes e telas
│   │   ├── main.js             # Loop principal e renderização
│   │   ├── tetris-engine.js    # Motor do Tetris (peças, colisão, limpeza)
│   │   ├── game-logic.js       # Lógica do jogo (perguntas, recompensas)
│   │   ├── questions.js        # Banco de perguntas de C
│   │   └── utils.js            # Funções utilitárias
│   └── public/                 # Assets estáticos
├── server/                     # Servidor Express (placeholder)
├── package.json
└── README.md
```

## 🏗️ Arquitetura

O projeto segue uma arquitetura modular bem definida:

### Módulos Principais

**`tetris-engine.js`** - Motor do Tetris
- Gerencia tabuleiro, peças e colisões
- Implementa rotação com wall-kick
- Detecta e limpa linhas completas
- Controla spawn de novas peças

**`game-logic.js`** - Lógica do Jogo
- Integra o motor Tetris com sistema de perguntas
- Gerencia recompensas e penalidades
- Controla timing de perguntas
- Calcula estatísticas

**`questions.js`** - Sistema de Perguntas
- Array de 20 perguntas sobre lógica em C
- Funções para validação e seleção aleatória
- Suporte a dificuldade (fácil/médio)

**`utils.js`** - Utilitários
- Formatação de tempo e pontuação
- Cálculo de velocidade de queda
- Cálculo de pontos e penalidades
- Funções de rotação de matriz

**`main.js`** - Loop Principal
- Gerencia o loop de jogo
- Renderiza tabuleiro e próxima peça
- Processa entrada do usuário
- Controla transição entre telas

**`index.css` + `styles.css`** - Estilos
- Tema neon/cyber com cores vibrantes
- Animações elegantes e responsivas
- Design system completo

## 🎯 Fluxo do Jogo

1. **Tela Inicial**: Apresenta o conceito e instruções
2. **Início da Partida**: Peças começam a cair
3. **Gameplay**: 
   - Jogador controla peças
   - A cada 5 peças OU 15 segundos, uma pergunta aparece
   - Jogador responde selecionando uma opção
4. **Recompensa/Penalidade**: Resultado é aplicado imediatamente
5. **Game Over**: Quando peça não cabe no tabuleiro
6. **Tela Final**: Mostra pontuação, nível, acurácia e estatísticas

## 📊 Sistema de Pontuação

| Ação | Pontos |
|------|--------|
| Linha simples | 100 × nível |
| 2 linhas | 300 × nível |
| 3 linhas | 500 × nível |
| 4 linhas (Tetris) | 800 × nível |
| Pergunta fácil (acerto) | +50 |
| Pergunta média (acerto) | +100 |
| Pergunta fácil (erro) | -25 |
| Pergunta média (erro) | -50 |
| Drop (queda rápida) | +2 por célula |

## 🧠 Perguntas de Programação em C

O banco inclui 20 perguntas sobre:
- Saída de código simples
- Loops (for, while)
- Condicionais (if, else)
- Vetores e arrays
- Operadores (aritméticos, lógicos)
- Variáveis e tipos
- Estruturas básicas

Exemplo:
```
Qual é a saída do código abaixo?
int x = 5;
printf("%d", x * 2 + 3);

A) 10
B) 13 ✓
C) 8
```

## 🎨 Design Visual

### Paleta de Cores
- **Fundo**: `#0a0e27` (azul-escuro)
- **Primário**: `#00ff88` (verde neon)
- **Secundário**: `#ff006e` (magenta neon)
- **Destaque**: `#00d9ff` (ciano neon)
- **Texto**: `#e0e0e0` (branco frio)

### Tipografia
- **Títulos**: Courier Prime (monoespacial, futurista)
- **Corpo**: Roboto (limpo, legível)

### Efeitos
- Glow effects em textos e bordas
- Scanlines sutis no tabuleiro
- Animações de fade-in/out
- Transições suaves (200-300ms)

## 🔧 Tecnologias

- **Frontend**: HTML5, CSS3, JavaScript puro (ES6+)
- **Canvas API**: Renderização do tabuleiro
- **Vite**: Build tool e dev server
- **Responsive Design**: Mobile-first approach

## 📈 Possíveis Melhorias Futuras

1. **Multiplayer**: Modo competitivo em tempo real
2. **Leaderboard**: Sistema de ranking com persistência
3. **Mais Perguntas**: Expandir banco para 50+ perguntas
4. **Dificuldades**: Modo fácil, normal, difícil
5. **Power-ups**: Itens especiais que afetam o jogo
6. **Som**: Efeitos sonoros e música de fundo
7. **Temas**: Diferentes temas visuais (dark, light, etc.)
8. **Estatísticas**: Gráficos de progresso e análise
9. **Backend**: Persistência de dados e autenticação
10. **Mobile App**: Versão nativa para iOS/Android

## 📝 Licença

Este projeto é um protótipo educacional. Sinta-se livre para usar, modificar e distribuir conforme necessário.

## 👨‍💻 Desenvolvimento

Desenvolvido como um protótipo MVP (Minimum Viable Product) para validar o conceito de combinar Tetris com educação em programação.

### Estrutura de Código

O código foi organizado para facilitar manutenção e evolução:
- **Separação de Responsabilidades**: Cada módulo tem uma função clara
- **Funções Puras**: Máximo de lógica sem efeitos colaterais
- **Comentários Detalhados**: Documentação inline
- **Nomes Descritivos**: Variáveis e funções auto-explicativas

---

**Aprenda C jogando. Divirta-se aprendendo. 🚀**
