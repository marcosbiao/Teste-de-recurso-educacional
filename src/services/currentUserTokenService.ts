import { auth } from '../firebase';

export class CurrentUserTokenError extends Error {
  readonly code = 'unauthenticated';
  constructor() { super('Não há usuário autenticado para obter um token.'); this.name = 'CurrentUserTokenError'; }
}
/** Read-on-demand only: never logs or persists the Firebase ID token. */
export async function getCurrentUserIdToken(): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new CurrentUserTokenError();
  return user.getIdToken();
}
