import { describe, it, expect } from 'vitest';
import { dataMappingService } from '../dataMappingService';
import { APP_CONSTANTS } from '../../config/constants';
import { Timestamp } from 'firebase/firestore';

describe('dataMappingService', () => {
  describe('normalizeAttempt', () => {
    it('deve preencher valores padrão para uma tentativa vazia', () => {
      const normalized = dataMappingService.normalizeAttempt({});

      expect(normalized.id).toBeDefined();
      expect(normalized.userId).toBe('anonymous');
      expect(normalized.challengeId).toBe('unknown');
      expect(normalized.category).toBe(APP_CONSTANTS.ANALYSIS_CATEGORIES.INITIAL);
      expect(normalized.confidence).toBe(APP_CONSTANTS.CONFIDENCE_LEVELS.MEDIUM);
      expect(normalized.tipsUsed).toEqual([]);
      expect(normalized.studentFeedback.positiveObservation).toBeTruthy();
    });

    it('deve converter uma tentativa legada para a nova estrutura', () => {
      const legacyAttempt = {
        userId: 'user-123',
        challengeId: 'desafio-1',
        feedback: {
          good: ['Você leu a entrada corretamente.'],
          review: ['O caso zero não foi tratado.', 'Evidência: a condição numero > 0 é seguida diretamente por else'],
          nextStep: 'Crie um caso separado para zero.'
        },
        difficultyHypothesis: 'O estudante ainda não separou todos os casos.',
        errorType: ['caso_nao_tratado'],
        suggestedNextStep: 'Crie um caso separado para zero.'
      };

      const normalized = dataMappingService.normalizeAttempt(legacyAttempt);

      expect(normalized.studentFeedback.positiveObservation).toBe('Você leu a entrada corretamente.');
      expect(normalized.studentFeedback.primaryIssue.hasIssue).toBe(true);
      expect(normalized.studentFeedback.primaryIssue.type).toBe('caso_nao_tratado');
      expect(normalized.studentFeedback.primaryIssue.explanation).toBe('O caso zero não foi tratado.');
      expect(normalized.studentFeedback.primaryIssue.evidence).toContain('numero > 0');
      expect(normalized.teacherDiagnosis.hypothesis).toContain('ainda não separou');
    });
  });

  describe('mapFirestoreAttempt', () => {
    it('deve converter Timestamp do Firestore para Date do JS', () => {
      const mockDate = new Date('2026-04-05T00:00:00Z');
      const mockTimestamp = Timestamp.fromDate(mockDate);
      const mockDoc = {
        id: 'doc-id',
        data: () => ({
          userId: 'user-1',
          timestamp: mockTimestamp
        })
      };

      const mapped = dataMappingService.mapFirestoreAttempt(mockDoc);
      expect(mapped.timestamp.getTime()).toBe(mockDate.getTime());
      expect(mapped.id).toBe('doc-id');
    });
  });
});


it('preserva local_fallback e interpreta registros antigos sem origem como unknown', () => {
  expect(dataMappingService.normalizeAttempt({ analysisMode: 'local_fallback' }).analysisMode).toBe('local_fallback');
  expect(dataMappingService.normalizeAttempt({}).analysisMode).toBe('unknown');
});
