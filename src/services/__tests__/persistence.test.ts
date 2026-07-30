import { describe, it, expect, vi, beforeEach } from 'vitest';
import { localPersistenceService } from '../localPersistenceService';
import { attemptService } from '../attemptService';
import { firestoreService } from '../firestoreService';
import { addDoc } from 'firebase/firestore';

vi.mock('firebase/firestore');
vi.mock('../firestoreService');

describe('Persistência e Fallback', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('localPersistenceService', () => {
    const mockAttempt = {
      id: '1',
      userId: 'user-1',
      challengeId: 'desafio-1',
      challengeVersion: '1.0.0',
      sessionId: 'sess-1',
      code: 'int main() {}',
      timestamp: new Date(),
      tipsUsed: [],
      category: 'tentativa inicial',
      confidence: 'media',
      studentFeedback: {
        positiveObservation: 'Leitura da entrada iniciada.',
        primaryIssue: {
          hasIssue: true,
          type: 'logica',
          concept: 'estrutura condicional',
          evidence: 'O bloco else cobre mais de um caso.',
          explanation: 'Os casos não foram separados corretamente.'
        },
        guidingQuestion: 'Qual caso ainda falta separar?',
        nextAction: 'Separe o caso zero em uma condição própria.'
      },
      teacherDiagnosis: {
        hypothesis: 'O estudante reconheceu a estrutura condicional, mas ainda não separou todos os casos.',
        confidence: 'alta'
      },
      difficultyHypothesis: 'O estudante reconheceu a estrutura condicional, mas ainda não separou todos os casos.',
      feedback: { good: ['Leitura da entrada iniciada.'], review: ['Os casos não foram separados corretamente.'], nextStep: 'Separe o caso zero em uma condição própria.' },
      errorType: ['logica'],
      suggestedNextStep: 'Separe o caso zero em uma condição própria.',
      analysisSummary: 'Os casos não foram separados corretamente.',
      analysisMode: 'gemini_primary',
      modelUsed: 'gemini-flash-latest',
      promptVersion: '3.1.0',
      processMetrics: { timeSinceSessionStart: 0, verificationIndex: 1, tipsCountAtSubmission: 0 }
    };

    it('deve salvar e recuperar tentativas do LocalStorage', () => {
      localPersistenceService.saveAttempt('desafio-1', mockAttempt as any);
      const attempts = localPersistenceService.getAttempts('desafio-1');

      expect(attempts).toHaveLength(1);
      expect(attempts[0].id).toBe('1');
      expect(attempts[0].studentFeedback.primaryIssue.concept).toBe('estrutura condicional');
    });

    it('deve normalizar tentativas legadas recuperadas do LocalStorage', () => {
      localStorage.setItem('attempts_desafio-1', JSON.stringify([{
        id: 'legacy',
        userId: 'user-1',
        challengeId: 'desafio-1',
        timestamp: new Date().toISOString(),
        code: 'int main() {}',
        tipsUsed: [],
        category: 'tentativa inicial',
        confidence: 'media',
        feedback: {
          good: ['Leu a entrada.'],
          review: ['O caso zero não foi tratado.', 'Evidência: a condição numero > 0 vai direto para else'],
          nextStep: 'Crie um caso separado para zero.'
        },
        difficultyHypothesis: 'Ainda não separou todos os casos.',
        errorType: ['caso_nao_tratado'],
        suggestedNextStep: 'Crie um caso separado para zero.',
        analysisSummary: 'O caso zero não foi tratado.'
      }]));

      const attempts = localPersistenceService.getAttempts('desafio-1');
      expect(attempts[0].studentFeedback.primaryIssue.type).toBe('caso_nao_tratado');
      expect(attempts[0].studentFeedback.nextAction).toBe('Crie um caso separado para zero.');
    });
  });

  describe('attemptService', () => {
    it('deve salvar tentativa remotamente chamando addDoc', async () => {
      const mockAttempt = {
        id: '1',
        userId: 'user-1',
        challengeId: 'desafio-1',
        code: 'int main() {}',
        timestamp: new Date()
      };

      vi.mocked(firestoreService.getUserAttemptsCollection).mockReturnValue({} as any);
      vi.mocked(addDoc).mockResolvedValue({ id: 'new-doc-id' } as any);

      await attemptService.saveAttempt('user-1', mockAttempt as any);

      expect(addDoc).toHaveBeenCalled();
    });
  });
});
