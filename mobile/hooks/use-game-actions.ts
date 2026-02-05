/**
 * useGameActions - Common game action handlers with audio feedback.
 * Eliminates duplication across all game mode screens.
 */

import { useCallback } from 'react';
import { useGameStore } from '@/stores/game-store';
import { playSound } from '@/services/audio';
import type { Direction } from '@/game/types';

interface GameActionsOptions {
  /** Called before move action - return false to prevent */
  onBeforeMove?: (direction: Direction) => boolean;
  /** Called before rotate action - return false to prevent */
  onBeforeRotate?: () => boolean;
  /** Called before place action - return false to prevent */
  onBeforePlace?: () => boolean;
  /** Called before undo action - return false to prevent */
  onBeforeUndo?: () => boolean;
  /** Called after successful move */
  onAfterMove?: (direction: Direction, success: boolean) => void;
  /** Called after successful rotate */
  onAfterRotate?: (success: boolean) => void;
  /** Called after successful place */
  onAfterPlace?: (success: boolean) => void;
  /** Called after successful undo */
  onAfterUndo?: (success: boolean) => void;
}

interface GameActions {
  handleMove: (direction: Direction) => void;
  handleRotate: () => void;
  handlePlace: () => void;
  handleUndo: () => void;
  handlePause: () => void;
  handleResume: () => void;
}

/**
 * Hook that provides common game action handlers with audio feedback.
 * Supports optional callbacks for mode-specific behavior (e.g., tutorial).
 */
export function useGameActions(options: GameActionsOptions = {}): GameActions {
  const {
    onBeforeMove,
    onBeforeRotate,
    onBeforePlace,
    onBeforeUndo,
    onAfterMove,
    onAfterRotate,
    onAfterPlace,
    onAfterUndo,
  } = options;

  const movePlayer = useGameStore((state) => state.movePlayer);
  const rotatePlayer = useGameStore((state) => state.rotatePlayer);
  const placeShape = useGameStore((state) => state.placeShape);
  const undo = useGameStore((state) => state.undo);
  const pause = useGameStore((state) => state.pause);
  const resume = useGameStore((state) => state.resume);

  const handleMove = useCallback(
    (direction: Direction) => {
      if (onBeforeMove && !onBeforeMove(direction)) return;
      const success = movePlayer(direction);
      playSound(success ? 'movement' : 'non_movement');
      onAfterMove?.(direction, success);
    },
    [movePlayer, onBeforeMove, onAfterMove]
  );

  const handleRotate = useCallback(() => {
    if (onBeforeRotate && !onBeforeRotate()) return;
    const success = rotatePlayer();
    playSound(success ? 'movement' : 'non_movement');
    onAfterRotate?.(success);
  }, [rotatePlayer, onBeforeRotate, onAfterRotate]);

  const handlePlace = useCallback(() => {
    if (onBeforePlace && !onBeforePlace()) return;
    const success = placeShape();
    if (success) playSound('movement');
    onAfterPlace?.(success);
  }, [placeShape, onBeforePlace, onAfterPlace]);

  const handleUndo = useCallback(() => {
    if (onBeforeUndo && !onBeforeUndo()) return;
    const success = undo();
    playSound(success ? 'movement' : 'non_movement');
    onAfterUndo?.(success);
  }, [undo, onBeforeUndo, onAfterUndo]);

  const handlePause = useCallback(() => {
    pause();
  }, [pause]);

  const handleResume = useCallback(() => {
    resume();
  }, [resume]);

  return {
    handleMove,
    handleRotate,
    handlePlace,
    handleUndo,
    handlePause,
    handleResume,
  };
}

export default useGameActions;
