/**
 * GameScreen - Main game container component.
 * Integrates all game components and manages the game loop.
 */

import React, { useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  Modal,
} from 'react-native';
import { useGameStore } from '@/stores/game-store';
import { useGameGestures } from '@/hooks/use-game-gestures';
import { GameBoard } from './game-board';
import { TargetGem } from './target-gem';
import { QueueDisplay } from './queue-display';
import { GameHUD } from './game-hud';
import { GameControls } from './game-controls';
import { GAME_COLORS, FONT_SIZES, SPACING } from '@/constants/theme';
import type { Direction, GameMode } from '../types';

interface GameScreenProps {
  onExit: () => void;
}

/**
 * Pause menu overlay.
 */
function PauseMenu({
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
  score,
  onNextLevel,
  onRestart,
  onExit,
  showNextLevel = true,
}: {
  visible: boolean;
  score: number;
  onNextLevel: () => void;
  onRestart: () => void;
  onExit: () => void;
  showNextLevel?: boolean;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.menuContainer}>
          <Text style={styles.menuTitle}>LEVEL COMPLETE!</Text>
          <Text style={styles.scoreDisplay}>Score: {score}</Text>
          {showNextLevel && (
            <Pressable style={styles.menuButton} onPress={onNextLevel}>
              <Text style={styles.menuButtonText}>Next Level</Text>
            </Pressable>
          )}
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
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.menuContainer}>
          <Text style={styles.menuTitle}>GAME OVER</Text>
          <Text style={styles.gameOverText}>Out of pieces!</Text>
          <Pressable style={styles.menuButton} onPress={onRestart}>
            <Text style={styles.menuButtonText}>Try Again</Text>
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
 * Main GameScreen component.
 */
export function GameScreen({ onExit }: GameScreenProps) {
  const {
    mode,
    board,
    player,
    queue,
    targetGem,
    level,
    worldNumber,
    alchemizations,
    bestScore,
    isPaused,
    isInteractionDisabled,
    isLevelComplete,
    isGameOver,
    getPlayerCells,
    movePlayer,
    rotatePlayer,
    placeShape,
    undo,
    pause,
    resume,
    nextLevel,
    restartLevel,
    reset,
  } = useGameStore();

  // Handle exit
  const handleExit = useCallback(() => {
    reset();
    onExit();
  }, [reset, onExit]);

  // Gesture handlers
  const gestureCallbacks = {
    onMove: (direction: Direction) => {
      movePlayer(direction);
    },
    onPlace: () => {
      placeShape();
    },
    onRotate: () => {
      rotatePlayer();
    },
  };

  const gestureHandlers = useGameGestures(gestureCallbacks);

  // Get player overlay cells
  const playerCells = getPlayerCells();

  // Don't render if no mode set
  if (!mode) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No game mode selected</Text>
      </View>
    );
  }

  const showTargetGem = mode !== 'tutorial' || level >= 5;
  const showQueue = mode !== 'tutorial' || level >= 6;

  return (
    <View style={styles.container}>
      {/* HUD */}
      <GameHUD
        mode={mode}
        level={level}
        worldNumber={worldNumber}
        levelNumber={level}
        score={alchemizations}
        bestScore={bestScore}
      />

      {/* Main game area */}
      <View style={styles.gameArea}>
        {/* Side panels */}
        <View style={styles.sidePanel}>
          {showTargetGem && <TargetGem gem={targetGem} />}
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
          {showQueue && queue && <QueueDisplay queue={queue.queue} />}
        </View>
      </View>

      {/* Controls */}
      <GameControls
        onRotate={rotatePlayer}
        onUndo={undo}
        onPause={pause}
        disabled={isInteractionDisabled}
      />

      {/* Pause Menu */}
      <PauseMenu
        visible={isPaused}
        onResume={resume}
        onRestart={() => {
          resume();
          restartLevel();
        }}
        onExit={handleExit}
      />

      {/* Level Complete */}
      <LevelCompleteOverlay
        visible={isLevelComplete}
        score={alchemizations}
        onNextLevel={nextLevel}
        onRestart={restartLevel}
        onExit={handleExit}
        showNextLevel={mode === 'freeplay'}
      />

      {/* Game Over */}
      <GameOverOverlay
        visible={isGameOver}
        onRestart={restartLevel}
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
  errorText: {
    fontFamily: 'DepartureMonoRegular',
    fontSize: FONT_SIZES.MEDIUM.INT,
    color: GAME_COLORS.TEXT_PRIMARY,
    textAlign: 'center',
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
    minWidth: 200,
    alignItems: 'center',
  },
  menuTitle: {
    fontFamily: 'DepartureMonoRegular',
    fontSize: FONT_SIZES.LARGE.INT,
    color: GAME_COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.MEDIUM.INT,
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
  scoreDisplay: {
    fontFamily: 'DepartureMonoRegular',
    fontSize: FONT_SIZES.MEDIUM.INT,
    color: GAME_COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.MEDIUM.INT,
  },
  gameOverText: {
    fontFamily: 'DepartureMonoRegular',
    fontSize: FONT_SIZES.MEDIUM.INT,
    color: GAME_COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.MEDIUM.INT,
  },
});

export default GameScreen;
