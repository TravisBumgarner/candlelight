/**
 * DailyScreen - Daily mode game screen.
 * Date-seeded daily challenge with best score tracking.
 */

import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Text, Pressable, Modal } from 'react-native';
import { useGameStore } from '@/stores/game-store';
import { useGameGestures } from '@/hooks/use-game-gestures';
import { GameBoard } from './game-board';
import { TargetGem } from './target-gem';
import { QueueDisplay } from './queue-display';
import { GameHUD } from './game-hud';
import { GameControls } from './game-controls';
import { GAME_COLORS, FONT_SIZES, SPACING } from '@/constants/theme';
import {
  getTodayDateKey,
  getTodaySeed,
  getTodayTargetGem,
  isNewBestScore,
} from '../modes/daily';
import { getDailyBestScore, saveDailyScore } from '@/services/storage';
import type { Direction } from '../types';

interface DailyScreenProps {
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
 * Level complete overlay for daily mode.
 */
function DailyCompleteOverlay({
  visible,
  score,
  bestScore,
  isNewBest,
  onRestart,
  onExit,
}: {
  visible: boolean;
  score: number;
  bestScore: number | null;
  isNewBest: boolean;
  onRestart: () => void;
  onExit: () => void;
}) {
  if (!visible) return null;

  return (
    <View style={styles.completeOverlay}>
      <Text style={styles.completeTitle}>DAILY COMPLETE!</Text>
      {isNewBest && <Text style={styles.newBestText}>NEW BEST!</Text>}
      <Text style={styles.scoreText}>Score: {score}</Text>
      {bestScore !== null && (
        <Text style={styles.bestScoreText}>Best: {bestScore}</Text>
      )}
      <View style={styles.buttonRow}>
        <Pressable style={styles.actionButton} onPress={onRestart}>
          <Text style={styles.actionButtonText}>Play Again</Text>
        </Pressable>
        <Pressable style={styles.actionButton} onPress={onExit}>
          <Text style={styles.actionButtonText}>Exit</Text>
        </Pressable>
      </View>
    </View>
  );
}

/**
 * DailyScreen component.
 */
export function DailyScreen({ onExit }: DailyScreenProps) {
  const {
    board,
    player,
    queue,
    targetGem,
    alchemizations,
    bestScore,
    isLevelComplete,
    isPaused,
    getPlayerCells,
    movePlayer,
    rotatePlayer,
    placeShape,
    undo,
    initGame,
    pause,
    resume,
    reset,
  } = useGameStore();

  const [isLoading, setIsLoading] = useState(true);
  const [isNewBest, setIsNewBest] = useState(false);
  const [savedBestScore, setSavedBestScore] = useState<number | null>(null);

  // Initialize daily game
  const initializeGame = useCallback(async () => {
    setIsLoading(true);
    setIsNewBest(false);

    const dateKey = getTodayDateKey();
    const storedBest = await getDailyBestScore(dateKey);
    setSavedBestScore(storedBest);

    const seed = getTodaySeed();
    const gem = getTodayTargetGem();

    initGame('daily', {
      level: 1,
      targetGem: gem,
      seed,
      bestScore: storedBest,
    });

    setIsLoading(false);
  }, [initGame]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Save score on completion
  useEffect(() => {
    if (isLevelComplete) {
      const saveScore = async () => {
        const dateKey = getTodayDateKey();
        const isBetter = isNewBestScore(alchemizations, savedBestScore);
        setIsNewBest(isBetter);

        if (isBetter) {
          await saveDailyScore(dateKey, alchemizations);
          setSavedBestScore(alchemizations);
        }
      };
      saveScore();
    }
  }, [isLevelComplete, alchemizations, savedBestScore]);

  // Action handlers
  const handleMove = useCallback(
    (direction: Direction) => {
      movePlayer(direction);
    },
    [movePlayer]
  );

  const handleRotate = useCallback(() => {
    rotatePlayer();
  }, [rotatePlayer]);

  const handlePlace = useCallback(() => {
    placeShape();
  }, [placeShape]);

  const handleUndo = useCallback(() => {
    undo();
  }, [undo]);

  const handlePause = useCallback(() => {
    pause();
  }, [pause]);

  const handleResume = useCallback(() => {
    resume();
  }, [resume]);

  const handleRestart = useCallback(() => {
    initializeGame();
  }, [initializeGame]);

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
      <GameHUD
        mode="daily"
        score={alchemizations}
        bestScore={savedBestScore}
      />

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

      {/* Daily complete overlay */}
      <DailyCompleteOverlay
        visible={isLevelComplete}
        score={alchemizations}
        bestScore={savedBestScore}
        isNewBest={isNewBest}
        onRestart={handleRestart}
        onExit={handleExit}
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
  completeOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeTitle: {
    fontFamily: 'DepartureMonoRegular',
    fontSize: FONT_SIZES.HUGE.INT,
    color: GAME_COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SMALL.INT,
  },
  newBestText: {
    fontFamily: 'DepartureMonoRegular',
    fontSize: FONT_SIZES.LARGE.INT,
    color: GAME_COLORS.BUTTON_HIGHLIGHT,
    marginBottom: SPACING.MEDIUM.INT,
  },
  scoreText: {
    fontFamily: 'DepartureMonoRegular',
    fontSize: FONT_SIZES.LARGE.INT,
    color: GAME_COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.TINY.INT,
  },
  bestScoreText: {
    fontFamily: 'DepartureMonoRegular',
    fontSize: FONT_SIZES.MEDIUM.INT,
    color: GAME_COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.LARGE.INT,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: SPACING.MEDIUM.INT,
  },
  actionButton: {
    backgroundColor: GAME_COLORS.BUTTON_PRIMARY,
    paddingVertical: SPACING.SMALL.INT,
    paddingHorizontal: SPACING.LARGE.INT,
    borderRadius: 4,
  },
  actionButtonText: {
    fontFamily: 'DepartureMonoRegular',
    fontSize: FONT_SIZES.MEDIUM.INT,
    color: GAME_COLORS.TEXT_PRIMARY,
  },
});

export default DailyScreen;
