import type { Challenge, ProblemRepresentationDraft } from '../types';
import type { AnalysisConfidence, AnalysisResult, ErrorType } from '../domain/analysis/analysisTypes';
import { validateAnalysisResult } from '../domain/analysis/validateAnalysisResult';
import { appConfig } from '../config/appConfig';
import { createAnalysisResult, normalizeAnalysisResult } from '../domain/pedagogicalDomain';
import { repairPedagogicalFeedback } from '../domain/analysis/repairPedagogicalFeedback';
import { evaluateFeedbackSpecificity } from '../domain/analysis/feedbackSpecificity';
import { attachCriteriaAssessment } from '../domain/analysis/criteriaAssessment';

export type LocalAnalysisRule =
  | 'challenge_specific'
  | 'declared_pattern'
  | 'unmet_criterion'
  | 'empty_code'
  | 'generic_structure'
  | 'insufficient_evidence';

export interface LocalAnalysisInput {
  challenge: Challenge;
  studentCode: string;
  representation?: ProblemRepresentationDraft;
}

export interface LocalAnalysisOutput {
  result: AnalysisResult;
  rule: LocalAnalysisRule;
  source: 'challenge' | 'metadata' | 'generic';
  confidence: AnalysisConfidence;
}

interface PedagogicalIssue {
  type: ErrorType;
  concept: string;
  evidence: string;
  explanation: string;
  question: string;
  nextAction: string;
}

function normalizeCode(code: string): string {
  return (code || '').replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '').trim().toLowerCase();
}

function buildResult(challenge: Challenge, studentCode: string, issue: PedagogicalIssue | undefined, confidence: AnalysisConfidence): AnalysisResult {
  const hasIssue = Boolean(issue);
  const positiveObservation = normalizeCode(studentCode)
    ? 'Você iniciou uma tentativa relacionada ao desafio proposto.'
    : 'A orientação abaixo ajuda a planejar a primeira estrutura da solução.';

  return createAnalysisResult({
    category: hasIssue ? 'tentativa inicial' : 'parcialmente correta',
    confidence,
    studentFeedback: {
      positiveObservation,
      primaryIssue: hasIssue
        ? { hasIssue: true, type: issue!.type, concept: issue!.concept, evidence: issue!.evidence, explanation: issue!.explanation }
        : { hasIssue: false, type: 'sem_erro_relevante', concept: '', evidence: '', explanation: '' },
      guidingQuestion: issue?.question || challenge.guidingQuestions[0] || 'Quais requisitos do enunciado aparecem explicitamente na sua solução?',
      nextAction: issue?.nextAction || 'Compare sua tentativa com o primeiro critério essencial do desafio.'
    },
    teacherDiagnosis: {
      hypothesis: hasIssue
        ? 'Há indícios locais de um ponto específico para revisar antes da próxima tentativa.'
        : 'A verificação local não encontrou evidência suficiente para apontar um erro específico.',
      confidence
    },
    analysisMode: 'local_fallback',
    analysisStatus: 'success',
    modelUsed: 'local_heuristic',
    promptVersion: appConfig.analysis.promptVersion,
    shouldPersistAttempt: true,
    shouldCountAnalysisRequest: true
  });
}

