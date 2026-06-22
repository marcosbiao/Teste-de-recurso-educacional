import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../../App';
import { authService } from '../../services/authService';
import { callAnalyzeApi } from '../../services/analysisServiceClient';
import { attemptService } from '../../services/attemptService';
import { APP_CONSTANTS } from '../../config/constants';

import { getDoc } from 'firebase/firestore';

// Mock dos serviços
vi.mock('../../services/authService');
vi.mock('../../services/analysisServiceClient');
vi.mock('../../services/attemptService');

describe('Fluxo Principal do App', () => {
  const mockUser = {
    uid: 'user-123',
    email: 'test@example.com',
    displayName: 'Usuário Teste'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Configura mocks padrão para evitar erros de "unsubscribe is not a function"
    vi.mocked(attemptService.subscribeToAttempts).mockReturnValue(() => {});
    vi.mocked(attemptService.subscribeToAllAttempts).mockImplementation((_userId, callback) => {
      callback([]);
      return () => {};
    });

    vi.mocked(authService.onAuthStateChanged).mockImplementation((cb) => {
      cb(mockUser as any);
      return () => {};
    });
    // Mock do perfil do usuário no Firestore
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

    // Aguarda o carregamento inicial
    await waitFor(() => {
      expect(screen.queryByText(/Carregando ambiente pedagógico/i)).not.toBeInTheDocument();
    });

    // Verifica se as trilhas são listadas e abre Condicionais
    expect(screen.getByText(/Trilhas de aprendizagem/i)).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: /Condicionais/i })).toBeInTheDocument();
    fireEvent.click(await screen.findByRole('button', { name: /Iniciar trilha: Condicionais/i }));

    // Seleciona o primeiro desafio
    const challengeButton = await screen.findByRole('button', { name: /Iniciar desafio: Desafio Guiado: Estrutura Condicional em C/i });
    fireEvent.click(challengeButton);

    // Verifica se a página do desafio é exibida
    expect(await screen.findByText(/Enunciado/i)).toBeInTheDocument();
    expect(await screen.findByText(/Solicitar Orientação/i)).toBeInTheDocument();
  });

  it('deve permitir digitar código e clicar em verificar resposta', async () => {
    const mockAnalysis = {
      category: APP_CONSTANTS.ANALYSIS_CATEGORIES.ADEQUATE,
      confidence: APP_CONSTANTS.CONFIDENCE_LEVELS.HIGH,
      feedback: { good: ['Bom trabalho'], review: [], nextStep: 'Parabéns' },
      difficultyHypothesis: '',
      errorType: [],
      suggestedNextStep: '',
      analysisSummary: '',
      analysisMode: APP_CONSTANTS.ANALYSIS_MODES.PRIMARY,
      modelUsed: 'gemini-3-flash-preview',
      promptVersion: '2.0.0'
    };

    vi.mocked(callAnalyzeApi).mockResolvedValue(mockAnalysis as any);
    vi.mocked(attemptService.saveAttempt).mockResolvedValue(undefined);

    render(<App />);

    // Aguarda o carregamento inicial
    await waitFor(() => {
      expect(screen.queryByText(/Carregando ambiente pedagógico/i)).not.toBeInTheDocument();
    });

    // Seleciona a trilha e o desafio
    fireEvent.click(await screen.findByRole('button', { name: /Iniciar trilha: Condicionais/i }));
    fireEvent.click(await screen.findByRole('button', { name: /Iniciar desafio: Desafio Guiado: Estrutura Condicional em C/i }));

    // Digita no editor (o editor é um textarea)
    const editor = await screen.findByPlaceholderText(/Escreva seu código C aqui/i);
    fireEvent.change(editor, { target: { value: 'int main() { return 0; }' } });

    // Clica em verificar
    const verifyButton = await screen.findByText(/Solicitar Orientação/i);
    fireEvent.click(verifyButton);

    // Verifica se o loading aparece
    expect(screen.getByRole('button', { name: /Analisando/i })).toBeInTheDocument();

    // Aguarda o feedback
    await waitFor(() => {
      expect(screen.getByText(/Orientação Pedagógica/i)).toBeInTheDocument();
      expect(screen.getByText(/Bom trabalho/i)).toBeInTheDocument();
    });

    // Verifica se a tentativa foi salva
    expect(attemptService.saveAttempt).toHaveBeenCalled();
  });

  it('deve exibir erro amigável quando a persistência falha', async () => {
    vi.mocked(callAnalyzeApi).mockResolvedValue({
      category: APP_CONSTANTS.ANALYSIS_CATEGORIES.ADEQUATE,
      confidence: APP_CONSTANTS.CONFIDENCE_LEVELS.HIGH,
      feedback: { good: [], review: [], nextStep: '' },
      difficultyHypothesis: '',
      errorType: [],
      suggestedNextStep: '',
      analysisSummary: '',
      analysisMode: APP_CONSTANTS.ANALYSIS_MODES.PRIMARY,
      modelUsed: 'gemini-3-flash-preview',
      promptVersion: '2.0.0'
    } as any);
    vi.mocked(attemptService.saveAttempt).mockRejectedValue(new Error('Falha na persistência'));

    render(<App />);
    
    // Aguarda o carregamento inicial
    await waitFor(() => {
      expect(screen.queryByText(/Carregando ambiente pedagógico/i)).not.toBeInTheDocument();
    });

    fireEvent.click(await screen.findByRole('button', { name: /Iniciar trilha: Condicionais/i }));
    fireEvent.click(await screen.findByRole('button', { name: /Iniciar desafio: Desafio Guiado: Estrutura Condicional em C/i }));

    const verifyButton = await screen.findByText(/Solicitar Orientação/i);
    fireEvent.click(verifyButton);

    // Aguarda o erro aparecer - usamos findByText que já tem waitFor embutido
    const errorAlert = await screen.findByText(/Não foi possível concluir a análise neste momento/i, {}, { timeout: 5000 });
    expect(errorAlert).toBeInTheDocument();
  }, 10000);
});
