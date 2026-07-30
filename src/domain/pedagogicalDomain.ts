import type {
  AnalysisConfidence,
  AnalysisMode,
  AnalysisStatus,
  AnalysisResult,
  Attempt,
  Challenge,
  ChallengeCategory,
  ErrorType,
  PreviousAttemptContext,
  StudentFeedback,
  TeacherDiagnosis,
  PrimaryIssue,
  CriterionAssessment,
  UserProfile
} from '../types.ts';
import { APP_CONSTANTS } from '../config/constants';

const DEFAULT_POSITIVE_OBSERVATION = 'Sua tentativa foi registrada.';
const DEFAULT_GUIDING_QUESTION = 'Qual parte do enunciado merece mais atenção nesta tentativa?';
const DEFAULT_NEXT_ACTION = 'Revise o ponto principal indicado e tente novamente.';
const DEFAULT_TEACHER_HYPOTHESIS = 'A análise identificou um ponto central para orientar a próxima revisão do estudante.';

export function createEmptyPrimaryIssue(): PrimaryIssue {
  return {
    hasIssue: false,
    type: 'sem_erro_relevante',
    concept: '',
    evidence: '',
    explanation: '',
    criterionId: ''
  };
}

function normalizePrimaryIssue(
  primaryIssue: Partial<PrimaryIssue> | undefined,
  category: ChallengeCategory,
  fallbackType: ErrorType
): PrimaryIssue {
  const hasIssue = category !== 'solução adequada' && Boolean(primaryIssue?.hasIssue ?? primaryIssue?.explanation ?? primaryIssue?.evidence ?? primaryIssue?.concept);

  if (!hasIssue) {
    return createEmptyPrimaryIssue();
  }

  return {
    hasIssue: true,
    type: primaryIssue?.type && APP_CONSTANTS.ERROR_TYPES.includes(primaryIssue.type) ? primaryIssue.type : fallbackType,
    concept: typeof primaryIssue?.concept === 'string' ? primaryIssue.concept : '',
    evidence: typeof primaryIssue?.evidence === 'string' ? primaryIssue.evidence : '',
    explanation: typeof primaryIssue?.explanation === 'string' ? primaryIssue.explanation : '',
    criterionId: typeof primaryIssue?.criterionId === 'string' ? primaryIssue.criterionId : ''
  };
}

export function normalizeStudentFeedback(
  feedback: Partial<StudentFeedback> | undefined,
  category: ChallengeCategory,
  fallbackType: ErrorType = 'logica'
): StudentFeedback {
  const positiveObservation = typeof feedback?.positiveObservation === 'string' && feedback.positiveObservation.trim().length > 0
    ? feedback.positiveObservation
    : DEFAULT_POSITIVE_OBSERVATION;

  const primaryIssue = normalizePrimaryIssue(feedback?.primaryIssue, category, fallbackType);

  const guidingQuestion = typeof feedback?.guidingQuestion === 'string' && feedback.guidingQuestion.trim().length > 0
    ? feedback.guidingQuestion
    : category === 'solução adequada'
      ? 'Como você explicaria por que sua solução atende a todos os critérios do desafio?'
      : DEFAULT_GUIDING_QUESTION;

  const nextAction = typeof feedback?.nextAction === 'string' && feedback.nextAction.trim().length > 0
    ? feedback.nextAction
    : category === 'solução adequada'
      ? 'Avance para o próximo desafio ou revise sua solução para consolidar o raciocínio.'
      : DEFAULT_NEXT_ACTION;

  return {
    positiveObservation,
    primaryIssue,
    guidingQuestion,
    nextAction
  };
}

export function normalizeTeacherDiagnosis(diagnosis: Partial<TeacherDiagnosis> | undefined): TeacherDiagnosis {
  return {
    hypothesis: typeof diagnosis?.hypothesis === 'string' && diagnosis.hypothesis.trim().length > 0
      ? diagnosis.hypothesis
      : DEFAULT_TEACHER_HYPOTHESIS,
    confidence: diagnosis?.confidence && ['baixa', 'media', 'alta'].includes(diagnosis.confidence)
      ? diagnosis.confidence
      : 'media'
  };
}