function fromChallengeSpecific(input: LocalAnalysisInput): LocalAnalysisOutput | undefined {
  if (typeof input.challenge.analyzeLocally !== 'function') return undefined;
  const specific = input.challenge.analyzeLocally(input.studentCode, input.representation);
  const normalized = normalizeAnalysisResult(specific, {
    analysisMode: 'local_fallback',
    analysisStatus: 'success',
    modelUsed: 'local_challenge_rules',
    promptVersion: appConfig.analysis.promptVersion
  });
  const normalizedIssue = normalized.studentFeedback.primaryIssue;
  const studentFeedback = normalizedIssue.hasIssue
    ? {
        ...normalized.studentFeedback,
        primaryIssue: {
          ...normalizedIssue,
          concept: normalizedIssue.concept || input.challenge.concepts[0] || 'Critério do desafio',
          evidence: normalizedIssue.evidence || normalized.feedback.review[0] || normalized.analysisSummary,
          explanation: normalizedIssue.explanation || normalized.feedback.review[0] || normalized.analysisSummary
        }
      }
    : normalized.studentFeedback;
  const result = createAnalysisResult({
    category: normalized.category,
    confidence: 'alta',
    studentFeedback,
    teacherDiagnosis: { ...normalized.teacherDiagnosis, confidence: 'alta' },
    analysisMode: 'local_fallback',
    analysisStatus: 'success',
    modelUsed: 'local_challenge_rules',
    promptVersion: appConfig.analysis.promptVersion,
    analysisSummary: normalized.analysisSummary,
    shouldPersistAttempt: true,
    shouldCountAnalysisRequest: true
  });
  return { result, rule: 'challenge_specific', source: 'challenge', confidence: 'alta' };
}

