/**
 * PuzzleScreen - Puzzle mode game screen.
 * Fixed queue levels with game over on queue exhaustion.
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
  getLevelData,
  getNextLevel,
  createPuzzleId,
  updateProgressAfterComplete,
} from '../modes/puzzle';
import { loadPuzzleProgress, savePuzzleProgress } from '@/services/storage';
import type { Direction } from '../types';

interface PuzzleScreenProps {
  worldNumber: number;
  levelNumber: number;
  onNextLevel: (worldNumber: number, levelNumber: number) => void;
  onExit: () => void;
}

/**
 * Pause menu overlay.
 */
function PauseMenuOverlay({
  visible,
  onResume,
  onRestart,
  onExit,
}: {
  visible: boolean;
  onResume: () => void;
  onRestart: () => void;
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
          <Pressable style={styles.menuButton} onPress={onRestart}>
            <Text style={styles.menuButtonText}>Restart</Text>
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
  worldNumber,
  levelNumber,
  score,
  bestScore,
  isNewBest,
  hasNextLevel,
  onNextLevel,
  onRestart,
  onExit,
}: {
  visible: boolean;
  worldNumber: number;
  levelNumber: number;
  score: number;
  bestScore: number | null;
  isNewBest: boolean;
  hasNextLevel: boolean;
  onNextLevel: () => void;
  onRestart: () => void;
  onExit: () => void;
}) {
  if (!visible) return null;

  return (
    <View style={styles.completeOverlay}>
      <Text style={styles.completeTitle}>LEVEL COMPLETE!</Text>
      <Text style={styles.levelText}>
        {worldNumber}_{levelNumber}
      </Text>
      {isNewBest && <Text style={styles.newBestText}>NEW BEST!</Text>}
      <Text style={styles.scoreText}>Score: {score}</Text>
      {bestScore !== null && (
        <Text style={styles.bestScoreText}>Best: {bestScore}</Text>
      )}
      <View style={styles.buttonColumn}>
        {hasNextLevel && (
          <Pressable style={styles.actionButton} onPress={onNextLevel}>
            <Text style={styles.actionButtonText}>Next Level</Text>
          </Pressable>
        )}
        <Pressable style={styles.actionButton} onPress={onRestart}>
          <Text style={styles.actionButtonText}>Restart</Text>
        </Pressable>
        <Pressable style={styles.actionButton} onPress={onExit}>
          <Text style={styles.actionButtonText}>Exit</Text>
        </Pressable>
      </View>
    </View>
  );
}

/**
 * Game over overlay.
 */
function GameOverOverlay({
  visible,
  onRestart,
  onExit,
}: {
  visible: boolean;
  onRestart: () => void;
  onExit: () => void;
}) {
  if (!visible) return null;

  return (
    <View style={styles.completeOverlay}>
      <Text style={styles.gameOverTitle}>OUT OF SHAPES!</Text>
      <Text style={styles.gameOverText}>Try again</Text>
      <View style={styles.buttonColumn}>
        <Pressable style={styles.actionButton} onPress={onRestart}>
          <Text style={styles.actionButtonText}>Restart</Text>
        </Pressable>
        <Pressable style={styles.actionButton} onPress={onExit}>
          <Text style={styles.actionButtonText}>Exit</Text>
        </Pressable>
      </View>
    </View>
  );
}

/**
 * PuzzleScreen component.
 */
