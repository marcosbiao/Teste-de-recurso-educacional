import { 
  addDoc, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../firebase';
import { Attempt } from '../types';
import { dataMappingService } from './dataMappingService';
import { firestoreService } from './firestoreService';
import { APP_CONSTANTS } from '../config/constants';
import { ANALYSIS_LIMITS } from '../domain/analysis/analysisLimits';

/**
 * Serviço para gerenciamento de tentativas no Firestore.
 */
export const attemptService = {
  
  /**
   * Salva uma nova tentativa de desafio no Firestore.
   */
  async saveAttempt(userId: string, attempt: Attempt): Promise<void> {
    try {
      // Validação básica antes de enviar
      if (!attempt.code || attempt.code.length > ANALYSIS_LIMITS.maxCodeLength) {
        throw new Error("Código inválido ou muito longo.");
      }
      
      const { id, ...dataToSave } = attempt;
      
      await addDoc(firestoreService.getUserAttemptsCollection(userId), {
        ...dataToSave,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `${APP_CONSTANTS.COLLECTIONS.USER_PROFILES}/${userId}/${APP_CONSTANTS.COLLECTIONS.ATTEMPTS}`);
      throw error;
    }
  },

  /**
   * Escuta as tentativas de um desafio específico para um usuário.
   */
  subscribeToAttempts(
    userId: string, 
    challengeId: string, 
    callback: (attempts: Attempt[]) => void
  ) {
    const q = firestoreService.getAttemptsByChallengeQuery(userId, challengeId);

    return onSnapshot(q, (snapshot) => {
      const attempts = snapshot.docs.map(doc => dataMappingService.mapFirestoreAttempt(doc));
      callback(attempts);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `${APP_CONSTANTS.COLLECTIONS.USER_PROFILES}/${userId}/${APP_CONSTANTS.COLLECTIONS.ATTEMPTS}`);
    });
  },

  /**
   * Escuta todas as tentativas de um usuário para calcular progresso global.
   */
  subscribeToAllAttempts(
    userId: string, 
    callback: (attempts: Attempt[]) => void,
    onError?: (error: unknown) => void
  ) {
    const q = firestoreService.getAllUserAttemptsQuery(userId);

    return onSnapshot(q, (snapshot) => {
      const attempts = snapshot.docs.map(doc => dataMappingService.mapFirestoreAttempt(doc));
      callback(attempts);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `${APP_CONSTANTS.COLLECTIONS.USER_PROFILES}/${userId}/${APP_CONSTANTS.COLLECTIONS.ATTEMPTS}`);
      onError?.(error);
    });
  }
};
