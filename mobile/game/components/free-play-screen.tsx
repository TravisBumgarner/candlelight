/**
 * FreePlayScreen - Free Play mode game screen.
 * Infinite play mode with level progression and auto-save.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, Pressable, Modal } from 'react-native';
import { useGameStore } from '@/stores/game-store';
import { useGameGestures } from '@/hooks/use-game-gestures';
import { playSound } from '@/services/audio';
import { GameBoard } from './game-board';
import { TargetGem } from './target-gem';
import { QueueDisplay } from './queue-display';
import { GameHUD } from './game-hud';
import { GameControls } from './game-controls';
import { GAME_COLORS, FONT_SIZES, SPACING } from '@/constants/theme';
import {
  shouldAutoSave,
  type FreePlaySlot,
  type FreePlaySaveData,
} from '../modes/free-play';
import {
  saveFreePlayGame,
  loadFreePlayGame,
} from '@/services/storage';
import type { Direction } from '../types';

interface FreePlayScreenProps {
  slot: FreePlaySlot;
  onExit: () => void;
}

/**
 * Pause menu overlay.
 */
function PauseMenuOverlay({
  visible,
  onResume,
  onExit,
}: {
  visible: boolean;
  onResume: () => void;
  onExit: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.menuContainer}>
          <Text style={styles.menuTitle}>PAUSED</Text>
          <Pressable style={styles.menuButton} onPress={onResume}>
            <Text style={styles.menuButtonText}>Resume</Text>
          </Pressable>
          <Pressable style={styles.menuButton} onPress={onExit}>
            <Text style={styles.menuButtonText}>Exit</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

/**
 * Level complete overlay.
 */
function LevelCompleteOverlay({
  visible,
  level,
  onContinue,
}: {
  visible: boolean;
  level: number;
  onContinue: () => void;
}) {
  if (!visible) return null;

  return (
    <View style={styles.levelCompleteOverlay}>
      <Text style={styles.levelCompleteText}>Level {level} Complete!</Text>
      <Pressable style={styles.continueButton} onPress={onContinue}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </Pressable>
    </View>
  );
}

/**
 * FreePlayScreen component.
 */
export function FreePlayScreen({ slot, onExit }: FreePlayScreenProps) {
  const {
    board,
    player,
    queue,
    targetGem,
    level,
    alchemizations,
    isLevelComplete,
    isPaused,
    getPlayerCells,
    movePlayer,
    rotatePlayer,
    placeShape,
    undo,
    initGame,
    nextLevel,
    pause,
    resume,
    reset,
  } = useGameStore();

  const [isLoading, setIsLoading] = useState(true);
  const slotRef = useRef(slot);

  // Load or initialize game
  useEffect(() => {
    const loadGame = async () => {
      setIsLoading(true);
      const savedData = await loadFreePlayGame(slot);

      if (savedData) {
        // Load saved game
        initGame('freeplay', {
          level: savedData.level,
          targetGem: savedData.targetGem,
          queue: savedData.queueShapes,
        });
        // The board state needs to be restored separately
        // For now, we start fresh but preserve level
      } else {
        // New game
        initGame('freeplay', { level: 1 });
      }
      setIsLoading(false);
    };

    loadGame();
    slotRef.current = slot;
  }, [slot, initGame]);

  // Play completion sound
  useEffect(() => {
    if (isLevelComplete) {
      playSound('one_gem');
    }
  }, [isLevelComplete]);

  // Auto-save after level complete
  const handleNextLevel = useCallback(async () => {
    const currentLevel = level;
    nextLevel();

    // Auto-save if level > 1
    if (shouldAutoSave(currentLevel) && player?.shapeName) {
      const saveData: FreePlaySaveData = {
        level: currentLevel + 1,
        alchemizations,
        board,
        targetGem,
        currentShapeName: player.shapeName,
        queueShapes: queue?.queue ?? [],
        history: [],
        gameStartTimestamp: Date.now(),
      };
      await saveFreePlayGame(slotRef.current, saveData);
    }
  }, [level, alchemizations, board, targetGem, player, queue, nextLevel]);

  // Action handlers with audio feedback
  const handleMove = useCallback(
    (direction: Direction) => {
      const success = movePlayer(direction);
      playSound(success ? 'movement' : 'non_movement');
    },
    [movePlayer]
  );

  const handleRotate = useCallback(() => {
    const success = rotatePlayer();
    playSound(success ? 'movement' : 'non_movement');
  }, [rotatePlayer]);

  const handlePlace = useCallback(() => {
    const success = placeShape();
    if (success) playSound('movement');
  }, [placeShape]);

  const handleUndo = useCallback(() => {
    const success = undo();
    playSound(success ? 'movement' : 'non_movement');
  }, [undo]);

  const handlePause = useCallback(() => {
    pause();
  }, [pause]);

  const handleResume = useCallback(() => {
    resume();
  }, [resume]);

  const handleExit = useCallback(() => {
    reset();
    onExit();
  }, [reset, onExit]);

  // Gesture handlers
  const gestureHandlers = useGameGestures({
    onMove: handleMove,
    onPlace: handlePlace,
    onRotate: handleRotate,
  });

  const playerCells = getPlayerCells();
  const isInteractionDisabled = isLevelComplete || isPaused;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HUD */}
      <GameHUD mode="freeplay" level={level} score={alchemizations} />

      {/* Main game area */}
      <View style={styles.gameArea}>
        {/* Target gem panel */}
        <View style={styles.sidePanel}>
          <TargetGem gem={targetGem} />
        </View>

        {/* Game board with gesture handling */}
        <View
          style={styles.boardContainer}
          onTouchStart={gestureHandlers.onTouchStart}
          onTouchEnd={gestureHandlers.onTouchEnd}
        >
          <GameBoard
            board={board}
            playerCells={playerCells}
            disabled={isInteractionDisabled}
          />
        </View>

        {/* Queue panel */}
        <View style={styles.sidePanel}>
          {queue && <QueueDisplay queue={queue.queue} />}
        </View>
      </View>

      {/* Controls */}
      <GameControls
        onRotate={handleRotate}
        onUndo={handleUndo}
        onPause={handlePause}
        disabled={isInteractionDisabled}
      />

      {/* Level complete overlay */}
      <LevelCompleteOverlay
        visible={isLevelComplete}
        level={level}
        onContinue={handleNextLevel}
      />

      {/* Pause menu */}
      <PauseMenuOverlay
        visible={isPaused}
        onResume={handleResume}
        onExit={handleExit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1015',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0a1015',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'DepartureMonoRegular',
    fontSize: FONT_SIZES.LARGE.INT,
    color: GAME_COLORS.TEXT_PRIMARY,
  },
  gameArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.SMALL.INT,
  },
  sidePanel: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    backgroundColor: GAME_COLORS.BOARD_BACKGROUND,
    borderWidth: 2,
    borderColor: GAME_COLORS.BOARD_BORDER,
    padding: SPACING.LARGE.INT,
    borderRadius: 8,
    minWidth: 250,
    alignItems: 'center',
  },
  menuTitle: {
    fontFamily: 'DepartureMonoRegular',
    fontSize: FONT_SIZES.LARGE.INT,
    color: GAME_COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.MEDIUM.INT,
    textAlign: 'center',
  },
  menuButton: {
    backgroundColor: GAME_COLORS.BUTTON_PRIMARY,
    paddingVertical: SPACING.SMALL.INT,
    paddingHorizontal: SPACING.LARGE.INT,
    borderRadius: 4,
    marginVertical: SPACING.TINY.INT,
    minWidth: 150,
    alignItems: 'center',
  },
  menuButtonText: {
    fontFamily: 'DepartureMonoRegular',
    fontSize: FONT_SIZES.MEDIUM.INT,
    color: GAME_COLORS.TEXT_PRIMARY,
  },
  levelCompleteOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelCompleteText: {
    fontFamily: 'DepartureMonoRegular',
    fontSize: FONT_SIZES.HUGE.INT,
    color: GAME_COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.LARGE.INT,
  },
  continueButton: {
    backgroundColor: GAME_COLORS.BUTTON_PRIMARY,
    paddingVertical: SPACING.MEDIUM.INT,
    paddingHorizontal: SPACING.XLARGE.INT,
    borderRadius: 4,
  },
  continueButtonText: {
    fontFamily: 'DepartureMonoRegular',
    fontSize: FONT_SIZES.LARGE.INT,
    color: GAME_COLORS.TEXT_PRIMARY,
  },
});

export default FreePlayScreen;
