import type { AnalysisResult, Challenge, PrimaryIssue, StudentFeedback } from '../../types';
import { createAnalysisResult } from '../pedagogicalDomain';
import { evaluateFeedbackSpecificity, type FeedbackSpecificityContext } from './feedbackSpecificity';

function codeIdentifiers(code: string): string[] {
  const ignored = new Set(['int', 'float', 'double', 'char', 'void', 'return', 'if', 'else', 'for', 'while', 'do', 'main', 'include', 'stdio', 'printf', 'scanf']);
  return [...new Set((code.match(/\b[A-Za-z_][A-Za-z0-9_]*\b/g) || [])
    .filter(name => name.length > 1 && !ignored.has(name.toLowerCase())))];
}

function selectRequirement(challenge: Challenge, issue: PrimaryIssue): string {
  const issueWords = `${issue.concept} ${issue.evidence} ${issue.explanation}`.toLocaleLowerCase('pt-BR');
  const matching = challenge.expectedCriteria.find(item => item.description.toLocaleLowerCase('pt-BR').split(/\s+/).some(word => word.length > 4 && issueWords.includes(word)));
  return matching?.description || challenge.expectedCriteria.find(item => item.importance === 'essencial')?.description || challenge.metadata.requirements || challenge.pedagogicalMetadata.learningObjective || 'o requisito principal do desafio';
}

interface FocusElement { label: string; kind: 'input' | 'output' | 'condition' | 'loop' | 'collection' | 'function' | 'file' | 'expression' | 'requirement'; }

function selectFocus(challenge: Challenge, code: string, issue: PrimaryIssue): FocusElement {
  const text = `${issue.concept} ${issue.evidence} ${issue.explanation}`.toLocaleLowerCase('pt-BR');
  if (/scanf|leitura|entrada/.test(text)) return { label: 'a leitura com `scanf`', kind: 'input' };
  if (/printf|sa[ií]da|exib/.test(text)) return { label: 'a saída com `printf`', kind: 'output' };
  if (/fopen|fclose|arquivo|abertura/.test(text)) return { label: 'a abertura ou o fechamento do arquivo', kind: 'file' };
  if (/vetor|matriz|[ií]ndice|posi[cç][aã]o|colchete/.test(text)) return { label: 'o índice usado no vetor ou na matriz', kind: 'collection' };
  if (/for|while|la[cç]o|repeti[cç]|contador|acumulador/.test(text)) return { label: 'o laço de repetição', kind: 'loop' };
  if (/fun[cç][aã]o|par[aâ]metro|argumento|retorno/.test(text)) return { label: 'a função e seus parâmetros', kind: 'function' };
  if (/if|condi[cç]|compara[cç]|caso/.test(text)) return { label: 'a condição `if`', kind: 'condition' };
  if (/divis|operador|express[aã]o|c[aá]lculo/.test(text)) {
    const named = codeIdentifiers(code).find(name => text.includes(name.toLocaleLowerCase('pt-BR')));
    return { label: named ? `a expressão que usa \`${named}\`` : 'a expressão principal do cálculo', kind: 'expression' };
  }
  const named = codeIdentifiers(code).find(name => text.includes(name.toLocaleLowerCase('pt-BR'))) || codeIdentifiers(code)[0];
  return named ? { label: `\`${named}\``, kind: 'expression' } : { label: 'o requisito central do desafio', kind: 'requirement' };
}

function questionFor(focus: FocusElement, requirement: string): string {
  switch (focus.kind) {
    case 'input': return 'Qual valor exigido pelo enunciado precisa ser lido com `scanf` antes de ser usado no processamento?';
    case 'output': return 'Qual resultado pedido pelo enunciado ainda precisa aparecer na saída com `printf`?';
    case 'condition': return 'Qual caso do enunciado deve ser separado pela condição `if` antes de continuar o processamento?';
    case 'loop': return 'Qual limite do enunciado deve controlar o laço de repetição para ele parar no momento correto?';
    case 'collection': return 'Quais índices são válidos para acessar o elemento solicitado sem ultrapassar o vetor ou a matriz?';
    case 'function': return 'Qual dado a função precisa receber ou retornar para cumprir o cálculo solicitado?';
    case 'file': return 'Qual operação de arquivo precisa acontecer para cumprir o requisito sem perder dados existentes?';
    case 'expression': return `Como ${focus.label} deve atender ao requisito "${requirement}"?`;
    default: return `Qual parte da sua implementação mostra o requisito "${requirement}"?`;
  }
}

