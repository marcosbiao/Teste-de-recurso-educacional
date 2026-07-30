import { beforeEach, describe, expect, it, vi } from 'vitest';

const CurrentUserTokenErrorMock = vi.hoisted(() => class CurrentUserTokenError extends Error { constructor() { super("missing"); this.name = "CurrentUserTokenError"; } });
const getToken = vi.hoisted(() => vi.fn());
vi.mock('../currentUserTokenService', () => ({ getCurrentUserIdToken: getToken, CurrentUserTokenError: CurrentUserTokenErrorMock }));
import { CloudflareWorkerTransport, WorkerTransportError } from './cloudflareWorkerTransport';

describe('CloudflareWorkerTransport', () => {
  beforeEach(() => { getToken.mockReset().mockResolvedValue('id-token'); vi.stubEnv('VITE_ANALYSIS_API_URL', 'https://worker.example/api/analyze'); vi.stubGlobal('fetch', vi.fn()); });
  it('envia token no cabeçalho e usa a URL configurada', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({ requestId: 'r1', result: { analysisMode: 'cloudflare_qwen' } }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
    await new CloudflareWorkerTransport().analyze({ challengeId: 'x', studentCode: 'int main() {}' });
    expect(fetch).toHaveBeenCalledWith('https://worker.example/api/analyze', expect.objectContaining({ headers: expect.objectContaining({ Authorization: 'Bearer id-token' }) }));
  });
  it('classifica erros de autorização sem fabricar fallback', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({ error: { code: 'UNAUTHORIZED', message: 'token inválido' } }), { status: 401, headers: { 'Content-Type': 'application/json' } }));
    await expect(new CloudflareWorkerTransport().analyze({ challengeId: 'x', studentCode: 'x' })).rejects.toMatchObject({ code: 'UNAUTHORIZED', status: 401, stage: 'worker_response', requestStarted: true });
  });
  it("classifica ausência de usuário antes do fetch como autenticação", async () => {
    getToken.mockRejectedValue(new CurrentUserTokenErrorMock());
    await expect(new CloudflareWorkerTransport().analyze({ challengeId: "x", studentCode: "x" })).rejects.toMatchObject({ code: "UNAUTHORIZED", stage: "auth_token", requestStarted: false });
    expect(fetch).not.toHaveBeenCalled();
  });
  it("classifica rejeição de getIdToken sem convertê-la em UNKNOWN", async () => {
    getToken.mockRejectedValue(new Error("firebase token refresh failed"));
    await expect(new CloudflareWorkerTransport().analyze({ challengeId: "x", studentCode: "x" })).rejects.toMatchObject({ code: "AUTH_TOKEN_FAILED", stage: "auth_token", requestStarted: false });
    expect(fetch).not.toHaveBeenCalled();
  });
  it("marca rede como iniciada quando fetch falha", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("offline"));
    await expect(new CloudflareWorkerTransport().analyze({ challengeId: "x", studentCode: "x" })).rejects.toMatchObject({ code: "NETWORK_ERROR", stage: "fetch", requestStarted: true });
  });
  it("preserva erros de resposta do Worker", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({ error: { code: "MODEL_OUTPUT_TRUNCATED", message: "truncated" } }), { status: 502, headers: { "Content-Type": "application/json" } }));
    await expect(new CloudflareWorkerTransport().analyze({ challengeId: "x", studentCode: "x" })).rejects.toMatchObject({ code: "MODEL_OUTPUT_TRUNCATED", status: 502, stage: "worker_response", requestStarted: true });
  });
});
