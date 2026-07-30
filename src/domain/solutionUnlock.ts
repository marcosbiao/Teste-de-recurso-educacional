import type { Challenge, Tip, SolutionUnlockProgress } from '../types';
import { isCodeSubstantial } from './pedagogicalDomain';

export const REQUIRED_ANALYSIS_REQUESTS = 2;

export interface SolutionUnlockState {
  openedTipIds: number[];
  openedTipsCount: number;
  totalTips: number;
  allTipsOpened: boolean;
  aiAnalysisRequestCount: number;
  displayedAnalysisRequestCount: number;
  canOpenSolution: boolean;
  guidanceMessage: string;
}

export interface AnalysisRequestGateInput {
  code: string;
  isAnalyzing: boolean;
  isInCooldown: boolean;
}

export function normalizeOpenedTipIds(openedTipIds: Array<number | string> = []): number[] {
  const uniqueIds = new Set<number>();

  openedTipIds.forEach((tipId) => {
    const numericId = Number(tipId);
    if (Number.isFinite(numericId)) {
      uniqueIds.add(numericId);
    }
  });

  return Array.from(uniqueIds);
}

export function areAllTipsOpened(tips: Tip[], openedTipIds: Array<number | string> = []): boolean {
  if (tips.length === 0) return true;

  const openedIds = new Set(normalizeOpenedTipIds(openedTipIds));
  return tips.every((tip) => openedIds.has(tip.id));
}

export function countOpenedCurrentTips(tips: Tip[], openedTipIds: Array<number | string> = []): number {
  const openedIds = new Set(normalizeOpenedTipIds(openedTipIds));
  return tips.filter((tip) => openedIds.has(tip.id)).length;
}

export function getSolutionUnlockState(
  challenge: Pick<Challenge, 'tips'>,
  progress: Pick<SolutionUnlockProgress, 'openedTipIds' | 'aiAnalysisRequestCount'>
): SolutionUnlockState {
  const openedTipIds = normalizeOpenedTipIds(progress.openedTipIds);
  const aiAnalysisRequestCount = Math.max(0, progress.aiAnalysisRequestCount || 0);
  const totalTips = challenge.tips.length;
  const openedTipsCount = countOpenedCurrentTips(challenge.tips, openedTipIds);
  const allTipsOpened = areAllTipsOpened(challenge.tips, openedTipIds);
  const canOpenSolution = allTipsOpened && aiAnalysisRequestCount >= REQUIRED_ANALYSIS_REQUESTS;
  const displayedAnalysisRequestCount = Math.min(aiAnalysisRequestCount, REQUIRED_ANALYSIS_REQUESTS);

  return {
    openedTipIds,
    openedTipsCount,
    totalTips,
    allTipsOpened,
    aiAnalysisRequestCount,
    displayedAnalysisRequestCount,
    canOpenSolution,
    guidanceMessage: getSolutionUnlockGuidance(allTipsOpened, aiAnalysisRequestCount)
  };
}

export function getSolutionUnlockGuidance(allTipsOpened: boolean, aiAnalysisRequestCount: number): string {
  const remainingAnalyses = Math.max(0, REQUIRED_ANALYSIS_REQUESTS - aiAnalysisRequestCount);

  if (allTipsOpened && remainingAnalyses === 0) {
    return 'Percurso de apoio concluído. A solução de referência está disponível.';
  }

  if (allTipsOpened && remainingAnalyses === 2) {
    return 'Todas as dicas foram consultadas. Solicite 2 análises da sua tentativa para liberar a solução.';
  }

  if (allTipsOpened && remainingAnalyses === 1) {
    return 'Todas as dicas foram consultadas. Solicite mais 1 análise da sua tentativa para liberar a solução.';
  }

  if (!allTipsOpened && remainingAnalyses === 0) {
    return 'As análises necessárias foram realizadas. Abra as dicas restantes para liberar a solução.';
  }

  const analysisText = remainingAnalyses === 1 ? 'mais 1 análise' : `mais ${remainingAnalyses} análises`;
  return `Para liberar a solução, abra todas as dicas e solicite ${analysisText} da sua tentativa.`;
}

export function createInitialSolutionProgress(
  userId: string,
  challengeId: string,
  challengeVersion: string
): SolutionUnlockProgress {
  return {
    userId,
    challengeId,
    challengeVersion,
    openedTipIds: [],
    aiAnalysisRequestCount: 0,
    solutionUnlocked: false,
    solutionOpenedAt: null
  };
}

export function normalizeSolutionProgress(
  progress: Partial<SolutionUnlockProgress> | null | undefined,
  userId: string,
  challengeId: string,
  challengeVersion: string
): SolutionUnlockProgress {
  return {
    ...createInitialSolutionProgress(userId, challengeId, challengeVersion),
    ...progress,
    userId,
    challengeId,
    challengeVersion,
    openedTipIds: normalizeOpenedTipIds(progress?.openedTipIds),
    aiAnalysisRequestCount: Math.max(0, Number(progress?.aiAnalysisRequestCount || 0)),
    solutionUnlocked: Boolean(progress?.solutionUnlocked),
    solutionOpenedAt: progress?.solutionOpenedAt ?? null
  };
}

export function mergeSolutionProgress(
  base: SolutionUnlockProgress,
  incoming: SolutionUnlockProgress
): SolutionUnlockProgress {
  return {
    ...base,
    openedTipIds: normalizeOpenedTipIds([...base.openedTipIds, ...incoming.openedTipIds]),
    aiAnalysisRequestCount: Math.max(base.aiAnalysisRequestCount, incoming.aiAnalysisRequestCount),
    solutionUnlocked: base.solutionUnlocked || incoming.solutionUnlocked,
    solutionOpenedAt: base.solutionOpenedAt || incoming.solutionOpenedAt || null
  };
}

export function addOpenedTip(progress: SolutionUnlockProgress, tipId: number): SolutionUnlockProgress {
  return {
    ...progress,
    openedTipIds: normalizeOpenedTipIds([...progress.openedTipIds, tipId])
  };
}

export function incrementAnalysisRequestCount(progress: SolutionUnlockProgress): SolutionUnlockProgress {
  return {
    ...progress,
    aiAnalysisRequestCount: progress.aiAnalysisRequestCount + 1
  };
}

export function canCountAiAnalysisRequest(input: AnalysisRequestGateInput): boolean {
  return !input.isAnalyzing && !input.isInCooldown && isCodeSubstantial(input.code);
}
