import { useEffect, useRef, useState } from "react";
import { UserProfile, AuthState } from '../types';
import { authService } from '../services/authService';
import { userProfileService } from '../services/userProfileService';

/**
 * Hook para gerenciar o estado de autenticação e perfil do usuário.
 */
export function useAuthState(): AuthState {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const anonymousSignInInFlight = useRef(false);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        setIsAuthenticated(true);
        setIsAnonymous(firebaseUser.isAnonymous === true);
        setIsAuthReady(true);
        setLoading(false);
        if (firebaseUser.isAnonymous) {
          setUser(null);
          setError(null);
          return;
        }
        try {
          const isAdmin = await authService.checkIsAdmin(firebaseUser);
          const userData = await userProfileService.ensureUserProfile(firebaseUser, isAdmin);
          setUser(userData);
          setError(null);
        } catch {
          setUser(null);
          setError("Falha ao carregar perfil. A análise automática continua disponível.");
        }
        return;
      }
      setUser(null);
      setIsAuthenticated(false);
      setIsAnonymous(false);
      if (anonymousSignInInFlight.current) return;
      anonymousSignInInFlight.current = true;
      try {
        await authService.signInAnonymously();
      } catch (error: unknown) {
        const code = error && typeof error === "object" && typeof (error as { code?: unknown }).code === "string" ? (error as { code: string }).code : "unknown";
        if (import.meta.env.DEV === true) console.info("[anonymous-auth]", { outcome: "ANONYMOUS_AUTH_FAILED", code });
        setError("Não foi possível preparar a análise automática.");
        setIsAuthReady(true);
        setLoading(false);
      } finally {
        anonymousSignInInFlight.current = false;
      }
    });
    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      await authService.loginWithGoogle();
    } catch (error: any) {
      console.error("Erro no login:", error);
      setError("Falha no login com Google.");
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error: any) {
      console.error("Erro no logout:", error);
      setError("Falha ao sair.");
    }
  };

  return { user, isAuthenticated, isAnonymous, isAuthReady, loading, error, login, logout };
}
