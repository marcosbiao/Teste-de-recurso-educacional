import type { Challenge, AnalysisResult } from '../types.ts';
import { createLocalAnalysisResult } from '../domain/pedagogicalDomain.ts';

export const desafioMatrizesContarPares: Challenge = {
  id: 'matrizes_contar_pares',
  categoryId: 'matrizes',
  title: 'Contar números pares na matriz',
  subtitle: 'Escreva um programa em C que leia os valores de uma matriz 3x3 de inteiros, conte quantos números pares ela possui e mostre esse total ao final.',
  challengeVersion: '1.0.0',
  
  metadata: {
    content: 'Matrizes Bidimensionais e Estatística de Paridade',
    language: 'C (ANSI/C99)',
    level: 'Intermediário',
    time: '20 minutos',
    requirements: 'Declaração de matriz 3x3 inteiro, loops aninhados de varredura, teste relacional modular, acumuladores.',
    skill: 'Combinar loops duplos com testes de divisibilidade matemática para classificação bidimensional.',
    version: '1.0.0'
  },

  pedagogicalMetadata: {
    learningObjective: 'Utilizar laços aninhados em C para percorrer todos os elementos de uma matriz 3x3, aplicando filtros lógicos de paridade em cada posição.',
    pedagogicalGoal: 'Compreender o percurso bidimensional exaustivo emparelhado com contagem condicionada por resto divisório.',
    expectedDifficulty: 'media',
    cognitiveOperation: 'aplicar',
    prerequisites: ['Declaração de Matrizes', 'Loops Aninhados (for/while)', 'Operador Módulo (%)', 'Estruturas de Decisão (if)']
  },

  domainTags: {
    skillTags: ['matrices', 'arrays', 'loops', 'conditionals'],
    topicTags: ['basic-c', 'data-structures', 'math-logic'],
    difficultyTag: 'medium-complexity-logic',
    prerequisiteTags: ['basic-syntax', 'loops', 'arrays']
  },

  problem: 'Escreva um programa em C que leia do teclado os valores inteiros necessários para preencher uma matriz 3x3 (3 linhas e 3 colunas). Após preencher toda a tabela, percorra a matriz de ponta a ponta contando quantos elementos pares estão guardados nela. Ao final, apresente essa quantidade no console.',
  
  guidingQuestions: [
    'Como declarar uma matriz bidimensional de inteiros com 3 linhas e 3 colunas?',
    'Como configurar dois loops aninhados (i de 0 a 2, j de 0 a 2) para ler os 9 valores do teclado usando scanf?',
    'Como testar se o elemento localizado nas coordenadas `matriz[i][j]` é divisível por 2?',
    'Qual valor de inicialização deve ser atribuído ao contador antes de iniciar a contagem bidimensional?'
  ],

  orientation: {
    input: '9 números inteiros separados por espaços ou quebras de linhas.',
    output: 'A quantidade total de elementos que atendem à regra de paridade contidos em toda a matriz.',
    cases: 'Se as entradas forem: 1 2 3, 4 5 6, 7 8 10; os pares são 2, 4, 6, 8 e 10, produzindo o total 5.',
    structure: 'Declaração de matriz 3x3. Loops duplos aninhados para preenchimento. Inicialização de contador pares = 0. Segundo loop duplo aninhado de varredura (ou computado dentro do primeiro) aplicando if (matriz[i][j] % 2 == 0) pares++. Printf isolado pós-laço.',
    expectedLogic: 'Criar int m[3][3], i, j, pares = 0. Rodar loop duplo recolhendo dados em &m[i][j]. Avaliar if (m[i][j] % 2 == 0) pares++. Printar pares.'
  },

  examples: [
    { input: '1 2 3 4 5 6 7 8 10', output: 'Total de pares: 5' },
    { input: '1 3 5 7 9 11 13 15 17', output: 'Total de pares: 0' }
  ],

  concepts: [
    'Acesso matricial bi-indexado por coordenadas (linha, coluna)',
    'Filtragem condicional bidimensional exaustiva',
    'Acumulação estatística por paridade'
  ],

  tips: [
    { 
      id: 1, 
      text: "Instancie a matriz inteira usando: 'int matriz[3][3];'. Garanta também uma variável contadora: 'int pares = 0;'.",
      pedagogicalGoal: "Definir com precisão tipos de matrizes e contadores."
    },
    { 
      id: 2, 
      text: "Utilize loops duplos aninhados (i variando de 0 a 2, j variando de 0 a 2) para ler com scanf: 'scanf(\"%d\", &matriz[i][j]);'.",
      pedagogicalGoal: "Fixar a fase de captação aninhada bidimensional."
    },
    { 
      id: 3, 
      text: "Para varrer a matriz e verificar paridade, você pode colocar o if dentro do próprio loop duplo. Faça: 'if (matriz[i][j] % 2 == 0)'.",
      pedagogicalGoal: "Aplicar teste de módulo em coordenadas bidimensionais."
    },
    { 
      id: 4, 
      text: "Sempre incremente seu contador de pares ('pares++') quando a pariedade retornar verdadeira. Mostre o resultado ao concluir tudo, fora dos laços.",
      pedagogicalGoal: "Localizar e gerir incrementos de buffers de contagem."
    }
  ],

  commonErrors: [
    { 
      title: "Esquecer de inicializar a variável de contagem", 
      description: "Deixar 'pares' sem atribuição inicial acumulará ruídos de RAM, gerando saídas falsas e variáveis instáveis.",
      pedagogicalAdvice: "Tome a firme disciplina de inicializar com zero todo acumulador ou contador criado no escopo."
    },
    { 
      title: "Escrever loops aninhados com a mesma variável iteradora", 
      description: "Escrever 'for(i=0; i<3; i++)' no externo e 'for(i=0; i<3; i++)' no interno estragará completamente o fluxo lógico das estruturas de repetição aninhadas.",
      pedagogicalAdvice: "Cada laço aninhado requer um identificador de iterador individualizado e exclusivo, por exemplo 'i' no externo e 'j' no interno."
    },
    { 
      title: "Confundir coordenadas colchete único", 
      description: "Tentar indexar como matriz[i, j] causará quebra de compilação C.",
      pedagogicalAdvice: "Cada dimensão exige um colchete próprio separado. Digite matriz[i][j]."
    },
    { 
      title: "Printf final dentro do corpo aninhado", 
      description: "Colocar a instrução de visualização final dentro dos laços poluíra o console, expondo saídas consecutivas intermináveis.",
      pedagogicalAdvice: "Comandos resolutivos e sintetizados de saída devem se posicionar após o desengajamento completo de todos os loops."
    }
  ],

  solution: `#include <stdio.h>

int main() {
    int matriz[3][3];
    int i, j, pares = 0;

    // Leitura dos dados da matriz 3x3
    for (i = 0; i < 3; i++) {
        for (j = 0; j < 3; j++) {
            scanf("%d", &matriz[i][j]);
        }
    }

    // Varredura exaustiva computando elementos de paridade
    for (i = 0; i < 3; i++) {
        for (j = 0; j < 3; j++) {
            if (matriz[i][j] % 2 == 0) {
                pares++; // Acumula elemento par
            }
        }
    }

    printf("Total de pares: %d\\n", pares);

    return 0;
}`,

  finalSummary: [
    'Análise Bidimensional: O uso coordenado de loops aninhados permite examinar exaustivamente qualquer tabela bidimensional de maneira metódica.',
    'Testes Modulares: O operador modular % 2 estuda as características internas de paridade com precisão computacional.',
    'Foco de Escopo: Posicionar contadores iniciais e resultados de saídas após o término de repetições resguarda a fidelidade de fluxos.'
  ],

  nextChallengeId: 'matrizes_maior_valor',

  expectedCriteria: [
    { id: 'crit1', description: 'Declaração correta de matriz de tamanho 3x3 inteira', importance: 'essencial' },
    { id: 'crit2', description: 'Inicialização segura de contadores com valor nulo zero', importance: 'essencial' },
    { id: 'crit3', description: 'Uso de dois laços de repetição aninhados com iteradores separados (ex: i, j)', importance: 'essencial' },
    { id: 'crit4', description: 'Verificação correta de paridade com operador modular (matriz[i][j] % 2 == 0)', importance: 'essencial' },
    { id: 'crit5', description: 'Incremento correto do contador e printf posicionado externamente aos blocos repetidores', importance: 'essencial' }
  ],

  probableErrors: [
    { id: 'err1', description: 'Conflito de iterador comum de laço', likelyCause: 'Usar i no laço interno e também no laço externo de controle' },
    { id: 'err2', description: 'Saída com lixo por contador instável', likelyCause: 'Omitir atribuição de valor nulo no início do contador de pares' },
    { id: 'err3', description: 'Impressão tumultuada no terminal', likelyCause: 'Alocar printf de saldo dentro das chaves de repetição interna' }
  ],

  templateCode: `#include <stdio.h>\n\nint main() {\n    // Seu código aqui\n    \n    return 0;\n}`,
  
  analyzeLocally: (code: string): AnalysisResult => {
    const codeLower = code.toLowerCase();
    const checks = {
      stdio: /#include\s*<\s*stdio\.h\s*>/.test(codeLower),
      main: /int\s+main\s*\(/.test(codeLower),
      loops: /\b(for|while)\b/.test(codeLower),
      doubleLoop: /(for|while)[\s\S]*?(for|while)/.test(codeLower),
      matrixDeclaration: /int\s+[a-zA-Z_][a-zA-Z0-9_]*\s*\[\s*3\s*\]\s*\[\s*3\s*\]/.test(codeLower),
      modCheck: /%\s*2\s*==\s*0/.test(codeLower),
      initZero: /(pares|paresCount|pares_tot|cont)\s*=\s*0\b/.test(codeLower),
      printf: /printf\s*\(/.test(codeLower)
    };

    const good: string[] = [];
    const review: string[] = [];
    let score = 0;

    if (checks.stdio) { good.push("Configuração do arquivo de cabeçalho de saída stdio.h presente."); score++; }
    else { review.push("Diga #include <stdio.h>."); }

    if (checks.main) { good.push("Int main() presente."); score++; }
    else { review.push("Assinale int main() em seu código."); }

    if (checks.matrixDeclaration) { good.push("Matriz 3x3 declarada com precisão de tamanho."); score += 3; }
    else { review.push("Declare sua matriz com tamanho 3x3, por exemplo: int m[3][3];"); }

    if (checks.doubleLoop) { good.push("Dois laços aninhados mapeados com sucesso."); score += 2; }
    else { review.push("Vá nos loops declarando-os aninhados para cobrir as dimensões de linha e coluna."); }

    if (checks.modCheck) { good.push("Teste modular de busca por paridade ativo."); score += 1; }
    else { review.push("Filtre o elemento examinando o resto da divisão por 2: matriz[i][j] % 2 == 0."); }

    if (checks.initZero) { good.push("Contador de pares inicializado com total integridade."); score += 1; }
    else { review.push("Projete a criação do contador de pares associado a uma inicialização em zero."); }

    if (checks.printf) { score++; }

    let category: AnalysisResult['category'] = 'tentativa inicial';
    if (score >= 9) category = 'solução adequada';
    else if (score >= 6) category = 'quase completa';
    else if (score >= 3) category = 'parcialmente correta';

    let difficulty = "Dificuldade em gerenciar filtros de condições em matrizes 2D";
    if (!checks.matrixDeclaration) difficulty = "Sem declaração de matriz 3x3";
    else if (!checks.doubleLoop) difficulty = "Sem laço duplo aninhado de preenchimento";
    else if (!checks.modCheck) difficulty = "Sem teste de paridade modular";

    let nextStep = "Comece com int m[3][3], pares = 0 e um laço aninhado para colher entradas.";
    if (category === 'parcialmente correta') nextStep = "Adicione um if (m[i][j] % 2 == 0) incrementando seu contador dentro dos laços.";
    if (category === 'quase completa') nextStep = "Retire o printf de dentro dos loops, exibindo o resultado único no encerramento externo.";
    if (category === 'solução adequada') nextStep = "Incrível! Compreendeu com alta fidelidade lógica os filtros bidimensionais estruturados.";

    return createLocalAnalysisResult(
      category,
      good,
      review,
      nextStep,
      difficulty,
      checks.doubleLoop ? ['logica'] : ['sintaxe_aparente'],
      `Análise Heurística da Paridade Bidimensional: ${score}/10 pontos.`
    );
  }
};
