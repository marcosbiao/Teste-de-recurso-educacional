import { readFileSync } from 'node:fs';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { createAnalysisResult } from '../../../domain/pedagogicalDomain';
import { recordAnalysisDiagnostic, resetLocalAnalysisDiagnostics } from '../../../services/analysisDiagnostics';
import { FeedbackPanel } from '../FeedbackPanel';

describe('painel técnico de desenvolvimento', () => {
  it('mostra somente metadados seguros após uma análise', () => {
    resetLocalAnalysisDiagnostics();
    vi.spyOn(console, 'info').mockImplementation(() => undefined);
    recordAnalysisDiagnostic({ requestId: 'request-safe', analysisMode: 'local_fallback', durationMs: 17, outcome: 'timeout', fallbackUsed: true, modelCalls: 2 });
    const analysis = createAnalysisResult({ category: 'tentativa inicial', studentFeedback: { positiveObservation: 'Você começou.', primaryIssue: { hasIssue: true, type: 'logica', concept: 'fluxo', evidence: 'return', explanation: 'Revise.' }, guidingQuestion: 'O fluxo atende ao enunciado', nextAction: 'Revise o fluxo.' }, teacherDiagnosis: { hypothesis: 'Teste', confidence: 'media' }, analysisMode: 'local_fallback', modelUsed: 'local', promptVersion: 'test' });
    render(<FeedbackPanel analysis={analysis} />);
    expect(screen.getByText('Diagnóstico técnico local')).toBeInTheDocument();
    expect(screen.getByText('local_fallback')).toBeInTheDocument();
    expect(screen.getByText('17 ms')).toBeInTheDocument();
    expect(document.body.textContent).not.toContain('VITE_GEMINI_API_KEY');
    expect(document.body.textContent).not.toContain('token-test');
  });
  it('mantém o guard de produção explícito no componente', () => {
    const source = readFileSync('src/components/challenge/FeedbackPanel.tsx', 'utf8');
    expect(source).toContain('import.meta.env.DEV !== true');
  });
});
