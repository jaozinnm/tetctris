/**
 * TECTRIS - Questions Module
 * 
 * Sistema de perguntas de lógica de programação em C
 * Perguntas de nível iniciante/intermediário
 * Formato: pergunta curta + 3 alternativas + 1 correta
 */

export const questions = [
  {
    id: 1,
    question: "Qual é a saída do código abaixo?\nint x = 5;\nprintf(\"%d\", x * 2 + 3);",
    options: ["10", "13", "8"],
    correct: 1, // índice 1 = "13"
    difficulty: "easy"
  },
  {
    id: 2,
    question: "Quantas vezes o loop executa?\nfor(int i = 0; i < 5; i++) { }",
    options: ["4 vezes", "5 vezes", "6 vezes"],
    correct: 1, // "5 vezes"
    difficulty: "easy"
  },
  {
    id: 3,
    question: "Qual é o valor de x após?\nint x = 10;\nif (x > 5) x = x - 3;",
    options: ["10", "7", "5"],
    correct: 1, // "7"
    difficulty: "easy"
  },
  {
    id: 4,
    question: "O que faz este código?\nint arr[3] = {1, 2, 3};\narr[1] = 5;",
    options: ["Muda o primeiro elemento", "Muda o segundo elemento", "Cria um novo array"],
    correct: 1, // "Muda o segundo elemento"
    difficulty: "easy"
  },
  {
    id: 5,
    question: "Qual operador retorna o resto da divisão?",
    options: ["/", "%", "//"],
    correct: 1, // "%"
    difficulty: "easy"
  },
  {
    id: 6,
    question: "Qual é a saída?\nint x = 5, y = 3;\nprintf(\"%d\", x > y ? 10 : 20);",
    options: ["20", "10", "5"],
    correct: 1, // "10"
    difficulty: "medium"
  },
  {
    id: 7,
    question: "Quantas vezes imprime 'x'?\nfor(int i = 0; i < 3; i++)\n  for(int j = 0; j < 2; j++)\n    printf(\"x\");",
    options: ["5 vezes", "6 vezes", "3 vezes"],
    correct: 1, // "6 vezes"
    difficulty: "medium"
  },
  {
    id: 8,
    question: "Qual é o valor de x?\nint x = 2;\nx = x * 3 + 1;",
    options: ["6", "7", "5"],
    correct: 1, // "7"
    difficulty: "easy"
  },
  {
    id: 9,
    question: "O que retorna 1 (verdadeiro)?\nint x = 5, y = 5;",
    options: ["x > y", "x == y", "x < y"],
    correct: 1, // "x == y"
    difficulty: "easy"
  },
  {
    id: 10,
    question: "Qual é a saída?\nint x = 0;\nfor(int i = 1; i <= 3; i++)\n  x += i;",
    options: ["3", "6", "5"],
    correct: 1, // "6"
    difficulty: "medium"
  },
  {
    id: 11,
    question: "Qual variável armazena um endereço de memória?",
    options: ["int", "char", "int*"],
    correct: 2, // "int*"
    difficulty: "medium"
  },
  {
    id: 12,
    question: "Qual é o tamanho padrão de um int em C?",
    options: ["1 byte", "2 bytes", "4 bytes"],
    correct: 2, // "4 bytes"
    difficulty: "medium"
  },
  {
    id: 13,
    question: "O que faz break em um loop?",
    options: ["Pausa a execução", "Sai do loop", "Reinicia o loop"],
    correct: 1, // "Sai do loop"
    difficulty: "easy"
  },
  {
    id: 14,
    question: "Qual é a saída?\nint arr[] = {10, 20, 30};\nprintf(\"%d\", arr[2]);",
    options: ["10", "20", "30"],
    correct: 2, // "30"
    difficulty: "easy"
  },
  {
    id: 15,
    question: "Qual operador lógico representa E (AND)?",
    options: ["|", "&&", "||"],
    correct: 1, // "&&"
    difficulty: "easy"
  },
  {
    id: 16,
    question: "Qual é a saída?\nint x = 5;\nprintf(\"%d\", ++x);",
    options: ["5", "6", "7"],
    correct: 1, // "6"
    difficulty: "medium"
  },
  {
    id: 17,
    question: "O que faz continue em um loop?",
    options: ["Sai do loop", "Pula para próxima iteração", "Pausa a execução"],
    correct: 1, // "Pula para próxima iteração"
    difficulty: "easy"
  },
  {
    id: 18,
    question: "Qual é o valor de x?\nint x = 10;\nint y = x++;\n",
    options: ["y=10, x=11", "y=11, x=10", "y=10, x=10"],
    correct: 0, // "y=10, x=11"
    difficulty: "medium"
  },
  {
    id: 19,
    question: "Qual função retorna o tamanho de um tipo?",
    options: ["length()", "size()", "sizeof()"],
    correct: 2, // "sizeof()"
    difficulty: "medium"
  },
  {
    id: 20,
    question: "Qual é a saída?\nint x = 0;\nwhile(x < 3) {\n  printf(\"%d\", x);\n  x++;\n}",
    options: ["012", "123", "0123"],
    correct: 0, // "012"
    difficulty: "medium"
  }
];

/**
 * Retorna uma pergunta aleatória do banco
 */
export function getRandomQuestion() {
  const randomIndex = Math.floor(Math.random() * questions.length);
  return questions[randomIndex];
}

/**
 * Retorna N perguntas aleatórias (sem repetição)
 */
export function getRandomQuestions(count) {
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, questions.length));
}

/**
 * Valida se a resposta está correta
 */
export function validateAnswer(question, selectedIndex) {
  return selectedIndex === question.correct;
}

/**
 * Retorna a resposta correta de uma pergunta
 */
export function getCorrectAnswer(question) {
  return question.options[question.correct];
}
