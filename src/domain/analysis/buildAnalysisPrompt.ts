import type { Challenge, ExpectedSolutionCriteria, PreviousAttemptContext } from '../../types';

const MAX_CONCEPTS = 5;
const MAX_CORE_CONCEPTS = 3;
const MAX_PROBABLE_ISSUE_TYPES = 3;
const MAX_CRITERIA = 20;
const MAX_PREVIOUS_CONCEPT_CHARS = 100;
const MAX_PREVIOUS_NEXT_ACTION_CHARS = 180;
const SYSTEM_INSTRUCTION_MAX_CHARS = 2200;
const DYNAMIC_CONTEXT_BUDGET_CHARS = 6000;
const PREVIOUS_CONTEXT_BUDGET_CHARS = 400;

export const ANALYSIS_SYSTEM_INSTRUCTION = [
  "Você é um tutor de Introdução à Programação em C. Responda em português conforme o schema.",
  "ETAPA 1: decomponha cada critério recebido em requisito verificável; diferencie declaração, leitura, cálculo, condição, laço, chamada, retorno, saída e arquivo.",
  "ETAPA 2: avalie TODOS os critérios pelo id recebido com status satisfied, partial, not_satisfied ou not_verifiable e uma evidência observável do código. Nunca use o texto do critério como evidência. Não marque como ausente algo explícito na tentativa: se o código declara e lê distancia, consumo e preco, não afirme que as três entradas não foram identificadas. Use not_verifiable quando a evidência não bastar.",
  "ETAPA 3: escolha um único problema prioritário cujo critério esteja partial ou not_satisfied. Priorize requisito explícito ausente, saída bloqueada, cálculo/regra incorreta, controle incorreto, risco ligado ao desafio, robustez e por último estilo. Não priorize melhoria opcional quando existir requisito obrigatório ausente; se resultados são calculados mas não exibidos, priorize a saída antes de validação adicional não exigida.",
  "ETAPA 4: todos os blocos tratam do mesmo critério: evidência → conceito → consequência → pergunta → ação. A observação positiva deve ser sustentada por um critério satisfied. Pergunta e ação mencionam variável, expressão, limite, índice, condição, laço, função, parâmetro, arquivo ou requisito real.",
  "Não invente variáveis, estruturas ou execução; não repita blocos; não revele a solução completa; não use frases genéricas como revise o enunciado, verifique seu código ou tente novamente."
].join(" ");

export interface AnalysisPromptMetrics {
  systemInstructionCharacters: number;
  dynamicContextCharacters: number;
  codeCharacters: number;
  totalCharacters: number;
  estimatedInputTokens: number;
}

export interface CompactCriterion {
  id?: string;
  description: string;
  importance: 'essencial' | 'desejável';
}

export interface CompactPreviousAttemptPayload {
  category?: string;
  issueType?: string;
  concept?: string;
  nextAction?: string;
  codeChanged: boolean;
}

export interface AnalysisPromptPayload {
  challenge: {
    id: string;
    title?: string;
    problem: string;
    competency: string;
    level: string;
    concepts: string[];
    criteria: CompactCriterion[];
    input: string;
    output: string;
    structure?: string;
    expectedLogic: string;
    requirements: string;
    cases?: string;
    commonErrors: string;
    probableIssueTypes?: string[];
  };
  attempt: {
    number: number;
    code: string;
    previous?: CompactPreviousAttemptPayload;
    usedTipIds?: number[];
  };
}

function uniquePreservingOrder(values: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    const normalized = value.toLowerCase();
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    result.push(value);
  }

  return result;
}

export function compactText(value: string | undefined | null): string {
  if (typeof value !== 'string') return '';

  return value
    .replace(/\r/g, '')
    .replace(/[\t ]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/ *\n */g, '\n')
    .trim();
}

function normalizedForComparison(value: string | undefined | null): string {
  return compactText(value).toLowerCase();
}

function safeTruncate(value: string | undefined | null, maxChars: number): string {
  const normalized = compactText(value);
  if (normalized.length <= maxChars) return normalized;

  const sliced = normalized.slice(0, maxChars - 1);
  const lastSpace = sliced.lastIndexOf(' ');
  const safeSlice = lastSpace >= Math.floor(maxChars * 0.6) ? sliced.slice(0, lastSpace) : sliced;
  return `${safeSlice.trim()}…`;
}

function normalizeConceptLabel(value: string): string {
  const normalized = compactText(value);
  if (!normalized) return '';

  const separators = [' - ', ': ', ' — ', ' – '];
  for (const separator of separators) {
    const separatorIndex = normalized.indexOf(separator);
    if (separatorIndex > 0) {
      const shortLabel = normalized.slice(0, separatorIndex).trim();
      if (shortLabel.length >= 3 && shortLabel.length <= 60) {
        return shortLabel;
      }
    }
  }

  return normalized.length > 60 ? safeTruncate(normalized, 60) : normalized;
}

