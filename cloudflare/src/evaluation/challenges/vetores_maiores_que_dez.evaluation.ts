import type { ChallengeEvaluation } from '../types';

export const vetoresMaioresQueDezEvaluation: ChallengeEvaluation = {
  challengeId: 'vetores_maiores_que_dez',

  rubric: [
    {
      id: 'crit1',
      criterion: 'O programa utiliza um vetor de inteiros com capacidade para armazenar as 8 entradas solicitadas.',
      essential: true,
      guidance: [
        'O uso efetivo de vetor faz parte do objetivo da atividade; oito variáveis escalares independentes não satisfazem integralmente o critério.',
        'Não exija nome específico para o vetor.',
        'Aceite tamanho definido por constante quando a capacidade efetiva for 8.',
        'Os valores fornecidos devem ser preservados no vetor.'
      ]
    },
    {
      id: 'crit2',
      criterion: 'Os 8 valores são lidos e armazenados em todas as posições válidas do vetor por meio de uma repetição indexada.',
      essential: true,
      guidance: [
        'A coleta deve alcançar exatamente os oito elementos do vetor.',
        'Aceite for, while ou estrutura repetitiva equivalente.',
        'Não conclua apenas pela forma textual do limite; analise quantas posições são efetivamente preenchidas.',
        'Não permita que a leitura dependa de posições fora da capacidade do vetor.'
      ]
    },
    {
      id: 'crit3',
      criterion: 'Durante a filtragem, cada elemento do vetor é testado pela relação estrita de ser maior que 10.',
      essential: true,
      guidance: [
        'A condição deve ser aplicada ao valor armazenado no elemento atual, não ao índice.',
        'O número 10 não deve ser incluído, pois o enunciado exige valores estritamente maiores que 10.',
        'Uma comparação maior ou igual a 10 viola este critério.',
        'Aceite forma relacional equivalente desde que o conjunto filtrado corresponda exatamente aos valores > 10.'
      ]
    },
    {
      id: 'crit4',
      criterion: 'Cada elemento que satisfaz o filtro é exibido, e elementos que não satisfazem a condição não são apresentados como resultados filtrados.',
      essential: true,
      guidance: [
        'A saída deve mostrar o conteúdo do vetor que passou pelo filtro, não o índice da posição.',
        'A impressão deve ocorrer associada ao processamento de cada valor aprovado.',
        'Não exija literalmente um printf dentro de um bloco if se outra estrutura equivalente garante que somente valores > 10 sejam exibidos.',
        'Se vários elementos satisfazem a condição, todos eles devem aparecer.'
      ]
    },
    {
      id: 'crit5',
      criterion: 'Quando nenhum dos 8 elementos é maior que 10, o programa apresenta explicitamente a saída "Nenhum", e não apresenta essa mensagem quando existe ao menos um resultado.',
      essential: true,
      guidance: [
        'A solução precisa manter ou inferir estado suficiente para distinguir entre zero resultados e pelo menos um resultado.',
        'Uma flag, contador de encontrados ou estratégia equivalente é válida.',
        'Não considere suficiente imprimir "Nenhum" incondicionalmente após a varredura.',
        'A mensagem deve ocorrer somente depois de se confirmar que nenhum elemento passou pelo filtro.'
      ]
    },
    {
      id: 'crit6',
      criterion: 'Todas as varreduras do vetor respeitam os limites válidos de suas 8 posições, sem omitir elementos nem acessar além da capacidade.',
      essential: true,
      guidance: [
        'O processamento deve abranger as oito posições válidas e não alcançar uma nona posição inexistente.',
        'Verifique erros de off-by-one tanto na leitura quanto na filtragem.',
        'Não exija uma forma textual específica como i < 8 se outra condição produz exatamente o mesmo conjunto seguro de índices.',
        'Um laço que alcança posição igual ao tamanho do vetor viola o critério.'
      ]
    }
  ],

  referenceStrategies: [
    'Preencher um vetor de 8 inteiros, percorrê-lo novamente, exibir cada elemento cujo valor seja estritamente maior que 10 e marcar que houve resultado; ao final, exibir "Nenhum" somente se nenhum elemento foi aprovado.',
    'Preencher o vetor e usar uma varredura segura equivalente que filtre os 8 elementos por > 10, mantenha uma contagem ou sinalização de resultados e trate explicitamente o caso de filtro vazio.'
  ],

  commonErrors: [
    {
      error: 'Imprimir o índice da posição em vez do valor armazenado no vetor.',
      consequence: 'A saída mostra números de posição, não os elementos maiores que 10.'
    },
    {
      error: 'Usar maior ou igual a 10 no filtro.',
      consequence: 'O valor 10 é incluído indevidamente, embora o enunciado exija relação estritamente maior.'
    },
    {
      error: 'Não tratar o caso em que nenhum elemento passa pelo filtro.',
      consequence: 'O programa termina sem a mensagem "Nenhum" exigida para esse cenário.'
    },
    {
      error: 'Imprimir "Nenhum" mesmo depois de ter exibido valores aprovados.',
      consequence: 'A saída se torna contraditória, indicando simultaneamente existência e ausência de resultados.'
    },
    {
      error: 'Acessar uma posição igual ou superior ao tamanho do vetor.',
      consequence: 'O programa ultrapassa os limites válidos do arranjo.'
    },
    {
      error: 'Omitir uma das oito posições na leitura ou na filtragem.',
      consequence: 'Um valor fornecido pode deixar de ser analisado e, se for maior que 10, não aparecer no resultado.'
    },
    {
      error: 'Usar oito variáveis independentes sem armazenar as entradas no vetor.',
      consequence: 'A solução não atende ao objetivo pedagógico de armazenamento e processamento vetorial.'
    }
  ]
};
