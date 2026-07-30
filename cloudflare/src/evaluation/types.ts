export interface ChallengeEvaluation {
  challengeId: string;
  rubric: Array<{ id: string; criterion: string; essential: boolean; guidance?: string[] }>;
  referenceStrategies?: string[];
  commonErrors?: Array<{ error: string; consequence?: string }>;
}
