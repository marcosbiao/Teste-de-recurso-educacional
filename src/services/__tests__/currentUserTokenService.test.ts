import { beforeEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ getIdToken: vi.fn() }));
vi.mock('../../firebase', () => ({ auth: { currentUser: { getIdToken: mocks.getIdToken } } }));
import { auth } from '../../firebase';
import { CurrentUserTokenError, getCurrentUserIdToken } from '../currentUserTokenService';
describe('getCurrentUserIdToken', () => {
  beforeEach(() => { mocks.getIdToken.mockReset(); (auth as any).currentUser = { getIdToken: mocks.getIdToken }; });
  it('obtém token somente sob demanda', async () => { mocks.getIdToken.mockResolvedValue('token-test'); await expect(getCurrentUserIdToken()).resolves.toBe('token-test'); expect(mocks.getIdToken).toHaveBeenCalledOnce(); });
  it('retorna erro tipado sem usuário', async () => { (auth as any).currentUser = null; await expect(getCurrentUserIdToken()).rejects.toBeInstanceOf(CurrentUserTokenError); });
  it("aceita token de usuário Firebase anônimo", async () => { (auth as any).currentUser = { isAnonymous: true, getIdToken: mocks.getIdToken }; mocks.getIdToken.mockResolvedValue("anonymous-token"); await expect(getCurrentUserIdToken()).resolves.toBe("anonymous-token"); expect(mocks.getIdToken).toHaveBeenCalledOnce(); });
});