function findDeclaredPattern(challenge: Challenge, code: string): PedagogicalIssue | undefined {
  const commonText = challenge.commonErrors.map(item => (item.title + ' ' + item.description + ' ' + item.pedagogicalAdvice).toLowerCase()).join(' ');
  const probableText = challenge.probableErrors.map(item => (item.description + ' ' + item.likelyCause).toLowerCase()).join(' ');
  const metadata = commonText + ' ' + probableText;

  if (/\bscanf\b|entrada/.test(metadata) && !/\bscanf\s*\(/.test(code)) {
    return { type: 'interpretacao_enunciado', concept: 'Leitura de dados', evidence: 'Não foi encontrada uma chamada a scanf na tentativa.', explanation: 'Há indícios de que a entrada solicitada ainda não foi incorporada à solução.', question: 'Em que ponto o valor informado pelo usuário é lido antes de ser usado?', nextAction: 'Inclua a leitura da entrada pedida no enunciado.' };
  }
  if (/zero|igualdade|comparação/.test(metadata) && /\bif\s*\([^)]*=\s*[^=]/.test(code)) {
    return { type: 'condicao_incompleta', concept: 'Operadores de comparação', evidence: 'Há uma atribuição dentro de uma condição if.', explanation: 'Verifique se a condição compara valores em vez de atribuir um valor.', question: 'Qual operador deve ser usado para testar igualdade em uma condição?', nextAction: 'Revise o operador usado na condição principal.' };
  }
  if (/zero/.test(metadata) && /\bif\b/.test(code) && !/\belse\b/.test(code) && !/==\s*0/.test(code)) {
    return { type: 'caso_nao_tratado', concept: 'Cobertura de casos', evidence: 'Há uma condição, mas não foi identificado tratamento para o caso neutro citado no desafio.', explanation: 'É possível que um dos casos previstos no enunciado ainda não esteja coberto.', question: 'Qual caso do enunciado permanece quando a primeira condição não é atendida?', nextAction: 'Verifique se todos os casos solicitados possuem um caminho na decisão.' };
  }
  return undefined;
}

function criterionIssue(challenge: Challenge, code: string): PedagogicalIssue | undefined {
  const checks: Array<{ matches: (description: string) => boolean; present: boolean; issue: PedagogicalIssue }> = [
    { matches: text => /scanf|leitura|entrada/.test(text), present: /\bscanf\s*\(/.test(code), issue: { type: 'interpretacao_enunciado', concept: 'Entrada de dados', evidence: 'Não foi encontrada uma chamada a scanf.', explanation: 'O critério de leitura da entrada ainda não aparece na tentativa.', question: 'Como o programa obterá o valor que precisa processar?', nextAction: 'Adicione a leitura da entrada solicitada.' } },
    { matches: text => /printf|saída|saida|exib/.test(text), present: /\bprintf\s*\(/.test(code), issue: { type: 'saida_incorreta', concept: 'Saída do programa', evidence: 'Não foi encontrada uma chamada a printf.', explanation: 'O resultado ainda não está sendo apresentado de forma observável.', question: 'Onde sua solução mostra o resultado pedido pelo enunciado?', nextAction: 'Inclua uma saída que apresente o resultado principal.' } },
    { matches: text => /if|condiç/.test(text), present: /\bif\s*\(/.test(code), issue: { type: 'condicao_incompleta', concept: 'Estrutura condicional', evidence: 'Não foi encontrada uma estrutura if na tentativa.', explanation: 'O desafio pede uma decisão e ela ainda não está explícita no código.', question: 'Qual condição separa os casos descritos no enunciado?', nextAction: 'Escreva a condição que diferencia os casos do problema.' } },
    { matches: text => /for|while|laço|laco|repetiç/.test(text), present: /\b(for|while|do)\b/.test(code), issue: { type: 'logica', concept: 'Estrutura de repetição', evidence: 'Não foi encontrado for, while ou do na tentativa.', explanation: 'O desafio requer repetição, mas a estrutura correspondente ainda não aparece.', question: 'Que parte da solução precisa se repetir até atingir o limite pedido?', nextAction: 'Inclua um laço adequado ao número de repetições.' } },
    { matches: text => /funç|func|procedimento/.test(text), present: /\b(?:int|float|double|void|char)\s+(?!main\b)[a-z_][a-z0-9_]*\s*\([^;]*\)\s*\{/.test(code), issue: { type: 'logica', concept: 'Modularização com funções', evidence: 'Não foi identificada uma definição de função além da estrutura principal.', explanation: 'O critério de modularização ainda não está explícito na tentativa.', question: 'Qual cálculo ou saída pode ser separado em uma função ou procedimento?', nextAction: 'Defina a função ou procedimento solicitado pelo desafio.' } },
    { matches: text => /vetor|matriz|índice|indice|posiç/.test(text), present: /\[[^\]]+\]/.test(code), issue: { type: 'logica', concept: 'Acesso indexado', evidence: 'Não foi encontrado acesso entre colchetes na tentativa.', explanation: 'O desafio trabalha com coleções, mas não há evidência de acesso por índice.', question: 'Qual índice permite acessar o elemento que precisa ser processado?', nextAction: 'Revise onde o vetor ou a matriz deve ser acessado por índice.' } }
  ];

  for (const criterion of challenge.expectedCriteria) {
    const description = criterion.description.toLowerCase();
    const check = checks.find(item => item.matches(description));
    if (check && !check.present) return check.issue;
  }
  return undefined;
}

function genericIssue(challenge: Challenge, code: string): { rule: LocalAnalysisRule; issue?: PedagogicalIssue } {
  if (!code) {
    return { rule: 'empty_code', issue: { type: 'sintaxe_aparente', concept: 'Estrutura inicial da solução', evidence: 'Não foi encontrado código além de espaços ou comentários.', explanation: 'Ainda não há uma estrutura observável para comparar com o desafio.', question: 'Qual é a primeira estrutura necessária para começar a resolver este problema?', nextAction: 'Escreva a primeira etapa da solução antes de solicitar nova orientação.' } };
  }
  const structure = (challenge.orientation.structure + ' ' + challenge.metadata.requirements + ' ' + challenge.domainTags.skillTags.join(' ')).toLowerCase();
  if (/laço|laco|repetiç|loops/.test(structure) && !/\b(for|while|do)\b/.test(code)) return { rule: 'generic_structure', issue: { type: 'logica', concept: 'Repetição', evidence: 'A tentativa não contém uma estrutura de laço.', explanation: 'Há indícios de que a repetição solicitada ainda não foi representada.', question: 'Qual comando repetirá a ação até o limite do enunciado?', nextAction: 'Inclua a estrutura de repetição necessária.' } };
  if (/condicional|condiç|conditionals/.test(structure) && !/\bif\s*\(/.test(code)) return { rule: 'generic_structure', issue: { type: 'condicao_incompleta', concept: 'Decisão condicional', evidence: 'A tentativa não contém uma estrutura if.', explanation: 'Há indícios de que os casos do problema ainda não foram separados.', question: 'Qual condição distingue os casos descritos no enunciado?', nextAction: 'Inclua a condição principal do problema.' } };
  if (/funç|func|modular/.test(structure) && !/\b(?:int|float|double|void|char)\s+(?!main\b)[a-z_][a-z0-9_]*\s*\([^;]*\)\s*\{/.test(code)) return { rule: 'generic_structure', issue: { type: 'logica', concept: 'Funções', evidence: 'Não foi identificada uma definição de função na tentativa.', explanation: 'É possível que a parte modular exigida ainda não tenha sido criada.', question: 'Qual responsabilidade do programa pode ficar em uma função?', nextAction: 'Defina a função ou procedimento solicitado.' } };
  if (/vetor|matriz|array/.test(structure) && !/\[[^\]]+\]/.test(code)) return { rule: 'generic_structure', issue: { type: 'logica', concept: 'Acesso indexado', evidence: 'Não foi encontrado acesso por colchetes na tentativa.', explanation: 'É possível que a coleção exigida ainda não esteja sendo acessada por índice.', question: 'Que índice permite chegar ao elemento necessário?', nextAction: 'Revise o acesso ao vetor ou à matriz.' } };
  return { rule: 'insufficient_evidence' };
}

export function generateLocalAnalysis(input: LocalAnalysisInput): LocalAnalysisOutput {
  const code = normalizeCode(input.studentCode);
  const specific = fromChallengeSpecific({ ...input, studentCode: input.studentCode });
  if (specific) return finalizeWithContext(specific, input);

  const pattern = findDeclaredPattern(input.challenge, code);
  if (pattern) return finalizeWithContext({ result: buildResult(input.challenge, input.studentCode, pattern, 'media'), rule: 'declared_pattern', source: 'metadata', confidence: 'media' }, input);

  const criterion = criterionIssue(input.challenge, code);
  if (criterion) return finalizeWithContext({ result: buildResult(input.challenge, input.studentCode, criterion, 'media'), rule: 'unmet_criterion', source: 'metadata', confidence: 'media' }, input);

  const generic = genericIssue(input.challenge, code);
  return finalizeWithContext({ result: buildResult(input.challenge, input.studentCode, generic.issue, 'baixa'), rule: generic.rule, source: 'generic', confidence: 'baixa' }, input);
}

function finalizeWithContext(output: LocalAnalysisOutput, input: LocalAnalysisInput): LocalAnalysisOutput {
  const criterionDriven = attachCriteriaAssessment(output.result, input.challenge, input.studentCode);
  const repaired = repairPedagogicalFeedback(criterionDriven, { challenge: input.challenge, studentCode: input.studentCode });
  validateAnalysisResult(repaired);
  if (import.meta.env.DEV === true) {
    const quality = evaluateFeedbackSpecificity(repaired, { challenge: input.challenge, studentCode: input.studentCode });
    console.info('[feedback-specificity]', { challengeId: input.challenge.id, analysisMode: repaired.analysisMode, model: repaired.modelUsed, fallbackUsed: true, criterionId: repaired.studentFeedback.primaryIssue.criterionId, criterionStatus: repaired.criteriaAssessment?.find(item => item.criterionId === repaired.studentFeedback.primaryIssue.criterionId)?.status, satisfiedCriteria: repaired.criteriaAssessment?.filter(item => item.status === 'satisfied').map(item => item.criterionId), unsatisfiedCriteria: repaired.criteriaAssessment?.filter(item => item.status === 'not_satisfied').map(item => item.criterionId), score: quality.score, issues: quality.issues, concreteReferences: quality.concreteReferences, similarities: quality.similarities });
  }
  return { ...output, result: repaired };
}
