import { ANALYSIS_CATEGORIES, ANALYSIS_CONFIDENCES, ANALYSIS_ERROR_TYPES, CRITERION_STATUSES } from './analysisTypes';
import type { AnalysisConfidence, ChallengeCategory, CriterionAssessment, CriterionStatus, ErrorType } from './analysisTypes';
import { normalizeAnalysisText } from './normalizeAnalysisResponse';

export class AnalysisValidationError extends Error {
  readonly code = 'invalid_schema';
  constructor(message: string) {
    super(message);
    this.name = 'AnalysisValidationError';
  }
}

export interface ValidatedAnalysisPayload {
  category: ChallengeCategory;
  confidence: AnalysisConfidence;
  studentFeedback: {
    positiveObservation: string;
    primaryIssue: { hasIssue: boolean; type: ErrorType; concept: string; evidence: string; explanation: string; criterionId: string };
    guidingQuestion: string;
    nextAction: string;
  };
  criteriaAssessment: CriterionAssessment[];
  teacherDiagnosis: { hypothesis: string; confidence: AnalysisConfidence };
}

function record(value: unknown, field: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new AnalysisValidationError(field + ' é obrigatório.');
  return value as Record<string, unknown>;
}
function text(value: unknown, field: string): string {
  const normalized = normalizeAnalysisText(value);
  if (!normalized) throw new AnalysisValidationError(field + ' deve ser texto não vazio.');
  return normalized;
}
function enumValue<T extends string>(value: unknown, values: readonly T[], field: string): T {
  if (typeof value !== 'string' || !values.includes(value as T)) throw new AnalysisValidationError(field + ' possui valor incompatível.');
  return value as T;
}
function assessments(value: unknown): CriterionAssessment[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  return value.map((item, index) => {
    const entry = record(item, 'criteriaAssessment[' + index + ']');
    const criterionId = text(entry.criterionId, 'criteriaAssessment[' + index + '].criterionId');
    if (seen.has(criterionId)) throw new AnalysisValidationError('criteriaAssessment possui criterionId duplicado.');
    seen.add(criterionId);
    return { criterionId, status: enumValue(entry.status, CRITERION_STATUSES, 'criteriaAssessment[' + index + '].status') as CriterionStatus, evidence: text(entry.evidence, 'criteriaAssessment[' + index + '].evidence') };
  });
}

export function validateAnalysisResult(value: unknown): ValidatedAnalysisPayload {
  const root = record(value, 'Resposta');
  const studentFeedback = record(root.studentFeedback, 'studentFeedback');
  const primaryIssue = record(studentFeedback.primaryIssue, 'studentFeedback.primaryIssue');
  const teacherDiagnosis = record(root.teacherDiagnosis, 'teacherDiagnosis');
  const criteriaAssessment = assessments(root.criteriaAssessment);
  const hasIssue = primaryIssue.hasIssue;
  if (typeof hasIssue !== 'boolean') throw new AnalysisValidationError('studentFeedback.primaryIssue.hasIssue deve ser booleano.');
  const type = enumValue(primaryIssue.type, ANALYSIS_ERROR_TYPES, 'studentFeedback.primaryIssue.type');
  const concept = normalizeAnalysisText(primaryIssue.concept);
  const evidence = normalizeAnalysisText(primaryIssue.evidence);
  const explanation = normalizeAnalysisText(primaryIssue.explanation);
  const criterionId = normalizeAnalysisText(primaryIssue.criterionId);
  if (hasIssue && (type === 'sem_erro_relevante' || !concept || !evidence || !explanation || (criteriaAssessment.length && !criterionId))) throw new AnalysisValidationError('O problema identificado não possui campos coerentes.');
  if (hasIssue && criteriaAssessment.length) { const criterion = criteriaAssessment.find(item => item.criterionId === criterionId); if (!criterion || !['partial', 'not_satisfied'].includes(criterion.status)) throw new AnalysisValidationError('O problema prioritário deve apontar para um critério parcial ou não atendido.'); }
  if (!hasIssue && type !== 'sem_erro_relevante') throw new AnalysisValidationError('Uma resposta sem problema deve usar sem_erro_relevante.');
  return {
    category: enumValue(root.category, ANALYSIS_CATEGORIES, 'category'),
    confidence: enumValue(root.confidence, ANALYSIS_CONFIDENCES, 'confidence'),
    studentFeedback: {
      positiveObservation: text(studentFeedback.positiveObservation, 'studentFeedback.positiveObservation'),
      primaryIssue: { hasIssue, type, concept, evidence, explanation, criterionId },
      guidingQuestion: text(studentFeedback.guidingQuestion, 'studentFeedback.guidingQuestion'),
      nextAction: text(studentFeedback.nextAction, 'studentFeedback.nextAction')
    },
    criteriaAssessment,
    teacherDiagnosis: {
      hypothesis: text(teacherDiagnosis.hypothesis, 'teacherDiagnosis.hypothesis'),
      confidence: enumValue(teacherDiagnosis.confidence, ANALYSIS_CONFIDENCES, 'teacherDiagnosis.confidence')
    }
  };
}