export function buildLegacyFields(studentFeedback: StudentFeedback, teacherDiagnosis: TeacherDiagnosis) {
  const review = studentFeedback.primaryIssue.hasIssue
    ? [
        studentFeedback.primaryIssue.explanation,
        studentFeedback.primaryIssue.evidence ? `Evidência: ${studentFeedback.primaryIssue.evidence}` : ''
      ].filter(Boolean)
    : [];

  return {
    difficultyHypothesis: teacherDiagnosis.hypothesis,
    feedback: {
      good: [studentFeedback.positiveObservation],
      review,
      nextStep: studentFeedback.nextAction
    },
    suggestedNextStep: studentFeedback.nextAction,
    analysisSummary: studentFeedback.primaryIssue.hasIssue
      ? studentFeedback.primaryIssue.explanation || studentFeedback.primaryIssue.evidence || studentFeedback.positiveObservation
      : studentFeedback.positiveObservation,
    errorType: [studentFeedback.primaryIssue.hasIssue ? studentFeedback.primaryIssue.type : 'sem_erro_relevante'] as ErrorType[]
  };
}

export function createAnalysisResult(params: {
  category: ChallengeCategory;
  confidence?: AnalysisConfidence;
  studentFeedback: Partial<StudentFeedback>;
  teacherDiagnosis: Partial<TeacherDiagnosis>;
  criteriaAssessment?: CriterionAssessment[];
  analysisMode: AnalysisMode;
  analysisStatus?: AnalysisStatus;
  modelUsed: string;
  promptVersion: string;
  requestId?: string;
  durationMs?: number;
  modelCalls?: number;
  analysisSummary?: string;
  retryAfterSeconds?: number;
  isTransientFailure?: boolean;
  shouldPersistAttempt?: boolean;
  shouldCountAnalysisRequest?: boolean;
}): AnalysisResult {
  const fallbackType = params.studentFeedback.primaryIssue?.type || 'logica';
  const studentFeedback = normalizeStudentFeedback(params.studentFeedback, params.category, fallbackType);
  const teacherDiagnosis = normalizeTeacherDiagnosis(params.teacherDiagnosis);
  const legacy = buildLegacyFields(studentFeedback, teacherDiagnosis);

  return {
    category: params.category,
    confidence: params.confidence || 'media',
    studentFeedback,
    teacherDiagnosis,
    criteriaAssessment: params.criteriaAssessment,
    difficultyHypothesis: legacy.difficultyHypothesis,
    feedback: legacy.feedback,
    errorType: legacy.errorType,
    suggestedNextStep: legacy.suggestedNextStep,
    analysisSummary: params.analysisSummary || legacy.analysisSummary,
    analysisMode: params.analysisMode,
    analysisStatus: params.analysisStatus || 'success',
    modelUsed: params.modelUsed,
    promptVersion: params.promptVersion,
    requestId: params.requestId,
    durationMs: params.durationMs,
    modelCalls: params.modelCalls,
    retryAfterSeconds: params.retryAfterSeconds,
    isTransientFailure: params.isTransientFailure,
    shouldPersistAttempt: params.shouldPersistAttempt,
    shouldCountAnalysisRequest: params.shouldCountAnalysisRequest
  };
}

function coerceCategory(value: unknown): ChallengeCategory {
  return value === 'parcialmente correta' || value === 'quase completa' || value === 'solução adequada'
    ? value
    : 'tentativa inicial';
}

function coerceConfidence(value: unknown): AnalysisConfidence {
  return value === 'baixa' || value === 'alta' ? value : 'media';
}

function coerceErrorType(value: unknown): ErrorType {
  return typeof value === 'string' && APP_CONSTANTS.ERROR_TYPES.includes(value as ErrorType)
    ? value as ErrorType
    : 'logica';
}

function normalizeCriteriaAssessment(value: unknown): CriterionAssessment[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const entries = value.filter((item): item is CriterionAssessment => Boolean(item) && typeof item === 'object' && typeof (item as CriterionAssessment).criterionId === 'string' && typeof (item as CriterionAssessment).evidence === 'string' && ['satisfied', 'partial', 'not_satisfied', 'not_verifiable'].includes((item as CriterionAssessment).status));
  return entries.length ? entries.map(item => ({ ...item })) : undefined;
}

