import type { Challenge, AnalysisResult } from '../types.ts';
import { createLocalAnalysisResult } from '../domain/pedagogicalDomain.ts';

export const desafioVetoresMaioresQueDez: Challenge = {
  id: 'vetores_maiores_que_dez',
  categoryId: 'vetores',
  title: 'Filtrar números maiores que 10',
  subtitle: 'Escreva um programa em C que leia 8 números inteiros em um vetor, percorra o vetor e exiba apenas os números maiores que 10.',
  challengeVersion: '1.0.0',
  
  metadata: {
    content: 'Laços de Seleção sobre Vetores Inteiros',
    language: 'C (ANSI/C99)',
    level: 'Intermediário',
    time: '20 minutos',
    requirements: 'Declaração de vetor inteiro de tamanho 8, loops de leitura e filtragem, estruturas condicionais internas.',
    skill: 'Iterar arranjos para filtrar e exibir subconjuntos de dados baseados em critérios relacionais.',
    version: '1.0.0'
  },

  pedagogicalMetadata: {
    learningObjective: 'Implementar a lógica de filtragem sequencial de dados em vetores unidimensionais por meio de condições relacionais.',
    pedagogicalGoal: 'Compreender a necessidade de persistir dados temporários em arrays para processamentos e filtros iterativos posteriores.',
    expectedDifficulty: 'media',
    cognitiveOperation: 'aplicar',
    prerequisites: ['Arrays Inteiros', 'Preenchimento Vetorial', 'Loops Condicionais', 'Estruturas Condicionais (if)']
  },

  domainTags: {
    skillTags: ['arrays', 'variables', 'loops', 'conditionals'],
    topicTags: ['basic-c', 'data-structures', 'math-logic'],
    difficultyTag: 'medium-complexity-logic',
    prerequisiteTags: ['basic-syntax', 'loops']
  },

  problem: 'Escreva um programa em C que leia do teclado 8 números inteiros e guarde-os em um vetor de tamanho 8. Após preencher todo o vetor, crie um laço que percorra as posições do vetor filtrando e mostrando no console exclusivamente os elementos que sejam estritamente maiores que 10.',
  
  guidingQuestions: [
    'Como declarar de forma correta um vetor de inteiros com capacidade de 8 elementos?',
    'Por que é vantajoso preencher o vetor primeiro em um laço e depois aplicar o filtro em outro laço?',
    'Como indexar a checagem lógica garantindo que cada posição do vetor seja avaliada?',
    'Qual operador relacional representa a comparação estritamente maior que 10?'
  ],

  orientation: {
    input: '8 números inteiros digitados separadamente no teclado.',
    output: 'Uma lista com os números que ultrapassam 10, mostrados individualmente, ou "Nenhum" se não houver valores aprovados.',
    cases: 'Se as entradas forem: 15, 3, 9, 21, 10, 8, 45, 0; os mostrados devem ser: 15, 21 e 45. Se as entradas forem 1, 2, 3, 4, 5, 6, 7, 8; o programa deve mostrar "Nenhum".',
    structure: 'Instanciação de um vetor int de tamanho 8. Um primeiro laço for de 0 a 7 lendo os dados. Um segundo laço de 0 a 7 com a condicional if (vetor[i] > 10) disparando printf com o elemento e atualizando uma variável de controle.',
    expectedLogic: 'Declarar int vetor[8], i e encontrou = 0. Executar loop de 0 a 7 recolhendo entradas dinâmicas em &vetor[i]. Implementar novo loop (ou aproveitar o mesmo) avaliando if (vetor[i] > 10), exibindo os dados aprovados e marcando encontrou = 1. Ao final, se encontrou continuar 0, imprimir "Nenhum".'
  },

  examples: [
    { input: '15 3 9 21 10 8 45 0', output: '15\n21\n45' },
    { input: '1 2 3 4 5 6 7 8', output: 'Nenhum' }
  ],

  concepts: [
    'Persistência em memória temporária por arranjos unidimensionais',
    'Separação de responsabilidades (leitura vs. busca ou filtro)',
    'Operadores relacionais de desigualdade em loops'
  ],

  tips: [
    { 
      id: 1, 
      text: "Para armazenar os 8 números, declare um vetor inteiro com a sintaxe: 'int vetor[8];'.",
      pedagogicalGoal: "Fixar a definição estática do tamanho do vetor."
    },
    { 
      id: 2, 
      text: "Escreva um primeiro laço 'for' para ler todas as posições do vetor, variando o índice de 0 a 7 com incrementos de um em um.",
      pedagogicalGoal: "Montar estruturas seguras de leitura de coleções."
    },
    { 
      id: 3, 
      text: "Após preencher, faça uma varredura (outroloop ou na mesma etapa). Em cada passo, verifique se a célula atual é maior que 10: 'if (vetor[i] > 10)'.",
      pedagogicalGoal: "Aplicar condições de filtragem em elementos de vetores."
    },
    { 
      id: 4, 
      text: "Se a comparação do seu 'if' for verdadeira, execute o printf mostrando o valor daquele índice específico e marque que algum número foi encontrado.",
      pedagogicalGoal: "Coordenar exibições indexadas em C."
    }
  ],

  commonErrors: [
    { 
      title: "Desfocar o índice ao imprimir a resposta", 
      description: "Escrever printf('%d', i) em vez de printf('%d', vetor[i]) imprimirá o valor do contador (como 0, 3, etc.) ao invés dos números informados naqueles índices.",
      pedagogicalAdvice: "Lembre-se de que a variável iteradora serve exclusivamente de chave de acesso (ponteiro lógico) para ler as caixinhas do vetor."
    },
    { 
      title: "Tratar 10 como maior que 10", 
      description: "Usar operador '>= 10' incluirá o número 10 na amostragem filtrada, ferindo a especificação estrita do enunciado de 'maiores que 10'.",
      pedagogicalAdvice: "Para relações estritas, prefira operadores diretos, ex: vetor[i] > 10."
    },
    { 
      title: "Varredura fora dos limites de tamanho do vetor", 
      description: "Rodar o laço repetidor de 0 a 8 tentará ler o vetor[8], violando limites estáticos da linguagem C.",
      pedagogicalAdvice: "Um vetor de tamanho N possui células operacionais que variam estritamente de 0 até N-1. Nunca acesse a célula de valor igual a N."
    },
    { 
      title: "Criar variáveis estáticas para cada leitura", 
      description: "Criar 8 variáveis avulsas int a,b,c... e não carregar no vetor viola o propósito didático do treinamento de arrays homogêneos.",
      pedagogicalAdvice: "Adote a disciplina de arranjos descrita para organizar em bloco homogêneo os fluxos volumosos."
    },
    {
      title: "Não tratar o caso sem resultados",
      description: "Quando nenhum elemento é maior que 10, deixar o programa sem saída contradiz a saída esperada.",
      pedagogicalAdvice: "Use uma variável de controle iniciada em 0 e imprima 'Nenhum' ao final se nenhum valor tiver passado pelo filtro."
    }
  ],

  solution: `#include <stdio.h>

int main() {
    int vetor[8];
    int i, encontrou = 0;

    // Leitura dos 8 números inteiros
    for (i = 0; i < 8; i++) {
        scanf("%d", &vetor[i]);
    }

    // Varredura de filtragem dos elementos maiores que 10
    for (i = 0; i < 8; i++) {
        if (vetor[i] > 10) {
            printf("%d\\n", vetor[i]);
            encontrou = 1;
        }
    }

    if (encontrou == 0) {
        printf("Nenhum\\n");
    }

    return 0;
}`,

  finalSummary: [
    'Filtragem Indexada: Percorrer arranjos aplicando condicionais individualizadas em posições específicas é uma das habilidades de manipulação mais valiosas.',
    'Separação de Etapas: Isolar leitura e processamento torna algoritmos complexos legíveis e organizados.',
    'Padrão de Claves de Limite: Garantir que as varreduras transcorram entre 0 e tamanho-1 protege a alocação do sistema operacional.'
  ],

  nextChallengeId: 'vetores_menor_e_posicao',

  expectedCriteria: [
    { id: 'crit1', description: 'Declaração correta de vetor int de tamanho 8', importance: 'essencial' },
    { id: 'crit2', description: 'Laço coletando os números de 0 até 7', importance: 'essencial' },
    { id: 'crit3', description: 'Uso de condicional testando se vetor[i] > 10', importance: 'essencial' },
    { id: 'crit4', description: 'Printf disparado dentro do if imprimindo o valor do elemento do vetor correspondente', importance: 'essencial' },
    { id: 'crit5', description: 'Controle do caso sem resultados imprimindo "Nenhum"', importance: 'essencial' },
    { id: 'crit6', description: 'Ausência de estouro de tamanho de limite nas varreduras iteradas', importance: 'essencial' }
  ],

  probableErrors: [
    { id: 'err1', description: 'Exibição inadequada do índice no lugar do conteúdo', likelyCause: 'Chamar printf do iterador i em vez de vetor[i]' },
    { id: 'err2', description: 'Inclusão imprecisa de constantes limítrofes', likelyCause: 'Confundir maior estrito com maior descritivo usando >= no teste if' },
    { id: 'err3', description: 'Estouro de faixas de arranjos', likelyCause: 'Programar o laço limitando a condição por <= 8' },
    { id: 'err4', description: 'Ausência de saída quando nenhum valor é maior que 10', likelyCause: 'Não manter um sinalizador ou contador para detectar se o filtro encontrou algum elemento' }
  ],

  templateCode: `#include <stdio.h>\n\nint main() {\n    // Seu código aqui\n    \n    return 0;\n}`,
  
  analyzeLocally: (code: string): AnalysisResult => {
    const codeLower = code.toLowerCase();
    const checks = {
      stdio: /#include\s*<\s*stdio\.h\s*>/.test(codeLower),
      main: /int\s+main\s*\(/.test(codeLower),
      loops: /\b(for|while)\b/.test(codeLower),
      arrayDeclaration: /int\s+[a-zA-Z_][a-zA-Z0-9_]*\s*\[\s*8\s*\]/.test(codeLower),
      filterGreater: />\s*10\b/.test(codeLower),
      printVetor: /print[\s\S]*?\[\s*[a-zA-Z0-9_]+\s*\]/.test(codeLower),
      printsNenhum: /nenhum/.test(codeLower),
      scanf: /scanf\s*\(/.test(codeLower)
    };

    const good: string[] = [];
    const review: string[] = [];
    let score = 0;

    if (checks.stdio) { good.push("Localizou dependência biblioteca stdio.h."); score++; }
    else { review.push("Assinale #include <stdio.h> no topo do programa C."); }

    if (checks.main) { good.push("Função int main() presente."); score++; }
    else { review.push("Assegure int main() declarado."); }

    if (checks.arrayDeclaration) { good.push("Definiu vetor inteiro de tamanho 8 como planejado."); score += 3; }
    else { review.push("Declare o vetor de tamanho 8, por exemplo: int meu_vetor[8];"); }

    if (checks.loops) { good.push("Você introduziu loop fixo estruturado."); score += 2; }
    else { review.push("Implemente repetição para ler e varrer o vetor."); }

    if (checks.filterGreater) { good.push("Estrutura condicional de teste se o elemento passa de 10 ativa."); score += 2; }
    else { review.push("Insira um teste condicional para examinar se a célula supera o valor 10, ex: vetor[i] > 10."); }

    if (checks.printVetor) { score++; }

    if (checks.printsNenhum) { good.push("Tratamento do caso sem números maiores que 10 identificado."); score++; }
    else { review.push("Inclua a saída 'Nenhum' quando nenhum elemento do vetor for maior que 10."); }

    let category: AnalysisResult['category'] = 'tentativa inicial';
    if (score >= 10) category = 'solução adequada';
    else if (score >= 6) category = 'quase completa';
    else if (score >= 3) category = 'parcialmente correta';

    let difficulty = "Dificuldade na varredura condicional de arranjos";
    if (!checks.arrayDeclaration) difficulty = "Sem declaração de vetor int de tamanho 8";
    else if (!checks.loops) difficulty = "Sem laço indexador";
    else if (!checks.filterGreater) difficulty = "Sem teste de elementos maiores que 10";
    else if (!checks.printsNenhum) difficulty = "Sem tratamento do caso sem números maiores que 10";

    let nextStep = "Comece com int vetor[8]; e use um laço 'for' de zero a sete preenchendo o array.";
    if (category === 'parcialmente correta') nextStep = "Adicione um if comparador verificando se o elemento do vetor focado 'vetor[i]' passa de 10.";
    if (category === 'quase completa') nextStep = "Ponha o printf no bloco do if e trate a saída 'Nenhum' caso o filtro não encontre valores.";
    if (category === 'solução adequada') nextStep = "Trabalho formidável! Dominou com competência os filtros relacionais de vetores.";

    return createLocalAnalysisResult(
      category,
      good,
      review,
      nextStep,
      difficulty,
      checks.loops ? ['logica'] : ['sintaxe_aparente'],
      `Análise Heurística de Filtro de Array: ${score}/11 pontos.`
    );
  }
};
