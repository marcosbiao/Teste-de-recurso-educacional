import type { AnalysisResult, Challenge, PrimaryIssue } from '../../types';

export const GENERIC_FEEDBACK_PATTERNS = [
  /\brevise (o )?enunciado\b/i,
  /\bverifique (seu )?c[oó]digo\b/i,
  /\bconfira a l[oó]gica\b/i,
  /\btente novamente\b/i,
  /qual parte (do enunciado )?merece mais aten[cç][aã]o/i,
  /o que (pode ser melhorado|falta)( no c[oó]digo)?\b/i,
  /\banalise (melhor )?(a )?solu[cç][aã]o\b/i,
  /verifique (as )?entradas?,? (processamento e )?sa[ií]das?\b/i,
  /compare (sua )?(resposta|solu[cç][aã]o) com (o )?problema\b/i,
  /sua solu[cç][aã]o atende ao enunciado/i,
  /pense melhor sobre isso/i,
  /revise sua l[oó]gica/i
];

export type FeedbackSpecificityIssue =
  | 'GENERIC_GUIDING_QUESTION'
  | 'GENERIC_NEXT_ACTION'
  | 'MISSING_CONCRETE_REFERENCE'
  | 'EVIDENCE_EXPLANATION_REPETITION'
  | 'EXPLANATION_NEXT_ACTION_REPETITION'
  | 'TITLE_EVIDENCE_REPETITION'
  | 'DIAGNOSTIC_CHAIN_MISMATCH'
  | 'POSSIBLY_INVENTED_EVIDENCE'
  | 'MULTIPLE_VAGUE_ACTIONS';

export interface FeedbackSpecificityContext {
  challenge: Pick<Challenge, 'id' | 'title' | 'problem' | 'concepts' | 'expectedCriteria' | 'orientation' | 'metadata'>;
  studentCode: string;
}

export interface FeedbackSpecificityEvaluation {
  isSpecific: boolean;
  score: number;
  issues: FeedbackSpecificityIssue[];
  concreteReferences: string[];
  similarities: { evidenceExplanation: number; explanationNextAction: number; titleEvidence: number };
}

const C_KEYWORDS = new Set([
  'auto', 'break', 'case', 'char', 'const', 'continue', 'default', 'do', 'double', 'else', 'enum', 'extern', 'float', 'for', 'goto', 'if', 'int', 'long', 'main', 'register', 'return', 'short', 'signed', 'sizeof', 'static', 'struct', 'switch', 'typedef', 'union', 'unsigned', 'void', 'volatile', 'while', 'printf', 'scanf', 'fopen', 'fclose', 'fread', 'fwrite'
]);

function normalize(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9_]+/g, ' ').trim();
}

function words(value: string): Set<string> {
  return new Set(normalize(value).split(/\s+/).filter(word => word.length >= 3));
}

export function feedbackTextSimilarity(first: string, second: string): number {
  const a = words(first);
  const b = words(second);
  if (!a.size || !b.size) return 0;
  const intersection = [...a].filter(word => b.has(word)).length;
  return intersection / new Set([...a, ...b]).size;
}

function codeIdentifiers(code: string): string[] {
  return [...new Set((code.match(/\b[A-Za-z_][A-Za-z0-9_]*\b/g) || [])
    .filter(identifier => !C_KEYWORDS.has(identifier.toLowerCase()) && identifier.length > 1))];
}

function contextualReferences(context: FeedbackSpecificityContext, issue: PrimaryIssue): string[] {
  const codeNames = codeIdentifiers(context.studentCode);
  const source = [
    issue.concept,
    issue.evidence,
    context.challenge.title,
    context.challenge.problem,
    context.challenge.orientation.input,
    context.challenge.orientation.output,
    context.challenge.orientation.cases,
    context.challenge.orientation.structure,
    context.challenge.orientation.expectedLogic,
    context.challenge.metadata.requirements,
    ...context.challenge.concepts,
    ...context.challenge.expectedCriteria.map(item => item.description)
  ].join(' ');
  const contextualWords = words(source);
  const terms = new Set<string>([
    ...codeNames.map(normalize),
    ...[...contextualWords].filter(term => term.length >= 4)
  ]);

  for (const builtin of ['scanf', 'printf', 'fopen', 'fclose', 'for', 'while', 'if', 'else', 'vetor', 'matriz', 'indice', 'contador', 'acumulador', 'funcao', 'parametro', 'argumento', 'arquivo', 'divisao', 'condicao']) {
    if (normalize(source).includes(builtin) || normalize(context.studentCode).includes(builtin)) terms.add(builtin);
  }
  return [...terms];
}

function hasConcreteReference(text: string, references: string[]): boolean {
  const normalized = normalize(text);
  return references.some(reference => reference.length >= 3 && normalized.includes(reference));
}

