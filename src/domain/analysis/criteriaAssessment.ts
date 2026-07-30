import type { AnalysisResult, Challenge, CriterionAssessment, CriterionStatus, PrimaryIssue } from '../../types';
import { createAnalysisResult } from '../pedagogicalDomain';

const STATUS_PRIORITY: Record<CriterionStatus, number> = {
  not_satisfied: 0,
  partial: 1,
  not_verifiable: 2,
  satisfied: 3
};

function cleanCode(code: string): string {
  return (code || '').replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '').toLocaleLowerCase('pt-BR');
}

function countCalls(code: string, name: string): number {
  return (code.match(new RegExp(`\\b${name}\\s*\\(`, 'g')) || []).length;
}

function expectedQuantity(text: string): number | undefined {
  const normalized = text.toLocaleLowerCase('pt-BR');
  const match = normalized.match(/\b(\d+)\b/);
  if (match) return Number(match[1]);
  if (/tr[eê]s/.test(normalized)) return 3;
  if (/dois|duas/.test(normalized)) return 2;
  if (/seis/.test(normalized)) return 6;
  if (/cinco/.test(normalized)) return 5;
  return undefined;
}

function assessmentForCriterion(challenge: Challenge, criterion: Challenge['expectedCriteria'][number], code: string): CriterionAssessment {
  if (challenge.id === "cci01-custo-viagem") {
    const cciStatus = (value: CriterionStatus, evidence: string): CriterionAssessment => ({ criterionId: criterion.id, status: value, evidence });
    const validScanf = (code.match(/\bscanf\s*\(\s*"%f"/g) || []).length;
    const hasThreeScanf = countCalls(code, "scanf") >= 3;
    const quantity = code.match(/\b([a-z_]\w*)\s*=\s*[a-z_\u00e1\u00e0\u00e3\u00e2]*\s*\/\s*consumo\b/);
    const quantityName = quantity?.[1];
    const hasCost = Boolean(quantityName && new RegExp("\\b[a-z_]\\w*\\s*=\\s*" + quantityName + "\\s*\\*\\s*preco\\b").test(code));
    const calculationIndex = quantity?.index ?? -1;
    const validationIndex = code.search(/\bif\s*\([^)]*consumo\s*(?:<=|<|==)\s*0[^)]*\)/);
    const protectsDivision = validationIndex >= 0 && (calculationIndex < 0 || validationIndex < calculationIndex);
    const resultOutput = (name: string | undefined) => Boolean(name && new RegExp("\\bprintf\\s*\\([^;]*\\b" + name + "\\b", "i").test(code));
    const anyResultOutput = resultOutput(quantityName) && /\bprintf\s*\([^;]*(?:custo|valor|total|qtd|litros)\b/i.test(code);
    if (criterion.id === "crit1") return cciStatus(validScanf >= 3 ? "satisfied" : hasThreeScanf ? "partial" : "not_satisfied", validScanf >= 3 ? "Foram encontradas três leituras de float com `scanf com %f`." : hasThreeScanf ? "Há três chamadas a `scanf`, mas ao menos um especificador de float não é `%f`." : "Não foram encontradas as três leituras necessárias.");
    if (criterion.id === "crit2") return cciStatus(quantityName && hasCost ? "satisfied" : quantityName || hasCost ? "partial" : "not_satisfied", quantityName && hasCost ? "Foram identificados o cálculo intermediário e o custo dependente dele." : "Não foram identificados, com segurança, os dois cálculos necessários.");
    if (criterion.id === "crit3") return cciStatus(quantityName && hasCost ? "satisfied" : "not_verifiable", quantityName && hasCost ? "O custo usa o resultado intermediário do cálculo de quantidade." : "Não há evidência segura da dependência entre quantidade e custo.");
    if (criterion.id === "crit4") return cciStatus(validScanf >= 3 && quantityName && hasCost ? "satisfied" : "partial", "A sequência local foi verificada apenas pelas leituras e atribuições observáveis.");
    if (criterion.id === "crit5") return cciStatus(protectsDivision ? "satisfied" : "not_satisfied", protectsDivision ? "Há validação de `consumo` antes da divisão." : "A divisão por `consumo` não é precedida por uma validação observável contra zero.");
    if (criterion.id === "crit6") return cciStatus(quantityName && hasCost ? "satisfied" : "partial", quantityName && hasCost ? "A lógica de cálculo está presente na tentativa." : "A lógica de cálculo ainda está incompleta.");
    if (criterion.id === "crit7") return cciStatus(/\b(float|double)\b/.test(code) ? "satisfied" : "not_satisfied", /\b(float|double)\b/.test(code) ? "Foram declarados tipos reais." : "Não foram encontrados tipos reais.");
    if (criterion.id === "crit8") return cciStatus(anyResultOutput ? "satisfied" : "not_satisfied", anyResultOutput ? "Foram encontradas saídas relacionadas aos resultados calculados." : "Os `printf` encontrados são apenas prompts de entrada ou não mostram os dois resultados.");
    if (criterion.id === "crit11") return cciStatus(anyResultOutput && /%\.2f/.test(code) ? "satisfied" : "not_satisfied", anyResultOutput && /%\.2f/.test(code) ? "Há saída de resultado com duas casas decimais." : "Não foi encontrada saída de resultado com formato `%.2f`.");
  }
  const description = criterion.description.toLocaleLowerCase('pt-BR');
  const expected = expectedQuantity(description);
  const scanfCount = countCalls(code, 'scanf');
  const printfCount = countCalls(code, 'printf');
  const has = (pattern: RegExp) => pattern.test(code);
  const status = (present: boolean, evidence: string, partial = false): CriterionAssessment => ({
    criterionId: criterion.id,
    status: present ? 'satisfied' : partial ? 'partial' : 'not_satisfied',
    evidence
  });

  if (/entrada|leitura|scanf/.test(description)) {
    const actual = scanfCount;
    if (!actual) return status(false, 'Não foi encontrada uma chamada a `scanf` na tentativa.');
    if (expected && actual < expected) return status(false, `Foram encontradas ${actual} leituras com \`scanf\`, mas o critério pede ${expected}.`, true);
    return status(true, `Foram encontradas ${actual} leituras com \`scanf\` na tentativa.`);
  }
  if (/sa[ií]da|exib|mostr|printf|resultado/.test(description)) {
    if (!printfCount) return status(false, 'Não foi encontrada uma instrução de saída com `printf` após os cálculos.');
    if (expected && printfCount < expected) return status(false, `Foram encontradas ${printfCount} saídas com \`printf\`, menos que as ${expected} solicitadas.`, true);
    return status(true, `Foram encontradas ${printfCount} instruções de saída com \`printf\`.`);
  }
  if (/tipo.*real|float|double|casas decimais/.test(description)) {
    return status(has(/\b(float|double)\b/), has(/\b(float|double)\b/) ? 'A tentativa declara ao menos um tipo real (`float` ou `double`).' : 'Não foi encontrado `float` ou `double` na tentativa.');
  }
  if (/fun[cç][aã]o|procedimento|par[aâ]metro|argumento|retorn/.test(description)) {
    const functionDefinition = /\b(?:int|float|double|void|char)\s+(?!main\b)[a-z_]\w*\s*\([^)]*\)\s*\{/.test(code);
    const functionCall = /\b(?!if\b|for\b|while\b|switch\b|main\b)[a-z_]\w*\s*\(/.test(code.replace(/\b(?:int|float|double|void|char)\s+[a-z_]\w*\s*\([^)]*\)\s*\{/g, ''));
    if (/cham/.test(description) && !functionCall) return status(false, 'Não foi identificada uma chamada de função além da estrutura principal.');
    return status(functionDefinition, functionDefinition ? 'Foi identificada uma definição de função além de `main`.' : 'Não foi identificada uma definição de função além de `main`.');
  }
  if (/arquivo|fopen|fclose|abertura/.test(description)) {
    if (/fech/.test(description)) return status(has(/\bfclose\s*\(/), has(/\bfclose\s*\(/) ? 'Foi encontrada uma chamada a `fclose`.' : 'Não foi encontrada uma chamada a `fclose`.');
    if (/verif/.test(description)) return status(has(/\bif\s*\([^)]*arquivo[^)]*\)/), has(/\bif\s*\([^)]*arquivo[^)]*\)/) ? 'Há uma condição que verifica a variável do arquivo.' : 'Não foi encontrada uma condição que verifique a abertura do arquivo.');
    return status(has(/\bfopen\s*\(/), has(/\bfopen\s*\(/) ? 'Foi encontrada uma chamada a `fopen`.' : 'Não foi encontrada uma chamada a `fopen`.');
  }
  if (/vetor|matriz|[ií]ndice|posi[cç][aã]o/.test(description)) {
    return status(has(/\[[^\]]+\]/), has(/\[[^\]]+\]/) ? 'A tentativa possui acesso entre colchetes.' : 'Não foi encontrado acesso por índice entre colchetes.');
  }
  if (/la[cç]o|repeti[cç]|contador|acumulador|for|while/.test(description)) {
    const loop = has(/\b(for|while|do)\b/);
    const updates = has(/\+\+|--|\+=|-=|\w+\s*=\s*\w+\s*[+\-]/);
    if (loop && /atualiz|contador|acumulador/.test(description) && !updates) return status(false, 'Há um laço, mas não foi identificada atualização de contador ou acumulador.', true);
    return status(loop, loop ? 'Foi identificada uma estrutura de repetição.' : 'Não foi encontrada uma estrutura de repetição.');
  }
  if (/(condi[cç]|(^|[^a-z])if([^a-z]|$)|caso|compar)/.test(description)) {
    return status(has(/\bif\s*\(/), has(/\bif\s*\(/) ? 'Foi identificada uma condição `if` na tentativa.' : 'Não foi encontrada uma condição `if` na tentativa.');
  }
  if (/c[aá]lcul|m[eé]dia|soma|multiplic|divis|litros|custo|valor/.test(description)) {
    const names = description.match(/\b(?:litros|custo|valor|media|m[eé]dia|soma|distancia|distância)\b/g) || [];
    const namedAssignment = names.some(name => new RegExp(`\\b${name.replace(/[áàãâ]/g, 'a')}\\w*\\s*=`, 'i').test(code));
    const operation = has(/[+*/-]/);
    return status(namedAssignment || operation, namedAssignment || operation ? 'Foi identificada uma atribuição ou expressão de cálculo relacionada ao critério.' : 'Não foi identificada uma expressão de cálculo relacionada ao critério.');
  }
  return { criterionId: criterion.id, status: 'not_verifiable', evidence: 'O critério não possui um padrão local suficientemente seguro para classificação automática.' };
}

export function assessChallengeCriteria(challenge: Challenge, studentCode: string): CriterionAssessment[] {
  const code = cleanCode(studentCode);
  return challenge.expectedCriteria.map(criterion => assessmentForCriterion(challenge, criterion, code));
}

function criterionIsExplicit(challenge: Challenge, criterion: Challenge['expectedCriteria'][number]): boolean {
  if (criterion.importance === 'essencial') return true;
  const context = `${challenge.problem} ${challenge.orientation.input} ${challenge.orientation.output} ${challenge.orientation.cases}`.toLocaleLowerCase('pt-BR');
  return criterion.description.toLocaleLowerCase('pt-BR').split(/\s+/).some(word => word.length > 4 && context.includes(word));
}

export function selectPriorityCriterion(challenge: Challenge, assessments: CriterionAssessment[]): CriterionAssessment | undefined {
  return assessments
    .filter(item => item.status === 'partial' || item.status === 'not_satisfied')
    .sort((a, b) => {
      const criterionA = challenge.expectedCriteria.find(item => item.id === a.criterionId)!;
      const criterionB = challenge.expectedCriteria.find(item => item.id === b.criterionId)!;
      const explicitDelta = Number(criterionIsExplicit(challenge, criterionB)) - Number(criterionIsExplicit(challenge, criterionA));
      const cciOutputDelta = challenge.id === "cci01-custo-viagem" ? Number(criterionB.id === "crit8") - Number(criterionA.id === "crit8") : 0;
      return cciOutputDelta || explicitDelta || STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status] || challenge.expectedCriteria.indexOf(criterionA) - challenge.expectedCriteria.indexOf(criterionB);
    })[0];
}

