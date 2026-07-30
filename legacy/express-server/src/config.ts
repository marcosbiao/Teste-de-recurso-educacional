import dotenv from 'dotenv';
import { APP_CONSTANTS } from '../config/constants.ts';
dotenv.config();

/**
 * Configuração centralizada e segura para o backend.
 */
export const config = {
  // Tenta GEMINI_API_KEY primeiro, depois API_KEY (usada em alguns contextos do AI Studio)
  get geminiApiKey() {
    // Tenta primeiro a chave personalizada, depois as chaves padrão do sistema
    const key = process.env.MY_GEMINI_KEY || process.env.GEMINI_API_KEY || process.env.API_KEY;
    
    // Se for vazio ou o placeholder do .env.example, retorna undefined
    if (!key || key.trim() === '' || key === 'your_gemini_api_key_here') {
      return undefined;
    }
    
    return key.trim();
  },
  port: 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  maxCodeLength: APP_CONSTANTS.MAX_CODE_LENGTH, // Limite de tamanho do payload
};

/**
 * Validação de variáveis obrigatórias no startup.
 */
export function validateConfig() {
  const apiKey = config.geminiApiKey;
  
  if (!apiKey) {
    console.warn(`[AVISO] GEMINI_API_KEY não configurada ou é um placeholder.`);
    console.warn('Para habilitar a análise via IA, configure a GEMINI_API_KEY no menu Settings > Secrets do AI Studio.');
  }
}
