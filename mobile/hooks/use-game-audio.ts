/**
 * Hook for integrating audio with game actions.
 * Wraps game store actions to play appropriate sounds.
 */

import { useCallback, useEffect } from 'react';
import { useGameStore } from '@/stores/game-store';
import { playSound, playMusic, stopMusic, pauseMusic, resumeMusic } from '@/services/audio';
import type { Direction } from '@/game/types';

/**
 * Hook that provides game actions with audio feedback.
 */
export function useGameAudio() {
  const {
    movePlayer: storeMovePlayer,
    placeShape: storePlaceShape,
    undo: storeUndo,
    pause: storePause,
    resume: storeResume,
    isLevelComplete,
    isGameOver,
    matchedGems,
  } = useGameStore();

  // Play gem sound when level completes
  useEffect(() => {
    if (isLevelComplete && matchedGems.length > 0) {
      if (matchedGems.length === 1) {
        playSound('one_gem');
      } else {
        playSound('two_gems');
      }
    }
  }, [isLevelComplete, matchedGems]);

  // Play sound on game over
  useEffect(() => {
    if (isGameOver) {
      playSound('non_movement');
    }
  }, [isGameOver]);

  // Move with sound
  const movePlayer = useCallback(
    (direction: Direction) => {
      const success = storeMovePlayer(direction);
      if (success) {
        playSound('movement');
      } else {
        playSound('non_movement');
      }
      return success;
    },
    [storeMovePlayer]
  );

  // Place with sound
  const placeShape = useCallback(() => {
    const success = storePlaceShape();
    if (success) {
      playSound('movement');
    }
    return success;
  }, [storePlaceShape]);

  // Undo with sound
  const undo = useCallback(() => {
    const success = storeUndo();
    if (success) {
      playSound('movement');
    } else {
      playSound('non_movement');
    }
    return success;
  }, [storeUndo]);

  // Pause with music pause
  const pause = useCallback(() => {
    storePause();
    pauseMusic();
  }, [storePause]);

  // Resume with music resume
  const resume = useCallback(() => {
    storeResume();
    resumeMusic();
  }, [storeResume]);

  return {
    movePlayer,
    placeShape,
    undo,
    pause,
    resume,
    // Music controls
    playMusic,
    stopMusic,
  };
}

export default useGameAudio;
