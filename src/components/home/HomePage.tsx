import * as React from 'react';
import { AlertTriangle, ArrowRight, Code2, FileJson, FileSpreadsheet, FlaskConical, LogIn, RefreshCw, Sparkles } from 'lucide-react';
import type { Attempt, Challenge, UserProfile } from '../../types';
import { CHALLENGES } from '../../challenges';
import { APP_CONSTANTS } from '../../config/constants';
import { attemptService } from '../../services/attemptService';
import { exportService } from '../../services/exportService';
import { localPersistenceService } from '../../services/localPersistenceService';
import { BenefitsBanner } from './BenefitsBanner';
import { HomeHeader } from './HomeHeader';
import { OverallProgressCard } from './OverallProgressCard';
import { TrailCard } from './TrailCard';
import { TrailFilters, type TrailFilter, type TrailSort } from './TrailFilters';
import { TRAILS, type TrailProgress } from './homeData';
import { TrailDetailView } from './TrailDetailView';

interface HomePageProps {
  user: UserProfile | null;
  selectedCategoryId: string | null;
  onSelectCategory: (id: string | null) => void;
  onSelectChallenge: (index: number) => void;
  onOpenWorkshop: () => void;
  onLogin: () => void;
  onLogout: () => void;
}

function timestampValue(timestamp: unknown) {
  if (timestamp instanceof Date) return timestamp.getTime();
  if (typeof timestamp === 'string' || typeof timestamp === 'number') return new Date(timestamp).getTime() || 0;
  if (timestamp && typeof timestamp === 'object' && 'toMillis' in timestamp && typeof timestamp.toMillis === 'function') {
    return timestamp.toMillis();
  }
  return 0;
}

function scrollToElement(id: string) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }));
}