function extractEvidenceFromLegacyReview(review: string[]): string {
  const evidenceLine = review.find(item => item.toLowerCase().startsWith('evidência:'));
  return evidenceLine ? evidenceLine.replace(/^evidência:\s*/i, '').trim() : '';
}

export function normalizeAnalysisResult(data: any, defaults?: Partial<Pick<AnalysisResult, 'analysisMode' | 'analysisStatus' | 'modelUsed' | 'promptVersion'>>): AnalysisResult {
  const category = coerceCategory(data?.category);
  const legacyReview = Array.isArray(data?.feedback?.review) ? data.feedback.review.filter((item: unknown) => typeof item === 'string') : [];
  const legacyGood = Array.isArray(data?.feedback?.good) ? data.feedback.good.filter((item: unknown) => typeof item === 'string') : [];
  const legacyErrorType = Array.isArray(data?.errorType) && data.errorType.length > 0
    ? coerceErrorType(data.errorType[0])
    : 'logica';
  const studentFeedback = normalizeStudentFeedback(data?.studentFeedback || {
    positiveObservation: legacyGood[0] || data?.analysisSummary || DEFAULT_POSITIVE_OBSERVATION,
    primaryIssue: {
      hasIssue: category !== 'solução adequada' && (legacyReview.length > 0 || legacyErrorType !== 'sem_erro_relevante'),
      type: category === 'solução adequada' ? 'sem_erro_relevante' : legacyErrorType,
      concept: data?.studentFeedback?.primaryIssue?.concept || '',
      evidence: data?.studentFeedback?.primaryIssue?.evidence || extractEvidenceFromLegacyReview(legacyReview),
      explanation: data?.studentFeedback?.primaryIssue?.explanation || legacyReview.find((item: string) => !item.toLowerCase().startsWith('evidência:')) || ''
    },
    guidingQuestion: data?.studentFeedback?.guidingQuestion || (category === 'solução adequada'
      ? 'Como você explicaria por que sua solução atende a todos os critérios?'
      : DEFAULT_GUIDING_QUESTION),
    nextAction: data?.studentFeedback?.nextAction || data?.feedback?.nextStep || data?.suggestedNextStep || DEFAULT_NEXT_ACTION
  }, category, legacyErrorType);

  const teacherDiagnosis = normalizeTeacherDiagnosis(data?.teacherDiagnosis || {
    hypothesis: data?.difficultyHypothesis || DEFAULT_TEACHER_HYPOTHESIS,
    confidence: data?.teacherDiagnosis?.confidence || data?.confidence || 'media'
  });

  return createAnalysisResult({
    category,
    confidence: coerceConfidence(data?.confidence),
    studentFeedback,
    teacherDiagnosis,
    analysisMode: defaults?.analysisMode || data?.analysisMode || 'unknown',
    analysisStatus: defaults?.analysisStatus || data?.analysisStatus || 'success',
    modelUsed: defaults?.modelUsed || data?.modelUsed || 'unknown',
    promptVersion: defaults?.promptVersion || data?.promptVersion || APP_CONSTANTS.PROMPT_VERSION,
    criteriaAssessment: normalizeCriteriaAssessment(data?.criteriaAssessment),
    analysisSummary: data?.analysisSummary
  });
}

export function buildPreviousAttemptContext(
  previousAttempt: Attempt | undefined,
  currentCode: string,
  openedTipIds: number[],
  attemptNumber: number
): PreviousAttemptContext {
  const currentNormalized = (currentCode || '').trim();
  const previousNormalized = (previousAttempt?.code || '').trim();
  const previousPrimaryIssue = previousAttempt?.studentFeedback.primaryIssue.hasIssue
    ? {
        type: previousAttempt.studentFeedback.primaryIssue.type,
        concept: previousAttempt.studentFeedback.primaryIssue.concept,
        explanation: previousAttempt.studentFeedback.primaryIssue.explanation
      }
    : undefined;

  return {
    attemptNumber,
    previousCategory: previousAttempt?.category,
    previousPrimaryIssue,
    previousGuidingQuestion: previousAttempt?.studentFeedback.guidingQuestion,
    previousNextAction: previousAttempt?.studentFeedback.nextAction,
    codeChanged: previousAttempt ? currentNormalized !== previousNormalized : true,
    openedTipIds: [...openedTipIds]
  };
}

