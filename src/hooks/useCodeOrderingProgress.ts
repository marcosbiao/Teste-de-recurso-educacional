import * as React from 'react';
import { validateCodeOrderingSolution } from '../domain/codeOrderingValidator';
import type { CodeOrderingChallenge } from '../types/workshop';

interface StoredCodeOrderingProgress {
  solutionOrder: string[];
  revealedHintCount: number;
  isCompleted: boolean;
}

function getStorageKey(challengeId: string) {
  return `workshop_code_ordering_${challengeId}`;
}

export function useCodeOrderingProgress(challenge: CodeOrderingChallenge) {
  const restoredProgress = React.useMemo(() => restoreProgress(challenge), [challenge]);
  const [solutionOrder, setSolutionOrder] = React.useState<string[]>(restoredProgress.solutionOrder);
  const [pastOrders, setPastOrders] = React.useState<string[][]>([]);
  const [futureOrders, setFutureOrders] = React.useState<string[][]>([]);
  const [revealedHintCount, setRevealedHintCount] = React.useState(restoredProgress.revealedHintCount);
  const [isCompleted, setIsCompleted] = React.useState(restoredProgress.isCompleted);

  React.useEffect(() => {
    persistProgress(challenge.id, {
      solutionOrder,
      revealedHintCount,
      isCompleted
    });
  }, [challenge.id, isCompleted, revealedHintCount, solutionOrder]);

  const commitOrder = React.useCallback((nextOrder: string[]) => {
    setSolutionOrder((currentOrder) => {
      if (areSameOrder(currentOrder, nextOrder)) {
        return currentOrder;
      }

      setPastOrders((past) => [...past, currentOrder]);
      setFutureOrders([]);
      setIsCompleted(false);
      return nextOrder;
    });
  }, []);

  const addBlock = React.useCallback((blockId: string, index = solutionOrder.length) => {
    if (solutionOrder.includes(blockId)) return;

    const boundedIndex = Math.max(0, Math.min(index, solutionOrder.length));
    const nextOrder = [
      ...solutionOrder.slice(0, boundedIndex),
      blockId,
      ...solutionOrder.slice(boundedIndex)
    ];
    commitOrder(nextOrder);
  }, [commitOrder, solutionOrder]);

  const removeBlock = React.useCallback((blockId: string) => {
    if (!solutionOrder.includes(blockId)) return;
    commitOrder(solutionOrder.filter((placedBlockId) => placedBlockId !== blockId));
  }, [commitOrder, solutionOrder]);

  const moveBlock = React.useCallback((blockId: string, direction: -1 | 1) => {
    const currentIndex = solutionOrder.indexOf(blockId);
    const nextIndex = currentIndex + direction;

    if (currentIndex < 0 || nextIndex < 0 || nextIndex >= solutionOrder.length) return;

    const nextOrder = [...solutionOrder];
    const [movedBlock] = nextOrder.splice(currentIndex, 1);
    nextOrder.splice(nextIndex, 0, movedBlock);
    commitOrder(nextOrder);
  }, [commitOrder, solutionOrder]);

  const insertPlacedBlock = React.useCallback((blockId: string, index: number) => {
    const currentIndex = solutionOrder.indexOf(blockId);
    if (currentIndex < 0) return;

    const nextOrder = [...solutionOrder];
    const [movedBlock] = nextOrder.splice(currentIndex, 1);
    const boundedIndex = Math.max(0, Math.min(index, nextOrder.length));
    nextOrder.splice(boundedIndex, 0, movedBlock);
    commitOrder(nextOrder);
  }, [commitOrder, solutionOrder]);

  const clearSolution = React.useCallback(() => {
    commitOrder([]);
  }, [commitOrder]);

  const resetActivity = React.useCallback(() => {
    commitOrder([]);
    setRevealedHintCount(1);
    setIsCompleted(false);
  }, [commitOrder]);

  const undo = React.useCallback(() => {
    setPastOrders((past) => {
      if (past.length === 0) return past;

      const previousOrder = past[past.length - 1];
      setFutureOrders((future) => [solutionOrder, ...future]);
      setSolutionOrder(previousOrder);
      setIsCompleted(false);
      return past.slice(0, -1);
    });
  }, [solutionOrder]);

  const redo = React.useCallback(() => {
    setFutureOrders((future) => {
      if (future.length === 0) return future;

      const [nextOrder, ...remainingFuture] = future;
      setPastOrders((past) => [...past, solutionOrder]);
      setSolutionOrder(nextOrder);
      setIsCompleted(false);
      return remainingFuture;
    });
  }, [solutionOrder]);

  const revealNextHint = React.useCallback(() => {
    setRevealedHintCount((currentCount) => Math.min(challenge.hints.length, currentCount + 1));
  }, [challenge.hints.length]);

  const markCompleted = React.useCallback(() => {
    const validation = validateCodeOrderingSolution(challenge, solutionOrder);
    if (validation.isValid) {
      setIsCompleted(true);
    }
  }, [challenge, solutionOrder]);

  return {
    solutionOrder,
    revealedHintCount,
    isCompleted,
    canUndo: pastOrders.length > 0,
    canRedo: futureOrders.length > 0,
    addBlock,
    removeBlock,
    moveBlock,
    insertPlacedBlock,
    clearSolution,
    resetActivity,
    undo,
    redo,
    revealNextHint,
    markCompleted
  };
}

function restoreProgress(challenge: CodeOrderingChallenge): StoredCodeOrderingProgress {
  const fallback: StoredCodeOrderingProgress = {
    solutionOrder: [],
    revealedHintCount: 1,
    isCompleted: false
  };

  if (typeof localStorage === 'undefined') return fallback;

  try {
    const rawProgress = localStorage.getItem(getStorageKey(challenge.id));
    if (!rawProgress) return fallback;

    const parsed = JSON.parse(rawProgress) as Partial<StoredCodeOrderingProgress>;
    const solutionOrder = sanitizeSolutionOrder(challenge, parsed.solutionOrder);
    const revealedHintCount = clampHintCount(challenge, parsed.revealedHintCount);
    const isCompleted = Boolean(parsed.isCompleted)
      && validateCodeOrderingSolution(challenge, solutionOrder).isValid;

    return {
      solutionOrder,
      revealedHintCount,
      isCompleted
    };
  } catch (error) {
    console.error('Erro ao restaurar progresso da atividade de ordenação:', error);
    return fallback;
  }
}

function persistProgress(challengeId: string, progress: StoredCodeOrderingProgress) {
  if (typeof localStorage === 'undefined') return;

  try {
    localStorage.setItem(getStorageKey(challengeId), JSON.stringify(progress));
  } catch (error) {
    console.error('Erro ao salvar progresso da atividade de ordenação:', error);
  }
}

function sanitizeSolutionOrder(challenge: CodeOrderingChallenge, maybeOrder: unknown) {
  if (!Array.isArray(maybeOrder)) return [];

  const validBlockIds = new Set(challenge.blocks.map((block) => block.id));
  const usedBlockIds = new Set<string>();

  return maybeOrder.filter((blockId): blockId is string => {
    if (typeof blockId !== 'string' || !validBlockIds.has(blockId) || usedBlockIds.has(blockId)) {
      return false;
    }

    usedBlockIds.add(blockId);
    return true;
  });
}

function clampHintCount(challenge: CodeOrderingChallenge, maybeCount: unknown) {
  const count = typeof maybeCount === 'number' ? maybeCount : 1;
  return Math.max(1, Math.min(challenge.hints.length, count));
}

function areSameOrder(left: string[], right: string[]) {
  return left.length === right.length && left.every((blockId, index) => blockId === right[index]);
}
