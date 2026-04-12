# Brainstorm de Design Visual - Tectris

## Conceito: Jogo Educacional Tetris + Perguntas de Lógica em C

---

## Resposta 1: Cyberpunk Neon - Arcade Futurista

**Probabilidade: 0.08**

### Design Movement
Cyberpunk 80s/90s arcade meets modern minimalism. Inspirado em interfaces de hacker, jogos retrô e dashboards futuristas.

### Core Principles
1. **Contraste Extremo**: Cores neon vibrantes (ciano, magenta, verde limão) sobre fundo escuro quase preto
2. **Geometria Angular**: Linhas retas, cortes diagonais, bordas afiadas—sem arredondamentos suaves
3. **Hierarquia Tipográfica Forte**: Títulos em fontes monoespaciais ou geométricas; corpo em sans-serif limpo
4. **Glow & Neon Effect**: Sombras luminosas, blur effects sutis, efeito de tubo de néon

### Color Philosophy
- **Fundo**: `#0a0e27` (azul-escuro quase preto)
- **Primário**: `#00ff88` (verde neon vibrante) — para acertos, sucesso
- **Secundário**: `#ff006e` (magenta/pink neon) — para penalidades, erros
- **Destaque**: `#00d9ff` (ciano) — para UI interativa
- **Neutro**: `#e0e0e0` (branco frio) — texto principal

### Layout Paradigm
- **Assimétrico com Grid Oculto**: Tabuleiro Tetris à esquerda (maior), painel lateral direito (menor) com stats
- **Diagonal Cuts**: Divisões entre seções usando clip-path com ângulos
- **Floating Elements**: Cards de pergunta flutuam sobre o tabuleiro com sombra neon

### Signature Elements
1. **Barra de Glow Animada**: Linha neon que percorre bordas de elementos interativos
2. **Scanlines Sutis**: Efeito de TV antiga (linhas horizontais finas) sobre o tabuleiro
3. **Ícones Geométricos**: Símbolos simples, monoespaciais, com glow

### Interaction Philosophy
- Cliques geram **pulso de luz** (flash neon)
- Transições rápidas (200-300ms) com easing suave
- Hover = aumento de brilho e glow
- Feedback sonoro visual (sem som real): animação de "beep" visual

### Animation
- **Entrada de Peças**: Fade-in com slide suave
- **Limpeza de Linha**: Explosão de partículas neon
- **Pergunta Aparecendo**: Zoom-in com glow crescente
- **Acerto**: Pulse de cor verde, confirmação rápida
- **Erro**: Shake suave + flash de magenta

### Typography System
- **Display/Títulos**: `Courier Prime` (monoespacial, futurista) — peso 700
- **Corpo/UI**: `Roboto` (limpo, legível) — peso 400/500
- **Hierarquia**: Títulos 32-48px, labels 14-16px, números grandes 28-36px

---

## Resposta 2: Minimalismo Geométrico - Design System Moderno

**Probabilidade: 0.07**

### Design Movement
Swiss design meets digital minimalism. Inspirado em interfaces de design systems modernos (Figma, Notion).

### Core Principles
1. **Espaço Negativo Generoso**: Muito ar branco/cinza, sem poluição visual
2. **Tipografia como Protagonista**: Fontes grandes, peso variado, espaçamento preciso
3. **Cores Limitadas & Significativas**: Máximo 3-4 cores, cada uma com propósito claro
4. **Bordas Limpas**: Linhas finas, sem sombras pesadas, apenas divisões sutis

### Color Philosophy
- **Fundo**: `#f5f5f7` (branco quente, quase cinza claro)
- **Primário**: `#0071e3` (azul profundo, confiável) — ações, acertos
- **Secundário**: `#ff3b30` (vermelho vibrante) — avisos, erros
- **Neutro**: `#1d1d1f` (preto quase puro) — texto
- **Destaque**: `#a2845e` (bege quente) — elementos premium

### Layout Paradigm
- **Grid Simétrico 12-col**: Tabuleiro centralizado, painel lateral equilibrado
- **Breathing Space**: Padding generoso entre elementos
- **Vertical Rhythm**: Espaçamento baseado em múltiplos de 8px

