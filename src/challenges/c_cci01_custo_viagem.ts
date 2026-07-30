import type { AnalysisResult, Challenge, ProblemRepresentationDraft } from '../types.ts';
import { createLocalAnalysisResult } from '../domain/pedagogicalDomain.ts';

export const desafioCci01CustoViagem: Challenge = {
  id: 'cci01-custo-viagem',
  categoryId: 'representacao',
  title: 'Planejando o custo de uma viagem',
  subtitle: 'Interprete entradas, cálculos e saídas antes de implementar a estimativa de combustível em C.',
  challengeVersion: '1.0.0',

  metadata: {
    content: 'CCI01. Representação de Problemas Introdutórios',
    language: 'C (ANSI/C99)',
    level: 'Iniciante',
    time: '15 a 20 minutos',
    requirements: 'Representação de entradas, processamento, saídas, sequência lógica e implementação sequencial em C.',
    skill: 'Representar problemas introdutórios por meio de soluções algorítmicas claras.',
    version: '1.0.0'
  },

  pedagogicalMetadata: {
    learningObjective: 'Identificar entradas, cálculos e saídas de um problema e organizar uma sequência algorítmica clara antes de implementar a solução.',
    pedagogicalGoal: 'Mobilizar K01, K03 e K06 para decompor o problema em estado inicial, transformações e resultados esperados.',
    expectedDifficulty: 'baixa',
    cognitiveOperation: 'analisar',
    prerequisites: ['Modelo de execução', 'Variáveis reais', 'Entrada e saída básica', 'Sequência lógica']
  },

  domainTags: {
    skillTags: ['problem-representation', 'input-processing-output', 'decomposition', 'sequence'],
    topicTags: ['cci01', 'basic-c', 'algorithmic-thinking'],
    difficultyTag: 'introductory-representation',
    prerequisiteTags: ['reading-comprehension', 'basic-math']
  },

  problem: `Uma pessoa deseja estimar quanto gastará de combustível em uma viagem de carro.

Para realizar a estimativa, devem ser informados:

- a distância total da viagem, em quilômetros;
- o consumo médio do veículo, em quilômetros por litro;
- o preço do litro do combustível.

O programa deve calcular e apresentar:

1. a quantidade estimada de litros necessária para realizar a viagem;
2. o custo total estimado com combustível.

Antes de escrever o código, identifique os dados de entrada, os cálculos necessários, os resultados que serão apresentados e a ordem correta das ações.`,

  guidingQuestions: [
    'Quais dados precisam existir antes de calcular qualquer resultado?',
    'Qual cálculo transforma distância e consumo em quantidade de litros?',
    'Por que o custo total depende da quantidade de litros já calculada?',
    'Em que ordem as leituras, validação, cálculos e saídas devem acontecer?'
  ],

  orientation: {
    input: 'Distância total da viagem, consumo médio do veículo e preço do litro do combustível.',
    output: 'Quantidade estimada de litros necessária e custo total estimado, ou "Consumo inválido" quando o consumo for menor ou igual a zero.',
    cases: 'Para distância 600, consumo 12 e preço 6.00, os litros são 50.00 e o custo é 300.00. Se o consumo for 0, a saída deve ser "Consumo inválido".',
    structure: 'Representar entradas, processamento, saídas e passos. Em C, ler três valores reais, validar consumo, calcular litros e custo, e exibir os resultados.',
    expectedLogic: 'Ler distância, consumo e preço. Se consumo <= 0, imprimir "Consumo inválido". Caso contrário, calcular litros = distância / consumo e custo = litros * preço. Mostrar litros e custo com duas casas decimais.'
  },

  problemRepresentation: {
    inputs: [
      'distância total da viagem',
      'consumo médio do veículo',
      'preço do litro do combustível'
    ],
    processing: [
      'litros necessários = distância / consumo médio',
      'custo total = litros necessários × preço do combustível'
    ],
    outputs: [
      'quantidade estimada de litros',
      'custo total estimado'
    ],
    steps: [
      'Ler a distância.',
      'Ler o consumo médio.',
      'Ler o preço do combustível.',
      'Verificar se o consumo é válido.',
      'Calcular a quantidade de litros necessária.',
      'Calcular o custo total.',
      'Mostrar a quantidade de litros.',
      'Mostrar o custo total.'
    ]
  },

  examples: [
    { input: '600\n12\n6.00', output: 'Litros necessários: 50.00\nCusto total: 300.00' },
    { input: '350\n10\n5.50', output: 'Litros necessários: 35.00\nCusto total: 192.50' },
    { input: '500\n0\n6.00', output: 'Consumo inválido' }
  ],

  concepts: [
    'Interpretação de enunciado',
    'Entrada, processamento e saída',
    'Decomposição de problema',
    'Sequência lógica',
    'Representação algorítmica'
  ],

  tips: [
    {
      id: 1,
      text: 'Quais informações precisam ser conhecidas antes que qualquer cálculo seja realizado?',
      pedagogicalGoal: 'Separar dados de entrada antes do processamento.'
    },
    {
      id: 2,
      text: 'O consumo informa quantos quilômetros o veículo percorre com um litro. Pense em como descobrir a quantidade de litros para toda a distância.',
      pedagogicalGoal: 'Relacionar distância e consumo médio.'
    },
    {
      id: 3,
      text: 'Primeiro determine a quantidade de litros. Depois utilize esse resultado para calcular o custo.',
      pedagogicalGoal: 'Perceber a dependência entre cálculo intermediário e resultado final.'
    },
    {
      id: 4,
      text: 'Organize a solução como: ler três dados, realizar dois cálculos e apresentar dois resultados.',
      pedagogicalGoal: 'Montar uma sequência algorítmica clara.'
    }
  ],

  commonErrors: [
    {
      title: 'Multiplicar distância pelo consumo',
      description: 'Usar distancia * consumo produz uma unidade incompatível com litros necessários.',
      pedagogicalAdvice: 'O consumo está expresso em quilômetros por litro. Para descobrir os litros necessários, a distância deve ser dividida pelo consumo.'
    },
    {
      title: 'Calcular o custo diretamente com a distância',
      description: 'Multiplicar distância pelo preço ignora que o preço é cobrado por litro.',
      pedagogicalAdvice: 'O preço é dado por litro. Primeiro é necessário descobrir quantos litros serão utilizados.'
    },
    {
      title: 'Ignorar consumo igual a zero',
      description: 'Dividir por consumo zero ou negativo gera uma operação inválida para o problema.',
      pedagogicalAdvice: 'Uma divisão por zero não é válida. Verifique o consumo antes de realizar o cálculo.'
    },
    {
      title: 'Misturar entrada e saída',
      description: 'Tratar litros ou custo como dados lidos confunde resultados calculados com informações fornecidas.',
      pedagogicalAdvice: 'Separe claramente quais dados são recebidos e quais resultados serão calculados e apresentados.'
    }
  ],

  solution: `#include <stdio.h>

int main() {
    float distancia, consumo, preco;
    float litros, custo;

    scanf("%f", &distancia);
    scanf("%f", &consumo);
    scanf("%f", &preco);

    if (consumo <= 0) {
        printf("Consumo inválido\\n");
        return 0;
    }

    litros = distancia / consumo;
    custo = litros * preco;

    printf("Litros necessários: %.2f\\n", litros);
    printf("Custo total: %.2f\\n", custo);

    return 0;
}`,

  finalSummary: [
    'Representação: Identificar entradas, processamento e saídas reduz ambiguidades antes do código.',
    'Sequência: O custo depende do cálculo intermediário de litros.',
    'Validação: Verificar consumo evita divisão por zero.'
  ],

  nextChallengeId: 'cci01-materiais-oficina',

  expectedCriteria: [
    { id: 'crit1', description: 'Identifica corretamente as três entradas', importance: 'essencial' },
    { id: 'crit2', description: 'Representa os dois cálculos necessários', importance: 'essencial' },
    { id: 'crit3', description: 'Diferencia litros necessários e custo total', importance: 'essencial' },
    { id: 'crit4', description: 'Organiza as ações em sequência coerente', importance: 'essencial' },
    { id: 'crit5', description: 'Evita divisão por zero', importance: 'essencial' },
    { id: 'crit6', description: 'Implementa a lógica representada', importance: 'essencial' },
    { id: 'crit7', description: 'Utiliza tipos adequados para valores reais', importance: 'desejável' },
    { id: 'crit8', description: 'Exibe os dois resultados', importance: 'essencial' },
    { id: 'crit9', description: 'Mantém correspondência entre representação e código', importance: 'desejável' },
    { id: 'crit10', description: 'Utiliza nomes de variáveis compreensíveis', importance: 'desejável' },
    { id: 'crit11', description: 'Formata os resultados com duas casas decimais', importance: 'desejável' },
    { id: 'crit12', description: 'Mantém o código organizado e legível', importance: 'desejável' }
  ],

  probableErrors: [
    { id: 'err1', description: 'Multiplicação da distância pelo consumo', likelyCause: 'Interpretação incorreta da unidade quilômetros por litro' },
    { id: 'err2', description: 'Cálculo direto do custo usando distância', likelyCause: 'Ausência do cálculo intermediário de litros' },
    { id: 'err3', description: 'Divisão por zero quando consumo é inválido', likelyCause: 'Falta de validação antes do cálculo' },
    { id: 'err4', description: 'Sequência de leitura, cálculo e saída desalinhada com o enunciado', likelyCause: 'Aluno ainda está consolidando a decomposição do problema em etapas executáveis' }
  ],

  templateCode: `#include <stdio.h>\n\nint main() {\n    // Implemente a solução aqui\n    \n    return 0;\n}`,

  analyzeLocally: (code: string, _representation?: ProblemRepresentationDraft): AnalysisResult => {
    const codeLower = code.toLowerCase();
    const checks = {
      stdio: /#include\s*<\s*stdio\.h\s*>/.test(codeLower),
      main: /int\s+main\s*\(/.test(codeLower),
      realTypes: /\b(float|double)\b/.test(codeLower),
      scanf: (codeLower.match(/scanf\s*\(/g) || []).length >= 3,
      consumptionValidation: /consumo\s*<=\s*0|0\s*>=\s*consumo/.test(codeLower),
      litersCalc: /dist[a-z_]*\s*\/\s*consumo|consumo\s*\)\s*;/.test(codeLower),
      costCalc: /litros\s*\*\s*preco|preco\s*\*\s*litros/.test(codeLower),
      invalidMessage: /consumo inválido/.test(codeLower),
      formattedOutput: /%\.\s*2f|%\.2f/.test(codeLower),
      twoOutputs: /litros necessários/.test(codeLower) && /custo total/.test(codeLower)
    };

    const good: string[] = [];
    const review: string[] = [];
    let score = 0;

    if (checks.realTypes) { good.push('Tipos reais foram usados para os valores com casas decimais.'); score++; }
    else { review.push('Use float ou double para distância, consumo, preço, litros e custo.'); }
    if (checks.scanf) { good.push('As três entradas principais são lidas.'); score += 2; }
    else { review.push('Leia distância, consumo e preço antes dos cálculos.'); }
    if (checks.consumptionValidation && checks.invalidMessage) { good.push('Há validação para consumo inválido.'); score += 2; }
    else { review.push('Antes de dividir, teste se o consumo é menor ou igual a zero e mostre "Consumo inválido".'); }
    if (checks.litersCalc && checks.costCalc) { good.push('Os cálculos de litros e custo aparecem na implementação.'); score += 2; }
    else { review.push('Calcule primeiro litros = distância / consumo e depois custo = litros * preço.'); }
    if (checks.twoOutputs && checks.formattedOutput) { good.push('As duas saídas são apresentadas com duas casas decimais.'); score += 2; }
    else { review.push('Mostre litros e custo com o texto esperado e formatação %.2f.'); }

    if (checks.stdio && checks.main) score++;

    let category: AnalysisResult['category'] = 'tentativa inicial';
    if (score >= 8) category = 'solução adequada';
    else if (score >= 6) category = 'quase completa';
    else if (score >= 4) category = 'parcialmente correta';

    return createLocalAnalysisResult(
      category,
      good,
      review,
      'Verifique se leituras, cálculos e saídas estão alinhados com o enunciado antes de reenviar.',
      'Ajustes na correspondência entre interpretação do problema e implementação',
      ['logica'],
      `Análise heurística CCI01 viagem: ${score}/9 pontos.`
    );
  }
};
