import { describe, it, expect } from 'vitest';
import { validators } from '../validators';

describe('validators', () => {
  describe('validateAnalysisRequest', () => {
    it('deve retornar erro para código vazio', () => {
      const result = validators.validateAnalysisRequest({ code: '', challengeId: '1' });
      expect(result.ok).toBe(false);
      expect(result.errorCode).toBe('INVALID_INPUT');
    });

    it('deve retornar erro para challengeId inexistente', () => {
      const result = validators.validateAnalysisRequest({ code: 'int main() {}', challengeId: 'non-existent' });
      expect(result.ok).toBe(false);
      expect(result.errorCode).toBe('CHALLENGE_NOT_FOUND');
    });

    it('deve retornar erro para código muito longo', () => {
      const longCode = 'a'.repeat(50001);
      const result = validators.validateAnalysisRequest({ code: longCode, challengeId: 'desafio1_condicionais_basico' });
      expect(result.ok).toBe(false);
      expect(result.errorCode).toBe('PAYLOAD_TOO_LARGE');
    });

    it('deve retornar sucesso para payload válido', () => {
      const result = validators.validateAnalysisRequest({ 
        code: 'int main() {}', 
        challengeId: 'desafio1_condicionais_basico' 
      });
      expect(result.ok).toBe(true);
      expect(result.challenge).toBeDefined();
    });
  });
});