### Signature Elements
1. **Linha Divisória Sutil**: Separadores em cinza muito claro (não preto)
2. **Badges Minimalistas**: Pequenos retângulos com borda fina para status
3. **Tipografia Variada**: Combinação de pesos (300, 500, 700) para hierarquia

### Interaction Philosophy
- Transições suaves (150-250ms)
- Hover = mudança sutil de cor ou elevação (shadow mínima)
- Feedback através de mudança de estado, não animação excessiva
- Foco em clareza e previsibilidade

### Animation
- **Entrada de Peças**: Fade-in suave
- **Limpeza de Linha**: Desvanecimento elegante
- **Pergunta Aparecendo**: Slide suave de baixo para cima
- **Acerto**: Checkmark com animação de desenho
- **Erro**: X com animação de shake mínimo

### Typography System
- **Display/Títulos**: `Inter` (weight 700) — 40-56px
- **Subtítulos**: `Inter` (weight 500) — 20-28px
- **Corpo**: `Inter` (weight 400) — 14-16px
- **Números/Dados**: `IBM Plex Mono` (monoespacial, weight 600) — 24-32px

---

## Resposta 3: Glassmorphism Gradiente - Futurista Suave

**Probabilidade: 0.06**

### Design Movement
Glassmorphism moderno com gradientes suaves. Inspirado em interfaces iOS 15+, design de aplicativos premium.

### Core Principles
1. **Transparência & Blur**: Elementos com fundo translúcido (backdrop-filter)
2. **Gradientes Sutis**: Transições de cor suave (não vibrante, mas elegante)
3. **Profundidade por Camadas**: Múltiplas camadas de transparência criam sensação 3D
4. **Suavidade Total**: Bordas arredondadas, transições fluidas, sem arestas

### Color Philosophy
- **Fundo Base**: Gradiente `#1a1a2e` → `#16213e` (azul-escuro degradê)
- **Primário**: `#00d4ff` (ciano suave, não vibrante) — acertos
- **Secundário**: `#ff6b6b` (coral suave) — erros
- **Glass**: `rgba(255, 255, 255, 0.1)` com blur — cards e painéis
- **Texto**: `#e8e8e8` (branco frio suave)

### Layout Paradigm
- **Overlapping Cards**: Elementos sobrepostos com transparência
- **Centered Composition**: Tabuleiro mais centralizado, com painel flutuante
- **Floating UI**: Botões e cards parecem flutuar sobre o fundo

### Signature Elements
1. **Glass Cards**: Painéis com `backdrop-filter: blur()` e borda sutil
2. **Gradientes Animados**: Fundo com gradiente que muda sutilmente
3. **Orbs/Blobs**: Formas abstratas blurred no fundo (decorativo)

### Interaction Philosophy
- Transições muito suaves (300-400ms)
- Hover = aumento de blur e opacidade
- Feedback visual através de mudança de cor e blur
- Sensação de "fluidez" em todas as interações

### Animation
- **Entrada de Peças**: Fade-in com blur crescente
- **Limpeza de Linha**: Dissolução suave com partículas blurred
- **Pergunta Aparecendo**: Zoom-in com blur, depois focus
- **Acerto**: Pulse suave de cor ciano
- **Erro**: Shake muito suave + mudança de cor coral

### Typography System
- **Display/Títulos**: `Poppins` (weight 700) — 44-60px
- **Corpo**: `Poppins` (weight 400) — 14-16px
- **Números**: `IBM Plex Mono` (weight 500) — 28-40px

---

## Decisão Final

**Escolhida: Cyberpunk Neon - Arcade Futurista**

### Razão
A abordagem cyberpunk neon é a mais **visualmente impactante** e **diferenciada** para um jogo educacional. Ela:
- Cria identidade visual forte e memorável
- Combina perfeitamente com a natureza "arcade" do Tetris
- Oferece feedback visual claro (verde = sucesso, magenta = erro)
- Permite animações elegantes sem parecer infantil
- Diferencia-se de interfaces genéricas

### Implementação
- Fundo escuro (`#0a0e27`)
- Cores neon primárias: verde (`#00ff88`), magenta (`#ff006e`), ciano (`#00d9ff`)
- Tipografia: Courier Prime (títulos), Roboto (corpo)
- Efeitos: Glow, scanlines sutis, animações rápidas
- Layout: Assimétrico com tabuleiro à esquerda, painel lateral direita
