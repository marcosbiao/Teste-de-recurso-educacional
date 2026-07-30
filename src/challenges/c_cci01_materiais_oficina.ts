import type { AnalysisResult, Challenge, ProblemRepresentationDraft } from '../types.ts';
import { createLocalAnalysisResult } from '../domain/pedagogicalDomain.ts';

export const desafioCci01MateriaisOficina: Challenge = {
  id: 'cci01-materiais-oficina',
  categoryId: 'representacao',
  title: 'Organizando os materiais para uma oficina',
  subtitle: 'Decomponha a distribuição de materiais em entrada, cálculos, saídas e sequência lógica antes do código.',
  challengeVersion: '1.0.0',

  metadata: {
    content: 'CCI01. Representação de Problemas Introdutórios',
    language: 'C (ANSI/C99)',
    level: 'Iniciante',
    time: '15 a 20 minutos',
    requirements: 'Representação algorítmica, variáveis inteiras, validação simples, cálculos sequenciais e saída formatada.',
    skill: 'Representar problemas introdutórios por meio de soluções algorítmicas claras.',
    version: '1.0.0'
  },

  pedagogicalMetadata: {
    learningObjective: 'Decompor um problema em partes menores, reconhecer relações entre uma entrada e múltiplas saídas e representar a sequência completa da solução.',
    pedagogicalGoal: 'Evidenciar como uma única entrada pode gerar diferentes resultados por regras simples de processamento.',
    expectedDifficulty: 'baixa',
    cognitiveOperation: 'analisar',
    prerequisites: ['Modelo de execução', 'Variáveis inteiras', 'Entrada e saída básica', 'Operações aritméticas simples']
  },

  domainTags: {
    skillTags: ['problem-representation', 'decomposition', 'input-processing-output', 'sequence'],
    topicTags: ['cci01', 'basic-c', 'algorithmic-thinking'],
    difficultyTag: 'introductory-representation',
    prerequisiteTags: ['reading-comprehension', 'integer-arithmetic']
  },

  problem: `Uma professora realizará uma oficina com um grupo de estudantes.

Cada estudante deverá receber:

- duas folhas de atividade;
- um lápis;
- uma borracha.

A professora informa a quantidade de estudantes que participarão da oficina.

O programa deve determinar:

1. a quantidade total de folhas necessárias;
2. a quantidade total de lápis;
3. a quantidade total de borrachas;
4. a quantidade total de materiais que serão distribuídos.

Antes de escrever o código, organize a solução indicando qual informação precisa ser recebida, quais cálculos devem ser realizados, quais resultados devem ser apresentados e em que ordem as ações devem acontecer.`,

  guidingQuestions: [
    'Qual é a única informação que muda de uma oficina para outra?',
    'Quais materiais precisam ser calculados separadamente?',
    'Por que folhas, lápis e borrachas geram quantidades diferentes?',
    'Como calcular o total geral depois dos subtotais?'
  ],

  orientation: {
    input: 'Quantidade de estudantes que participarão da oficina.',
    output: 'Total de folhas, lápis, borrachas e total geral de materiais, ou "Quantidade inválida" quando a quantidade for menor ou igual a zero.',
    cases: 'Para 10 estudantes, são necessárias 20 folhas, 10 lápis, 10 borrachas e 40 materiais no total.',
    structure: 'Representar a entrada, calcular separadamente cada material, somar os subtotais e mostrar os quatro resultados.',
    expectedLogic: 'Ler a quantidade de estudantes. Se estudantes <= 0, imprimir "Quantidade inválida". Caso contrário, calcular folhas = estudantes * 2, lapis = estudantes, borrachas = estudantes e total = folhas + lapis + borrachas. Mostrar os quatro resultados.'
  },

  problemRepresentation: {
    inputs: ['quantidade de estudantes'],
    processing: [
      'total de folhas = quantidade de estudantes × 2',
      'total de lápis = quantidade de estudantes',
      'total de borrachas = quantidade de estudantes',
      'total geral = total de folhas + total de lápis + total de borrachas'
    ],
    outputs: [
      'total de folhas',
      'total de lápis',
      'total de borrachas',
      'total geral de materiais'
    ],
    steps: [
      'Ler a quantidade de estudantes.',
      'Verificar se a quantidade é válida.',
      'Calcular o total de folhas.',
      'Determinar o total de lápis.',
      'Determinar o total de borrachas.',
      'Calcular o total geral.',
      'Mostrar os quatro resultados.'
    ]
  },

  examples: [
    { input: '10', output: 'Folhas: 20\nLápis: 10\nBorrachas: 10\nTotal de materiais: 40' },
    { input: '25', output: 'Folhas: 50\nLápis: 25\nBorrachas: 25\nTotal de materiais: 100' },
    { input: '0', output: 'Quantidade inválida' }
  ],

  concepts: [
    'Interpretação de enunciado',
    'Entrada, processamento e saída',
    'Decomposição',
    'Sequência lógica',
    'Representação algorítmica'
  ],

  tips: [
    {
      id: 1,
      text: 'Qual é a única informação que varia de uma oficina para outra?',
      pedagogicalGoal: 'Identificar a entrada principal.'
    },
    {
      id: 2,
      text: 'Calcule separadamente a quantidade de folhas, lápis e borrachas.',
      pedagogicalGoal: 'Decompor o problema em subtotais.'
    },
    {
      id: 3,
      text: 'Cada estudante recebe dois tipos de materiais em quantidade igual a 1 e folhas em quantidade igual a 2.',
      pedagogicalGoal: 'Relacionar a entrada com múltiplas saídas.'
    },
    {
      id: 4,
      text: 'Depois de calcular cada tipo de material, some as três quantidades.',
      pedagogicalGoal: 'Construir o total geral a partir dos subtotais.'
    }
  ],

  commonErrors: [
    {
      title: 'Considerar apenas uma folha por estudante',
      description: 'Calcular folhas = estudantes ignora que cada estudante recebe duas folhas.',
      pedagogicalAdvice: 'O enunciado informa que cada estudante recebe duas folhas. Esse valor precisa participar do cálculo.'
    },
    {
      title: 'Somar estudantes em vez de materiais',
      description: 'Repetir a quantidade de estudantes como total geral não soma todos os itens distribuídos.',
      pedagogicalAdvice: 'O total geral deve somar folhas, lápis e borrachas, e não apenas repetir a quantidade de estudantes.'
    },
    {
      title: 'Não separar os resultados',
      description: 'Mostrar apenas o total geral deixa de apresentar as quantidades de cada material.',
      pedagogicalAdvice: 'O problema solicita a quantidade de cada material e também o total geral.'
    },
    {
      title: 'Aceitar quantidade inválida',
      description: 'Permitir zero ou valores negativos produz uma oficina sem sentido prático.',
      pedagogicalAdvice: 'Uma oficina não pode ser organizada para uma quantidade igual ou menor que zero.'
    }
  ],

  solution: `#include <stdio.h>

int main() {
    int estudantes;
    int folhas, lapis, borrachas, total;

    scanf("%d", &estudantes);

    if (estudantes <= 0) {
        printf("Quantidade inválida\\n");
        return 0;
    }

    folhas = estudantes * 2;
    lapis = estudantes;
    borrachas = estudantes;
    total = folhas + lapis + borrachas;

    printf("Folhas: %d\\n", folhas);
    printf("Lápis: %d\\n", lapis);
    printf("Borrachas: %d\\n", borrachas);
    printf("Total de materiais: %d\\n", total);

    return 0;
}`,

  finalSummary: [
    'Decomposição: Um problema com uma entrada pode gerar vários subtotais.',
    'Sequência: Calcular subtotais antes do total geral deixa a lógica clara.',
    'Validação: Quantidades iguais ou menores que zero devem ser tratadas antes dos cálculos.'
  ],

  nextChallengeId: 'desafio1_condicionais_basico',

  expectedCriteria: [
    { id: 'crit1', description: 'Identifica a quantidade de estudantes como entrada', importance: 'essencial' },
    { id: 'crit2', description: 'Reconhece que cada estudante recebe duas folhas', importance: 'essencial' },
    { id: 'crit3', description: 'Representa corretamente as quantidades de lápis e borrachas', importance: 'essencial' },
    { id: 'crit4', description: 'Calcula corretamente o total geral', importance: 'essencial' },
    { id: 'crit5', description: 'Organiza as etapas em sequência lógica', importance: 'essencial' },
    { id: 'crit6', description: 'Implementa o código de acordo com a representação', importance: 'essencial' },
    { id: 'crit7', description: 'Utiliza variáveis inteiras', importance: 'desejável' },
    { id: 'crit8', description: 'Valida a quantidade de estudantes', importance: 'desejável' },
    { id: 'crit9', description: 'Apresenta as quatro saídas', importance: 'desejável' },
    { id: 'crit10', description: 'Mantém correspondência entre dados, cálculos e resultados', importance: 'desejável' },
    { id: 'crit11', description: 'Utiliza nomes de variáveis claros', importance: 'desejável' },
    { id: 'crit12', description: 'Evita cálculos ou variáveis desnecessárias', importance: 'desejável' }
  ],

  probableErrors: [
    { id: 'err1', description: 'Cálculo de apenas uma folha por estudante', likelyCause: 'Leitura incompleta da regra de distribuição' },
    { id: 'err2', description: 'Total geral igual à quantidade de estudantes', likelyCause: 'Confusão entre entrada e soma de materiais' },
    { id: 'err3', description: 'Ausência de uma ou mais saídas solicitadas', likelyCause: 'Foco no total geral sem decompor subtotais' },
    { id: 'err4', description: 'Subtotais ou total geral não correspondem ao que o enunciado pede', likelyCause: 'Aluno ainda está consolidando a decomposição do problema em cálculos independentes' }
  ],

  templateCode: `#include <stdio.h>\n\nint main() {\n    // Implemente a solução aqui\n    \n    return 0;\n}`,

  analyzeLocally: (code: string, _representation?: ProblemRepresentationDraft): AnalysisResult => {
    const codeLower = code.toLowerCase();
    const checks = {
      stdio: /#include\s*<\s*stdio\.h\s*>/.test(codeLower),
      main: /int\s+main\s*\(/.test(codeLower),
      intTypes: /\bint\b/.test(codeLower),
      scanf: /scanf\s*\(/.test(codeLower),
      validation: /estudantes\s*<=\s*0|0\s*>=\s*estudantes/.test(codeLower),
      invalidMessage: /quantidade inválida/.test(codeLower),
      folhasCalc: /folhas\s*=\s*estudantes\s*\*\s*2|folhas\s*=\s*2\s*\*\s*estudantes/.test(codeLower),
      lapisCalc: /lapis\s*=\s*estudantes/.test(codeLower),
      borrachasCalc: /borrachas\s*=\s*estudantes/.test(codeLower),
      totalCalc: /total\s*=\s*folhas\s*\+\s*lapis\s*\+\s*borrachas/.test(codeLower),
      allOutputs: /folhas:/.test(codeLower) && /lápis:/.test(codeLower) && /borrachas:/.test(codeLower) && /total de materiais:/.test(codeLower)
    };

    const good: string[] = [];
    const review: string[] = [];
    let score = 0;

    if (checks.intTypes) { good.push('Variáveis inteiras aparecem na solução.'); score++; }
    else { review.push('Use variáveis inteiras para estudantes e quantidades de materiais.'); }
    if (checks.scanf) { good.push('A quantidade de estudantes é lida.'); score += 1; }
    else { review.push('Leia a quantidade de estudantes com scanf.'); }
    if (checks.validation && checks.invalidMessage) { good.push('A quantidade inválida é tratada antes dos cálculos.'); score += 2; }
    else { review.push('Valide estudantes <= 0 e mostre "Quantidade inválida".'); }
    if (checks.folhasCalc && checks.lapisCalc && checks.borrachasCalc) { good.push('Os subtotais dos materiais foram decompostos corretamente.'); score += 3; }
    else { review.push('Calcule folhas, lápis e borrachas separadamente.'); }
    if (checks.totalCalc) { good.push('O total geral soma os três materiais.'); score += 1; }
    else { review.push('Some folhas, lápis e borrachas para obter o total de materiais.'); }
    if (checks.allOutputs) { good.push('As quatro saídas solicitadas aparecem no código.'); score += 2; }
    else { review.push('Mostre folhas, lápis, borrachas e total de materiais.'); }
    if (checks.stdio && checks.main) score++;

    let category: AnalysisResult['category'] = 'tentativa inicial';
    if (score >= 8) category = 'solução adequada';
    else if (score >= 6) category = 'quase completa';
    else if (score >= 4) category = 'parcialmente correta';

    return createLocalAnalysisResult(
      category,
      good,
      review,
      'Confira se cada subtotal e o total geral correspondem exatamente ao que o enunciado pede.',
      'Ajustes de correspondência entre decomposição do problema e implementação',
      ['logica'],
      `Análise heurística CCI01 oficina: ${score}/10 pontos.`
    );
  }
};
