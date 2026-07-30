import type { Response } from "express";
import type { AnalysisError } from "../types.ts";

/**
 * Centralizador de tratamento de erros para o backend de análise.
 * Garante respostas consistentes para o frontend.
 */
export const errorHandlers = {
  /**
   * Erro de requisição inválida (400).
   */
  handleBadRequest(res: Response, errorCode: string, message: string) {
    const error: AnalysisError = { ok: false, errorCode, message };
    return res.status(400).json(error);
  },

  /**
   * Erro de recurso não encontrado (404).
   */
  handleNotFound(res: Response, errorCode: string, message: string) {
    const error: AnalysisError = { ok: false, errorCode, message };
    return res.status(404).json(error);
  },

  /**
   * Erro interno do servidor (500).
   */
  handleInternalError(res: Response, err: any) {
    console.error("[ERRO INTERNO]", err);
    
    // Se o erro tiver uma mensagem específica que queremos mostrar (como erro de config)
    const isConfigError = err?.message?.includes("chave de API") || err?.message?.includes("API key");
    const message = isConfigError ? err.message : "Ocorreu um erro inesperado ao processar a análise pedagógica.";
    
    const error: AnalysisError = { 
      ok: false, 
      errorCode: isConfigError ? "CONFIG_ERROR" : "INTERNAL_SERVER_ERROR", 
      message 
    };
    return res.status(500).json(error);
  },

  /**
   * Erro de limite de taxa (429).
   */
  handleRateLimit(res: Response) {
    const error: AnalysisError = { 
      ok: false, 
      errorCode: "RATE_LIMIT_EXCEEDED", 
      message: "Limite de requisições excedido. Aguarde alguns instantes." 
    };
    return res.status(429).json(error);
  }
};