function isGeneric(text: string): boolean {
  return GENERIC_FEEDBACK_PATTERNS.some(pattern => pattern.test(text));
}

function hasSpecificReference(text: string, references: string[]): boolean {
  const genericTerms = new Set(['enunciado', 'problema', 'solucao', 'desafio', 'codigo', 'tentativa', 'requisito', 'parte']);
  return hasConcreteReference(text, references.filter(reference => !genericTerms.has(reference)));
}

function issueSet(issues: FeedbackSpecificityIssue[]): Set<FeedbackSpecificityIssue> {
  return new Set(issues);
}

/**
 * Pure, conservative quality check. It never changes feedback or calls a model.
 * Contextual terms are derived from the attempt and challenge metadata, not from
 * punctuation or formatting conventions such as backticks.
 */
export function evaluateFeedbackSpecificity(result: Pick<AnalysisResult, 'studentFeedback'>, context: FeedbackSpecificityContext): FeedbackSpecificityEvaluation {
  const feedback = result.studentFeedback;
  const issue = feedback.primaryIssue;
  const references = contextualReferences(context, issue);
  const issues: FeedbackSpecificityIssue[] = [];
  const evidenceExplanation = feedbackTextSimilarity(issue.evidence, issue.explanation);
  const explanationNextAction = feedbackTextSimilarity(issue.explanation, feedback.nextAction);
  const titleEvidence = feedbackTextSimilarity(issue.concept, issue.evidence);
  const questionHasReference = hasConcreteReference(feedback.guidingQuestion, references);
  const actionHasReference = hasConcreteReference(feedback.nextAction, references);
  const questionHasSpecificReference = hasSpecificReference(feedback.guidingQuestion, references);
  const actionHasSpecificReference = hasSpecificReference(feedback.nextAction, references);

  if (!questionHasReference || (isGeneric(feedback.guidingQuestion) && !questionHasSpecificReference)) issues.push('GENERIC_GUIDING_QUESTION');
  if (!actionHasReference || (isGeneric(feedback.nextAction) && !actionHasSpecificReference)) issues.push('GENERIC_NEXT_ACTION');
  if (issue.hasIssue && (!questionHasReference || !actionHasReference)) issues.push('MISSING_CONCRETE_REFERENCE');
  if (issue.hasIssue && evidenceExplanation >= 0.74) issues.push('EVIDENCE_EXPLANATION_REPETITION');
  if (issue.hasIssue && explanationNextAction >= 0.78) issues.push('EXPLANATION_NEXT_ACTION_REPETITION');
  if (issue.hasIssue && titleEvidence >= 0.88) issues.push('TITLE_EVIDENCE_REPETITION');

  const evidenceReferences = contextualReferences(context, { ...issue, concept: '', evidence: issue.evidence });
  const questionSharesEvidence = hasConcreteReference(feedback.guidingQuestion, evidenceReferences);
  const actionSharesEvidence = hasConcreteReference(feedback.nextAction, evidenceReferences);
  if (issue.hasIssue && (!questionSharesEvidence || !actionSharesEvidence)) issues.push('DIAGNOSTIC_CHAIN_MISMATCH');

  const evidenceMentionsAbsence = /\b(não|sem|ausência|ausente|falta)\b/i.test(issue.evidence);
  const identifiersInEvidence = [...issue.evidence.matchAll(/`([^`]+)`/g)].flatMap(match => codeIdentifiers(match[1]));
  const identifiersInCode = new Set(codeIdentifiers(context.studentCode).map(normalize));
  if (!evidenceMentionsAbsence && identifiersInEvidence.some(identifier => !identifiersInCode.has(normalize(identifier)))) issues.push('POSSIBLY_INVENTED_EVIDENCE');
  if (/\b(e|ou|e depois|tamb[eé]m)\b/i.test(feedback.nextAction) && !actionHasReference) issues.push('MULTIPLE_VAGUE_ACTIONS');

  const uniqueIssues = [...issueSet(issues)];
  const severe = uniqueIssues.filter(item => ['GENERIC_GUIDING_QUESTION', 'GENERIC_NEXT_ACTION', 'MISSING_CONCRETE_REFERENCE', 'DIAGNOSTIC_CHAIN_MISMATCH'].includes(item)).length;
  const score = Math.max(0, 100 - severe * 22 - (uniqueIssues.length - severe) * 8);
  return {
    isSpecific: severe === 0 && !uniqueIssues.includes('EVIDENCE_EXPLANATION_REPETITION'),
    score,
    issues: uniqueIssues,
    concreteReferences: references.filter(reference => hasConcreteReference(`${feedback.guidingQuestion} ${feedback.nextAction}`, [reference])).slice(0, 8),
    similarities: { evidenceExplanation, explanationNextAction, titleEvidence }
  };
}
