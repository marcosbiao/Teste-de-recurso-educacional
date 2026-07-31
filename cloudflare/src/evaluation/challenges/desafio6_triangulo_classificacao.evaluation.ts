import type { ChallengeEvaluation } from '../types';

export const desafio6TrianguloClassificacaoEvaluation: ChallengeEvaluation = {
  challengeId: 'desafio6_triangulo_classificacao',

  rubric: [
    {
      id: 'crit1',
      criterion: 'A solução verifica de forma completa a condição de existência do triângulo, garantindo as três desigualdades triangulares antes de considerar os lados válidos.',
      essential: true,
      guidance: [
        'Para considerar válido diretamente, devem valer simultaneamente: a + b > c, a + c > b e b + c > a.',
        'A forma de referência combina as três condições válidas com &&.',
        'Também aceite a lógica equivalente que detecta invalidade se qualquer uma falhar, por exemplo a + b <= c || a + c <= b || b + c <= a, e trata o ramo complementar como válido.',
        'ATENÇÃO: não marque qualquer uso de || como erro automaticamente; OR é correto quando combina condições de INVALIDADE.',
        'Verificar apenas uma ou duas das três desigualdades é insuficiente.',
        'A desigualdade deve ser estrita: igualdade entre a soma de dois lados e o terceiro não forma triângulo.'
      ]
    },
    {
      id: 'crit2',
      criterion: 'A classificação em equilátero, isósceles ou escaleno ocorre somente depois de estabelecido que os três valores formam um triângulo válido.',
      essential: true,
      guidance: [
        'O problema possui dois estágios lógicos: validar e depois classificar.',
        'A forma de referência usa um if externo de validade e condicionais internas para o tipo.',
        'Aceite também fluxo equivalente, como detectar um triângulo inválido, emitir a mensagem e encerrar antes de executar a classificação.',
        'Não classifique como equilátero, isósceles ou escaleno um conjunto que falha a desigualdade triangular.',
        'Para triângulos válidos, a lógica deve distinguir as três categorias pedidas.'
      ]
    },
    {
      id: 'crit3',
      criterion: 'A classificação identifica corretamente o caso equilátero quando os três lados são iguais, sem confundi-lo com isósceles.',
      essential: true,
      guidance: [
        'Uma forma suficiente é a == b && b == c; comparações equivalentes entre os três lados também são válidas.',
        'Como um equilátero possui pares de lados iguais, uma condição genérica de isósceles testada antes pode capturá-lo indevidamente.',
        'Aceite testar equilátero primeiro ou definir isósceles como exatamente dois lados iguais com exclusão explícita do caso de três iguais.',
        'Não exija literalmente a sequência a == b && b == c quando outra expressão comprova corretamente que os três valores são iguais.',
        'A classificação dos casos escaleno e isósceles deve permanecer coerente com o resultado do teste de equilátero.'
      ]
    },
    {
      id: 'crit4',
      criterion: 'Quando as desigualdades triangulares não são satisfeitas, o programa informa que os valores não formam triângulo e não apresenta uma classificação de tipo válida.',
      essential: true,
      guidance: [
        'O caso inválido precisa ter resultado final claramente distinto das três classificações de triângulo.',
        'Não deve aparecer simultaneamente uma mensagem de invalidade e uma classificação como equilátero, isósceles ou escaleno.',
        'Aceite else, retorno antecipado ou estrutura equivalente para separar o fluxo inválido.',
        'Casos degenerados como 1, 1, 2 são inválidos porque a desigualdade triangular exige soma estritamente maior.'
      ]
    }
  ],

  referenceStrategies: [
    'Ler os três lados, validar com as três desigualdades combinadas por && e, apenas no ramo válido, testar primeiro equilátero, depois isósceles e usar o caso restante para escaleno; no else externo, informar que não forma triângulo.',
    'Detectar primeiro qualquer violação das desigualdades com || entre condições de invalidade; se houver, informar que não forma triângulo e encerrar. Caso contrário, classificar os lados válidos.',
    'Após a validação, identificar equilátero pelos três lados iguais, isósceles quando exatamente dois lados são iguais e escaleno quando os três são diferentes.'
  ],

  commonErrors: [
    {
      error: 'Verificar apenas uma ou duas desigualdades triangulares.',
      consequence: 'Alguns conjuntos inválidos podem passar para a etapa de classificação.'
    },
    {
      error: 'Usar || entre as três condições de validade a + b > c, a + c > b e b + c > a.',
      consequence: 'Basta uma desigualdade verdadeira para aceitar um conjunto que pode não formar triângulo.'
    },
    {
      error: 'Marcar qualquer ocorrência de || como erro sem observar o significado das condições.',
      consequence: 'Uma solução correta que usa OR para detectar qualquer condição de invalidade seria rejeitada indevidamente.'
    },
    {
      error: 'Classificar os lados antes de verificar se formam um triângulo.',
      consequence: 'Entradas como 1, 1, 10 podem receber uma categoria geométrica que não deveria existir.'
    },
    {
      error: 'Testar isósceles de forma inclusiva antes do equilátero sem excluir o caso de três lados iguais.',
      consequence: 'Um triângulo equilátero pode ser rotulado incorretamente como isósceles.'
    },
    {
      error: 'Aceitar soma de dois lados igual ao terceiro.',
      consequence: 'Um caso degenerado é tratado como triângulo válido, contrariando a desigualdade estrita.'
    },
    {
      error: 'Exibir uma classificação de tipo junto com a mensagem de que não forma triângulo.',
      consequence: 'A saída fica logicamente contraditória.'
    }
  ]
};
