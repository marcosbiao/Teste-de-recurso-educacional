import type { AnalysisTransport, AnalyzeChallengeRequest, AnalyzeChallengeResponse } from '../../domain/analysis/analysisTransportContract';
import { ANALYSIS_LIMITS } from '../../domain/analysis/analysisLimits';
import { CurrentUserTokenError, getCurrentUserIdToken } from '../currentUserTokenService';

export class WorkerTransportError extends Error {
  constructor(readonly code: string, readonly status?: number, message = 'Não foi possível acessar o serviço de análise.', readonly retryAfterSeconds?: number, readonly requestId?: string, readonly stage?: 'auth_token' | 'fetch' | 'worker_response', readonly requestStarted = false) {
    super(message);
    this.name = 'WorkerTransportError';
  }
}

function getWorkerUrl(): string {
  const url = import.meta.env.VITE_ANALYSIS_API_URL?.trim();
  if (!url) throw new WorkerTransportError('CONFIGURATION_ERROR', undefined, 'A URL do serviço de análise não está configurada.');
  return url;
}

function parseRetryAfter(response: Response, payload: any): number | undefined {
  const value = payload?.error?.retryAfterSeconds ?? Number(response.headers.get('Retry-After'));
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

export class CloudflareWorkerTransport implements AnalysisTransport {
  async analyze(request: AnalyzeChallengeRequest): Promise<AnalyzeChallengeResponse> {
    const { requestId: _requestId, ...requestPayload } = request;
    let requestStarted = false;
    let stage: "auth_token" | "fetch" | "worker_response" = "auth_token";
    let timeout: ReturnType<typeof setTimeout> | undefined;
    try {
      const controller = new AbortController();
      timeout = globalThis.setTimeout(() => controller.abort(), ANALYSIS_LIMITS.clientTimeoutMs);
      const token = await getCurrentUserIdToken();
      stage = "fetch";
      requestStarted = true;
      const response = await fetch(getWorkerUrl(), {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'X-Analysis-Request-Id': request.requestId || '' },
        body: JSON.stringify(requestPayload),
        signal: controller.signal,
      });
      stage = "worker_response";
      let payload: any;
      try { payload = await response.json(); } catch { throw new WorkerTransportError("MODEL_RESPONSE_INVALID", response.status, "O serviço retornou uma resposta inválida.", undefined, undefined, stage, requestStarted); }
      if (import.meta.env.DEV === true) console.info("[analysis-transport]", { requestId: payload?.requestId || payload?.error?.requestId || request.requestId, url: getWorkerUrl(), method: "POST", status: response.status, contentType: response.headers.get("Content-Type"), topLevelKeys: payload && typeof payload === "object" ? Object.keys(payload).slice(0, 12) : [], errorCode: payload?.error?.code, bodyLength: Number(response.headers.get("Content-Length")) || undefined });
      if (!response.ok) throw new WorkerTransportError(payload?.error?.code || "INTERNAL_ERROR", response.status, payload?.error?.message || "O serviço recusou a análise.", parseRetryAfter(response, payload), payload?.error?.requestId, stage, requestStarted);
      if (!payload?.result || typeof payload.requestId !== "string") throw new WorkerTransportError("MODEL_RESPONSE_INVALID", response.status, "O serviço retornou uma resposta incompleta.", undefined, undefined, stage, requestStarted);
      return payload as AnalyzeChallengeResponse;
    } catch (error) {
      if (error instanceof WorkerTransportError) throw error;
      if (error instanceof CurrentUserTokenError) throw new WorkerTransportError("UNAUTHORIZED", undefined, "Autenticação necessária para iniciar a análise.", undefined, undefined, "auth_token", false);
      if (stage === 'auth_token') throw new WorkerTransportError('AUTH_TOKEN_FAILED', undefined, 'Não foi possível obter a credencial de autenticação.', undefined, undefined, 'auth_token', false);
      if (error instanceof DOMException && error.name === 'AbortError') throw new WorkerTransportError('TIMEOUT', undefined, 'A análise excedeu o tempo permitido.', undefined, undefined, stage, requestStarted);
      throw new WorkerTransportError('NETWORK_ERROR', undefined, 'Não foi possível conectar ao serviço de análise.', undefined, undefined, stage, requestStarted);
    } finally { if (timeout) globalThis.clearTimeout(timeout); }
  }
}
