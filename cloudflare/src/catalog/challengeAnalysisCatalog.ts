import { CHALLENGE_ANALYSIS_CATALOG } from '../../../src/domain/analysis/challengeAnalysisCatalog';

export type InternalChallenge = typeof CHALLENGE_ANALYSIS_CATALOG[number];

export function getInternalChallenge(challengeId: string): InternalChallenge | undefined {
  return CHALLENGE_ANALYSIS_CATALOG.find((challenge) => challenge.id === challengeId);
}
