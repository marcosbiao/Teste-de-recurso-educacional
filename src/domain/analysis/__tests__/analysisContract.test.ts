import { describe, expect, it } from 'vitest';
import { ANALYSIS_RESPONSE_SCHEMA } from '../analysisSchema';
import { ANALYSIS_CATEGORIES, ANALYSIS_CONFIDENCES, ANALYSIS_ERROR_TYPES } from '../analysisTypes';
import { AnalysisNormalizationError, normalizeAnalysisResponse } from '../normalizeAnalysisResponse';
import { AnalysisValidationError, validateAnalysisResult } from '../validateAnalysisResult';
import { migrateLegacyAnalysis } from '../migrateLegacyAnalysis';
import { CHALLENGES } from '../../../challenges';
import { generateLocalAnalysis } from '../../../services/localAnalysisService';

const validPayload = {
  category: 'tentativa inicial', confidence: 'media',
  studentFeedback: {
    positiveObservation: 'Ok',
    primaryIssue: { hasIssue: true, type: 'logica', concept: 'if', evidence: 'else', explanation: 'Revise a condição.' },
    guidingQuestion: 'Qual caso falta', nextAction: 'Revise o if.'
  },
  teacherDiagnosis: { hypothesis: 'Há um caso para revisar.', confidence: 'media' }
};

describe('contrato canônico de análise', () => {
  it('mantém no schema todos os campos gerados pelo Gemini, sem analysisMode', () => {
    const properties = ANALYSIS_RESPONSE_SCHEMA.properties as any;
    expect(properties).toHaveProperty('category');
    expect(properties).toHaveProperty('confidence');
    expect(properties).toHaveProperty('studentFeedback');
    expect(properties).toHaveProperty('teacherDiagnosis');
    expect(properties).not.toHaveProperty('analysisMode');
    expect(properties.category.enum).toEqual(ANALYSIS_CATEGORIES);
    expect(properties.confidence.enum).toEqual(ANALYSIS_CONFIDENCES);
    expect(properties.studentFeedback.properties.primaryIssue.properties.type.enum).toEqual(ANALYSIS_ERROR_TYPES);
  });

  it('normaliza JSON puro, Markdown, texto externo e espaços sem inventar conteúdo', () => {
    expect(normalizeAnalysisResponse(JSON.stringify(validPayload))).toEqual(validPayload);
    const fenced = String.fromCharCode(96).repeat(3) + 'json\n' + JSON.stringify(validPayload) + '\n' + String.fromCharCode(96).repeat(3);
    expect(normalizeAnalysisResponse(fenced)).toEqual(validPayload);
    expect(normalizeAnalysisResponse('Resposta:\n' + JSON.stringify(validPayload) + '\nFim.')).toEqual(validPayload);
    const validated = validateAnalysisResult({ ...validPayload, studentFeedback: { ...validPayload.studentFeedback, positiveObservation: '  Ok  ', guidingQuestion: ' curta ', nextAction: ' faça ' } });
    expect(validated.studentFeedback).toMatchObject({ positiveObservation: 'Ok', guidingQuestion: 'curta', nextAction: 'faça' });
  });

  it('retorna erros tipados para JSON irrecuperável e schema incompatível', () => {
    expect(() => normalizeAnalysisResponse('sem json')).toThrow(AnalysisNormalizationError);
    expect(() => validateAnalysisResult({ ...validPayload, confidence: 'certeza' })).toThrow(AnalysisValidationError);
    expect(() => validateAnalysisResult({ ...validPayload, studentFeedback: { ...validPayload.studentFeedback, primaryIssue: { ...validPayload.studentFeedback.primaryIssue, hasIssue: false } } })).toThrow(AnalysisValidationError);
    expect(() => validateAnalysisResult({ ...validPayload, studentFeedback: undefined })).toThrow(AnalysisValidationError);
  });

  it('aceita textos curtos válidos e valida o fallback local pelo mesmo contrato', () => {
    expect(validateAnalysisResult(validPayload).studentFeedback.positiveObservation).toBe('Ok');
    const local = generateLocalAnalysis({ challenge: CHALLENGES[0], studentCode: 'int main() { return 0; }' }).result;
    expect(validateAnalysisResult(local)).toMatchObject({ category: local.category, studentFeedback: local.studentFeedback });
  });

  it('migra registros históricos sem analysisMode e campos legados sem alterar seu conteúdo', () => {
    const missingMode = migrateLegacyAnalysis({ feedback: { good: ['Leitura presente'], review: ['Falta o zero'], nextStep: 'Revise zero' }, errorType: ['caso_nao_tratado'], difficultyHypothesis: 'Caso pendente' });
    expect(missingMode.analysisMode).toBe('unknown');
    expect(missingMode.studentFeedback.positiveObservation).toBe('Leitura presente');
    expect(missingMode.studentFeedback.primaryIssue.explanation).toBe('Falta o zero');
    expect(migrateLegacyAnalysis({ analysisMode: 'local_fallback', ...validPayload }).analysisMode).toBe('local_fallback');
  });
});
