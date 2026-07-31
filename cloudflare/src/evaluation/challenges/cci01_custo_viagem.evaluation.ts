import type { ChallengeEvaluation } from '../types';

export const cci01CustoViagemEvaluation: ChallengeEvaluation = {
  challengeId: 'cci01-custo-viagem',

  rubric: [
    {
      id: 'crit1',
      criterion: 'A solução identifica como dados de entrada a distância total da viagem, o consumo médio do veículo e o preço do litro do combustível.',
      essential: true,
      guidance: [
        'Considere como evidência tanto a representação do estudante, quando preenchida, quanto o código efetivamente escrito.',
        'Os três dados precisam existir conceitualmente antes dos cálculos que dependem deles.',
        'No código, uma única chamada scanf pode ler mais de um valor; não conte chamadas textuais como se fossem necessariamente entradas distintas.',
        'Não exija nomes literais como distancia, consumo e preco se outras variáveis representam claramente os mesmos dados.',
        'Não confunda litros necessários ou custo total com entradas: esses são resultados derivados.',
        'Se a representação estiver vazia mas o código lê e utiliza corretamente os três dados, não marque este critério como ausente apenas pela falta da representação textual.'
      ]
    },
    {
      id: 'crit2',
      criterion: 'A solução representa corretamente os dois cálculos centrais: quantidade de litros como distância dividida pelo consumo e custo total como quantidade de litros multiplicada pelo preço do combustível.',
      essential: true,
      guidance: [
        'A relação dimensional correta é litros = distância / consumo quando o consumo está em quilômetros por litro.',
        'O custo deve depender da quantidade de litros e do preço por litro.',
        'Aceite expressão algébrica equivalente para o custo, como (distancia / consumo) * preco, desde que a solução também represente corretamente a quantidade de litros solicitada como resultado.',
        'Não exija variáveis com nomes específicos nem a mesma divisão em linhas da solução de referência.',
        'Multiplicar distância por consumo não representa litros.',
        'Multiplicar distância diretamente pelo preço ignora a unidade preço por litro e não representa o custo correto.'
      ]
    },
    {
      id: 'crit3',
      criterion: 'A solução mantém distintos os dois resultados derivados: litros necessários e custo total estimado.',
      essential: true,
      guidance: [
        'Litros e custo representam grandezas diferentes e devem poder ser reconhecidos separadamente.',
        'Aceite variáveis separadas ou expressões equivalentes desde que os dois resultados possam ser obtidos e apresentados corretamente.',
        'Não considere suficiente calcular apenas o custo se a quantidade de litros solicitada não puder ser produzida.',
        'Não considere suficiente calcular apenas os litros sem produzir o custo.',
        'Na representação do estudante, não penalize diferenças de redação quando as duas grandezas estiverem claramente distinguidas.'
      ]
    },
    {
      id: 'crit4',
      criterion: 'As ações seguem uma sequência coerente de dependências: obter os dados necessários, impedir cálculo com consumo inválido, realizar os cálculos e então apresentar os resultados.',
      essential: true,
      guidance: [
        'Avalie dependência sem exigir a mesma ordem textual exata da solução de referência.',
        'Os cálculos não podem utilizar dados antes que esses valores estejam disponíveis.',
        'A divisão por consumo só pode ocorrer depois de garantir que o consumo permite a operação.',
        'O custo precisa ser calculado a partir de dados já disponíveis, incluindo a quantidade de combustível necessária ou expressão equivalente.',
        'As saídas de litros e custo devem representar resultados já calculados.',
        'Declarações de variáveis podem aparecer antes das leituras sem violar a sequência lógica.'
      ]
    },
    {
      id: 'crit5',
      criterion: 'A solução evita dividir por consumo igual a zero e trata como inválido o caso em que o consumo é menor ou igual a zero antes de realizar a divisão.',
      essential: true,
      guidance: [
        'A regra confiável do desafio define consumo <= 0 como inválido.',
        'Aceite testar consumo <= 0 e sair do fluxo, ou testar consumo > 0 para entrar no ramo de cálculo e tratar o ramo complementar como inválido.',
        'Não exija literalmente `return 0` dentro do ramo inválido se outra estrutura impede de forma segura que a divisão seja executada.',
        'Uma verificação feita somente depois de calcular distancia / consumo não evita a divisão inválida.',
        'Validar apenas consumo == 0 deixa valores negativos entrarem no cálculo e não atende integralmente à regra do desafio.',
        'Não imponha validações adicionais de distância ou preço como requisitos essenciais, pois não são pedidas pelo enunciado.'
      ]
    },
    {
      id: 'crit6',
      criterion: 'O código implementa de forma funcional a lógica representada para os casos válidos e para o caso de consumo inválido.',
      essential: true,
      guidance: [
        'Este critério integra leitura, validação, cálculos e fluxo de saída.',
        'A solução deve produzir litros e custo corretos quando consumo > 0 e evitar esses cálculos quando consumo <= 0.',
        'Não exija estrutura sintática idêntica à referência; aceite fluxos equivalentes.',
        'Se a representação estiver preenchida, compare-a ao comportamento do código sem exigir correspondência palavra por palavra.',
        'Um código que apenas declara variáveis ou descreve a fórmula em comentários, mas não executa a lógica, não satisfaz o critério.'
      ]
    },
    {
      id: 'crit7',
      criterion: 'Os valores que podem conter parte decimal são representados por tipos de ponto flutuante adequados.',
      essential: false,
      guidance: [
        'Float é a estratégia de referência e double também é uma alternativa adequada.',
        'Distância, consumo, preço, litros e custo podem envolver valores fracionários.',
        'Não exija que todas as variáveis sejam float se uma combinação com double preserva corretamente os valores reais.',
        'Tipos inteiros podem causar perda de informação e divisão inteira, mas avalie o comportamento e os tipos efetivamente usados antes de diagnosticar.',
        'Não priorize este critério desejável sobre um erro essencial de fórmula, validação ou saída.'
      ]
    },
    {
      id: 'crit8',
      criterion: 'Para consumo válido, o programa apresenta tanto a quantidade estimada de litros quanto o custo total estimado.',
      essential: true,
      guidance: [
        'Os dois resultados são exigidos no caso válido.',
        'A saída deve usar valores que representem efetivamente litros e custo.',
        'Não confunda prompts de entrada com apresentação dos resultados.',
        'As mensagens podem variar semanticamente; não exija texto idêntico aos exemplos se as duas grandezas estiverem identificáveis.',
        'No caso consumo <= 0, a saída de invalidez substitui corretamente os dois resultados e não deve ser tratada como ausência indevida de saída.'
      ]
    },
    {
      id: 'crit9',
      criterion: 'Quando há representação do problema preenchida, ela mantém correspondência conceitual com a implementação realizada no código.',
      essential: false,
      guidance: [
        'Compare inputs, processing, outputs e steps com o comportamento efetivo do código somente quando a representação tiver conteúdo relevante.',
        'Representação ausente ou campos vazios não devem ser classificados automaticamente como erro; nesse caso prefira não usar este critério como problema prioritário.',
        'Diferenças de nomes, redação ou nível de detalhamento são aceitáveis quando o significado é equivalente.',
        'Contradições materiais são relevantes, por exemplo a representação dizer multiplicação distância * consumo enquanto o código implementa divisão distância / consumo.',
        'Não priorize este critério desejável se existe um erro essencial de cálculo, validação ou saída.'
      ]
    },
    {
      id: 'crit10',
      criterion: 'Os nomes usados no código permitem compreender de forma razoável o papel das principais grandezas do problema.',
      essential: false,
      guidance: [
        'Nomes como distancia, consumo, preco, litros e custo são exemplos, não requisitos literais.',
        'Aceite nomes abreviados ou em outro idioma quando ainda permitem acompanhar a lógica pelo contexto.',
        'Variáveis como a, b e c não tornam automaticamente a solução incorreta; este é um critério desejável de clareza.',
        'Não transforme preferência estilística em erro essencial.',
        'Só use este critério quando a nomenclatura realmente dificulta compreender a correspondência entre os dados e cálculos.'
      ]
    },
    {
      id: 'crit11',
      criterion: 'Os resultados numéricos de litros e custo são apresentados com duas casas decimais.',
      essential: false,
      guidance: [
        'A solução de referência usa formatação equivalente a %.2f.',
        'Aceite formatação equivalente compatível com o tipo utilizado.',
        'Duas casas decimais são um requisito de apresentação desejável, não devem superar erros essenciais na prioridade.',
        'Não confunda o número de casas mostrado com a correção matemática do valor calculado.',
        'A mensagem de consumo inválido não precisa conter valor numérico formatado.'
      ]
    },
    {
      id: 'crit12',
      criterion: 'O código mantém organização e legibilidade suficientes para que a sequência de entrada, validação, processamento e saída possa ser acompanhada.',
      essential: false,
      guidance: [
        'Avalie clareza funcional, não preferências pessoais de estilo.',
        'Não exija quantidade específica de linhas, comentários, espaços ou chaves quando o código permanece compreensível.',
        'Não penalize declarações agrupadas ou separadas apenas por estilo.',
        'Código compacto ainda pode ser legível se as relações do problema forem claras.',
        'Não priorize este critério desejável sobre qualquer requisito essencial não atendido.'
      ]
    }
  ],

  referenceStrategies: [
    'Ler distância, consumo e preço como valores reais; se consumo <= 0, informar consumo inválido e impedir os cálculos; caso contrário, calcular litros = distância / consumo, depois custo = litros * preço e apresentar os dois resultados.',
    'Usar um ramo positivo consumo > 0 para calcular e exibir litros e custo, deixando o ramo complementar para a mensagem de consumo inválido.',
    'Calcular o custo com expressão equivalente a (distancia / consumo) * preco, desde que a solução também preserve ou calcule separadamente a quantidade de litros necessária para apresentá-la como o primeiro resultado.'
  ],

  commonErrors: [
    {
      error: 'Multiplicar distância pelo consumo para obter a quantidade de combustível.',
      consequence: 'A operação não corresponde à unidade km/L e produz uma quantidade de litros incorreta.'
    },
    {
      error: 'Multiplicar diretamente distância pelo preço do combustível.',
      consequence: 'O custo é calculado sem determinar quantos litros serão consumidos, misturando quilômetros com preço por litro.'
    },
    {
      error: 'Calcular distancia / consumo antes de verificar se o consumo é válido.',
      consequence: 'A tentativa pode executar divisão por zero antes que a validação tenha oportunidade de impedir a operação.'
    },
    {
      error: 'Validar apenas consumo == 0 e permitir consumo negativo.',
      consequence: 'Valores definidos pelo desafio como inválidos ainda entram nos cálculos.'
    },
    {
      error: 'Tratar litros ou custo como dados de entrada em vez de resultados calculados.',
      consequence: 'A decomposição entrada → processamento → saída fica invertida e o programa deixa de derivar as grandezas solicitadas.'
    },
    {
      error: 'Calcular somente o custo ou somente a quantidade de litros.',
      consequence: 'Um dos dois resultados obrigatórios do problema fica ausente.'
    },
    {
      error: 'Usar apenas tipos inteiros para grandezas que podem ser fracionárias.',
      consequence: 'Partes decimais podem ser perdidas e a divisão pode deixar de representar corretamente litros e custo.'
    },
    {
      error: 'Exibir variáveis que não correspondem aos resultados calculados.',
      consequence: 'A matemática interna pode estar correta, mas o usuário recebe outra grandeza ou um valor intermediário.'
    },
    {
      error: 'Acusar ausência de representação apenas porque os campos de representação estão vazios, mesmo quando o código implementa corretamente o problema.',
      consequence: 'Esse seria um falso diagnóstico, pois o comportamento atual do desafio permite avaliar a implementação correta sem tornar o preenchimento da representação obrigatório.'
    }
  ]
};
