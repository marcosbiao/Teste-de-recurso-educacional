import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChallengePage } from '../../components/challenge/ChallengePage';
import { ChallengeActions } from '../../components/challenge/ChallengeActions';
import { CHALLENGES } from '../../challenges';

const mockUseChallengeState = vi.fn();

vi.mock('../../hooks/useChallengeState', () => ({
  useChallengeState: (...args: unknown[]) => mockUseChallengeState(...args)
}));

const baseState = {
  code: '#include <stdio.h>\nint main() { return 0; }',
  setCode: vi.fn(),
  attempts: [],
  usedTips: [],
  analysis: null,
  technicalAnalysisError: null,
  hasChangesSinceLastAnalysis: false,
  allTipsOpened: false,
  aiAnalysisRequestCount: 0,
  displayedAnalysisRequestCount: 0,
  canOpenSolution: false,
  isRateLimited: false,
  rateLimitRemainingSeconds: 0,
  solutionUnlockMessage: 'Bloqueada',
  openedTipsCount: 0,
  totalTips: 4,
  isAnalyzing: false,
  showSolution: false,
  lastAnalysisTime: 0,
  error: null,
  handleVerify: vi.fn(),
  useTip: vi.fn(),
  resetCode: vi.fn(),
  cancelReset: vi.fn(),
  initiateReset: vi.fn(),
  showResetConfirm: false,
  setShowSolution: vi.fn(),
  handleOpenSolution: vi.fn(),
  setError: vi.fn(),
  openHistory: vi.fn()
};

describe('ChallengePage', () => {
  beforeEach(() => {
    mockUseChallengeState.mockReturnValue(baseState);
  });

  it('não renderiza a representação do problema para desafios CCI01', () => {
    const challenge = CHALLENGES.find(item => item.id === 'cci01-custo-viagem');
    expect(challenge).toBeDefined();

    render(
      <ChallengePage
        challenge={challenge!}
        user={null}
        isAuthReady
        isAuthenticated={false}
        isAnonymous={false}
        onBack={vi.fn()}
        onOpenWorkshop={vi.fn()}
        onLogin={vi.fn()}
        onLogout={vi.fn()}
      />
    );

    expect(screen.queryByText('Representação do problema')).not.toBeInTheDocument();
  });

  it('não renderiza a seção de erros comuns em nenhum desafio guiado', () => {
    const challenge = CHALLENGES.find(item => item.id === 'desafio1_condicionais_basico');
    expect(challenge).toBeDefined();

    render(
      <ChallengePage
        challenge={challenge!}
        user={null}
        isAuthReady
        isAuthenticated={false}
        isAnonymous={false}
        onBack={vi.fn()}
        onOpenWorkshop={vi.fn()}
        onLogin={vi.fn()}
        onLogout={vi.fn()}
      />
    );

    expect(screen.queryByText('Erros Comuns')).not.toBeInTheDocument();
    expect(screen.queryByText('Erros comuns')).not.toBeInTheDocument();
  });
  it("centraliza disponibilidade e motivo do botão de análise", () => {
    const { rerender } = render(<ChallengeActions onVerify={vi.fn()} isAnalyzing={false} canRequestAnalysis={false} disabledReason="AUTH_INITIALIZING" />);
    let button = screen.getByRole("button", { name: /Preparando análise/i });
    expect(button).toBeDisabled();
    expect(screen.getByText(/Preparando a autenticação/i)).toBeInTheDocument();
    rerender(<ChallengeActions onVerify={vi.fn()} isAnalyzing={false} canRequestAnalysis={false} disabledReason="NO_AUTHENTICATED_USER" />);
    button = screen.getByRole("button", { name: /Autenticação necessária/i });
    expect(button).toBeDisabled();
    expect(screen.getByText(/É necessário estar autenticado/i)).toBeInTheDocument();
    rerender(<ChallengeActions onVerify={vi.fn()} isAnalyzing={false} canRequestAnalysis />);
    expect(screen.getByRole("button", { name: /Solicitar Orientação/i })).toBeEnabled();
    rerender(<ChallengeActions onVerify={vi.fn()} isAnalyzing canRequestAnalysis />);
    expect(screen.getByRole("button", { name: /Analisando/i })).toBeDisabled();
  });
});
