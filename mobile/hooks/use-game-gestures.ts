/**
 * Hook for handling game gestures (swipes and taps).
 */

import { useRef, useMemo, useEffect } from 'react';
import { PanResponder, GestureResponderEvent } from 'react-native';
import type { Direction } from '@/game/types';

interface GestureCallbacks {
  onMove: (direction: Direction) => void;
  onPlace: () => void;
}

const TAP_THRESHOLD = 10; // Maximum movement for a tap - anything more is a swipe

/**
 * Hook that provides gesture handlers for game controls.
 * - Swipe: Move in direction
 * - Tap: Place shape
 *
 * Uses refs for callbacks to avoid recreating PanResponder on every render
 * while still having access to the latest callback functions.
 */
export function useGameGestures(callbacks: GestureCallbacks) {
  const startPos = useRef<{ x: number; y: number } | null>(null);
  const callbacksRef = useRef(callbacks);

  // Keep the ref updated with latest callbacks
  useEffect(() => {
    callbacksRef.current = callbacks;
  }, [callbacks]);

  const panResponder = useMemo(() => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: (event: GestureResponderEvent) => {
        const touch = event.nativeEvent;
        startPos.current = { x: touch.pageX, y: touch.pageY };
      },

      onPanResponderRelease: (event: GestureResponderEvent) => {
        if (!startPos.current) {
          return;
        }

        const touch = event.nativeEvent;
        const endPos = { x: touch.pageX, y: touch.pageY };

        const deltaX = endPos.x - startPos.current.x;
        const deltaY = endPos.y - startPos.current.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        // Check if it's a tap (small movement)
        if (distance < TAP_THRESHOLD) {
          callbacksRef.current.onPlace();
        } else {
          // It's a swipe - determine direction based on which axis has more movement
          if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal swipe
            callbacksRef.current.onMove(deltaX > 0 ? 'right' : 'left');
          } else {
            // Vertical swipe
            callbacksRef.current.onMove(deltaY > 0 ? 'down' : 'up');
          }
        }

        startPos.current = null;
      },
    });
  }, []); // Empty deps - PanResponder created once, uses refs for callbacks

  return panResponder.panHandlers;
}

export default useGameGestures;
