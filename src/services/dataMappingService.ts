import { Timestamp } from 'firebase/firestore';
import { Attempt, UserProfile } from '../types';
import { APP_CONSTANTS } from '../config/constants';
import { migrateLegacyAnalysis } from '../domain/analysis/migrateLegacyAnalysis';

export const dataMappingService = {
  mapFirestoreAttempt(doc: any): Attempt {
    const data = doc.data();
    return this.normalizeAttempt({
      ...data,
      id: doc.id,
      timestamp: data.timestamp instanceof Timestamp ? data.timestamp.toDate() : data.timestamp
    });
  },

  mapLocalAttempt(data: any): Attempt {
    return this.normalizeAttempt({
      ...data,
      timestamp: typeof data.timestamp === 'string' ? new Date(data.timestamp) : data.timestamp
    });
  },

  normalizeAttempt(data: any): Attempt {
    const normalizedAnalysis = migrateLegacyAnalysis(data, {
      analysisMode: data.analysisMode || 'unknown',
      modelUsed: data.modelUsed || 'unknown',
      promptVersion: data.promptVersion || APP_CONSTANTS.PROMPT_VERSION
    });

    return {
      id: data.id || crypto.randomUUID(),
      userId: data.userId || 'anonymous',
      challengeId: data.challengeId || 'unknown',
      challengeVersion: data.challengeVersion || '1.0.0',
      sessionId: data.sessionId || 'unknown_session',
      timestamp: data.timestamp || new Date(),
      code: data.code || '',
      tipsUsed: Array.isArray(data.tipsUsed) ? data.tipsUsed : [],
      category: normalizedAnalysis.category,
      confidence: normalizedAnalysis.confidence,
      studentFeedback: normalizedAnalysis.studentFeedback,
      criteriaAssessment: normalizedAnalysis.criteriaAssessment,
      teacherDiagnosis: normalizedAnalysis.teacherDiagnosis,
      difficultyHypothesis: normalizedAnalysis.difficultyHypothesis,
      feedback: normalizedAnalysis.feedback,
      errorType: normalizedAnalysis.errorType,
      suggestedNextStep: normalizedAnalysis.suggestedNextStep,
      analysisSummary: normalizedAnalysis.analysisSummary,
      analysisMode: normalizedAnalysis.analysisMode,
      modelUsed: normalizedAnalysis.modelUsed,
      promptVersion: normalizedAnalysis.promptVersion,
      processMetrics: {
        timeSinceSessionStart: data.processMetrics?.timeSinceSessionStart || 0,
        verificationIndex: data.processMetrics?.verificationIndex || 0,
        tipsCountAtSubmission: data.processMetrics?.tipsCountAtSubmission || 0
      },
      isLocal: Boolean(data.isLocal)
    };
  },

  normalizeUserProfile(data: any): UserProfile {
    return {
      uid: data.uid,
      email: data.email || null,
      displayName: data.displayName || null,
      photoURL: data.photoURL || null,
      role: data.role || 'student',
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt
    };
  }
};
