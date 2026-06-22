import * as React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  ArrowLeft,
  FlaskConical,
  LayoutGrid,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles
} from 'lucide-react';
import { CHALLENGES } from '../../challenges';
import {
  CHALLENGE_FORMATS,
  WORKSHOP_ACTIVITIES,
  WORKSHOP_CATEGORY_OPTIONS,
  WORKSHOP_SORT_OPTIONS,
  getChallengeFormatById
} from '../../data/challengeFormats';
import type { ChallengeFormat, ChallengeFormatId, WorkshopActivity, WorkshopSortOption } from '../../types/workshop';
import { ChallengeFormatCard } from './ChallengeFormatCard';

interface WorkshopHomePageProps {
  activeFormatId: ChallengeFormatId | null;
  onBackToGuided: () => void;
  onSelectFormat: (formatId: ChallengeFormatId) => void;
  onOpenCodeOrderingActivity: (slug: string) => void;
  onBackToFormatSelection: () => void;
}

type FormatFilterValue = ChallengeFormatId | 'all';

export function WorkshopHomePage({
  activeFormatId,
  onBackToGuided,
  onSelectFormat,
  onOpenCodeOrderingActivity,
  onBackToFormatSelection
}: WorkshopHomePageProps) {
  const shouldReduceMotion = useReducedMotion();
  const selectedFormat = activeFormatId && activeFormatId !== 'guided'
    ? getChallengeFormatById(activeFormatId)
    : undefined;

  const [searchTerm, setSearchTerm] = React.useState('');
  const [formatFilter, setFormatFilter] = React.useState<FormatFilterValue>('all');
  const [categoryFilter, setCategoryFilter] = React.useState('all');
  const [competencyFilter, setCompetencyFilter] = React.useState('all');
  const [sortBy, setSortBy] = React.useState<WorkshopSortOption>('title');

  React.useEffect(() => {
    setFormatFilter(selectedFormat ? selectedFormat.id : 'all');
  }, [selectedFormat]);

  const categoryOptions = React.useMemo(() => {
    const categories = new Map(WORKSHOP_CATEGORY_OPTIONS.map((category) => [category.id, category]));
    WORKSHOP_ACTIVITIES.forEach((activity) => {
      categories.set(activity.categoryId, {
        id: activity.categoryId,
        label: activity.categoryLabel
      });
    });
    return Array.from(categories.values());
  }, []);

  const competencyOptions = React.useMemo(() => {
    const competencies = new Set<string>();

    WORKSHOP_ACTIVITIES.forEach((activity) => {
      if (activity.competencyLabel.trim()) {
        competencies.add(activity.competencyLabel.trim());
      }
    });

    CHALLENGES.forEach((challenge) => {
      if (challenge.metadata.skill.trim()) {
        competencies.add(challenge.metadata.skill.trim());
      }
    });

    return Array.from(competencies).sort((left, right) => left.localeCompare(right, 'pt-BR'));
  }, []);

  const visibleActivities = React.useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLocaleLowerCase('pt-BR');

    return WORKSHOP_ACTIVITIES
      .filter((activity) => {
        const matchesSearch = normalizedSearch.length === 0
          || activity.title.toLocaleLowerCase('pt-BR').includes(normalizedSearch)
          || activity.description.toLocaleLowerCase('pt-BR').includes(normalizedSearch);
        const matchesFormat = formatFilter === 'all' || activity.formatId === formatFilter;
        const matchesCategory = categoryFilter === 'all' || activity.categoryId === categoryFilter;
        const matchesCompetency = competencyFilter === 'all' || activity.competencyLabel === competencyFilter;

        return matchesSearch && matchesFormat && matchesCategory && matchesCompetency;
      })
      .sort((left, right) => sortWorkshopActivities(left, right, sortBy));
  }, [categoryFilter, competencyFilter, formatFilter, searchTerm, sortBy]);

  const selectedFormatActivitiesCount = selectedFormat
    ? WORKSHOP_ACTIVITIES.filter((activity) => activity.formatId === selectedFormat.id).length
    : 0;

  const handleFormatAction = (format: ChallengeFormat) => {
    if (format.id === 'guided') {
      onBackToGuided();
      return;
    }

    onSelectFormat(format.id);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050b1b] text-white selection:bg-cyan-300/30">
      <header className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(37,99,235,0.18),transparent_38%,rgba(139,92,246,0.12)_70%,transparent)]" />
        <div className="absolute inset-0 hidden bg-[linear-gradient(rgba(148,163,184,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:48px_48px] md:block" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-8 sm:py-10">
          <nav className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between" aria-label="Navegação da oficina">
            <div className="inline-flex items-center gap-3 text-sm font-black uppercase tracking-widest text-slate-200">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10">
                <FlaskConical className="h-5 w-5 text-cyan-200" aria-hidden="true" />
              </span>
              Oficina Interativa de Código
            </div>

            <button
              type="button"
              onClick={onBackToGuided}
              className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-black uppercase tracking-widest text-slate-100 transition-all hover:border-cyan-200/40 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200 active:scale-[0.98] sm:w-auto"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Voltar aos desafios guiados
            </button>
          </nav>

          <div className="mt-16 max-w-4xl pb-8 sm:mt-20">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-200/20 bg-cyan-200/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-cyan-100">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Novos formatos
            </span>
            <h1 className="mt-6 text-4xl font-black leading-none tracking-tight text-white sm:text-5xl lg:text-6xl">
              Oficina Interativa de Código
            </h1>
            <p className="mt-6 max-w-3xl text-lg font-medium leading-relaxed text-slate-300 sm:text-xl">
              Diferentes formatos para praticar, analisar e desenvolver habilidades de programação.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-12 px-6 py-12 sm:py-14">
        <section aria-labelledby="format-selection-title" className="space-y-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-cyan-100/70">Seleção de formatos</p>
              <h2 id="format-selection-title" className="mt-2 text-3xl font-black tracking-tight text-white">
                Escolha como praticar
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[repeat(5,minmax(0,1fr))]">
            {CHALLENGE_FORMATS.map((format) => (
              <ChallengeFormatCard
                key={format.id}
                format={format}
                isSelected={activeFormatId === format.id}
                onAction={handleFormatAction}
              />
            ))}
          </div>
        </section>

        <AnimatePresence mode="wait">
          {selectedFormat && (
            <motion.section
              key={selectedFormat.id}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
              transition={{ duration: 0.22 }}
              aria-labelledby="selected-format-title"
              className={`rounded-3xl border ${selectedFormat.theme.border} bg-slate-950/70 p-6 shadow-2xl ${selectedFormat.theme.glow} sm:p-8`}
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex gap-4">
                  <div className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border ${selectedFormat.theme.iconWrap}`}>
                    <selectedFormat.icon className={`h-7 w-7 ${selectedFormat.theme.icon}`} aria-hidden="true" />
                  </div>
                  <div className="space-y-3">
                    <p className={`text-sm font-black uppercase tracking-widest ${selectedFormat.theme.mutedText}`}>
                      Área de testes
                    </p>
                    <h2 id="selected-format-title" className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                      {selectedFormat.title}
                    </h2>
                    <p className="max-w-3xl text-base font-medium leading-relaxed text-slate-300">
                      {selectedFormat.longDescription}
                    </p>
                    <p className={`text-base font-black ${selectedFormat.theme.text}`}>
                      {selectedFormatActivitiesCount > 0
                        ? 'Atividades publicadas deste formato aparecem no catálogo abaixo.'
                        : 'Atividades deste formato serão adicionadas nesta área'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onBackToFormatSelection}
                  className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-black uppercase tracking-widest text-slate-100 transition-all hover:border-white/20 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200 active:scale-[0.98] sm:w-auto"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  Voltar à seleção
                </button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        <section aria-labelledby="activities-title" className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                  <LayoutGrid className="h-5 w-5 text-cyan-100" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-black uppercase tracking-widest text-slate-400">Catálogo</p>
                  <h2 id="activities-title" className="text-2xl font-black tracking-tight text-white">
                    Atividades disponíveis
                  </h2>
                </div>
              </div>
            </div>
          </div>

          <form
            className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-5"
            role="search"
            aria-label="Filtros de atividades da oficina"
            onSubmit={(event) => event.preventDefault()}
          >
            <FilterField label="Buscar atividade" className="lg:col-span-1">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Buscar atividade"
                  className="min-h-12 w-full rounded-2xl border border-white/10 bg-slate-950/70 py-3 pl-10 pr-4 text-base font-semibold text-white placeholder:text-slate-500 transition-colors hover:border-white/20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
                />
              </div>
            </FilterField>

            <FilterField label="Formato">
              <select
                value={formatFilter}
                onChange={(event) => setFormatFilter(event.target.value as FormatFilterValue)}
                className="min-h-12 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-base font-semibold text-white transition-colors hover:border-white/20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
              >
                <option value="all">Todos</option>
                {CHALLENGE_FORMATS.map((format) => (
                  <option key={format.id} value={format.id}>
                    {format.title}
                  </option>
                ))}
              </select>
            </FilterField>

            <FilterField label="Categoria">
              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                className="min-h-12 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-base font-semibold text-white transition-colors hover:border-white/20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
              >
                <option value="all">Todas</option>
                {categoryOptions.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
            </FilterField>

            <FilterField label="Competência">
              <select
                value={competencyFilter}
                onChange={(event) => setCompetencyFilter(event.target.value)}
                className="min-h-12 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-base font-semibold text-white transition-colors hover:border-white/20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
              >
                <option value="all">Todas as competências</option>
                {competencyOptions.map((competency) => (
                  <option key={competency} value={competency}>
                    {competency}
                  </option>
                ))}
              </select>
            </FilterField>

            <FilterField label="Ordenação">
              <div className="relative">
                <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value as WorkshopSortOption)}
                  className="min-h-12 w-full rounded-2xl border border-white/10 bg-slate-950/70 py-3 pl-10 pr-4 text-base font-semibold text-white transition-colors hover:border-white/20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
                >
                  {WORKSHOP_SORT_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </FilterField>
          </form>

          <div className="mt-8">
            {visibleActivities.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {visibleActivities.map((activity) => (
                  <article key={activity.id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
                    <p className="text-sm font-black uppercase tracking-widest text-cyan-100/70">
                      {activity.categoryLabel}
                    </p>
                    <h3 className="mt-2 text-xl font-black tracking-tight text-white">{activity.title}</h3>
                    <p className="mt-3 text-base font-medium leading-relaxed text-slate-300">{activity.description}</p>
                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="text-xs font-black uppercase tracking-widest text-slate-400">
                        {activity.competencyId} · {activity.language ?? 'C'} · nível {activity.difficulty ?? '-'}
                      </div>
                      {activity.formatId === 'code-ordering' && activity.slug && (
                        <button
                          type="button"
                          onClick={() => onOpenCodeOrderingActivity(activity.slug!)}
                          className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-blue-500 px-4 py-2 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-blue-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-200 active:scale-[0.98]"
                        >
                          Abrir atividade
                        </button>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-white/15 bg-slate-950/45 px-6 py-10 text-center">
                <p className="text-lg font-black tracking-tight text-white">Nenhuma atividade cadastrada para estes filtros.</p>
                <p className="mx-auto mt-3 max-w-2xl text-base font-medium leading-relaxed text-slate-400">
                  Atividades deste catálogo serão adicionadas conforme os novos formatos forem cadastrados.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function FilterField({
  label,
  className = '',
  children
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block space-y-2 ${className}`}>
      <span className="text-xs font-black uppercase tracking-widest text-slate-400">{label}</span>
      {children}
    </label>
  );
}

function sortWorkshopActivities(left: WorkshopActivity, right: WorkshopActivity, sortBy: WorkshopSortOption) {
  switch (sortBy) {
    case 'category':
      return left.categoryLabel.localeCompare(right.categoryLabel, 'pt-BR');
    case 'competency':
      return left.competencyLabel.localeCompare(right.competencyLabel, 'pt-BR');
    case 'recent':
      return getActivityTime(right) - getActivityTime(left);
    case 'title':
    default:
      return left.title.localeCompare(right.title, 'pt-BR');
  }
}

function getActivityTime(activity: WorkshopActivity) {
  return activity.createdAt ? Date.parse(activity.createdAt) : 0;
}
