/**
 * Hook for handling game gestures (swipes and taps).
 */

import { useRef, useCallback } from 'react';
import type { GestureResponderEvent } from 'react-native';
import type { Direction } from '@/game/types';

interface GestureCallbacks {
  onMove: (direction: Direction) => void;
  onPlace: () => void;
  onRotate: () => void;
}

interface GestureHandlers {
  onTouchStart: (event: GestureResponderEvent) => void;
  onTouchEnd: (event: GestureResponderEvent) => void;
}

const SWIPE_THRESHOLD = 30; // Minimum distance for a swipe
const TAP_THRESHOLD = 10; // Maximum movement for a tap

/**
 * Hook that provides gesture handlers for game controls.
 * - Swipe: Move in direction
 * - Tap: Place shape
 * - Double tap could be added for rotate if needed
 */
export function useGameGestures(callbacks: GestureCallbacks): GestureHandlers {
  const startPos = useRef<{ x: number; y: number } | null>(null);
  const startTime = useRef<number>(0);

  const onTouchStart = useCallback((event: GestureResponderEvent) => {
    const touch = event.nativeEvent;
    startPos.current = { x: touch.pageX, y: touch.pageY };
    startTime.current = Date.now();
  }, []);

  const onTouchEnd = useCallback(
    (event: GestureResponderEvent) => {
      if (!startPos.current) return;

      const touch = event.nativeEvent;
      const endPos = { x: touch.pageX, y: touch.pageY };

      const deltaX = endPos.x - startPos.current.x;
      const deltaY = endPos.y - startPos.current.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // Check if it's a tap (small movement)
      if (distance < TAP_THRESHOLD) {
        callbacks.onPlace();
        startPos.current = null;
        return;
      }

      // Check if it's a swipe (larger movement)
      if (distance >= SWIPE_THRESHOLD) {
        // Determine direction based on which axis has more movement
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          // Horizontal swipe
          callbacks.onMove(deltaX > 0 ? 'right' : 'left');
        } else {
          // Vertical swipe
          callbacks.onMove(deltaY > 0 ? 'down' : 'up');
        }
      }

      startPos.current = null;
    },
    [callbacks]
  );

  return {
    onTouchStart,
    onTouchEnd,
  };
}

export default useGameGestures;
