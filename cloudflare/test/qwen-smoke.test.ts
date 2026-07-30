import { describe, expect, it, vi } from 'vitest';
import worker from '../src/index';
import { qwenSmoke } from '../src/routes/qwenSmoke';

const env = (run: ReturnType<typeof vi.fn>, environment = 'development') => ({ AI: { run }, ENVIRONMENT: environment, FIREBASE_PROJECT_ID: 'test', ALLOWED_ORIGINS: 'http://localhost:3000', ANALYSIS_RATE_LIMITER: { limit: vi.fn() } }) as any;

describe('smoke test Qwen de desenvolvimento', () => {
  it('usa Qwen uma vez, sem response_format, e devolve apenas diagnóstico sanitizado', async () => {
    const run = vi.fn().mockResolvedValue({ choices: [{ message: { content: '{"status":"ok"}' } }], usage: { total_tokens: 9 }, model: '@cf/qwen/qwen3-30b-a3b-fp8' });
    const response = await qwenSmoke(new Request('http://worker/debug/qwen-smoke'), env(run));
    const body = await response.json() as Record<string, unknown>;
    expect(response.status).toBe(200);
    expect(run).toHaveBeenCalledOnce();
    expect(run.mock.calls[0][0]).toBe('@cf/qwen/qwen3-30b-a3b-fp8');
    expect(run.mock.calls[0][1]).not.toHaveProperty('response_format');
    expect(body).toMatchObject({ success: true, parserSucceeded: true, parsedStatus: 'ok', choicesCount: 1, hasMessageContent: true });
    expect(JSON.stringify(body)).not.toContain('{"status":"ok"}');
  });
  it('classifica resposta vazia, inferência falha e JSON inválido sem devolver conteúdo bruto', async () => {
    for (const raw of [{ choices: [] }, { choices: [{ message: { content: 'não é json' } }] }]) {
      const response = await qwenSmoke(new Request('http://worker/debug/qwen-smoke'), env(vi.fn().mockResolvedValue(raw)));
      const body = await response.json() as Record<string, unknown>;
      expect(body.success).toBe(false); expect(body.requestId).toEqual(expect.any(String)); expect(JSON.stringify(body)).not.toContain('não é json');
    }
    const failed = await qwenSmoke(new Request('http://worker/debug/qwen-smoke'), env(vi.fn().mockRejectedValue(new Error('secret prompt text'))));
    const failedBody = await failed.json() as Record<string, unknown>;
    expect(failedBody).toMatchObject({ success: false, code: 'MODEL_UNAVAILABLE', stage: 'workers_ai_inference' });
    expect(JSON.stringify(failedBody)).not.toContain('secret prompt text');
  });
  it('não registra a rota em produção', async () => {
    const response = await worker.fetch(new Request('http://worker/debug/qwen-smoke'), env(vi.fn(), 'production'));
    expect(response.status).toBe(404);
  });
});