export function criterionFeedback(challenge: Challenge, assessment: CriterionAssessment, code: string): Pick<AnalysisResult, 'studentFeedback'>['studentFeedback'] {
  const criterion = challenge.expectedCriteria.find(item => item.id === assessment.criterionId)!;
  const description = criterion.description;
  const resultNames = [...code.matchAll(/\b([a-zA-Z_]\w*)\s*=/g)].map(match => match[1]).filter(name => !['if', 'for', 'while'].includes(name)).slice(-2);
  const outputs = /sa[ií]da|exib|mostr|printf|resultado/i.test(description);
  const evidence = outputs && !/\bprintf\s*\(/.test(code)
    ? `Após calcular ${resultNames.length ? resultNames.map(name => `\`${name}\``).join(' e ') : 'os resultados'}, não há uma saída com \`printf\` antes de \`return 0\`.`
    : assessment.evidence;
  const explanation = outputs
    ? 'Os resultados podem ficar armazenados nas variáveis, mas não são apresentados ao usuário como o enunciado solicita.'
    : `Sem atender a esse critério, a solução não cumpre o requisito "${description}".`;
  const reference = resultNames.length ? resultNames.map(name => `\`${name}\``).join(' e ') : 'o resultado principal';
  return {
    positiveObservation: '',
    primaryIssue: { hasIssue: true, type: outputs ? 'saida_incorreta' : 'logica', criterionId: criterion.id, concept: description, evidence, explanation },
    guidingQuestion: outputs ? `Em que momento ${reference} é apresentado ao usuário?` : `Como sua implementação pode cumprir o critério "${description}"?`,
    nextAction: outputs ? `Adicione uma saída com \`printf\` para apresentar ${reference} antes de \`return 0\`.` : `Ajuste a estrutura relacionada a "${description}" e verifique esse requisito novamente.`
  };
}

