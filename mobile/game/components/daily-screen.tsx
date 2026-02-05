/**
 * DailyScreen - Daily mode game screen.
 * Date-seeded daily challenge with best score tracking.
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, Text, Pressable, Modal } from 'react-native';
import { useGameStore } from '@/stores/game-store';
import { playSound } from '@/services/audio';
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
import {
  getTodayDateKey,
  getTodaySeed,
  getTodayTargetGem,
  isNewBestScore,
} from '../modes/daily';
import { getDailyBestScore, saveDailyScore, loadSettings } from '@/services/storage';
import type { Direction } from '../types';

interface DailyScreenProps {
  onExit: () => void;
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
  const [showSettings, setShowSettings] = useState(false);
  const [leftHanded, setLeftHanded] = useState(false);

  // Initialize daily game
  const initializeGame = useCallback(async () => {
    setIsLoading(true);
    setIsNewBest(false);

    // Load settings
    const settings = await loadSettings();
    setLeftHanded(settings.leftHanded);

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

  // Play completion sound
  useEffect(() => {
    if (isLevelComplete) {
      playSound('one_gem');
    }
  }, [isLevelComplete]);

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

  const handleOpenSettings = useCallback(() => {
    setShowSettings(true);
  }, []);

  const handleCloseSettings = useCallback(async () => {
    setShowSettings(false);
    // Reload settings in case handedness changed
    const settings = await loadSettings();
    setLeftHanded(settings.leftHanded);
  }, []);

  const handleRestart = useCallback(() => {
    initializeGame();
  }, [initializeGame]);

  const handleExit = useCallback(() => {
    reset();
    onExit();
  }, [reset, onExit]);

  // Compute player cells from destructured state
  const playerCells = useMemo(() => {
    if (!player) return [];
    return getPlayerOverlay(player, board);
  }, [player, board]);

  const isInteractionDisabled = isLevelComplete || isPaused;

  if (isLoading) {
    return (
      <SafeAreaWrapper>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper>
      {/* Menu button */}
      <GameHUD onMenu={handlePause} />

      {/* Queue */}
      {queue && <HorizontalQueueDisplay queue={queue.queue} />}

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
        onMove={handleMove}
        onRotate={handleRotate}
        onPlace={handlePlace}
        onUndo={handleUndo}
        disabled={isInteractionDisabled}
        leftHanded={leftHanded}
      >
        <GameInfoPanel mode="daily" score={alchemizations} bestScore={savedBestScore}>
          {targetGem.length > 0 && <TargetGem gem={targetGem} cellSize={8} showLabel={false} />}
        </GameInfoPanel>
      </GameControlsPad>

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
      <PauseMenu
        visible={isPaused && !showSettings}
        onResume={handleResume}
        onSettings={handleOpenSettings}
        onExit={handleExit}
      />

      {/* Settings modal */}
      <Modal visible={showSettings} animationType="slide">
        <SettingsScreen onBack={handleCloseSettings} />
      </Modal>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'DepartureMonoRegular',
    fontSize: FONT_SIZES.LARGE.INT,
    color: GAME_COLORS.TEXT_PRIMARY,
  },
  boardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
