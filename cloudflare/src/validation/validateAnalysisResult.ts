import type { AnalysisResult, CriterionAssessment } from '../../../src/domain/analysis/analysisTypes';
import { validateAnalysisResult as validatePayload, AnalysisValidationError } from '../../../src/domain/analysis/validateAnalysisResult';
import { evaluateFeedbackSpecificity } from '../../../src/domain/analysis/feedbackSpecificity';
import type { InternalChallenge } from '../catalog/challengeAnalysisCatalog';
import { HttpError } from '../http/errors';

type WorkerPayload = Omit<AnalysisResult, 'analysisMode' | 'analysisStatus' | 'modelUsed' | 'promptVersion' | 'difficultyHypothesis' | 'feedback' | 'errorType' | 'suggestedNextStep' | 'analysisSummary'>;

function completeDesirableCriteria(challenge: InternalChallenge, assessments: CriterionAssessment[]): CriterionAssessment[] {
  const known = new Set(assessments.map((item) => item.criterionId));
  return [
    ...assessments,
    ...challenge.expectedEvidence
      .filter((criterion) => criterion.importance !== 'essencial' && !known.has(criterion.criterionId))
      .map((criterion) => ({ criterionId: criterion.criterionId, status: 'not_verifiable' as const, evidence: 'O modelo não avaliou este critério desejável.' })),
  ];
}

function minimumDesirableCoverage(_challenge: InternalChallenge): number {
  // Essential coverage is mandatory; desirable criteria may be omitted under model output limits.
  return 0;
}

function specificityContext(challenge: InternalChallenge, studentCode: string) {
  return {
    challenge: {
      id: challenge.id, title: challenge.title, problem: challenge.statement, concepts: challenge.requiredConcepts,
      expectedCriteria: challenge.expectedEvidence.map((item) => ({ id: item.criterionId, description: item.description })),
      orientation: { input: '', output: '', cases: '', structure: '', expectedLogic: '' }, metadata: { requirements: challenge.objective },
    } as never,
    studentCode,
  };
}

export function validateWorkerAnalysis(raw: unknown, challenge: InternalChallenge, studentCode: string): WorkerPayload {
  try {
    const payload = validatePayload(raw);
    const known = new Set(challenge.expectedEvidence.map((criterion) => criterion.criterionId));
    if (!payload.criteriaAssessment.length || payload.criteriaAssessment.some((item) => !known.has(item.criterionId))) throw new AnalysisValidationError('Os critérios avaliados não correspondem ao desafio.');
    const essentialIds = challenge.expectedEvidence.filter((item) => item.importance === 'essencial').map((item) => item.criterionId);
    const assessedIds = new Set(payload.criteriaAssessment.map((item) => item.criterionId));
    const missingEssential = essentialIds.filter((id) => !assessedIds.has(id));
    if (missingEssential.length) throw new AnalysisValidationError('A resposta não avaliou todos os critérios essenciais.');
    const assessedDesirable = challenge.expectedEvidence.filter((item) => item.importance !== 'essencial' && assessedIds.has(item.criterionId)).length;
    if (assessedDesirable < minimumDesirableCoverage(challenge)) throw new AnalysisValidationError('A resposta não possui cobertura mínima dos critérios desejáveis.');
    const criteriaAssessment = completeDesirableCriteria(challenge, payload.criteriaAssessment);
    const issue = payload.studentFeedback.primaryIssue;
    if (issue.hasIssue) {
      if (!issue.criterionId) throw new AnalysisValidationError('O problema prioritário deve ter criterionId.');
      const priority = criteriaAssessment.find((criterion) => criterion.criterionId === issue.criterionId);
      if (!priority || !['partial', 'not_satisfied'].includes(priority.status)) throw new AnalysisValidationError('O problema prioritário não é um critério pendente.');
    } else {
      const essentialAssessments = criteriaAssessment.filter((item) => essentialIds.includes(item.criterionId));
      if (essentialAssessments.some((item) => item.status !== 'satisfied')) throw new AnalysisValidationError('Uma solução sem problema precisa atender todos os critérios essenciais.');
    }
    const candidate = {
      ...payload, criteriaAssessment, studentFeedback: { ...payload.studentFeedback, primaryIssue: { ...issue } },
      analysisMode: 'cloudflare_qwen', analysisStatus: 'success', modelUsed: 'worker-validation', promptVersion: 'worker',
      difficultyHypothesis: payload.teacherDiagnosis.hypothesis, feedback: { good: [payload.studentFeedback.positiveObservation], review: issue.hasIssue ? [issue.explanation] : [], nextStep: payload.studentFeedback.nextAction },
      errorType: [issue.type], suggestedNextStep: payload.studentFeedback.nextAction, analysisSummary: issue.hasIssue ? issue.explanation : payload.studentFeedback.positiveObservation,
    } as AnalysisResult;
    const specificity = evaluateFeedbackSpecificity(candidate, specificityContext(challenge, studentCode));
    if (!specificity.isSpecific) throw new HttpError(422, 'MODEL_PEDAGOGICAL_INVALID', `Feedback pedagógico inconsistente: ${specificity.issues.join(', ')}`);
    return { ...payload, criteriaAssessment };
  } catch (error) {
    if (error instanceof HttpError) throw error;
    throw new HttpError(502, 'MODEL_RESPONSE_INVALID', error instanceof Error ? error.message : 'A resposta do modelo não passou pela validação.');
  }
}
