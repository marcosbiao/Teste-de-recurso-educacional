import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../../App';
import { authService } from '../../services/authService';
import { analyzeChallengeAttempt } from '../../services/analysisService';
import { attemptService } from '../../services/attemptService';
import { APP_CONSTANTS } from '../../config/constants';
import { getDoc } from 'firebase/firestore';

vi.mock('../../services/authService');
vi.mock('../../services/analysisService');
vi.mock('../../services/attemptService');

describe('Fluxo Principal do App', () => {
  const mockUser = {
    uid: 'user-123',
    email: 'test@example.com',
    displayName: 'Usuário Teste'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(attemptService.subscribeToAttempts).mockReturnValue(() => {});
    vi.mocked(attemptService.subscribeToAllAttempts).mockImplementation((_userId, callback) => {
      callback([]);
      return () => {};
    });

    vi.mocked(authService.onAuthStateChanged).mockImplementation((cb) => {
      cb(mockUser as any);
      return () => {};
    });

    vi.mocked(getDoc).mockResolvedValue({
      exists: () => true,
      data: () => ({
        uid: 'user-123',
        role: 'student',
        displayName: 'Usuário Teste'
      })
    } as any);
  });

  it('deve renderizar a tela inicial e permitir selecionar um desafio', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText(/Carregando ambiente pedagógico/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText(/Trilhas de aprendizagem/i)).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: /Condicionais/i })).toBeInTheDocument();
    fireEvent.click(await screen.findByRole('button', { name: /Iniciar trilha: Condicionais/i }));

    const challengeButton = await screen.findByRole('button', { name: /Iniciar desafio: Desafio Guiado: Estrutura Condicional em C/i });
    fireEvent.click(challengeButton);

    expect(await screen.findByText(/Enunciado/i)).toBeInTheDocument();
    expect(await screen.findByText(/Solicitar Orientação/i)).toBeInTheDocument();
  });

  it('deve permitir digitar código e receber o novo feedback estruturado', async () => {
    vi.mocked(analyzeChallengeAttempt).mockResolvedValue({
      category: APP_CONSTANTS.ANALYSIS_CATEGORIES.ADEQUATE,
      confidence: APP_CONSTANTS.CONFIDENCE_LEVELS.HIGH,
      studentFeedback: {
        positiveObservation: 'A leitura da entrada foi estruturada corretamente.',
        primaryIssue: {
          hasIssue: false,
          type: 'sem_erro_relevante',
          concept: '',
          evidence: '',
          explanation: ''
        },
        guidingQuestion: 'Como você explicaria por que sua solução atende ao enunciado?',
        nextAction: 'Avance para o próximo desafio.'
      },
      teacherDiagnosis: {
        hypothesis: 'O estudante demonstrou domínio da solução proposta.',
        confidence: APP_CONSTANTS.CONFIDENCE_LEVELS.HIGH
      },
      difficultyHypothesis: 'O estudante demonstrou domínio da solução proposta.',
      feedback: { good: ['A leitura da entrada foi estruturada corretamente.'], review: [], nextStep: 'Avance para o próximo desafio.' },
      errorType: ['sem_erro_relevante'],
      suggestedNextStep: 'Avance para o próximo desafio.',
      analysisSummary: 'A leitura da entrada foi estruturada corretamente.',
      analysisMode: APP_CONSTANTS.ANALYSIS_MODES.PRIMARY,
      analysisStatus: 'success',
      modelUsed: 'gemini-flash-latest',
      promptVersion: '3.1.0'
    } as any);
    vi.mocked(attemptService.saveAttempt).mockResolvedValue(undefined);

    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText(/Carregando ambiente pedagógico/i)).not.toBeInTheDocument();
    });

    fireEvent.click(await screen.findByRole('button', { name: /Iniciar trilha: Condicionais/i }));
    fireEvent.click(await screen.findByRole('button', { name: /Iniciar desafio: Desafio Guiado: Estrutura Condicional em C/i }));

    const editor = await screen.findByPlaceholderText(/Escreva seu código C aqui/i);
    fireEvent.change(editor, { target: { value: 'int main() { return 0; }' } });

    fireEvent.click(await screen.findByText(/Solicitar Orientação/i));

    expect(screen.getByRole('button', { name: /Analisando/i })).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/O que você já conseguiu/i)).toBeInTheDocument();
      expect(screen.getByText(/A leitura da entrada foi estruturada corretamente./i)).toBeInTheDocument();
      expect(screen.getByText(/Sua próxima ação/i)).toBeInTheDocument();
    });

    expect(attemptService.saveAttempt).toHaveBeenCalled();
  });
});
