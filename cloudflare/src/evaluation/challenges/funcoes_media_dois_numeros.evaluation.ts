import type { ChallengeEvaluation } from '../types';

export const funcoesMediaDoisNumerosEvaluation: ChallengeEvaluation = {
  challengeId: 'funcoes_media_dois_numeros',

  rubric: [
    {
      id: 'crit_float',
      criterion: 'Os dois valores de entrada, o resultado da média e os dados relevantes da função de cálculo são representados com float, preservando resultados com parte decimal.',
      essential: true,
      guidance: [
        'O uso de float é um objetivo explícito desta atividade.',
        'Os operandos usados no cálculo e o valor devolvido pela função devem permitir média fracionária.',
        'Não considere int equivalente completo apenas porque alguns exemplos possuem resultado inteiro.',
        'Não exija nomes específicos para as variáveis.',
        'O procedimento de saída deve receber a média em tipo compatível com o float calculado.'
      ]
    },
    {
      id: 'crit_leitura_main',
      criterion: 'Os dois números são lidos no escopo principal e depois fornecidos à função de cálculo por parâmetros.',
      essential: true,
      guidance: [
        'O enunciado exige explicitamente que a leitura seja realizada no main.',
        'Uma única chamada scanf com dois conversores pode ler os dois valores; não exija duas chamadas separadas.',
        'Não considere correto transferir a leitura para a função calcularMedia ou para o procedimento de saída.',
        'Para variáveis float, a leitura com scanf deve usar especificador compatível e endereço das variáveis.'
      ]
    },
    {
      id: 'crit_funcao_media',
      criterion: 'Existe uma função com retorno float responsável pelo cálculo da média a partir dos dois valores recebidos por parâmetro.',
      essential: true,
      guidance: [
        'A função de cálculo deve possuir retorno float.',
        'Não exija o nome literal calcularMedia.',
        'Ela deve receber os valores necessários por parâmetros e produzir a média como resultado da função.',
        'Uma função void que apenas imprime ou modifica uma variável global não satisfaz o objetivo de função com retorno.',
        'A responsabilidade de apresentação pertence ao procedimento, não à função de cálculo.'
      ]
    },
    {
      id: 'crit_formula',
      criterion: 'A função calcula a média aritmética dos dois valores pela soma de ambos dividida por 2.',
      essential: true,
      guidance: [
        'A operação matemática esperada é (valor1 + valor2) / 2.',
        'Parênteses em torno da soma são essenciais quando necessários para garantir que a divisão seja aplicada à soma completa.',
        'ATENÇÃO: se valor1 e valor2 são float, dividir a soma por uma constante inteira 2 continua sendo divisão em ponto flutuante em C; NÃO marque (n1 + n2) / 2 como divisão inteira.',
        'Também aceite divisão por 2.0f ou forma aritmeticamente equivalente.',
        'Somar os dois valores sem dividir por 2 não calcula a média.',
        'Não aceite n1 + n2 / 2 como equivalente, pois a precedência calcula apenas metade do segundo valor antes da soma.'
      ]
    },
    {
      id: 'crit_return',
      criterion: 'A função devolve a média calculada por meio de return para que o main possa utilizar o resultado.',
      essential: true,
      guidance: [
        'Imprimir a média dentro da função não substitui o valor de retorno.',
        'O return pode devolver diretamente a expressão da média ou uma variável local que contenha o resultado.',
        'Não exija uma variável local chamada media dentro da função.',
        'O valor retornado deve corresponder à média calculada, não a um dos operandos ou apenas à soma.'
      ]
    },
    {
      id: 'crit_procedimento',
      criterion: 'Existe um procedimento void responsável por receber a média calculada e apresentá-la ao usuário.',
      essential: true,
      guidance: [
        'O procedimento deve ser void e exercer a responsabilidade de saída.',
        'Não exija o nome literal mostrarMedia.',
        'Ele deve receber o resultado da média por parâmetro em tipo compatível.',
        'Um printf diretamente no main, sem o procedimento solicitado, não satisfaz integralmente este critério.',
        'A função de cálculo não deve substituir o procedimento fazendo ela própria a apresentação principal.'
      ]
    },
    {
      id: 'crit_chamada_main',
      criterion: 'O procedimento de saída é invocado a partir do main depois que o resultado da função de média está disponível.',
      essential: true,
      guidance: [
        'O main deve integrar a leitura, a chamada da função de cálculo e a chamada do procedimento.',
        'A estratégia de referência armazena o retorno da função em uma variável e depois chama o procedimento.',
        'Aceite também mostrarMedia(calcularMedia(n1, n2)) quando essa composição ocorre diretamente no main, pois o procedimento continua sendo invocado pelo escopo principal com o resultado da função.',
        'O procedimento não deve ser chamado exclusivamente de dentro da função de cálculo.',
        'Definir o procedimento sem invocá-lo no fluxo real não satisfaz o critério.'
      ]
    }
  ],

  referenceStrategies: [
    'No main, ler dois float, chamar uma função float que recebe os dois números e retorna (n1 + n2) / 2, armazenar o resultado e passá-lo a um procedimento void que exibe a média.',
    'No main, ler os dois float e chamar diretamente o procedimento com o retorno da função, como mostrarMedia(calcularMedia(n1, n2)), mantendo cálculo e saída em módulos distintos.',
    'A função pode retornar diretamente a expressão da média ou calcular em variável local; o essencial é receber os dois valores, calcular corretamente e devolver float.'
  ],

  commonErrors: [
    {
      error: 'Usar int para os valores ou para a média.',
      consequence: 'Resultados com parte decimal podem ser perdidos e o objetivo de trabalhar com float não é atendido.'
    },
    {
      error: 'Ler os números dentro da função de cálculo ou do procedimento.',
      consequence: 'A leitura deixa de ocorrer no escopo principal como solicitado.'
    },
    {
      error: 'Declarar a função de cálculo como void.',
      consequence: 'O resultado da média não é devolvido ao main por meio de return.'
    },
    {
      error: 'Calcular apenas n1 + n2.',
      consequence: 'A expressão produz a soma, não a média aritmética.'
    },
    {
      error: 'Calcular n1 + n2 / 2 sem agrupar a soma.',
      consequence: 'Pela precedência dos operadores, apenas n2 é dividido por 2 antes de ser somado a n1.'
    },
    {
      error: 'Marcar (n1 + n2) / 2 como divisão inteira quando n1 e n2 são float.',
      consequence: 'Esse diagnóstico seria falso: a soma é float e o divisor inteiro é convertido para ponto flutuante na operação.'
    },
    {
      error: 'Imprimir a média na função de cálculo em vez de retorná-la.',
      consequence: 'A solução mistura cálculo e saída e deixa de usar corretamente a função com retorno.'
    },
    {
      error: 'Criar o procedimento void, mas não chamá-lo a partir do main.',
      consequence: 'A exigência de que o procedimento seja invocado pelo escopo principal não é atendida.'
    },
    {
      error: 'Chamar o procedimento dentro da função de cálculo como único ponto de uso.',
      consequence: 'O fluxo deixa de respeitar a responsabilidade do main de integrar função e procedimento.'
    }
  ]
};