export function hasValidPriorityLink(primaryIssue: PrimaryIssue, assessments: CriterionAssessment[] | undefined): boolean {
  if (!primaryIssue.hasIssue) return true;
  const assessment = assessments?.find(item => item.criterionId === primaryIssue.criterionId);
  return Boolean(assessment && (assessment.status === 'partial' || assessment.status === 'not_satisfied'));
}

export function attachCriteriaAssessment(result: AnalysisResult, challenge: Challenge, studentCode: string): AnalysisResult {
  const criteriaAssessment = assessChallengeCriteria(challenge, studentCode);
  const priority = selectPriorityCriterion(challenge, criteriaAssessment);
  const satisfied = criteriaAssessment.filter(item => item.status === "satisfied");
  const positiveObservation = satisfied.length
    ? (satisfied[0]?.evidence || "Você já atendeu a um requisito observável na tentativa.")
    : result.studentFeedback.positiveObservation;
  const studentFeedback = priority
    ? { ...criterionFeedback(challenge, priority, studentCode), positiveObservation }
    : { ...result.studentFeedback, positiveObservation, primaryIssue: result.studentFeedback.primaryIssue.hasIssue && criteriaAssessment.length ? { hasIssue: false, type: "sem_erro_relevante" as const, concept: "", evidence: "", explanation: "", criterionId: "" } : result.studentFeedback.primaryIssue };
  return createAnalysisResult({
    category: result.category, confidence: result.confidence, studentFeedback, teacherDiagnosis: result.teacherDiagnosis, criteriaAssessment,
    analysisMode: result.analysisMode, analysisStatus: result.analysisStatus, modelUsed: result.modelUsed, promptVersion: result.promptVersion,
    analysisSummary: result.analysisSummary, requestId: result.requestId, durationMs: result.durationMs, modelCalls: result.modelCalls,
    retryAfterSeconds: result.retryAfterSeconds, isTransientFailure: result.isTransientFailure, shouldPersistAttempt: result.shouldPersistAttempt, shouldCountAnalysisRequest: result.shouldCountAnalysisRequest
  });
}

export function assessmentsMatchChallenge(challenge: Challenge, assessments: CriterionAssessment[]): boolean {
  if (assessments.length !== challenge.expectedCriteria.length) return false;
  const expected = new Set(challenge.expectedCriteria.map(item => item.id));
  return assessments.every(item => expected.has(item.criterionId));
}