function actionFor(focus: FocusElement, requirement: string): string {
  switch (focus.kind) {
    case 'input': return 'Adicione a leitura com `scanf` do valor exigido antes de iniciar o processamento.';
    case 'output': return 'Inclua uma saída com `printf` que apresente o resultado principal solicitado.';
    case 'condition': return 'Ajuste a condição `if` para separar o caso exigido antes de executar o cálculo seguinte.';
    case 'loop': return 'Ajuste o limite ou a atualização do laço para que ele percorra exatamente as repetições solicitadas.';
    case 'collection': return 'Ajuste o índice para acessar somente as posições válidas do vetor ou da matriz.';
    case 'function': return 'Ajuste a chamada ou a definição da função para corresponder aos dados exigidos pelo cálculo.';
    case 'file': return 'Ajuste a operação de abertura ou fechamento para cumprir o requisito de arquivo identificado.';
    case 'expression': return `Ajuste ${focus.label} para cumprir o requisito "${requirement}".`;
    default: return `Implemente uma etapa visível que cumpra o requisito "${requirement}".`;
  }
}

function observedPositive(code: string, current: string): string {
  if (!/tentativa (foi registrada|relacionada)|espa[cç]o de resposta/i.test(current)) return current;
  if (/\b(float|double)\b/i.test(code)) return 'Você utilizou um tipo real para representar valores que podem ter casas decimais.';
  if (/\b(for|while|do)\b/i.test(code)) return 'Você já incluiu uma estrutura de repetição na tentativa.';
  if (/\bif\s*\(/i.test(code)) return 'Você já separou parte da lógica usando uma condição `if`.';
  if (/\b(?:int|float|double|void|char)\s+[A-Za-z_]\w*\s*\(/.test(code)) return 'Você declarou uma função, criando uma estrutura observável para a solução.';
  if (/\b(?:scanf|printf)\s*\(/i.test(code)) return 'Você já incluiu uma operação de entrada ou saída na tentativa.';
  if (code.trim()) return 'Você já escreveu uma estrutura de código que permite verificar um requisito do desafio.';
  return 'Ainda não há código suficiente para reconhecer uma escolha correta na tentativa.';
}

function nonRepeatingEvidence(issue: PrimaryIssue, code: string, requirement: string, focus: FocusElement): PrimaryIssue {
  const sameText = issue.evidence.trim().toLocaleLowerCase('pt-BR') === issue.explanation.trim().toLocaleLowerCase('pt-BR');
  if (!sameText) return issue;
  const evidence = focus.kind === 'input' && !/\bscanf\s*\(/.test(code)
    ? 'Não foi encontrada uma leitura com `scanf` na tentativa.'
    : focus.kind === 'output' && !/\bprintf\s*\(/.test(code)
      ? 'Não foi encontrada uma saída com `printf` na tentativa.'
      : `A tentativa ainda não mostra uma implementação verificável de "${requirement}".`;
  const explanation = `Sem atender a esse requisito, o programa pode não produzir o comportamento solicitado no enunciado.`;
  return { ...issue, evidence, explanation };
}

/** Applies only deterministic, evidence-preserving local repairs; it never invents a new diagnosis. */
export function repairPedagogicalFeedback(result: AnalysisResult, context: FeedbackSpecificityContext): AnalysisResult {
  const initial = evaluateFeedbackSpecificity(result, context);
  const current = result.studentFeedback;
  if (!current.primaryIssue.hasIssue) return result;
  const challenge = context.challenge as Challenge;
  const requirement = selectRequirement(challenge, current.primaryIssue);
  const focus = selectFocus(challenge, context.studentCode, current.primaryIssue);
  const issue = nonRepeatingEvidence(current.primaryIssue, context.studentCode, requirement, focus);
  const needsQuestion = initial.issues.includes('GENERIC_GUIDING_QUESTION') || initial.issues.includes('DIAGNOSTIC_CHAIN_MISMATCH');
  const needsAction = initial.issues.includes('GENERIC_NEXT_ACTION') || initial.issues.includes('DIAGNOSTIC_CHAIN_MISMATCH') || initial.issues.includes('EXPLANATION_NEXT_ACTION_REPETITION');
  const feedback: StudentFeedback = {
    ...current,
    positiveObservation: observedPositive(context.studentCode, current.positiveObservation),
    primaryIssue: issue,
    guidingQuestion: needsQuestion ? questionFor(focus, requirement) : current.guidingQuestion,
    nextAction: needsAction ? actionFor(focus, requirement) : current.nextAction
  };
  return createAnalysisResult({
    category: result.category,
    confidence: result.confidence,
    studentFeedback: feedback,
    teacherDiagnosis: result.teacherDiagnosis,
    criteriaAssessment: result.criteriaAssessment,
    analysisMode: result.analysisMode,
    analysisStatus: result.analysisStatus,
    modelUsed: result.modelUsed,
    promptVersion: result.promptVersion,
    analysisSummary: result.analysisSummary,
    requestId: result.requestId,
    durationMs: result.durationMs,
    modelCalls: result.modelCalls,
    retryAfterSeconds: result.retryAfterSeconds,
    isTransientFailure: result.isTransientFailure,
    shouldPersistAttempt: result.shouldPersistAttempt,
    shouldCountAnalysisRequest: result.shouldCountAnalysisRequest
  });
}
