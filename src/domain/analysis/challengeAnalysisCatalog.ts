import { CHALLENGES } from '../../challenges';

export interface ChallengeAnalysisDefinition {
  id: string;
  competencyCode: string;
  title: string;
  statement: string;
  objective: string;
  requiredConcepts: string[];
  expectedEvidence: Array<{ criterionId: string; description: string; importance: 'essencial' | 'desejável' }>;
  commonErrors: Array<{ title: string; description: string; pedagogicalAdvice: string }>;
  analysisGuidance: string[];
}
/** Excludes solution, template code and executable functions. */
export function createChallengeAnalysisCatalog(): ChallengeAnalysisDefinition[] {
  return CHALLENGES.map((challenge) => ({
    id: challenge.id,
    competencyCode: challenge.categoryId || challenge.metadata.skill,
    title: challenge.title,
    statement: challenge.problem,
    objective: challenge.pedagogicalMetadata.learningObjective,
    requiredConcepts: [...challenge.concepts],
    expectedEvidence: challenge.expectedCriteria.map((criterion) => ({ criterionId: criterion.id, description: criterion.description, importance: criterion.importance })),
    commonErrors: challenge.commonErrors.map(({ title, description, pedagogicalAdvice }) => ({ title, description, pedagogicalAdvice })),
    analysisGuidance: [...challenge.guidingQuestions],
  }));
}
export const CHALLENGE_ANALYSIS_CATALOG = createChallengeAnalysisCatalog();
