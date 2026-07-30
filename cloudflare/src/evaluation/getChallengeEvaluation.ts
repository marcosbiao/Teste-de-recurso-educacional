import { lacosMaiorDezNumerosEvaluation } from './challenges/lacos_maior_dez_numeros.evaluation';
import type { ChallengeEvaluation } from './types';

const evaluations: Record<string, ChallengeEvaluation> = {
  [lacosMaiorDezNumerosEvaluation.challengeId]: lacosMaiorDezNumerosEvaluation,
};

export function getChallengeEvaluation(challengeId: string): ChallengeEvaluation | undefined { return evaluations[challengeId]; }
