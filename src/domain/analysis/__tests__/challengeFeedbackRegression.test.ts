import { describe, expect, it } from 'vitest';
import { CHALLENGES } from '../../../challenges';
import { generateLocalAnalysis } from '../../../services/localAnalysisService';
import { evaluateFeedbackSpecificity } from '../feedbackSpecificity';

describe('regressão global de feedback local', () => {
  it.each(CHALLENGES.map(challenge => [challenge.id, challenge]))('%s mantém contexto pedagógico suficiente', (_id, challenge) => {
    expect(challenge.problem).not.toHaveLength(0);
    expect(challenge.expectedCriteria.length).toBeGreaterThan(0);
    expect(challenge.commonErrors.length + challenge.probableErrors.length).toBeGreaterThan(0);
    const result = generateLocalAnalysis({ challenge, studentCode: challenge.templateCode }).result;
    expect(result.criteriaAssessment).toHaveLength(challenge.expectedCriteria.length);
    expect(result.criteriaAssessment?.every(item => challenge.expectedCriteria.some(criterion => criterion.id === item.criterionId))).toBe(true);
    const quality = evaluateFeedbackSpecificity(result, { challenge, studentCode: challenge.templateCode });
    expect(quality.isSpecific, quality.issues.join(', ')).toBe(true);
  });
});
