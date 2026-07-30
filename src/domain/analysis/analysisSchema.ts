import { ANALYSIS_CATEGORIES, ANALYSIS_CONFIDENCES, ANALYSIS_ERROR_TYPES, CRITERION_STATUSES } from './analysisTypes';

/** JSON-schema-shaped contract retained for documentation and tests. It is provider-neutral. */
export const ANALYSIS_RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    category: { type: 'string', enum: ANALYSIS_CATEGORIES },
    confidence: { type: 'string', enum: ANALYSIS_CONFIDENCES },
    studentFeedback: {
      type: 'object', properties: {
        positiveObservation: { type: 'string' },
        primaryIssue: { type: 'object', properties: { hasIssue: { type: 'boolean' }, type: { type: 'string', enum: ANALYSIS_ERROR_TYPES }, concept: { type: 'string' }, evidence: { type: 'string' }, explanation: { type: 'string' }, criterionId: { type: 'string' } }, required: ['hasIssue', 'type', 'concept', 'evidence', 'explanation', 'criterionId'] },
        guidingQuestion: { type: 'string' }, nextAction: { type: 'string' }
      }, required: ['positiveObservation', 'primaryIssue', 'guidingQuestion', 'nextAction']
    },
    criteriaAssessment: { type: 'array', items: { type: 'object', properties: { criterionId: { type: 'string' }, status: { type: 'string', enum: CRITERION_STATUSES }, evidence: { type: 'string' } }, required: ['criterionId', 'status', 'evidence'] } },
    teacherDiagnosis: { type: 'object', properties: { hypothesis: { type: 'string' }, confidence: { type: 'string', enum: ANALYSIS_CONFIDENCES } }, required: ['hypothesis', 'confidence'] }
  }, required: ['category', 'confidence', 'studentFeedback', 'criteriaAssessment', 'teacherDiagnosis']
} as const;