export function createLocalAnalysisResult(
  category: ChallengeCategory,
  good: string[],
  review: string[],
  nextStep: string,
  difficultyHypothesis: string,
  errorType: ErrorType[] = ['logica'],
  summary: string = 'Análise heurística local realizada com sucesso.'
): AnalysisResult {
  const normalizedType = errorType[0] && APP_CONSTANTS.ERROR_TYPES.includes(errorType[0])
    ? errorType[0]
    : 'logica';
  const evidence = extractEvidenceFromLegacyReview(review);
  const explanation = review.find(item => !item.toLowerCase().startsWith('evidência:')) || '';

  return createAnalysisResult({
    category,
    confidence: 'media',
    studentFeedback: {
      positiveObservation: good[0] || DEFAULT_POSITIVE_OBSERVATION,
      primaryIssue: {
        hasIssue: category !== 'solução adequada' && (Boolean(explanation) || normalizedType !== 'sem_erro_relevante'),
        type: category === 'solução adequada' ? 'sem_erro_relevante' : normalizedType,
        concept: '',
        evidence,
        explanation
      },
      guidingQuestion: category === 'solução adequada'
        ? 'Como você explicaria os pontos fortes da sua solução para outro estudante?'
        : DEFAULT_GUIDING_QUESTION,
      nextAction: nextStep
    },
    teacherDiagnosis: {
      hypothesis: difficultyHypothesis,
      confidence: 'media'
    },
    analysisMode: 'local_fallback',
    modelUsed: 'local_heuristic',
    promptVersion: APP_CONSTANTS.PROMPT_VERSION,
    analysisSummary: summary
  });
}

export function formatAttempt(
  user: UserProfile | null,
  challenge: Challenge,
  code: string,
  analysis: AnalysisResult,
  usedTips: number[],
  sessionId: string,
  processMetrics: {
    timeSinceSessionStart: number;
    verificationIndex: number;
    tipsCountAtSubmission: number;
  }
): Attempt {
  const normalizedAnalysis = normalizeAnalysisResult(analysis, {
    analysisMode: analysis.analysisMode,
    modelUsed: analysis.modelUsed,
    promptVersion: analysis.promptVersion
  });

  return {
    id: crypto.randomUUID(),
    userId: user?.uid || 'anonymous',
    challengeId: challenge.id,
    challengeVersion: challenge.metadata.version,
    sessionId,
    timestamp: new Date(),
    code,
    tipsUsed: [...usedTips],
    category: normalizedAnalysis.category,
    confidence: normalizedAnalysis.confidence,
    studentFeedback: normalizedAnalysis.studentFeedback,
    criteriaAssessment: normalizedAnalysis.criteriaAssessment,
    teacherDiagnosis: normalizedAnalysis.teacherDiagnosis,
    difficultyHypothesis: normalizedAnalysis.difficultyHypothesis,
    feedback: normalizedAnalysis.feedback,
    errorType: normalizedAnalysis.errorType,
    suggestedNextStep: normalizedAnalysis.suggestedNextStep,
    analysisSummary: normalizedAnalysis.analysisSummary,
    analysisMode: normalizedAnalysis.analysisMode,
    modelUsed: normalizedAnalysis.modelUsed,
    promptVersion: normalizedAnalysis.promptVersion,
    analysisRequestId: normalizedAnalysis.requestId,
    analysisDurationMs: normalizedAnalysis.durationMs,
    modelCalls: normalizedAnalysis.modelCalls,
    processMetrics
  };
}

export function isChallengeSolved(category: ChallengeCategory): boolean {
  return category === 'solução adequada';
}

export function getIncentiveMessage(category: ChallengeCategory): string {
  switch (category) {
    case 'solução adequada':
      return 'Excelente trabalho! Você dominou este conceito.';
    case 'quase completa':
      return 'Quase lá! Só mais um pequeno ajuste.';
    case 'parcialmente correta':
      return 'Bom começo! Continue explorando as condições.';
    default:
      return 'Não desista! Programação é prática constante.';
  }
}

export function getAvailableTips(challenge: Challenge, usedTips: number[]) {
  return challenge.tips.filter(tip => !usedTips.includes(tip.id));
}

export function isCodeSubstantial(code: string): boolean {
  const cleanCode = code.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '').trim();
  return cleanCode.length > 10;
}
