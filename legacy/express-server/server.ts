import express from "express";
import cors from "cors";
import path from "path";
import { config, validateConfig } from "./src/server/config.ts";
import { analyzeCodeWithGeminiServer } from "./src/server/analysis.ts";
import { validators } from "./src/server/validators.ts";
import { rateLimiter } from "./src/server/rateLimit.ts";
import { errorHandlers } from "./src/server/errors.ts";

// 1. Validação de configuração no startup
validateConfig();

export async function createServer() {
  const app = express();

  // 2. Middleware de segurança e parsing
  app.use(cors());
  app.use(express.json({ limit: '1mb' }));

  // Endpoint de Saúde para diagnóstico de implantação
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", mode: process.env.NODE_ENV, prod: process.env.PROD === "true" });
  });

  // 3. Endpoint Seguro de Análise Pedagógica
  app.post("/api/analyze", rateLimiter, async (req, res) => {
    const { code, userId, problemRepresentation } = req.body;

    // Validação de entrada no backend usando o validador centralizado
    const validation = validators.validateAnalysisRequest(req.body);
    if (!validation.ok) {
      if (validation.errorCode === "CHALLENGE_NOT_FOUND") {
        return errorHandlers.handleNotFound(res, validation.errorCode, validation.message!);
      }
      return errorHandlers.handleBadRequest(res, validation.errorCode!, validation.message!);
    }

    const { challenge } = validation;
    console.log(`[AUDITORIA] Usuário ${userId || 'anonymous'} solicitou análise para o desafio ${challenge?.id}.`);

    try {
      const result = await analyzeCodeWithGeminiServer(code, challenge!, problemRepresentation);
      res.json({ ok: true, data: result });
    } catch (error: any) {
      errorHandlers.handleInternalError(res, error);
    }
  });

  // 4. Integração com Vite (Frontend)
  const isProd = process.env.NODE_ENV === "production" || process.env.PROD === "true";

  if (!isProd && process.env.NODE_ENV !== "test") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else if (isProd) {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Em Express 5, use '*all' para garantir que capture todas as rotas para o SPA fallback
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  return app;
}

async function startServer() {
  const app = await createServer();
  const PORT = 3000;

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SERVIDOR] Rodando em http://localhost:${PORT}`);
    console.log(`[AMBIENTE] Modo: ${config.nodeEnv}`);
  });
}

if (process.env.NODE_ENV !== "test") {
  startServer();
}
