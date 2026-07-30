import { decodeProtectedHeader, importX509, jwtVerify, type JWTPayload } from 'jose';
import { HttpError } from '../http/errors';
import type { Env } from '../types/env';

const FIREBASE_CERTS_URL = 'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';
let certificateCache: { certificates: Record<string, string>; expiresAt: number } | undefined;

function cacheDuration(response: Response): number {
  const seconds = Number(response.headers.get('Cache-Control')?.match(/max-age=(\d+)/)?.[1]);
  return Number.isFinite(seconds) && seconds > 0 ? seconds * 1000 : 60 * 60 * 1000;
}

async function firebaseCertificates(): Promise<Record<string, string>> {
  if (certificateCache && certificateCache.expiresAt > Date.now()) return certificateCache.certificates;
  const response = await fetch(FIREBASE_CERTS_URL);
  if (!response.ok) throw new HttpError(503, 'MODEL_UNAVAILABLE', 'Não foi possível validar a autenticação neste momento.');
  const certificates = await response.json() as Record<string, string>;
  certificateCache = { certificates, expiresAt: Date.now() + cacheDuration(response) };
  return certificates;
}

export interface FirebaseIdentity { uid: string; claims: JWTPayload; }

export async function verifyFirebaseToken(request: Request, env: Env): Promise<FirebaseIdentity> {
  const projectId = env.FIREBASE_PROJECT_ID?.trim();
  if (!projectId) throw new HttpError(500, 'INTERNAL_ERROR', 'A autenticação do serviço não está configurada.');
  const authorization = request.headers.get('Authorization') || '';
  const token = authorization.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) throw new HttpError(401, 'UNAUTHORIZED', 'A autenticação é obrigatória para solicitar uma análise.');
  try {
    const protectedHeader = decodeProtectedHeader(token);
    if (protectedHeader.alg !== 'RS256' || !protectedHeader.kid) throw new Error('Cabeçalho JWT incompatível.');
    const certificate = (await firebaseCertificates())[protectedHeader.kid];
    if (!certificate) throw new Error('Chave JWT desconhecida.');
    const key = await importX509(certificate, 'RS256');
    const { payload } = await jwtVerify(token, key, {
      algorithms: ['RS256'],
      audience: projectId,
      issuer: `https://securetoken.google.com/${projectId}`,
    });
    const now = Math.floor(Date.now() / 1000);
    if (typeof payload.sub !== 'string' || !payload.sub || payload.sub.length > 128 || typeof payload.iat !== 'number' || payload.iat > now + 60) throw new Error('Claims JWT incompatíveis.');
    return { uid: payload.sub, claims: payload };
  } catch (error) {
    if (error instanceof HttpError) throw error;
    throw new HttpError(401, 'UNAUTHORIZED', 'O token de autenticação é inválido ou expirou.');
  }
}
