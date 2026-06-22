/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { CHALLENGES } from './challenges';
import { getCodeOrderingChallengeBySlug } from './data/codeOrderingChallenges';
import { useAuthState } from './hooks/useAuthState';
import { useHashRoute } from './hooks/useHashRoute';
import { HomePage } from './components/home/HomePage';
import { WorkshopHomePage } from './components/workshop/WorkshopHomePage';
import { CodeOrderingActivityPage } from './components/workshop/CodeOrderingActivityPage';
import { ChallengePage } from './components/challenge/ChallengePage';
import { LoadingState } from './components/layout/LoadingState';
import { ErrorBoundary } from './components/common/ErrorBoundary';

/**
 * Componente Principal (Orquestrador).
 */
export default function App() {
  // 1. Estado Global de Autenticação via Hook
  const { user, isAuthReady, loading, login, logout } = useAuthState();
  const {
    route,
    navigateToGuided,
    navigateToWorkshop,
    navigateToWorkshopFormat,
    navigateToCodeOrderingChallenge
  } = useHashRoute();
  const shouldReduceMotion = useReducedMotion();

  // 2. Estado de Navegação
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState<number | null>(null);
  const isHome = currentChallengeIndex === null;
  const isWorkshopRoute = route.view === 'workshop' && route.formatId !== 'guided';
  const codeOrderingChallenge = route.view === 'code-ordering'
    ? getCodeOrderingChallengeBySlug(route.slug)
    : undefined;
  const isCodeOrderingRoute = Boolean(codeOrderingChallenge);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: shouldReduceMotion ? 'auto' : 'smooth' });
  };

  useEffect(() => {
    document.title = isCodeOrderingRoute && codeOrderingChallenge
      ? `${codeOrderingChallenge.title} | Ordenação de Código`
      : isWorkshopRoute
      ? 'Oficina Interativa de Código'
      : 'Desafios Guiados | Oficina Interativa de Código';
  }, [codeOrderingChallenge, isCodeOrderingRoute, isWorkshopRoute]);

  useEffect(() => {
    if (route.view === 'workshop' || route.view === 'code-ordering') {
      setCurrentChallengeIndex(null);
    }
  }, [route.view]);

  useEffect(() => {
    if (route.view === 'workshop' && route.formatId === 'guided') {
      navigateToGuided();
    }
  }, [navigateToGuided, route]);

  useEffect(() => {
    if (route.view === 'code-ordering' && !codeOrderingChallenge) {
      navigateToWorkshop();
    }
  }, [codeOrderingChallenge, navigateToWorkshop, route.view]);

  // 3. Handlers de Navegação
  const handleSelectChallenge = (index: number) => {
    setCurrentChallengeIndex(index);
    scrollToTop();
  };

  const handleBackToHome = () => {
    setCurrentChallengeIndex(null);
    scrollToTop();
  };

  const handleOpenWorkshop = () => {
    setCurrentChallengeIndex(null);
    navigateToWorkshop();
    scrollToTop();
  };

  const handleBackToGuided = () => {
    setCurrentChallengeIndex(null);
    navigateToGuided();
    scrollToTop();
  };

  const handleBackToWorkshopSelection = () => {
    navigateToWorkshop();
    scrollToTop();
  };

  // 4. Renderização Condicional de Estados Iniciais
  if (loading || !isAuthReady) {
    return <LoadingState />;
  }

  return (
    <ErrorBoundary>
      <AnimatePresence mode="wait">
        {isWorkshopRoute ? (
          <motion.div
            key="workshop"
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
          >
            <WorkshopHomePage
              activeFormatId={route.formatId}
              onBackToGuided={handleBackToGuided}
              onSelectFormat={navigateToWorkshopFormat}
              onOpenCodeOrderingActivity={navigateToCodeOrderingChallenge}
              onBackToFormatSelection={handleBackToWorkshopSelection}
            />
          </motion.div>
        ) : isCodeOrderingRoute && codeOrderingChallenge ? (
          <motion.div
            key={`code-ordering-${codeOrderingChallenge.slug}`}
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
          >
            <CodeOrderingActivityPage
              challenge={codeOrderingChallenge}
              onBackToWorkshop={handleBackToWorkshopSelection}
            />
          </motion.div>
        ) : isHome ? (
          <motion.div
            key="home"
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
          >
            <HomePage 
              user={user} 
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={setSelectedCategoryId}
              onSelectChallenge={handleSelectChallenge} 
              onOpenWorkshop={handleOpenWorkshop}
              onLogin={login} 
              onLogout={logout} 
            />
          </motion.div>
        ) : (
          <motion.div
            key="challenge"
            initial={shouldReduceMotion ? false : { opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
          >
            <ChallengePage 
              challenge={CHALLENGES[currentChallengeIndex!]} 
              user={user} 
              isAuthReady={isAuthReady}
              onBack={handleBackToHome} 
              onOpenWorkshop={handleOpenWorkshop}
              onLogin={login}
              onLogout={logout} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </ErrorBoundary>
  );
}