export function normalizeEssentialConcepts(concepts: string[] | undefined, maxConcepts = MAX_CONCEPTS): string[] {
  if (!Array.isArray(concepts)) return [];

  return uniquePreservingOrder(
    concepts
      .map((concept) => normalizeConceptLabel(concept))
      .filter(Boolean)
  ).slice(0, maxConcepts);
}

function toCompactCriterion(criterion: ExpectedSolutionCriteria): CompactCriterion {
  return {
    ...(criterion.id ? { id: compactText(criterion.id) } : {}),
    description: compactText(criterion.description),
    importance: criterion.importance
  };
}

export function selectRelevantCriteria(criteria: ExpectedSolutionCriteria[] | undefined, maxCriteria = MAX_CRITERIA): CompactCriterion[] {
  if (!Array.isArray(criteria) || criteria.length === 0) return [];

  const compactCriteria = criteria
    .map(toCompactCriterion)
    .filter((criterion) => criterion.description.length > 0);

  const essential = compactCriteria.filter((criterion) => criterion.importance === 'essencial');
  const optional = compactCriteria.filter((criterion) => criterion.importance !== 'essencial');

  if (essential.length >= maxCriteria) {
    return essential;
  }

  return [...essential, ...optional.slice(0, Math.max(0, maxCriteria - essential.length))];
}

function compactOrientationField(value: string, problem: string, fallbackToExpectedLogic?: string): string {
  const compactValue = compactText(value);
  if (!compactValue) return '';

  const normalizedValue = normalizedForComparison(compactValue);
  const normalizedProblem = normalizedForComparison(problem);
  const normalizedFallback = normalizedForComparison(fallbackToExpectedLogic);

  if (normalizedValue === normalizedProblem) return '';
  if (normalizedProblem.includes(normalizedValue) && normalizedValue.length >= 24) return '';
  if (normalizedFallback && normalizedValue === normalizedFallback) return '';

  return compactValue;
}

function compactExpectedLogic(value: string, problem: string): string {
  const compactValue = compactText(value);
  if (!compactValue) return '';

  return normalizedForComparison(compactValue) === normalizedForComparison(problem) ? '' : compactValue;
}

function getChallengeCompetency(challenge: Challenge): string {
  return compactText(challenge.metadata.skill || challenge.metadata.content || challenge.categoryId || '');
}

function getProbableIssueTypes(challenge: Challenge): string[] {
  const probableIssueTypes = uniquePreservingOrder(
    (challenge.probableErrors || [])
      .map((error) => compactText(error.id))
      .filter(Boolean)
  ).slice(0, MAX_PROBABLE_ISSUE_TYPES);

  return probableIssueTypes;
}

export function compactPreviousAttemptContext(context?: PreviousAttemptContext): CompactPreviousAttemptPayload | undefined {
  if (!context) return undefined;

  const compactPrevious: CompactPreviousAttemptPayload = {
    codeChanged: Boolean(context.codeChanged)
  };

  if (context.previousCategory) {
    compactPrevious.category = compactText(context.previousCategory);
  }

  if (context.previousPrimaryIssue?.type) {
    compactPrevious.issueType = compactText(context.previousPrimaryIssue.type);
  }

  const concept = safeTruncate(context.previousPrimaryIssue?.concept, MAX_PREVIOUS_CONCEPT_CHARS);
  if (concept) {
    compactPrevious.concept = concept;
  }

  const nextAction = safeTruncate(context.previousNextAction, MAX_PREVIOUS_NEXT_ACTION_CHARS);
  if (nextAction) {
    compactPrevious.nextAction = nextAction;
  }

  return compactPrevious;
}

function countPreviousContextCharacters(previous: CompactPreviousAttemptPayload | undefined): number {
  if (!previous) return 0;
  return JSON.stringify(previous).length;
}

function removeOptionalCriteria(criteria: CompactCriterion[]): CompactCriterion[] {
  const essential = criteria.filter((criterion) => criterion.importance === 'essencial');
  if (essential.length === criteria.length) return criteria;

  const optional = criteria.filter((criterion) => criterion.importance !== 'essencial');
  optional.pop();
  return [...essential, ...optional];
}

function clonePayload(payload: AnalysisPromptPayload): AnalysisPromptPayload {
  return {
    challenge: {
      ...payload.challenge,
      concepts: [...payload.challenge.concepts],
      criteria: payload.challenge.criteria.map((criterion) => ({ ...criterion })),
      ...(payload.challenge.probableIssueTypes ? { probableIssueTypes: [...payload.challenge.probableIssueTypes] } : {})
    },
    attempt: {
      ...payload.attempt,
      ...(payload.attempt.previous ? { previous: { ...payload.attempt.previous } } : {})
    }
  };
}