export function HomePage({ user, selectedCategoryId, onSelectCategory, onSelectChallenge, onOpenWorkshop, onLogin, onLogout }: HomePageProps) {
  const [allAttempts, setAllAttempts] = React.useState<Attempt[]>([]);
  const [isProgressLoading, setIsProgressLoading] = React.useState(Boolean(user));
  const [progressError, setProgressError] = React.useState<string | null>(null);
  const [retryKey, setRetryKey] = React.useState(0);
  const [filter, setFilter] = React.useState<TrailFilter>('all');
  const [search, setSearch] = React.useState('');
  const [sort, setSort] = React.useState<TrailSort>('recommended');

  React.useEffect(() => {
    setProgressError(null);
    if (!user) {
      setAllAttempts(localPersistenceService.getAllLocalAttempts());
      setIsProgressLoading(false);
      return;
    }

    setIsProgressLoading(true);
    const unsubscribe = attemptService.subscribeToAllAttempts(
      user.uid,
      attempts => {
        setAllAttempts(attempts);
        setIsProgressLoading(false);
      },
      () => {
        setProgressError('Não foi possível atualizar seu progresso agora. As trilhas continuam disponíveis.');
        setIsProgressLoading(false);
      }
    );
    return () => unsubscribe();
  }, [retryKey, user]);

  const completedChallengeIds = React.useMemo(() => new Set(
    allAttempts
      .filter(attempt => attempt.category === APP_CONSTANTS.ANALYSIS_CATEGORIES.ADEQUATE)
      .map(attempt => attempt.challengeId)
  ), [allAttempts]);

  const startedChallengeIds = React.useMemo(() => new Set(allAttempts.map(attempt => attempt.challengeId)), [allAttempts]);

  const trails = React.useMemo<TrailProgress[]>(() => TRAILS.map(trail => {
    const challenges = CHALLENGES.filter(challenge => challenge.categoryId === trail.id);
    const completedCount = challenges.filter(challenge => completedChallengeIds.has(challenge.id)).length;
    const startedCount = challenges.filter(challenge => startedChallengeIds.has(challenge.id)).length;
    const percent = challenges.length ? Math.round((completedCount / challenges.length) * 100) : 0;
    const status = completedCount === challenges.length && challenges.length > 0
      ? 'completed'
      : startedCount > 0
        ? 'in-progress'
        : 'not-started';
    return { ...trail, challenges, completedCount, startedCount, percent, status };
  }), [completedChallengeIds, startedChallengeIds]);

  const latestAttempt = React.useMemo(() => {
    const incompleteAttempts = allAttempts.filter(attempt => !completedChallengeIds.has(attempt.challengeId));
    const candidates = incompleteAttempts.length ? incompleteAttempts : allAttempts;
    return [...candidates].sort((a, b) => timestampValue(b.timestamp) - timestampValue(a.timestamp))[0];
  }, [allAttempts, completedChallengeIds]);

  const currentChallenge = latestAttempt ? CHALLENGES.find(challenge => challenge.id === latestAttempt.challengeId) : undefined;
  const currentChallengeIndex = currentChallenge ? CHALLENGES.findIndex(challenge => challenge.id === currentChallenge.id) : -1;
  const currentTrail = currentChallenge ? trails.find(trail => trail.id === currentChallenge.categoryId) : undefined;
  const completedCount = CHALLENGES.filter(challenge => completedChallengeIds.has(challenge.id)).length;
  const overallPercent = CHALLENGES.length ? Math.round((completedCount / CHALLENGES.length) * 100) : 0;

  const visibleTrails = React.useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('pt-BR');
    const matches = trails.filter(trail => {
      const matchesFilter = filter === 'all' || trail.status === filter;
      const searchable = `${trail.title} ${trail.competency} ${trail.description}`.toLocaleLowerCase('pt-BR');
      return matchesFilter && (!normalizedSearch || searchable.includes(normalizedSearch));
    });
    if (sort === 'title') return [...matches].sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'));
    if (sort === 'progress') return [...matches].sort((a, b) => b.percent - a.percent);
    return matches;
  }, [filter, search, sort, trails]);

  const showTrails = React.useCallback(() => {
    if (selectedCategoryId) onSelectCategory(null);
    scrollToElement('trails-section');
  }, [onSelectCategory, selectedCategoryId]);

  const openCurrentOrTrails = () => {
    if (currentChallengeIndex >= 0) onSelectChallenge(currentChallengeIndex);
    else showTrails();
  };

  const activeTrail = trails.find(trail => trail.id === selectedCategoryId);

  return (
    <div className="home-shell">
      <HomeHeader user={user} onOpenWorkshop={onOpenWorkshop} onLogin={onLogin} onLogout={onLogout} onShowTrails={showTrails} />

      {activeTrail ? (
        <TrailDetailView
          trail={activeTrail}
          attempts={allAttempts}
          completedChallengeIds={completedChallengeIds}
          onBack={showTrails}
          onSelectChallenge={challenge => onSelectChallenge(CHALLENGES.findIndex(item => item.id === challenge.id))}
        />
      ) : (
        <main className="home-main">
          <section className="home-container hero-section" aria-labelledby="home-title">
            <div className="hero-copy">
              <span className="hero-copy__kicker"><Sparkles size={15} /> Aprenda construindo</span>
              <h1 id="home-title">Desafios <span>Guiados</span></h1>
              <p>Pratique programação com orientação passo a passo e feedback inteligente.</p>
              <div className="hero-copy__actions">
                <button className="primary-action" type="button" onClick={showTrails}>Explorar trilhas <ArrowRight size={18} /></button>
                <button className="secondary-action" type="button" onClick={onOpenWorkshop}><FlaskConical size={18} /> Outros formatos</button>
              </div>
              <Code2 className="hero-decoration hero-decoration--code" aria-hidden="true" />
              <span className="hero-decoration hero-decoration--dots" aria-hidden="true" />
            </div>
            {isProgressLoading ? <ProgressSkeleton /> : (
              <OverallProgressCard completed={completedCount} total={CHALLENGES.length} percent={overallPercent} currentTrail={currentTrail?.title} hasProgress={Boolean(latestAttempt)} onAction={openCurrentOrTrails} />
            )}
          </section>

          <div className="home-container">
            {progressError && (
              <div className="progress-error" role="alert">
                <AlertTriangle size={19} /><span>{progressError}</span>
                <button type="button" onClick={() => setRetryKey(value => value + 1)}><RefreshCw size={16} /> Tentar novamente</button>
              </div>
            )}

            <section id="trails-section" className="trails-section" aria-labelledby="trails-title">
              <div className="section-heading">
                <span><Code2 size={18} aria-hidden="true" /> Competências em C</span>
                <h2 id="trails-title">Trilhas de aprendizagem</h2>
                <p>Escolha uma competência e avance no seu ritmo.</p>
              </div>
              <TrailFilters filter={filter} search={search} sort={sort} onFilterChange={setFilter} onSearchChange={setSearch} onSortChange={setSort} />

              {isProgressLoading ? <TrailGridSkeleton /> : visibleTrails.length ? (
                <div className="trails-grid">
                  {visibleTrails.map(trail => <TrailCard key={trail.id} trail={trail} onOpen={() => onSelectCategory(trail.id)} />)}
                </div>
              ) : (
                <div className="empty-trails" role="status">
                  <Code2 size={30} /><h3>Nenhuma trilha encontrada</h3><p>Tente outro termo ou ajuste os filtros de progresso.</p>
                  <button type="button" onClick={() => { setSearch(''); setFilter('all'); }}>Limpar filtros</button>
                </div>
              )}
            </section>

            <BenefitsBanner />

            {user && allAttempts.length > 0 && (
              <section className="data-banner" aria-labelledby="export-title">
                <div><span>Seus dados, sempre com você</span><h2 id="export-title">Exportar tentativas</h2><p>Baixe as {allAttempts.length} tentativas registradas para análise ou backup.</p></div>
                <div className="data-banner__actions">
                  <button type="button" onClick={() => exportService.exportToJson(allAttempts, user.uid)}><FileJson size={18} /> JSON</button>
                  <button type="button" onClick={() => exportService.exportToCsv(allAttempts, user.uid)}><FileSpreadsheet size={18} /> CSV</button>
                </div>
              </section>
            )}

            {!user && (
              <section className="login-banner" aria-labelledby="login-title">
                <div className="login-banner__icon"><LogIn size={25} /></div>
                <div><h2 id="login-title">Leve seu progresso com você</h2><p>Os desafios são livres. Entre para sincronizar tentativas e histórico entre dispositivos.</p></div>
                <button className="secondary-action" type="button" onClick={onLogin}>Entrar com Google <ArrowRight size={18} /></button>
              </section>
            )}
          </div>
        </main>
      )}
    </div>
  );
}

function ProgressSkeleton() {
  return <div className="overall-card skeleton-card" aria-label="Carregando progresso"><span /><span /><span /></div>;
}

function TrailGridSkeleton() {
  return <div className="trails-grid skeleton-grid" aria-label="Carregando trilhas">{Array.from({ length: 5 }, (_, index) => <div className="trail-card" key={index}><span /><span /><span /></div>)}</div>;
}
