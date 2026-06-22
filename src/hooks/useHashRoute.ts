import * as React from 'react';
import { isChallengeFormatId } from '../data/challengeFormats';
import type { ChallengeFormatId } from '../types/workshop';

export type AppHashRoute =
  | { view: 'guided' }
  | { view: 'workshop'; formatId: ChallengeFormatId | null }
  | { view: 'code-ordering'; slug: string };

const WORKSHOP_ROOT_HASH = '#/oficina';

export function parseHashRoute(hash: string): AppHashRoute {
  const normalizedHash = hash.replace(/^#/, '') || '/';
  const normalizedPath = normalizedHash.endsWith('/') && normalizedHash.length > 1
    ? normalizedHash.slice(0, -1)
    : normalizedHash;

  if (normalizedPath === '/' || normalizedPath === '') {
    return { view: 'guided' };
  }

  if (normalizedPath === '/oficina') {
    return { view: 'workshop', formatId: null };
  }

  const codeOrderingMatch = normalizedPath.match(/^\/oficina\/ordenacao-de-codigo\/([^/]+)$/);
  if (codeOrderingMatch) {
    return { view: 'code-ordering', slug: codeOrderingMatch[1] };
  }

  const formatMatch = normalizedPath.match(/^\/oficina\/formato\/([^/]+)$/);
  if (formatMatch && isChallengeFormatId(formatMatch[1])) {
    return { view: 'workshop', formatId: formatMatch[1] };
  }

  return { view: 'guided' };
}

export function useHashRoute() {
  const [route, setRoute] = React.useState<AppHashRoute>(() => parseHashRoute(window.location.hash));

  React.useEffect(() => {
    const handleHashChange = () => {
      setRoute(parseHashRoute(window.location.hash));
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToHash = React.useCallback((hash: string) => {
    if (hash === '') {
      const baseUrl = `${window.location.pathname}${window.location.search}`;
      window.history.pushState(null, '', baseUrl);
      setRoute(parseHashRoute(''));
      return;
    }

    if (window.location.hash === hash) {
      setRoute(parseHashRoute(hash));
      return;
    }

    window.location.hash = hash;
  }, []);

  const navigateToGuided = React.useCallback(() => {
    navigateToHash('');
  }, [navigateToHash]);

  const navigateToWorkshop = React.useCallback(() => {
    navigateToHash(WORKSHOP_ROOT_HASH);
  }, [navigateToHash]);

  const navigateToWorkshopFormat = React.useCallback((formatId: ChallengeFormatId) => {
    navigateToHash(`${WORKSHOP_ROOT_HASH}/formato/${formatId}`);
  }, [navigateToHash]);

  const navigateToCodeOrderingChallenge = React.useCallback((slug: string) => {
    navigateToHash(`${WORKSHOP_ROOT_HASH}/ordenacao-de-codigo/${slug}`);
  }, [navigateToHash]);

  return {
    route,
    navigateToGuided,
    navigateToWorkshop,
    navigateToWorkshopFormat,
    navigateToCodeOrderingChallenge
  };
}
