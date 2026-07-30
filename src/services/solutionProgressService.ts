import { getDoc, serverTimestamp, setDoc, Timestamp } from 'firebase/firestore';
import type { SolutionUnlockProgress } from '../types';
import { firestoreService } from './firestoreService';
import { normalizeSolutionProgress } from '../domain/solutionUnlock';

function mapRemoteDate(value: unknown) {
  return value instanceof Timestamp ? value.toDate() : value;
}

export const solutionProgressService = {
  async getProgress(
    userId: string,
    challengeId: string,
    challengeVersion: string
  ): Promise<SolutionUnlockProgress | null> {
    const snapshot = await getDoc(firestoreService.getUserChallengeProgressDoc(userId, challengeId, challengeVersion));
    if (!snapshot.exists()) return null;

    const data = snapshot.data();
    return normalizeSolutionProgress({
      ...data,
      solutionOpenedAt: mapRemoteDate(data.solutionOpenedAt),
      updatedAt: mapRemoteDate(data.updatedAt)
    }, userId, challengeId, challengeVersion);
  },

  async saveProgress(progress: SolutionUnlockProgress): Promise<void> {
    const dataToSave: Record<string, unknown> = {
      userId: progress.userId,
      challengeId: progress.challengeId,
      challengeVersion: progress.challengeVersion,
      openedTipIds: progress.openedTipIds,
      aiAnalysisRequestCount: progress.aiAnalysisRequestCount,
      solutionUnlocked: progress.solutionUnlocked,
      updatedAt: serverTimestamp()
    };

    if (progress.solutionOpenedAt) {
      dataToSave.solutionOpenedAt = progress.solutionOpenedAt instanceof Date
        ? progress.solutionOpenedAt
        : new Date(progress.solutionOpenedAt);
    }

    await setDoc(
      firestoreService.getUserChallengeProgressDoc(progress.userId, progress.challengeId, progress.challengeVersion),
      dataToSave,
      { merge: true }
    );
  }
};