export function PuzzleScreen({
  worldNumber,
  levelNumber,
  onNextLevel,
  onExit,
}: PuzzleScreenProps) {
  const {
    board,
    player,
    queue,
    targetGem,
    alchemizations,
    bestScore,
    isLevelComplete,
    isGameOver,
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

  // Initialize puzzle level
  const initializeLevel = useCallback(async () => {
    setIsLoading(true);
    setIsNewBest(false);

    const levelData = getLevelData(worldNumber, levelNumber);
    if (!levelData) {
      setIsLoading(false);
      return;
    }

    // Load existing progress to get best score
    const progress = await loadPuzzleProgress();
    const puzzleId = createPuzzleId(worldNumber, levelNumber);
    const existingBest = progress.levelScores[puzzleId] ?? null;
    setSavedBestScore(existingBest);

    initGame('puzzle', {
      level: levelNumber,
      worldNumber,
      targetGem: levelData.targetGem,
      queue: levelData.queue,
      bestScore: existingBest,
    });

    setIsLoading(false);
  }, [worldNumber, levelNumber, initGame]);

  useEffect(() => {
    initializeLevel();
  }, [initializeLevel]);

  // Save progress on level complete
  useEffect(() => {
    if (isLevelComplete) {
      const saveProgress = async () => {
        const progress = await loadPuzzleProgress();
        const isBetter = savedBestScore === null || alchemizations < savedBestScore;
        setIsNewBest(isBetter);

        const updatedProgress = updateProgressAfterComplete(
          progress,
          worldNumber,
          levelNumber,
          alchemizations
        );
        await savePuzzleProgress(updatedProgress);

        if (isBetter) {
          setSavedBestScore(alchemizations);
        }
      };
      saveProgress();
    }
  }, [isLevelComplete, alchemizations, worldNumber, levelNumber, savedBestScore]);

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
    resume();
    initializeLevel();
  }, [resume, initializeLevel]);

  const handleNextLevel = useCallback(() => {
    const next = getNextLevel(worldNumber, levelNumber);
    if (next) {
      onNextLevel(next.worldNumber, next.levelNumber);
    }
  }, [worldNumber, levelNumber, onNextLevel]);

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
  const isInteractionDisabled = isLevelComplete || isGameOver || isPaused;
  const nextLevel = getNextLevel(worldNumber, levelNumber);

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
        mode="puzzle"
        worldNumber={worldNumber}
        levelNumber={levelNumber}
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

      {/* Level complete overlay */}
      <LevelCompleteOverlay
        visible={isLevelComplete}
        worldNumber={worldNumber}
        levelNumber={levelNumber}
        score={alchemizations}
        bestScore={savedBestScore}
        isNewBest={isNewBest}
        hasNextLevel={nextLevel !== null}
        onNextLevel={handleNextLevel}
        onRestart={handleRestart}
        onExit={handleExit}
      />

      {/* Game over overlay */}
      <GameOverOverlay
        visible={isGameOver}
        onRestart={handleRestart}
        onExit={handleExit}
      />

      {/* Pause menu */}
      <PauseMenuOverlay
        visible={isPaused}
        onResume={handleResume}
        onRestart={handleRestart}
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
  levelText: {
    fontFamily: 'DepartureMonoRegular',
    fontSize: FONT_SIZES.LARGE.INT,
    color: GAME_COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.SMALL.INT,
  },
  newBestText: {
    fontFamily: 'DepartureMonoRegular',
    fontSize: FONT_SIZES.LARGE.INT,
    color: GAME_COLORS.BUTTON_HIGHLIGHT,
    marginBottom: SPACING.SMALL.INT,
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
  gameOverTitle: {
    fontFamily: 'DepartureMonoRegular',
    fontSize: FONT_SIZES.HUGE.INT,
    color: '#ff6b6b',
    marginBottom: SPACING.SMALL.INT,
  },
  gameOverText: {
    fontFamily: 'DepartureMonoRegular',
    fontSize: FONT_SIZES.MEDIUM.INT,
    color: GAME_COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.LARGE.INT,
  },
  buttonColumn: {
    gap: SPACING.SMALL.INT,
  },
  actionButton: {
    backgroundColor: GAME_COLORS.BUTTON_PRIMARY,
    paddingVertical: SPACING.SMALL.INT,
    paddingHorizontal: SPACING.XLARGE.INT,
    borderRadius: 4,
    minWidth: 150,
    alignItems: 'center',
  },
  actionButtonText: {
    fontFamily: 'DepartureMonoRegular',
    fontSize: FONT_SIZES.MEDIUM.INT,
    color: GAME_COLORS.TEXT_PRIMARY,
  },
});

export default PuzzleScreen;
