import type { ChallengeEvaluation } from '../types';

export const cci01MateriaisOficinaEvaluation: ChallengeEvaluation = {
  challengeId: 'cci01-materiais-oficina',

  rubric: [
    {
      id: 'crit1',
      criterion: 'A solução identifica a quantidade de estudantes como o dado de entrada que determina as quantidades de materiais.',
      essential: true,
      guidance: [
        'Considere como evidência tanto a representação preenchida pelo estudante quanto o código.',
        'Existe uma única entrada principal: número de estudantes.',
        'Folhas, lápis, borrachas e total geral são resultados derivados, não novas entradas.',
        'Não exija o nome literal estudantes se outra variável representa claramente a quantidade de participantes.',
        'Se a representação estiver vazia mas o código lê e utiliza corretamente a quantidade de estudantes, não marque este critério como ausente apenas pela falta de texto de representação.'
      ]
    },
    {
      id: 'crit2',
      criterion: 'A solução representa corretamente que cada estudante necessita de duas folhas, resultando em quantidade de folhas igual ao dobro do número de estudantes.',
      essential: true,
      guidance: [
        'A relação correta é folhas = estudantes * 2, 2 * estudantes ou expressão aritmeticamente equivalente.',
        'Usar folhas = estudantes representa apenas uma folha por estudante e não satisfaz a regra.',
        'Não exija variável com nome literal folhas se a grandeza estiver clara.',
        'O cálculo pode ser realizado em atribuição própria ou diretamente em uma expressão de saída, desde que a quantidade de folhas seja correta e identificável.',
        'Quando houver representação preenchida, aceite redações equivalentes como "duas folhas por aluno".'
      ]
    },
    {
      id: 'crit3',
      criterion: 'A solução representa corretamente que a quantidade de lápis e a quantidade de borrachas são, cada uma, iguais à quantidade de estudantes.',
      essential: true,
      guidance: [
        'Cada estudante recebe um lápis e uma borracha.',
        'Portanto, os dois subtotais correspondem individualmente ao número de estudantes.',
        'Não exija atribuições textualmente idênticas `lapis = estudantes` e `borrachas = estudantes` se a mesma relação é implementada de forma equivalente.',
        'Não some lápis e borrachas em uma única grandeza quando o problema solicita os subtotais separadamente.',
        'Os dois materiais precisam permanecer conceitualmente distinguíveis para que possam ser apresentados individualmente.'
      ]
    },
    {
      id: 'crit4',
      criterion: 'O total geral corresponde à soma das quantidades de folhas, lápis e borrachas, produzindo o total de materiais distribuídos.',
      essential: true,
      guidance: [
        'A estratégia de referência é total = folhas + lapis + borrachas.',
        'Aceite expressão equivalente como estudantes * 4 quando os subtotais individuais também estão corretamente representados e podem ser apresentados.',
        'Não considere a própria quantidade de estudantes como total geral.',
        'O total deve incluir os três tipos de material e não duplicar ou omitir qualquer subtotal.',
        'Não exija variável literal chamada total.'
      ]
    },
    {
      id: 'crit5',
      criterion: 'As etapas seguem uma sequência lógica em que a entrada fica disponível antes dos cálculos, os subtotais são definidos de forma coerente e o total e as saídas usam valores já determinados.',
      essential: true,
      guidance: [
        'Não exija a mesma ordem de linhas da solução de referência.',
        'Os cálculos não podem depender da quantidade de estudantes antes de ela ser obtida.',
        'Quando houver validação, ela deve ocorrer antes dos cálculos que seriam inválidos ou sem sentido para a regra da atividade.',
        'O total geral deve ser calculado quando os dados necessários já estiverem disponíveis, seja por subtotais explícitos ou expressão equivalente.',
        'As saídas devem apresentar grandezas já determinadas.',
        'Declarações de variáveis podem aparecer antes da leitura sem violar a sequência lógica.'
      ]
    },
    {
      id: 'crit6',
      criterion: 'O código implementa de forma funcional as relações apresentadas na representação do problema para obter as quantidades de materiais.',
      essential: true,
      guidance: [
        'A implementação deve transformar a quantidade de estudantes nas quantidades corretas de folhas, lápis, borrachas e total.',
        'Não exija estrutura sintática idêntica à solução de referência.',
        'Se a representação estiver preenchida, use-a como evidência adicional de planejamento e compare-a ao comportamento do código sem exigir correspondência textual.',
        'Se a representação estiver vazia, uma implementação correta ainda pode satisfazer o critério.',
        'Comentários que apenas descrevem os cálculos sem implementá-los não bastam.'
      ]
    },
    {
      id: 'crit7',
      criterion: 'As quantidades de estudantes e materiais são representadas com variáveis inteiras adequadas à natureza discreta do problema.',
      essential: false,
      guidance: [
        'A solução de referência usa int porque estudantes e unidades de materiais são contagens discretas.',
        'Não exija nomes específicos para as variáveis.',
        'Outro tipo numérico que permita o cálculo pode produzir alguns resultados corretos, mas não atende tão adequadamente ao objetivo de modelagem das quantidades inteiras.',
        'Este é um critério desejável e não deve ser priorizado acima de erros essenciais de cálculo ou decomposição.'
      ]
    },
    {
      id: 'crit8',
      criterion: 'A solução trata quantidade de estudantes menor ou igual a zero como inválida antes de apresentar quantidades de materiais para esse caso.',
      essential: false,
      guidance: [
        'A orientação confiável do desafio define estudantes <= 0 como quantidade inválida.',
        'Aceite testar estudantes <= 0, testar estudantes > 0 e usar o ramo complementar, ou fluxo equivalente.',
        'Não exija literalmente `return 0` no ramo inválido se a estrutura impede corretamente os cálculos/saídas normais.',
        'Validar apenas estudantes == 0 deixa valores negativos sem tratamento.',
        'Como este critério é desejável no contrato público, não o priorize sobre um erro essencial de cálculo.'
      ]
    },
    {
      id: 'crit9',
      criterion: 'A solução apresenta separadamente as quatro saídas solicitadas: folhas, lápis, borrachas e total geral de materiais.',
      essential: false,
      guidance: [
        'Os quatro resultados precisam ser distinguíveis na saída para atender integralmente a apresentação esperada.',
        'Não exija textos literalmente iguais aos exemplos se cada quantidade estiver claramente identificada.',
        'Uma única linha pode conter os quatro resultados; não exija quatro printf separados.',
        'No caso de quantidade inválida, a mensagem de invalidez pode substituir as quatro saídas normais.',
        'Este critério é desejável segundo o contrato público; mantenha essa classificação.'
      ]
    },
    {
      id: 'crit10',
      criterion: 'Quando há representação preenchida, entrada, cálculos e resultados descritos nela correspondem ao comportamento implementado no código.',
      essential: false,
      guidance: [
        'Compare representação e código somente quando os campos de representação tiverem conteúdo relevante.',
        'Representação ausente ou vazia não deve gerar erro automaticamente.',
        'Aceite diferenças de nomes e redação quando o significado é equivalente.',
        'Uma contradição material, como representar uma folha por estudante enquanto o código calcula duas, é evidência de desalinhamento.',
        'Não priorize este critério desejável quando houver erro essencial na lógica implementada.'
      ]
    },
    {
      id: 'crit11',
      criterion: 'Os nomes das variáveis permitem compreender de forma razoável quais valores representam estudantes e os diferentes materiais.',
      essential: false,
      guidance: [
        'Estudantes, folhas, lapis, borrachas e total são exemplos de nomes claros, não nomes obrigatórios.',
        'Aceite abreviações e nomes em outro idioma quando a função da variável continua compreensível pelo contexto.',
        'Nomes curtos não tornam automaticamente o cálculo errado.',
        'Use este critério somente quando a nomenclatura realmente prejudica a compreensão da decomposição.',
        'Não transforme preferência estilística em erro essencial.'
      ]
    },
    {
      id: 'crit12',
      criterion: 'A solução evita cálculos ou estados redundantes que não contribuem para obter ou apresentar os resultados pedidos, sem penalizar decomposições úteis.',
      essential: false,
      guidance: [
        'As variáveis separadas para folhas, lápis, borrachas e total NÃO são desnecessárias: elas correspondem aos subtotais solicitados.',
        'Não penalize duas etapas quando elas tornam explícita a decomposição pedagógica do problema.',
        'Uma variável temporária adicional também não é automaticamente um problema se possui função compreensível.',
        'Considere este critério somente para redundância clara que torne a solução confusa ou mantenha cálculos sem uso.',
        'Não priorize este critério desejável sobre qualquer requisito essencial.'
      ]
    }
  ],

  referenceStrategies: [
    'Ler a quantidade de estudantes, tratar estudantes <= 0 como quantidade inválida e, no caso válido, calcular folhas = estudantes * 2, lápis = estudantes, borrachas = estudantes, total = folhas + lápis + borrachas e apresentar os quatro valores.',
    'Para quantidade válida, manter os três subtotais individualmente e calcular o total por expressão equivalente a estudantes * 4, desde que folhas, lápis e borrachas também permaneçam corretamente representados e disponíveis para saída.',
    'Usar um ramo estudantes > 0 para calcular e apresentar os materiais e deixar o ramo complementar responsável pela mensagem de quantidade inválida.'
  ],

  commonErrors: [
    {
      error: 'Usar uma folha por estudante.',
      consequence: 'A quantidade de folhas fica pela metade do valor definido pelo enunciado.'
    },
    {
      error: 'Tratar lápis ou borrachas como dois por estudante.',
      consequence: 'O subtotal daquele material deixa de corresponder à regra de uma unidade por estudante.'
    },
    {
      error: 'Usar a quantidade de estudantes como total geral.',
      consequence: 'O total ignora que cada estudante recebe quatro unidades de materiais ao considerar duas folhas, um lápis e uma borracha.'
    },
    {
      error: 'Somar apenas dois dos três subtotais.',
      consequence: 'O total geral omite um tipo de material e fica menor que a quantidade distribuída.'
    },
    {
      error: 'Misturar os subtotais e deixar de distinguir folhas, lápis e borrachas.',
      consequence: 'A solução pode chegar a um total, mas não representa nem apresenta corretamente as quantidades individuais solicitadas.'
    },
    {
      error: 'Executar os cálculos normais para quantidade de estudantes igual ou menor que zero.',
      consequence: 'A solução produz quantidades de materiais para um caso que a orientação define como inválido.'
    },
    {
      error: 'Mostrar apenas o total geral.',
      consequence: 'As quantidades individuais de folhas, lápis e borrachas solicitadas deixam de ser apresentadas.'
    },
    {
      error: 'Considerar as variáveis de subtotais como redundantes apenas porque o total poderia ser calculado por estudantes * 4.',
      consequence: 'Esse seria um falso diagnóstico: os subtotais correspondem a resultados explicitamente pedidos e são pedagogicamente úteis para a decomposição.'
    },
    {
      error: 'Acusar ausência de representação apenas porque os campos estão vazios, embora o código implemente corretamente o problema.',
      consequence: 'Esse seria um falso diagnóstico, pois o projeto já permite avaliar como adequada uma implementação correta sem tornar o preenchimento da representação obrigatório.'
    }
  ]
};
