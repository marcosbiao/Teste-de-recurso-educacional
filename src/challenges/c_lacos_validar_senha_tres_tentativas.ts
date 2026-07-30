import type { Challenge, AnalysisResult } from '../types.ts';
import { createLocalAnalysisResult } from '../domain/pedagogicalDomain.ts';

export const desafioLacosValidarSenhaTresTentativas: Challenge = {
  id: 'lacos_validar_senha_tres_tentativas',
  categoryId: 'lacos',
  title: 'Validar senha com número limitado de tentativas',
  subtitle: 'Escreva um programa em C que leia uma senha numérica. A senha correta é 1234. O usuário pode tentar no máximo 3 vezes. Ao final, o programa deve mostrar se o acesso foi permitido ou bloqueado.',
  challengeVersion: '1.0.0',
  
  metadata: {
    content: 'Laços de Repetição com Condição de Parada Complexa',
    language: 'C (ANSI/C99)',
    level: 'Intermediário',
    time: '25 minutos',
    requirements: 'Composição de múltiplas condições em laços (while/for), controle de tentativas, flags de estado.',
    skill: 'Desenvolver loops com critérios de parada híbridos ou baseados em flags e limites físicos.',
    version: '1.0.0'
  },

  pedagogicalMetadata: {
    learningObjective: 'Implementar loops lógicos condicionados por múltiplos fatores síncronos (número de tentativas excedido ou acerto de credencial).',
    pedagogicalGoal: 'Compreender a combinação de condições utilizando conectores lógicos (&&),flags booleanas numéricas em C e o controle cirúrgico de fluxos de segurança.',
    expectedDifficulty: 'alta',
    cognitiveOperation: 'aplicar',
    prerequisites: ['Laço Condicional (while)', 'Conectores Lógicos (&&/||)', 'Variáveis de Estado (flags)', 'Mecanismos de Tentativas']
  },

  domainTags: {
    skillTags: ['loops', 'variables', 'conditionals', 'input-output'],
    topicTags: ['basic-c', 'repetition', 'math-logic'],
    difficultyTag: 'high-complexity-logic',
    prerequisiteTags: ['basic-syntax', 'loops', 'conditionals']
  },

  problem: 'Escreva um programa em C que leia uma senha numérica. A senha secreta e correta do sistema é o número 1234. O usuário do console dispõe de, no máximo, 3 tentativas para acertar. Caso digite a senha correta, as leituras param imediatamente. Ao final do processamento, mostre se o acesso foi "Acesso permitido" ou "Acesso bloqueado".',
  
  guidingQuestions: [
    'Como modelar um loop while que dependa de duas condições simultâneas: ainda haver tentativas remanescentes e o acesso ainda não ter sido liberado?',
    'Como usar o operador lógico && de forma correta para unificar esses testes condicionados?',
    'Por que declarar e utilizar uma flag numérica de simulação de booleano (ex: acesso = 0) auxilia a desatar o controle de loops longos?',
    'Onde devemos situar o teste if-else final para imprimir "Acesso permitido" ou "Acesso bloqueado" de forma segura conforme as flags estruturadas?'
  ],

  orientation: {
    input: 'Até 3 tentativas de senhas numéricas colhidas separadamente.',
    output: '"Acesso permitido" ou "Acesso bloqueado" conforme as decisões lógico-estruturais aferidas.',
    cases: 'Digitações: 4444 (erro 1), 5555 (erro 2), 1234 (acerto 3) resulta no final em "Acesso permitido". Digitações: 1111, 2222, 3333 (três erros consecutivos) resulta em "Acesso bloqueado".',
    structure: 'Laço condicional (while) operando com a conjunção de testes (tentativas < 3 && acesso == 0). Captura em cada iteração, incremento de tentativas e alteração da flag de acesso se senha == 1234.',
    expectedLogic: 'Instanciar variaveis senha, tentativas = 0 e acesso = 0. Declarar while (tentativas < 3 && acesso == 0). No bloco, ler senha pelo scanf, somar tentativas++ e testar se senha == 1234. Se for igual, reatribuir acesso = 1. Fora do while, fazer if (acesso == 1) exibindo "Acesso permitido", else "Acesso bloqueado".'
  },

  examples: [
    { input: '1111\n2222\n1234', output: 'Acesso permitido' },
    { input: '9999\n8888\n7777', output: 'Acesso bloqueado' }
  ],

  concepts: [
    'Laços de validade híbridos baseados em múltipla verificação',
    'Flags lógicas numéricas (estado booleano implícito)',
    'Controle de limites operacionais'
  ],

  tips: [
    { 
      id: 1, 
      text: "Você precisa controlar duas coisas em paralelo: quantas tentativas foram feitas (contador tentativas++) e se o usuário já acertou a senha (flag acesso = 0 ou 1).",
      pedagogicalGoal: "Identificar as variáveis críticas de controle."
    },
    { 
      id: 2, 
      text: "A estrutura de repetição while ideal pode ser escrita como: 'while (tentativas < 3 && acesso == 0)'. Ela para se passar de 3 rodadas ou se acesso virar 1.",
      pedagogicalGoal: "Compor condições híbridas com conectores lógicos."
    },
    { 
      id: 3, 
      text: "Dentro do laço, leia a senha com scanf, incremente suas tentativas imediatamente e, se a senha lida for idêntica a 1234, atualize sua flag de acesso para 1.",
      pedagogicalGoal: "Coordenar ações síncronas no corpo iterativo."
    },
    { 
      id: 4, 
      text: "Após o fechamento das chaves do laço, examine o valor de acesso. Se for 1, imprima 'Acesso permitido'. Se não, apresente 'Acesso bloqueado'.",
      pedagogicalGoal: "Estruturar saídas lógicas com base nas flags estáticas."
    }
  ],

  commonErrors: [
    { 
      title: "Autorizar tentativas ilimitadas", 
      description: "Escrever while(senha != 1234) sem acompanhar o volume de iterações criará falhas graves de barreira física, exaurindo recursos do servidor se o usuário errar seguidamente.",
      pedagogicalAdvice: "Telas de segurança financeira ou governamental devem impor tetos físicos severos contra tentativas de força bruta (brute-force)."
    },
    { 
      title: "Ignorar o acerto de credencial interrompendo as leituras", 
      description: "Caso o usuário acerte de primeira ('1234'), o programa não deve continuar solicitante de logins adicionais, sob pena de irritar o operador.",
      pedagogicalAdvice: "Mapeie condições de encerramentos céleres e interrompa imediatamente o consumo quando a meta prioritária for atingida."
    },
    { 
      title: "Exibir 'Acesso bloqueado' precoce por erro intermediário", 
      description: "Colocar o printf de negação dentro do laço avisará que o acesso está bloqueado na tentativa 1 ou 2, mesmo restando vidas para o aluno.",
      pedagogicalAdvice: "Análises de barreiras completas devem relegar o veredicto conclusivo à área pós-término de todos os prazos em loop."
    },
    { 
      title: "Uso equivocado de conectores lógicos", 
      description: "Empregar operadores lógicos de disjunção (||) em vez de conjunções (&&) fará o laço desengajar apenas se ambos os limites caírem, o que gera mau funcionamento total do sistema.",
      pedagogicalAdvice: "Examine com calma as tabelas verdade: o laço deve continuar somente se a tentativa for válida E o acesso ainda continue trancado."
    }
  ],

  solution: `#include <stdio.h>

int main() {
    int senha, tentativas = 0, acesso = 0;

    // Roda enquanto o usuário tiver tentativas livres E não tiver acertado
    while (tentativas < 3 && acesso == 0) {
        scanf("%d", &senha);
        tentativas++; // Registra nova tentativa consumida

        if (senha == 1234) {
            acesso = 1; // Flag vira 1, sinalizando sucesso e forçando parada do loop
        }
    }

    // Veredicto final fora do loop
    if (acesso == 1) {
        printf("Acesso permitido\\n");
    } else {
        printf("Acesso bloqueado\\n");
    }

    return 0;
}`,

  finalSummary: [
    'Flags Lógicas: Empregar variáveis que funcionam como interruptores lógicos simplifica o fluxo de tomada de decisões.',
    'Limites Físicos: Proteger barramentos contra abusos de looping é a base de boa arquitetura de sistemas seguros.',
    'Operadores de Conjunção: Utilizar && sincroniza percursos múltiplos sob restrições severas.'
  ],

  nextChallengeId: 'vetores_media_seis_valores',

  expectedCriteria: [
    { id: 'crit1', description: 'Declarador de variáveis tentativas e flag de sucesso', importance: 'essencial' },
    { id: 'crit2', description: 'Loop condicionado a tentativas menores que 3', importance: 'essencial' },
    { id: 'crit3', description: 'Leitura com scanf no bloco do laço incrementando tentativas', importance: 'essencial' },
    { id: 'crit4', description: 'Interrupção antecipada por flag ou break quando senha == 1234', importance: 'essencial' },
    { id: 'crit5', description: 'Condicional final fora do loop decidindo mensagens corretas do console', importance: 'essencial' }
  ],

  probableErrors: [
    { id: 'err1', description: 'Loop infinito de autenticação', likelyCause: 'Ausência de incremento de tentativas dentro das chaves de repetição' },
    { id: 'err2', description: 'Uso de conectores lógicos incompatíveis', likelyCause: 'Escrever operador || no teste complexo de paridade do while' },
    { id: 'err3', description: 'Validação de senha deslocada espacialmente', likelyCause: 'Posicionar veredicto final e exclusões dentro da rotatividade do laço' }
  ],

  templateCode: `#include <stdio.h>\n\nint main() {\n    // Seu código aqui\n    \n    return 0;\n}`,
  
  analyzeLocally: (code: string): AnalysisResult => {
    const codeLower = code.toLowerCase();
    const checks = {
      stdio: /#include\s*<\s*stdio\.h\s*>/.test(codeLower),
      main: /int\s+main\s*\(/.test(codeLower),
      loops: /\b(while|for)\b/.test(codeLower),
      scanf: /scanf\s*\(/.test(codeLower),
      passwordCheck: /\b1234\b/.test(codeLower),
      limitAttempts: /<\s*3\b|<=2\b/.test(codeLower),
      hasAnd: /&&/.test(codeLower),
      increment: /tentativas\s*(\+\+|\+=\s*1|=\s*tentativas\s*\+\s*1)/.test(codeLower) || /tentativa\s*(\+\+|\+=\s*1)/.test(codeLower),
      allowedMsg: /(permitido|liberado)/.test(codeLower),
      blockedMsg: /(bloqueado|barrado|recusado)/.test(codeLower),
    };

    const good: string[] = [];
    const review: string[] = [];
    let score = 0;

    if (checks.stdio) { good.push("Disponibilizou cabeçalho stdio.h."); score++; }
    else { review.push("Assinale #include <stdio.h>."); }

    if (checks.main) { good.push("Int main() bem configurado."); score++; }
    else { review.push("Sinalize int main() no início."); }

    if (checks.loops) { good.push("Você utilizou uma estrutura de laço."); score++; }
    else { review.push("Utilize um laço (while ou for) para repetir o fluxo de tentativas."); }

    if (checks.scanf && checks.passwordCheck) { good.push("Presença de leitura e verificação da senha literal '1234' no código."); score += 2; }
    else { review.push("Faça leitura pelo scanf e teste se o valor bate com o segredo 1234."); }

    if (checks.limitAttempts) { good.push("Você implementou uma condição limitadora de no máximo 3 tentativas."); score += 2; }
    else { review.push("Garanta que o programa encerre caso o usuário comente 3 falhas de senha."); }

    if (checks.increment) { good.push("Incremento do contador de tentativas ativado de forma correta."); score++; }
    else { review.push("Não esqueça de somar 1 em suas tentativas a cada leitura dentro do loop, para evitar loop infinito."); }

    if (checks.allowedMsg && checks.blockedMsg) { good.push("Sinalizações de bloqueio e liberação registradas com sucesso."); score += 2; }
    else { review.push("Revise se suas mensagens finais atendem e exibem 'Acesso permitido' ou 'Acesso bloqueado' conforme as saídas lógicas."); }

    let category: AnalysisResult['category'] = 'tentativa inicial';
    if (score >= 9) category = 'solução adequada';
    else if (score >= 6) category = 'quase completa';
    else if (score >= 3) category = 'parcialmente correta';

    let difficulty = "Dificuldade na estruturação de loops com saídas lógicas complexas";
    if (!checks.loops) difficulty = "Sem laço de segurança de tentativas";
    else if (!checks.limitAttempts) difficulty = "Ausência de teto limitador de tentativas operacionais";
    else if (!checks.passwordCheck) difficulty = "Sem verificação estrita de senha seletora";

    let nextStep = "Comece declarando variáveis int senha, tentativas = 0, acesso = 0.";
    if (category === 'parcialmente correta') nextStep = "Crie uma instrução while que repita dependendo do valor do iterador e de acesso.";
    if (category === 'quase completa') nextStep = "Assegure-se de que a verificação de acesso permitido ou negado esteja fora do escopo do laço condicional via if/else final.";
    if (category === 'solução adequada') nextStep = "Parabéns! Excelente emprego de conectores de restrição e flags de estado para a segurança cibernética de aplicações.";

    return createLocalAnalysisResult(
      category,
      good,
      review,
      nextStep,
      difficulty,
      checks.loops ? ['logica'] : ['sintaxe_aparente'],
      `Análise Heurística de Acesso: ${score}/10 pontos.`
    );
  }
};
