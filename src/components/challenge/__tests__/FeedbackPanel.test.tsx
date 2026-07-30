import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FeedbackPanel } from '../FeedbackPanel';
import type { AnalysisResult } from '../../../types';

function createAnalysisResult(overrides?: Partial<AnalysisResult>): AnalysisResult {
  return {
    category: 'tentativa inicial',
    confidence: 'media',
    studentFeedback: {
      positiveObservation: 'A leitura da entrada foi estruturada corretamente.',
      primaryIssue: {
        hasIssue: true,
        type: 'caso_nao_tratado',
        concept: 'estrutura condicional',
        evidence: 'A condição numero > 0 é seguida diretamente por else.',
        explanation: 'O caso zero está sendo tratado junto com os negativos.'
      },
      guidingQuestion: 'Qual valor não é positivo nem negativo?',
      nextAction: 'Crie um tratamento separado para o caso em que o valor seja zero.'
    },
    teacherDiagnosis: {
      hypothesis: 'O estudante reconheceu a estrutura condicional, mas ainda não separou todos os casos.',
      confidence: 'alta'
    },
    difficultyHypothesis: 'O estudante reconheceu a estrutura condicional, mas ainda não separou todos os casos.',
    feedback: {
      good: ['A leitura da entrada foi estruturada corretamente.'],
      review: ['O caso zero está sendo tratado junto com os negativos.'],
      nextStep: 'Crie um tratamento separado para o caso em que o valor seja zero.'
    },
    errorType: ['caso_nao_tratado'],
    suggestedNextStep: 'Crie um tratamento separado para o caso em que o valor seja zero.',
    analysisSummary: 'O caso zero está sendo tratado junto com os negativos.',
    analysisMode: 'gemini_primary',
    analysisStatus: 'success',
    modelUsed: 'gemini-flash-latest',
    promptVersion: '3.1.0',
    ...overrides
  };
}

describe('FeedbackPanel', () => {
  it('não exibe feedback pedagógico quando houver rate_limit', () => {
    render(
      <FeedbackPanel
        analysis={createAnalysisResult()}
        technicalError={createAnalysisResult({
          analysisMode: 'gemini_fallback',
          analysisStatus: 'rate_limit',
          retryAfterSeconds: 60
        })}
        rateLimitRemainingSeconds={42}
      />
    );

    expect(screen.getByText('Limite temporário de análises atingido')).toBeInTheDocument();
    expect(screen.getByText(/aproximadamente 42 segundos/i)).toBeInTheDocument();
    expect(screen.queryByText('Análise da IA concluída')).not.toBeInTheDocument();
    expect(screen.queryByText('O que você já conseguiu')).not.toBeInTheDocument();
    expect(screen.queryByText('Consolidação da solução')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ver última análise válida/i })).toBeInTheDocument();
  });


  it('mostra a mensagem específica de configuration_error sem feedback pedagógico', () => {
    render(
      <FeedbackPanel
        analysis={createAnalysisResult()}
        technicalError={createAnalysisResult({
          analysisMode: 'gemini_fallback',
          analysisStatus: 'configuration_error',
          modelUsed: 'gemini-flash-latest'
        })}
      />
    );

    expect(screen.getByText('Configuração da análise indisponível')).toBeInTheDocument();
    expect(screen.getByText(/modelo de inteligência artificial configurado não está disponível/i)).toBeInTheDocument();
    expect(screen.queryByText('Consolidação da solução')).not.toBeInTheDocument();
    expect(screen.queryByText('O que você já conseguiu')).not.toBeInTheDocument();
    expect(screen.queryByText('Análise da IA concluída')).not.toBeInTheDocument();
  });

  it('não exibe consolidação da solução em temporarily_unavailable', () => {
    render(
      <FeedbackPanel
        analysis={null}
        technicalError={createAnalysisResult({
          analysisMode: 'gemini_fallback',
          analysisStatus: 'temporarily_unavailable'
        })}
      />
    );

    expect(screen.getByText('Análise temporariamente indisponível')).toBeInTheDocument();
    expect(screen.queryByText('Consolidação da solução')).not.toBeInTheDocument();
    expect(screen.queryByText('Principal ponto para revisar')).not.toBeInTheDocument();
  });
});


it('indica discretamente quando a orientação vem de regras locais', () => {
  render(<FeedbackPanel analysis={createAnalysisResult({ analysisMode: 'local_fallback', modelUsed: 'local_challenge_rules' })} />);
  expect(screen.getByText('Feedback baseado nos critérios do desafio')).toBeInTheDocument();
  expect(screen.queryByText('Análise da IA concluída')).not.toBeInTheDocument();
});
