import * as React from 'react';
import { CheckCircle2, Circle, LayoutGrid, RefreshCw, Search } from 'lucide-react';
import type { TrailStatus } from './homeData';

export type TrailFilter = 'all' | TrailStatus;
export type TrailSort = 'recommended' | 'title' | 'progress';

interface TrailFiltersProps {
  filter: TrailFilter;
  search: string;
  sort: TrailSort;
  onFilterChange: (filter: TrailFilter) => void;
  onSearchChange: (search: string) => void;
  onSortChange: (sort: TrailSort) => void;
}

const FILTERS: Array<{ id: TrailFilter; label: string; icon: React.ReactNode }> = [
  { id: 'all', label: 'Todas', icon: <LayoutGrid size={16} /> },
  { id: 'in-progress', label: 'Em andamento', icon: <RefreshCw size={16} /> },
  { id: 'not-started', label: 'Não iniciadas', icon: <Circle size={16} /> },
  { id: 'completed', label: 'Concluídas', icon: <CheckCircle2 size={16} /> }
];

export function TrailFilters({ filter, search, sort, onFilterChange, onSearchChange, onSortChange }: TrailFiltersProps) {
  return (
    <div className="trail-controls">
      <div className="filter-tabs" role="group" aria-label="Filtrar trilhas por progresso">
        {FILTERS.map(item => (
          <button key={item.id} className={filter === item.id ? 'is-active' : undefined} type="button" onClick={() => onFilterChange(item.id)} aria-pressed={filter === item.id}>
            {item.icon}{item.label}
          </button>
        ))}
      </div>
      <div className="trail-controls__fields">
        <label className="search-field">
          <span className="sr-only">Buscar trilha ou competência</span>
          <Search size={18} aria-hidden="true" />
          <input value={search} onChange={event => onSearchChange(event.target.value)} placeholder="Buscar trilha ou competência..." />
        </label>
        <label className="sort-field">
          <span>Ordenar por:</span>
          <select value={sort} onChange={event => onSortChange(event.target.value as TrailSort)} aria-label="Ordenar trilhas">
            <option value="recommended">Recomendação</option>
            <option value="title">Nome</option>
            <option value="progress">Maior progresso</option>
          </select>
        </label>
      </div>
    </div>
  );
}
