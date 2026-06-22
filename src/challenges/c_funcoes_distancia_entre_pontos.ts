import type { Challenge, AnalysisResult, ErrorType } from '../types.ts';
import { createLocalAnalysisResult } from '../domain/pedagogicalDomain.ts';

export const desafioFuncoesDistanciaEntrePontos: Challenge = {
  id: 'funcoes_distancia_entre_pontos',
  categoryId: 'funcoes',
  title: 'Distância entre dois pontos com função float',
  subtitle: 'Escreva uma função em C que receba as coordenadas de dois pontos e retorne a distância entre eles usando valores float.',
  challengeVersion: '1.0.0',
  
  metadata: {
    content: 'Funções com retorno float e expressão matemática',
    language: 'C (ANSI/C99)',
    level: 'Intermediário',
    time: '20 minutos',
    requirements: 'Função com quatro parâmetros float, cálculo de diferenças entre coordenadas, uso de sqrt e retorno float.',
    skill: 'Implementar função matemática modular com parâmetros e retorno em ponto flutuante.',
    version: '1.0.0'
  },

  pedagogicalMetadata: {
    learningObjective: 'Implementar uma função em C que calcule e retorne a distância entre dois pontos no plano cartesiano.',
    pedagogicalGoal: 'Consolidar o uso de parâmetros float, retorno float e expressão matemática dentro de uma função.',
    expectedDifficulty: 'media',
    cognitiveOperation: 'aplicar',
    prerequisites: [
      'Variáveis float',
      'Funções com parâmetros',
      'Retorno com return',
      'Expressões aritméticas',
      'Biblioteca math.h',
      'Função sqrt'
    ]
  },

  domainTags: {
    skillTags: ['functions', 'float', 'parameters', 'return', 'math-expression'],
    topicTags: ['basic-c', 'modularization', 'math', 'functions'],
    difficultyTag: 'medium-math-function',
    prerequisiteTags: ['basic-syntax', 'arithmetic', 'functions', 'float']
  },

  problem: 'Escreva uma função que calcule e retorne a distância entre dois pontos (x1, y1) e (x2, y2). Todos os números e valores de retorno devem ser do tipo float.',
  
  guidingQuestions: [
    'Quais coordenadas a função precisa receber?',
    'Por que todos os parâmetros devem ser float?',
    'Por que o retorno da função também deve ser float?',
    'Como calcular a diferença entre as coordenadas x e y?',
    'Por que a raiz quadrada é necessária na fórmula da distância?'
  ],

  orientation: {
    input: 'Quatro valores float representando x1, y1, x2 e y2.',
    output: 'Um valor float correspondente à distância entre os dois pontos.',
    cases: 'Entre os pontos (0, 0) e (3, 4), a distância deve ser 5.00.',
    structure: 'A função recebe x1, y1, x2 e y2. Calcula dx = x2 - x1 e dy = y2 - y1. Depois calcula sqrt(dx * dx + dy * dy) e retorna esse valor.',
    expectedLogic: 'Declarar dx, dy e distancia como float. Calcular as diferenças entre as coordenadas. Somar os quadrados das diferenças. Aplicar sqrt. Retornar a distância calculada.'
  },

  examples: [
    {
      input: '0 0 3 4',
      output: '5.00',
      description: 'A distância forma o caso clássico 3, 4 e 5.'
    },
    {
      input: '1 2 1 2',
      output: '0.00',
      description: 'Quando os dois pontos são iguais, a distância é zero.'
    }
  ],

  concepts: [
    'Função com quatro parâmetros',
    'Retorno float',
    'Distância euclidiana',
    'Diferença entre coordenadas',
    'Uso de sqrt',
    'Biblioteca math.h'
  ],

  tips: [
    {
      id: 1,
      text: 'A função precisa receber quatro valores: x1, y1, x2 e y2.',
      pedagogicalGoal: 'Reforçar a identificação dos parâmetros necessários.'
    },
    {
      id: 2,
      text: 'Todos os parâmetros e o retorno devem ser float, porque coordenadas e distâncias podem ter casas decimais.',
      pedagogicalGoal: 'Evitar uso indevido de int.'
    },
    {
      id: 3,
      text: 'Calcule primeiro dx = x2 - x1 e dy = y2 - y1. Isso deixa a fórmula mais clara.',
      pedagogicalGoal: 'Organizar a expressão matemática em partes menores.'
    },
    {
      id: 4,
      text: 'A distância é a raiz quadrada da soma dos quadrados das diferenças: sqrt(dx * dx + dy * dy).',
      pedagogicalGoal: 'Conectar a expressão em C com a fórmula matemática.'
    },
    {
      id: 5,
      text: 'Para usar sqrt, inclua math.h. Em alguns ambientes, a compilação pode precisar de gcc arquivo.c -lm.',
      pedagogicalGoal: 'Antecipar detalhe técnico comum ao usar biblioteca matemática em C.'
    }
  ],

  commonErrors: [
    {
      title: 'Usar int nos parâmetros',
      description: 'O enunciado exige que todos os números sejam do tipo float.',
      pedagogicalAdvice: 'Declare x1, y1, x2 e y2 como float.'
    },
    {
      title: 'Declarar a função como void',
      description: 'A função precisa retornar a distância calculada.',
      pedagogicalAdvice: 'Use float como tipo de retorno e finalize com return.'
    },
    {
      title: 'Esquecer um dos quatro parâmetros',
      description: 'Dois pontos no plano precisam de quatro coordenadas.',
      pedagogicalAdvice: 'A assinatura deve receber x1, y1, x2 e y2.'
    },
    {
      title: 'Somar dx e dy diretamente',
      description: 'A distância não é calculada por dx + dy.',
      pedagogicalAdvice: 'Use a soma dos quadrados das diferenças e depois aplique sqrt.'
    },
    {
      title: 'Esquecer a raiz quadrada',
      description: 'dx * dx + dy * dy representa o quadrado da distância, não a distância final.',
      pedagogicalAdvice: 'Aplique sqrt ao resultado da soma dos quadrados.'
    },
    {
      title: 'Imprimir dentro da função',
      description: 'O enunciado pede uma função que calcule e retorne a distância.',
      pedagogicalAdvice: 'A função deve retornar o valor, não fazer printf.'
    }
  ],

  solution: `#include <math.h>
#include <stdio.h>

float calcularDistancia(float x1, float y1, float x2, float y2) {
    float dx, dy, distancia;

    dx = x2 - x1;
    dy = y2 - y1;

    distancia = sqrt(dx * dx + dy * dy);

    return distancia;
}

int main(void) {
    float x1, y1, x2, y2, distancia;

    printf("Digite as coordenadas x1, y1, x2 e y2: ");
    scanf("%f %f %f %f", &x1, &y1, &x2, &y2);

    distancia = calcularDistancia(x1, y1, x2, y2);
    printf("Distancia: %.2f\\n", distancia);

    return 0;
}

/* Observação: em alguns compiladores, programas que usam sqrt podem precisar ser compilados
   com a biblioteca matemática, por exemplo: gcc arquivo.c -lm. */`,

  finalSummary: [
    'A função recebe quatro coordenadas do tipo float.',
    'As diferenças entre as coordenadas organizam o cálculo.',
    'A fórmula usa a raiz quadrada da soma dos quadrados.',
    'A função retorna a distância, sem imprimir diretamente.'
  ],

  expectedCriteria: [
    { id: 'crit_retorno_float', description: 'Define a função com retorno float.', importance: 'essencial' },
    { id: 'crit_quatro_parametros', description: 'Recebe quatro parâmetros float: x1, y1, x2 e y2.', importance: 'essencial' },
    { id: 'crit_dx_dy', description: 'Calcula corretamente as diferenças entre as coordenadas.', importance: 'essencial' },
    { id: 'crit_soma_quadrados', description: 'Usa a soma dos quadrados das diferenças.', importance: 'essencial' },
    { id: 'crit_sqrt', description: 'Usa sqrt para calcular a raiz quadrada.', importance: 'essencial' },
    { id: 'crit_return', description: 'Retorna a distância calculada.', importance: 'essencial' },
    { id: 'crit_sem_printf', description: 'Não substitui o retorno por printf dentro da função.', importance: 'desejável' }
  ],

  probableErrors: [
    { id: 'err_uso_int', description: 'Uso de int nos parâmetros ou no retorno.', likelyCause: 'Não observar a exigência de tipo float.' },
    { id: 'err_void', description: 'Função declarada como void.', likelyCause: 'Confusão entre função e procedimento.' },
    { id: 'err_parametros_incompletos', description: 'Função recebe menos de quatro parâmetros.', likelyCause: 'Representação incompleta dos dois pontos.' },
    { id: 'err_formula_linear', description: 'Uso de dx + dy ou expressão equivalente.', likelyCause: 'Desconhecimento da fórmula da distância.' },
    { id: 'err_sem_sqrt', description: 'Cálculo da soma dos quadrados sem raiz quadrada.', likelyCause: 'Confundir distância com distância ao quadrado.' },
    { id: 'err_printf', description: 'Printf usado no lugar do return.', likelyCause: 'Confusão entre exibir e retornar valor.' }
  ],

  templateCode: `#include <math.h>

float calcularDistancia(float x1, float y1, float x2, float y2) {
    // calcule dx e dy

    // calcule a distância

    // retorne a distância
}`,
  
  analyzeLocally: (code: string): AnalysisResult => {
    type ParsedFunction = {
      returnType: 'int' | 'void' | 'float' | 'double';
      name: string;
      params: string;
      body: string;
    };

    const source = code.toLowerCase();
    const codeWithoutComments = source.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, ' ');

    const parseFunctions = (input: string): ParsedFunction[] => {
      const functions: ParsedFunction[] = [];
      const functionPattern = /\b(int|void|float|double)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(([^)]*)\)\s*\{/g;
      let match: RegExpExecArray | null;

      while ((match = functionPattern.exec(input)) !== null) {
        const openingBraceIndex = functionPattern.lastIndex - 1;
        let depth = 0;
        let closingBraceIndex = -1;

        for (let i = openingBraceIndex; i < input.length; i++) {
          if (input[i] === '{') {
            depth++;
          } else if (input[i] === '}') {
            depth--;
            if (depth === 0) {
              closingBraceIndex = i;
              break;
            }
          }
        }

        if (closingBraceIndex > openingBraceIndex) {
          functions.push({
            returnType: match[1] as ParsedFunction['returnType'],
            name: match[2],
            params: match[3],
            body: input.slice(openingBraceIndex + 1, closingBraceIndex)
          });
          functionPattern.lastIndex = closingBraceIndex + 1;
        }
      }

      return functions;
    };

    const getParamParts = (params: string): string[] =>
      params
        .split(',')
        .map(param => param.trim())
        .filter(param => param.length > 0 && param !== 'void');

    const getParamNames = (params: string): string[] =>
      getParamParts(params)
        .map(param => {
          const normalized = param.replace(/\[[^\]]*\]/g, '').replace(/\*/g, ' ').trim();
          return normalized.match(/([a-zA-Z_][a-zA-Z0-9_]*)$/)?.[1] ?? '';
        })
        .filter(Boolean);

    const hasFourParams = (params: string): boolean =>
      getParamParts(params).length >= 4;

    const hasFourFloatParams = (params: string): boolean => {
      const paramParts = getParamParts(params);
      const explicitFloatParams = paramParts.filter(param => /\bfloat\b/.test(param)).length;
      const compactFloatParams =
        /^\s*float\s+[a-zA-Z_][a-zA-Z0-9_]*\s*,\s*[a-zA-Z_][a-zA-Z0-9_]*\s*,\s*[a-zA-Z_][a-zA-Z0-9_]*\s*,\s*[a-zA-Z_][a-zA-Z0-9_]*/.test(params);

      return paramParts.length >= 4 && (explicitFloatParams >= 4 || compactFloatParams);
    };

    const hasKnownCalcName = (name: string): boolean =>
      /^(distancia|calculardistancia|distanciaentrepontos|calculadistancia)$/.test(name) || /distancia/.test(name);

    const hasCoordinateNames = (text: string): boolean =>
      /\bx1\b/.test(text) && /\by1\b/.test(text) && /\bx2\b/.test(text) && /\by2\b/.test(text);

    const hasXDifference = (body: string): boolean =>
      /\bx2\b\s*-\s*\bx1\b/.test(body) || /\bx1\b\s*-\s*\bx2\b/.test(body);

    const hasYDifference = (body: string): boolean =>
      /\by2\b\s*-\s*\by1\b/.test(body) || /\by1\b\s*-\s*\by2\b/.test(body);

    const hasSquares = (body: string): boolean =>
      /\b([a-zA-Z_][a-zA-Z0-9_]*)\b\s*\*\s*\b\1\b/.test(body) ||
      /pow\s*\(/.test(body) ||
      /\(\s*x2\s*-\s*x1\s*\)\s*\*\s*\(\s*x2\s*-\s*x1\s*\)/.test(body) ||
      /\(\s*y2\s*-\s*y1\s*\)\s*\*\s*\(\s*y2\s*-\s*y1\s*\)/.test(body);

    const hasSumOfSquares = (body: string): boolean =>
      hasSquares(body) && /\+/.test(body);

    const hasLinearDistanceFormula = (body: string): boolean =>
      /(return|=)\s*(sqrt\s*\(\s*)?\bdx\b\s*\+\s*\bdy\b/.test(body) ||
      /\(\s*x2\s*-\s*x1\s*\)\s*\+\s*\(\s*y2\s*-\s*y1\s*\)/.test(body);

    const functions = parseFunctions(codeWithoutComments);
    const floatFunctions = functions.filter(fn => fn.returnType === 'float');
    const intFunctions = functions.filter(fn => fn.returnType === 'int' && fn.name !== 'main');
    const voidFunctions = functions.filter(fn => fn.returnType === 'void');

    const calcFunction =
      floatFunctions.find(fn => hasKnownCalcName(fn.name) && hasFourParams(fn.params)) ??
      floatFunctions.find(fn => hasFourParams(fn.params)) ??
      floatFunctions.find(fn => hasKnownCalcName(fn.name)) ??
      floatFunctions[0];

    const calcVoidCandidate = voidFunctions.find(fn =>
      hasKnownCalcName(fn.name) || hasXDifference(fn.body) || hasYDifference(fn.body) || /sqrt\s*\(/.test(fn.body)
    );

    const calcIntCandidate = intFunctions.find(fn =>
      hasKnownCalcName(fn.name) || hasXDifference(fn.body) || hasYDifference(fn.body) || /sqrt\s*\(/.test(fn.body)
    );

    const targetFunction = calcFunction ?? calcVoidCandidate ?? calcIntCandidate;
    const targetBody = targetFunction?.body ?? '';
    const targetParams = targetFunction?.params ?? '';

    const checks = {
      math: /#include\s*<\s*math\.h\s*>/.test(codeWithoutComments),
      floatFunction: Boolean(calcFunction),
      coherentName: Boolean(targetFunction && hasKnownCalcName(targetFunction.name)),
      fourParams: Boolean(targetFunction && hasFourParams(targetParams)),
      fourFloatParams: Boolean(targetFunction && hasFourFloatParams(targetParams)),
      coordinateUsage: Boolean(targetFunction && (hasCoordinateNames(targetParams) || hasCoordinateNames(targetBody))),
      xDifference: Boolean(targetFunction && hasXDifference(targetBody)),
      yDifference: Boolean(targetFunction && hasYDifference(targetBody)),
      squares: Boolean(targetFunction && hasSquares(targetBody)),
      sumOfSquares: Boolean(targetFunction && hasSumOfSquares(targetBody)),
      sqrt: /sqrt\s*\(/.test(targetBody),
      returnStatement: /\breturn\b/.test(targetBody),
      printf: /printf\s*\(/.test(targetBody),
      intReturn: Boolean(calcIntCandidate),
      voidReturn: Boolean(calcVoidCandidate),
      lessThanFourParams: Boolean(targetFunction && !hasFourParams(targetParams)),
      linearFormula: Boolean(targetFunction && hasLinearDistanceFormula(targetBody)),
      sqrtWithoutMath: /sqrt\s*\(/.test(targetBody) && !/#include\s*<\s*math\.h\s*>/.test(codeWithoutComments)
    };

    const good: string[] = [];
    const review: string[] = [];

    const addReview = (message: string) => {
      if (!review.includes(message)) review.push(message);
    };

    let score = 0;

    if (checks.math) { good.push('Incluiu a biblioteca math.h para usar sqrt.'); score++; }
    else if (checks.sqrt) { addReview('Inclua #include <math.h> quando usar sqrt.'); }
    else { addReview('Inclua #include <math.h> para usar sqrt na fórmula da distância.'); }

    if (checks.floatFunction) { good.push('Definiu uma função com retorno float.'); score += 3; }
    else if (checks.voidReturn) { addReview('A função precisa retornar float, pois a distância pode ter casas decimais.'); }
    else { addReview('Crie uma função com retorno float para calcular a distância.'); }

    if (checks.coherentName) { good.push('O nome da função comunica a ideia de distância.'); score++; }

    if (checks.fourParams) { good.push('A função recebe quatro parâmetros.'); score += 2; }
    else { addReview('A assinatura deve receber quatro parâmetros float: x1, y1, x2 e y2.'); }

    if (checks.fourFloatParams) { good.push('Os quatro parâmetros foram tratados como float.'); score += 2; }
    else { addReview('Todos os parâmetros devem ser float, porque coordenadas podem ter casas decimais.'); }

    if (checks.coordinateUsage) { good.push('A solução trabalha com as coordenadas x1, y1, x2 e y2.'); score++; }
    else { addReview('Use as quatro coordenadas x1, y1, x2 e y2 no cálculo.'); }

    if (checks.xDifference) { good.push('Calculou a diferença entre as coordenadas x.'); score += 2; }
    else { addReview('Calcule a diferença entre x2 e x1 antes de aplicar a fórmula.'); }

    if (checks.yDifference) { good.push('Calculou a diferença entre as coordenadas y.'); score += 2; }
    else { addReview('Calcule a diferença entre y2 e y1 antes de aplicar a fórmula.'); }

    if (checks.squares) { good.push('Usou multiplicação ou pow para representar quadrados.'); score += 2; }
    else { addReview('Use dx * dx e dy * dy, ou pow, para calcular os quadrados das diferenças.'); }

    if (checks.sumOfSquares) { good.push('A expressão soma os quadrados das diferenças.'); score += 2; }
    else { addReview('Some os quadrados das diferenças antes de aplicar a raiz quadrada.'); }

    if (checks.sqrt) { good.push('Aplicou sqrt na soma dos quadrados.'); score += 3; }
    else { addReview('A soma dos quadrados ainda não é a distância final. Aplique sqrt.'); }

    if (checks.returnStatement) { good.push('A função retorna a distância calculada.'); score += 3; }
    else { addReview('A função deve retornar a distância, não apenas imprimir o valor.'); }

    if (!checks.printf) { good.push('A função não substitui o retorno por printf.'); score++; }

    if (checks.intReturn) {
      score -= 3;
      addReview('A função precisa retornar float, não int.');
    }

    if (checks.voidReturn) {
      score -= 3;
      addReview('A função precisa retornar float, pois a distância pode ter casas decimais.');
    }

    if (checks.lessThanFourParams) {
      score -= 2;
      addReview('A assinatura deve receber quatro parâmetros float: x1, y1, x2 e y2.');
    }

    if (checks.linearFormula) {
      score -= 3;
      addReview('A distância não é dx + dy. Use a soma dos quadrados e depois sqrt.');
    }

    if (checks.printf && !checks.returnStatement) {
      score -= 3;
      addReview('A função deve retornar a distância, não apenas imprimir o valor.');
    } else if (checks.printf) {
      score -= 1;
      addReview('Evite printf dentro da função: ela deve calcular e retornar a distância.');
    }

    if (checks.sqrtWithoutMath) {
      score -= 1;
      addReview('Inclua #include <math.h> quando usar sqrt.');
    }

    let category: AnalysisResult['category'] = 'tentativa inicial';
    const solutionIsAdequate =
      checks.floatFunction &&
      checks.fourFloatParams &&
      checks.coordinateUsage &&
      checks.xDifference &&
      checks.yDifference &&
      checks.sumOfSquares &&
      checks.sqrt &&
      checks.returnStatement &&
      !checks.intReturn &&
      !checks.voidReturn &&
      !checks.linearFormula &&
      !(checks.printf && !checks.returnStatement);

    if (solutionIsAdequate && checks.math) category = 'solução adequada';
    else if (solutionIsAdequate || score >= 16) category = 'quase completa';
    else if (score >= 8) category = 'parcialmente correta';

    let difficulty = 'Dificuldade em implementar uma função matemática com parâmetros float e retorno.';
    if (!targetFunction) difficulty = 'Estrutura de função ainda ausente ou incompatível.';
    else if (checks.intReturn || checks.voidReturn || !checks.floatFunction) difficulty = 'Tipo de retorno inadequado para uma distância com casas decimais.';
    else if (!checks.fourParams || !checks.fourFloatParams) difficulty = 'Representação incompleta dos dois pontos como quatro parâmetros float.';
    else if (!checks.xDifference || !checks.yDifference) difficulty = 'Diferenças entre coordenadas ainda incompletas.';
    else if (!checks.sumOfSquares || checks.linearFormula) difficulty = 'Fórmula da distância confundida com soma linear.';
    else if (!checks.sqrt) difficulty = 'Uso ausente da raiz quadrada para obter a distância final.';
    else if (!checks.returnStatement || checks.printf) difficulty = 'Confusão entre retornar o valor e exibir o valor.';

    let nextStep = 'Comece criando uma função float calcularDistancia com parâmetros x1, y1, x2 e y2.';
    if (checks.floatFunction && !checks.fourFloatParams) nextStep = 'Ajuste a assinatura para receber quatro parâmetros float: x1, y1, x2 e y2.';
    if (checks.fourFloatParams && !checks.xDifference) nextStep = 'Calcule dx = x2 - x1 para organizar a fórmula.';
    if (checks.xDifference && !checks.yDifference) nextStep = 'Calcule também dy = y2 - y1.';
    if (checks.xDifference && checks.yDifference && !checks.sumOfSquares) nextStep = 'Use dx * dx + dy * dy para representar a soma dos quadrados.';
    if (checks.sumOfSquares && !checks.sqrt) nextStep = 'A soma dos quadrados ainda não é a distância final. Aplique sqrt.';
    if (checks.sqrt && !checks.returnStatement) nextStep = 'Retorne a distância calculada com return.';
    if (checks.sqrtWithoutMath) nextStep = 'Inclua #include <math.h> para usar sqrt corretamente.';
    if (category === 'solução adequada') nextStep = 'Ótimo trabalho! A função calcula e retorna a distância com uma expressão matemática bem modularizada.';

    const errorTypes: ErrorType[] = [];
    if (!targetFunction || !checks.math) errorTypes.push('sintaxe_aparente');
    if (!checks.fourParams || !checks.fourFloatParams) errorTypes.push('interpretacao_enunciado');
    if (!checks.sumOfSquares || !checks.sqrt || checks.linearFormula || checks.intReturn || checks.voidReturn) errorTypes.push('logica');
    if (checks.printf && !checks.returnStatement) errorTypes.push('saida_incorreta');

    return createLocalAnalysisResult(
      category,
      good,
      review,
      nextStep,
      difficulty,
      errorTypes.length > 0 ? errorTypes : ['sem_erro_relevante'],
      `Análise heurística de função de distância: ${Math.max(score, 0)}/25 critérios observados.`
    );
  }
};
