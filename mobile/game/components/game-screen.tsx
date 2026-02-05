/**
 * GameScreen - Main game container component.
 * Integrates all game components and manages the game loop.
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  Modal,
} from 'react-native';
import { useGameStore } from '@/stores/game-store';
import { getPlayerOverlay } from '../engine';
import { GameBoard } from './game-board';
import { TargetGem } from './target-gem';
import { HorizontalQueueDisplay } from './queue-display';
import { GameHUD } from './game-hud';
import { GameInfoPanel } from './game-info-panel';
import { GameControlsPad } from './game-controls-pad';
import { SafeAreaWrapper } from '@/components/safe-area-wrapper';
import SettingsScreen from '@/components/settings-screen';
import { PauseMenu } from './pause-menu';
import { GAME_COLORS, FONT_SIZES, SPACING } from '@/constants/theme';
import { loadSettings } from '@/services/storage';
import type { Direction, GameMode } from '../types';

interface GameScreenProps {
  onExit: () => void;
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

  const [showSettings, setShowSettings] = useState(false);
  const [leftHanded, setLeftHanded] = useState(false);

  // Load settings on mount
  useEffect(() => {
    const init = async () => {
      const settings = await loadSettings();
      setLeftHanded(settings.leftHanded);
    };
    init();
  }, []);

  // Handle exit
  const handleExit = useCallback(() => {
    reset();
    onExit();
  }, [reset, onExit]);

  const handleOpenSettings = useCallback(() => {
    setShowSettings(true);
  }, []);

  const handleCloseSettings = useCallback(async () => {
    setShowSettings(false);
    // Reload settings in case handedness changed
    const settings = await loadSettings();
    setLeftHanded(settings.leftHanded);
  }, []);

  // Compute player cells from destructured state to ensure React tracks dependencies
  const playerCells = useMemo(() => {
    if (!player) return [];
    return getPlayerOverlay(player, board);
  }, [player, board]);

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
    <SafeAreaWrapper>
      {/* Menu button */}
      <GameHUD onMenu={pause} />

      {/* Queue */}
      {showQueue && queue && <HorizontalQueueDisplay queue={queue.queue} />}

      {/* Game board */}
      <View style={styles.boardContainer}>
        <GameBoard
          board={board}
          playerCells={playerCells}
          disabled={isInteractionDisabled}
        />
      </View>

      {/* Controls with info panel */}
      <GameControlsPad
        onMove={(direction) => movePlayer(direction)}
        onRotate={() => rotatePlayer()}
        onPlace={() => placeShape()}
        onUndo={undo}
        disabled={isInteractionDisabled}
        leftHanded={leftHanded}
      >
        <GameInfoPanel
          mode={mode}
          level={level}
          worldNumber={worldNumber}
          levelNumber={level}
          score={alchemizations}
          bestScore={bestScore}
        >
          {showTargetGem && <TargetGem gem={targetGem} cellSize={8} showLabel={false} />}
        </GameInfoPanel>
      </GameControlsPad>

      {/* Pause Menu */}
      <PauseMenu
        visible={isPaused && !showSettings}
        onResume={resume}
        onRestart={() => {
          resume();
          restartLevel();
        }}
        onSettings={handleOpenSettings}
        onExit={handleExit}
      />

      {/* Settings modal */}
      <Modal visible={showSettings} animationType="slide">
        <SettingsScreen onBack={handleCloseSettings} />
      </Modal>

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
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1015',
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
