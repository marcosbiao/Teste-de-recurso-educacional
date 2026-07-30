import { describe, it, expect, vi, beforeEach } from 'vitest';
import { exportService } from '../exportService';
import { fileUtils } from '../../utils/fileUtils';
import { Attempt } from '../../types';

vi.mock('../../utils/fileUtils');

describe('exportService', () => {
  const mockAttempts: Attempt[] = [
    {
      id: '1',
      userId: 'user-1',
      challengeId: 'desafio-1',
      challengeVersion: '1.0.0',
      sessionId: 'sess-1',
      timestamp: new Date('2026-04-05T10:00:00Z'),
      code: 'int main() { return 0; }',
      tipsUsed: [1],
      category: 'solução adequada',
      confidence: 'alta',
      studentFeedback: {
        positiveObservation: 'A estrutura principal do programa está correta.',
        primaryIssue: { hasIssue: false, type: 'sem_erro_relevante', concept: '', evidence: '', explanation: '' },
        guidingQuestion: 'Como você explicaria por que a solução está correta?',
        nextAction: 'Avance para o próximo desafio.'
      },
      teacherDiagnosis: {
        hypothesis: 'O estudante demonstrou domínio do conceito central.',
        confidence: 'alta'
      },
      difficultyHypothesis: 'O estudante demonstrou domínio do conceito central.',
      feedback: { good: ['A estrutura principal do programa está correta.'], review: [], nextStep: 'Avance para o próximo desafio.' },
      errorType: ['sem_erro_relevante'],
      suggestedNextStep: 'Avance para o próximo desafio.',
      analysisSummary: 'A estrutura principal do programa está correta.',
      analysisMode: 'gemini_primary',
      modelUsed: 'gemini-flash-latest',
      promptVersion: '3.1.0',
      processMetrics: { timeSinceSessionStart: 100, verificationIndex: 1, tipsCountAtSubmission: 1 }
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('exportToJson', () => {
    it('deve chamar fileUtils.download com o JSON correto', () => {
      exportService.exportToJson(mockAttempts, 'user-1', 'desafio-1');

      expect(fileUtils.download).toHaveBeenCalled();
      const [content, , mimeType] = vi.mocked(fileUtils.download).mock.calls[0];

      const parsed = JSON.parse(content);
      expect(parsed.metadata.totalAttempts).toBe(1);
      expect(parsed.metadata.userId).toBe('user-1');
      expect(parsed.metadata.challengeFilter).toBe('desafio-1');
      expect(parsed.attempts).toHaveLength(1);
      expect(parsed.attempts[0].studentFeedback.nextAction).toBe('Avance para o próximo desafio.');
      expect(mimeType).toBe('application/json');
    });
  });

  describe('exportToCsv', () => {
    it('deve chamar fileUtils.download com o CSV correto', () => {
      exportService.exportToCsv(mockAttempts, 'user-1', 'desafio-1');

      expect(fileUtils.download).toHaveBeenCalled();
      const [content, , mimeType] = vi.mocked(fileUtils.download).mock.calls[0];

      expect(mimeType).toBe('text/csv;charset=utf-8;');
      const lines = content.split('\n');
      expect(lines.length).toBeGreaterThan(1);
      expect(lines[1]).toContain('user-1');
      expect(lines[1]).toContain('desafio-1');
      expect(lines[1]).toContain('Avance para o próximo desafio.');
    });
  });
});
