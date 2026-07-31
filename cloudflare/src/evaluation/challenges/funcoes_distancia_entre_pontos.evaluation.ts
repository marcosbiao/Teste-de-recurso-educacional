import type { ChallengeEvaluation } from '../types';

export const funcoesDistanciaEntrePontosEvaluation: ChallengeEvaluation = {
  challengeId: 'funcoes_distancia_entre_pontos',

  rubric: [
    {
      id: 'crit_retorno_float',
      criterion: 'A função que calcula a distância possui tipo de retorno float, conforme a exigência explícita do desafio.',
      essential: true,
      guidance: [
        'O objetivo pedagógico desta atividade inclui especificamente uma função com retorno float.',
        'Não exija o nome literal calcularDistancia.',
        'Uma função void não satisfaz este critério porque não devolve a distância.',
        'Embora double seja um tipo real válido em C, o enunciado desta atividade exige explicitamente float; portanto, não trate double como atendimento integral deste critério.',
        'O tipo de retorno deve permitir devolver a distância calculada ao ponto de chamada.'
      ]
    },
    {
      id: 'crit_quatro_parametros',
      criterion: 'A função recebe exatamente as quatro coordenadas necessárias dos dois pontos por meio de quatro parâmetros float.',
      essential: true,
      guidance: [
        'Os parâmetros representam x1, y1, x2 e y2, ainda que possuam outros nomes.',
        'Todos os quatro parâmetros devem ser do tipo float, pois essa é uma exigência explícita do desafio.',
        'Dois pontos no plano exigem quatro coordenadas; omitir uma delas impede o cálculo geral.',
        'Não aceite leitura interna como substituta da passagem das quatro coordenadas por parâmetros.',
        'Embora double seja tecnicamente capaz de representar coordenadas, o objetivo específico aqui é praticar parâmetros float.'
      ]
    },
    {
      id: 'crit_dx_dy',
      criterion: 'A função calcula corretamente as diferenças entre as coordenadas correspondentes dos dois pontos nos eixos x e y.',
      essential: true,
      guidance: [
        'Uma forma de referência é dx = x2 - x1 e dy = y2 - y1.',
        'Também aceite x1 - x2 e y1 - y2, pois o sinal desaparece quando essas diferenças são elevadas ao quadrado.',
        'Não exija necessariamente variáveis locais chamadas dx e dy; as diferenças podem aparecer diretamente na expressão matemática.',
        'A diferença do eixo x deve relacionar as duas coordenadas x, e a diferença do eixo y deve relacionar as duas coordenadas y.',
        'Misturar x com y na mesma diferença não representa a geometria correta.'
      ]
    },
    {
      id: 'crit_soma_quadrados',
      criterion: 'A expressão da distância utiliza a soma dos quadrados das diferenças dos dois eixos.',
      essential: true,
      guidance: [
        'A grandeza sob a raiz deve ser dx² + dy².',
        'Aceite dx * dx + dy * dy, uso equivalente de pow/powf para elevar cada diferença ao quadrado ou expressão algébrica equivalente.',
        'Não aceite apenas dx + dy, |dx| + |dy| ou outra métrica diferente da distância euclidiana solicitada.',
        'Se as diferenças forem escritas diretamente, verifique se cada diferença completa é elevada ao quadrado.',
        'A soma precisa incluir contribuição dos dois eixos.'
      ]
    },
    {
      id: 'crit_sqrt',
      criterion: 'A função aplica uma operação de raiz quadrada da biblioteca matemática à soma dos quadrados para obter a distância euclidiana.',
      essential: true,
      guidance: [
        'A solução de referência usa sqrt.',
        'Aceite sqrtf como equivalente apropriado para operandos float.',
        'O uso da raiz quadrada é parte do objetivo pedagógico; não considere apenas a soma dos quadrados como distância final.',
        'A chamada deve receber a expressão correspondente à soma dos quadrados.',
        'Não substitua este critério por uma solução com métrica diferente.',
        'Uma solução que usa hypot/hypotf pode calcular matematicamente a distância, mas não exercita explicitamente a construção soma dos quadrados + raiz quadrada definida pelos critérios desta atividade; portanto, não a considere atendimento integral aos critérios `crit_soma_quadrados` e `crit_sqrt`.'
      ]
    },
    {
      id: 'crit_return',
      criterion: 'A função devolve por meio de return o valor final da distância calculada.',
      essential: true,
      guidance: [
        'O return deve fornecer a distância depois da aplicação da raiz quadrada.',
        'Imprimir o valor não substitui o retorno.',
        'Aceite retornar uma variável local ou retornar diretamente a expressão matemática correta.',
        'Não exija uma variável local chamada distancia.',
        'O valor devolvido deve representar a distância, e não apenas dx, dy ou a soma dos quadrados sem raiz.'
      ]
    },
    {
      id: 'crit_sem_printf',
      criterion: 'A função mantém a responsabilidade de calcular e retornar a distância, sem substituir esse retorno por uma impressão dentro da própria função.',
      essential: false,
      guidance: [
        'Este é um critério desejável de separação de responsabilidades.',
        'O problema principal é usar printf no lugar de return.',
        'Se a função retorna corretamente a distância mas também contém uma impressão extra, os critérios essenciais de cálculo e retorno podem continuar satisfeitos; este critério desejável, porém, pode ser considerado não atendido por misturar saída com cálculo.',
        'Não transforme a presença de um printf adicional em prova de que a fórmula matemática está errada.',
        'O feedback prioritário deve respeitar a hierarquia global: erros de compilação ou erros essenciais de fórmula/retorno vêm antes deste aspecto desejável.'
      ]
    }
  ],

  referenceStrategies: [
    'Definir uma função float com quatro parâmetros float, calcular dx e dy, formar dx * dx + dy * dy, aplicar sqrt ou sqrtf e retornar a distância.',
    'Retornar diretamente uma expressão equivalente a sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)), preservando retorno e parâmetros float.',
    'Calcular as diferenças no sentido inverso, x1 - x2 e y1 - y2, e elevar ambas ao quadrado antes de somar e aplicar a raiz; o resultado permanece equivalente.'
  ],

  commonErrors: [
    {
      error: 'Declarar a função de distância como void.',
      consequence: 'A distância calculada não pode ser devolvida ao ponto de chamada como resultado da função.'
    },
    {
      error: 'Usar int nos parâmetros ou no retorno.',
      consequence: 'A solução deixa de atender à exigência de valores float e pode perder partes decimais.'
    },
    {
      error: 'Usar double no lugar de float como se fossem requisitos indistintos.',
      consequence: 'Embora double seja tecnicamente válido para números reais, não atende integralmente ao objetivo explícito desta atividade de praticar parâmetros e retorno float.'
    },
    {
      error: 'Receber menos de quatro coordenadas.',
      consequence: 'A função não possui informação suficiente para representar dois pontos gerais no plano.'
    },
    {
      error: 'Misturar coordenadas de eixos diferentes ao calcular as diferenças.',
      consequence: 'A expressão deixa de representar os deslocamentos horizontal e vertical entre os dois pontos.'
    },
    {
      error: 'Somar dx e dy diretamente.',
      consequence: 'O resultado não corresponde à distância euclidiana.'
    },
    {
      error: 'Somar os quadrados, mas esquecer a raiz quadrada.',
      consequence: 'A função devolve a distância ao quadrado, não a distância.'
    },
    {
      error: 'Aplicar sqrt somente a uma parcela da soma por erro de parênteses.',
      consequence: 'A expressão deixa de representar a raiz da soma completa dos quadrados.'
    },
    {
      error: 'Imprimir a distância dentro da função e não retorná-la.',
      consequence: 'A função deixa de cumprir sua responsabilidade de devolver o resultado ao chamador.'
    },
    {
      error: 'Rejeitar x1 - x2 e y1 - y2 apenas por estarem no sentido oposto à estratégia de referência.',
      consequence: 'Esse seria um falso diagnóstico, pois o quadrado torna as duas orientações de diferença matematicamente equivalentes.'
    },
    {
      error: 'Rejeitar sqrtf quando os operandos são float.',
      consequence: 'Esse seria um falso diagnóstico: sqrtf é a variante da biblioteca matemática apropriada para float e satisfaz a operação de raiz quadrada.'
    }
  ]
};
