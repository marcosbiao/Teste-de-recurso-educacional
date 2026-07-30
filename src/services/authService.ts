import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  getIdTokenResult,
  signInAnonymously,
  User as FirebaseUser
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

/**
 * Serviço de autenticação para o frontend.
 * Encapsula a lógica do Firebase Auth.
 */
export const authService = {
  /**
   * Realiza login com Google via Popup.
   */
  async loginWithGoogle() {
    try {
      return await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Erro no login com Google:", error);
      throw error;
    }
  },

  /**
   * Realiza logout do usuário.
   */
  async signInAnonymously() {
    return signInAnonymously(auth);
  },

  async logout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Erro no logout:", error);
      throw error;
    }
  },

  /**
   * Escuta mudanças no estado de autenticação.
   */
  onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  },

  /**
   * Verifica se o usuário tem privilégios de administrador.
   */
  async checkIsAdmin(user: FirebaseUser): Promise<boolean> {
    try {
      const idTokenResult = await getIdTokenResult(user);
      return !!idTokenResult.claims.admin;
    } catch (error) {
      console.error("Erro ao verificar claims de admin:", error);
      return false;
    }
  }
};