function getDynamicContextLength(payload: AnalysisPromptPayload): number {
  return JSON.stringify(payload).length;
}

export function applyPromptContextBudget(basePayload: AnalysisPromptPayload): AnalysisPromptPayload {
  const payload = clonePayload(basePayload);

  while (getDynamicContextLength(payload) - payload.attempt.code.length > DYNAMIC_CONTEXT_BUDGET_CHARS) {
    if (payload.challenge.commonErrors.length > 0) {
      payload.challenge.commonErrors = '';
      continue;
    }

    if (payload.challenge.probableIssueTypes?.length) {
      delete payload.challenge.probableIssueTypes;
      continue;
    }

    if (payload.challenge.concepts.length > MAX_CORE_CONCEPTS) {
      payload.challenge.concepts = payload.challenge.concepts.slice(0, MAX_CORE_CONCEPTS);
      continue;
    }


    if (payload.attempt.previous) {
      if (payload.attempt.previous.nextAction && countPreviousContextCharacters(payload.attempt.previous) > PREVIOUS_CONTEXT_BUDGET_CHARS) {
        delete payload.attempt.previous.nextAction;
        continue;
      }
      if (payload.attempt.previous.concept) {
        delete payload.attempt.previous.concept;
        continue;
      }
      if (payload.attempt.previous.category) {
        delete payload.attempt.previous.category;
        continue;
      }
    }

    if (payload.challenge.title) {
      delete payload.challenge.title;
      continue;
    }

    if (payload.challenge.structure) {
      delete payload.challenge.structure;
      continue;
    }

    break;
  }

  return payload;
}

export function buildAnalysisPromptPayload(params: {
  challenge: Challenge;
  code: string;
  previousAttemptContext?: PreviousAttemptContext;
}): AnalysisPromptPayload {
  const { challenge, code, previousAttemptContext } = params;
  const problem = compactText(challenge.problem);
  const expectedLogic = compactExpectedLogic(challenge.orientation.expectedLogic, problem);
  const structure = compactOrientationField(challenge.orientation.structure, problem, expectedLogic);
  const previous = compactPreviousAttemptContext(previousAttemptContext);
  const probableIssueTypes = getProbableIssueTypes(challenge);

  const payload: AnalysisPromptPayload = {
    challenge: {
      id: challenge.id,
      title: compactText(challenge.title),
      problem,
      competency: getChallengeCompetency(challenge),
      level: compactText(challenge.metadata.level),
      concepts: normalizeEssentialConcepts(challenge.concepts),
      criteria: selectRelevantCriteria(challenge.expectedCriteria),
      input: compactText(challenge.orientation.input),
      output: compactText(challenge.orientation.output),
      expectedLogic,
      requirements: compactText(challenge.metadata.requirements),
      ...(compactText(challenge.orientation.cases) ? { cases: compactText(challenge.orientation.cases) } : {}),
      commonErrors: challenge.commonErrors.slice(0, 3).map(item => compactText(item.title + ': ' + item.description)).filter(Boolean).join(' | '),
      ...(structure ? { structure } : {}),
      ...(probableIssueTypes.length ? { probableIssueTypes } : {})
    },
    attempt: {
      number: previousAttemptContext?.attemptNumber ?? 1,
      code,
      ...(previous ? { previous } : {})
    }
  };

  return applyPromptContextBudget(payload);
}

export function estimateTokens(totalCharacters: number): number {
  return Math.ceil(totalCharacters / 4);
}

export function createAnalysisPromptMetrics(params: {
  payload: AnalysisPromptPayload;
  systemInstruction?: string;
}): AnalysisPromptMetrics {
  const systemInstruction = params.systemInstruction ?? ANALYSIS_SYSTEM_INSTRUCTION;
  const codeCharacters = params.payload.attempt.code.length;
  const payloadWithoutCode = {
    ...params.payload,
    attempt: {
      ...params.payload.attempt,
      code: ''
    }
  };
  const dynamicContextCharacters = JSON.stringify(payloadWithoutCode).length;
  const totalCharacters = systemInstruction.length + JSON.stringify(params.payload).length;

  return {
    systemInstructionCharacters: systemInstruction.length,
    dynamicContextCharacters,
    codeCharacters,
    totalCharacters,
    estimatedInputTokens: estimateTokens(totalCharacters)
  };
}

export function buildAnalysisPromptClient(params: {
  challenge: Challenge;
  code: string;
  previousAttemptContext?: PreviousAttemptContext;
}): string {
  const payload = buildAnalysisPromptPayload(params);
  return JSON.stringify(payload);
}

if (ANALYSIS_SYSTEM_INSTRUCTION.length > SYSTEM_INSTRUCTION_MAX_CHARS) {
  throw new Error('ANALYSIS_SYSTEM_INSTRUCTION excedeu o orçamento configurado.');
}
