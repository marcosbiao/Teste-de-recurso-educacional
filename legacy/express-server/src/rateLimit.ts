/**
 * Controle de Abuso (Rate Limiting) para o backend.
 * Em produção, recomenda-se o uso de Redis ou Firestore para persistência.
 */
const userRateLimits = new Map<string, { count: number, lastReset: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minuto
const MAX_REQUESTS_PER_WINDOW = 5; // 5 análises por minuto

/**
 * Middleware de Rate Limiting por usuário.
 */
export const rateLimiter = (req: any, res: any, next: any) => {
  const userId = req.body.userId || 'anonymous';
  const now = Date.now();
  const userLimit = userRateLimits.get(userId) || { count: 0, lastReset: now };

  // Resetar janela se o tempo expirou
  if (now - userLimit.lastReset > RATE_LIMIT_WINDOW) {
    userLimit.count = 0;
    userLimit.lastReset = now;
  }

  // Verificar limite
  if (userLimit.count >= MAX_REQUESTS_PER_WINDOW) {
    console.warn(`[RATE LIMIT] Usuário ${userId} excedeu o limite de requisições.`);
    return res.status(429).json({
      ok: false,
      errorCode: "RATE_LIMIT_EXCEEDED",
      message: "Você atingiu o limite de análises por minuto. Aguarde um pouco e tente novamente."
    });
  }

  // Incrementar contador
  userLimit.count++;
  userRateLimits.set(userId, userLimit);
  next();
};
