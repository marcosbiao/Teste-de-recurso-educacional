import { collection, doc, query, where, orderBy, limit, CollectionReference, DocumentReference, Query } from 'firebase/firestore';
import { db } from '../firebase';
import { APP_CONSTANTS } from '../config/constants';

/**
 * Utilitário centralizado para gerar referências e queries do Firestore.
 * Garante consistência nos caminhos das coleções e evita duplicação de lógica.
 */
export const firestoreService = {
  
  /**
   * Retorna a referência para a coleção de perfis de usuário.
   */
  getUserProfilesCollection(): CollectionReference {
    return collection(db, APP_CONSTANTS.COLLECTIONS.USER_PROFILES);
  },

  /**
   * Retorna a referência para um documento de perfil de usuário específico.
   */
  getUserProfileDoc(uid: string): DocumentReference {
    return doc(db, APP_CONSTANTS.COLLECTIONS.USER_PROFILES, uid);
  },

  /**
   * Retorna a referência para a subcoleção de tentativas de um usuário.
   */
  getUserAttemptsCollection(userId: string): CollectionReference {
    return collection(db, APP_CONSTANTS.COLLECTIONS.USER_PROFILES, userId, APP_CONSTANTS.COLLECTIONS.ATTEMPTS);
  },

  /**
   * Retorna a referência para o progresso pedagógico de um desafio por usuário.
   */
  getUserChallengeProgressDoc(userId: string, challengeId: string, challengeVersion: string): DocumentReference {
    return doc(
      db,
      APP_CONSTANTS.COLLECTIONS.USER_PROFILES,
      userId,
      APP_CONSTANTS.COLLECTIONS.CHALLENGE_PROGRESS,
      `${challengeId}_${challengeVersion}`
    );
  },

  /**
   * Retorna a referência para a coleção de sessões.
   */
  getSessionsCollection(): CollectionReference {
    return collection(db, APP_CONSTANTS.COLLECTIONS.SESSIONS);
  },

  /**
   * Retorna a referência para um documento de sessão específico.
   */
  getSessionDoc(sessionId: string): DocumentReference {
    return doc(db, APP_CONSTANTS.COLLECTIONS.SESSIONS, sessionId);
  },

  /**
   * Retorna a referência para a coleção de eventos.
   */
  getEventsCollection(): CollectionReference {
    return collection(db, APP_CONSTANTS.COLLECTIONS.EVENTS);
  },

  /**
   * Cria uma query para buscar tentativas filtradas por desafio.
   */
  getAttemptsByChallengeQuery(userId: string, challengeId: string, limitCount: number = 10): Query {
    return query(
      this.getUserAttemptsCollection(userId),
      where('challengeId', '==', challengeId),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
  },

  /**
   * Cria uma query para buscar todas as tentativas de um usuário.
   */
  getAllUserAttemptsQuery(userId: string, limitCount: number = 100): Query {
    return query(
      this.getUserAttemptsCollection(userId),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
  }
};
