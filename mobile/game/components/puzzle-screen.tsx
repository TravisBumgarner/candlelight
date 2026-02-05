/**
 * PuzzleScreen - Puzzle mode game screen.
 * Fixed queue levels with game over on queue exhaustion.
 */

import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { useGameStore } from '@/stores/game-store';
import { BaseGameScreen } from './base-game-screen';
import { TargetGem } from './target-gem';
import { GameInfoPanel } from './game-info-panel';
import { GAME_COLORS, FONT_SIZES, SPACING, SHARED_STYLES } from '@/constants/theme';
import {
  getLevelData,
  getNextLevel,
  createPuzzleId,
  updateProgressAfterComplete,
} from '../modes/puzzle';
import { loadPuzzleProgress, savePuzzleProgress } from '@/services/storage';

interface PuzzleScreenProps {
  worldNumber: number;
  levelNumber: number;
  onNextLevel: (worldNumber: number, levelNumber: number) => void;
  onExit: () => void;
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
    targetGem,
    alchemizations,
    isLevelComplete,
    isGameOver,
    initGame,
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

  const nextLevel = getNextLevel(worldNumber, levelNumber);

  const infoPanel = (
    <GameInfoPanel
      mode="puzzle"
      worldNumber={worldNumber}
      levelNumber={levelNumber}
      score={alchemizations}
      bestScore={savedBestScore}
    >
      {targetGem.length > 0 && <TargetGem gem={targetGem} cellSize={8} showLabel={false} />}
    </GameInfoPanel>
  );

  const overlay = (
    <>
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
      <GameOverOverlay
        visible={isGameOver}
        onRestart={handleRestart}
        onExit={handleExit}
      />
    </>
  );

  return (
    <BaseGameScreen
      isLoading={isLoading}
      isGameDisabled={isLevelComplete || isGameOver}
      infoPanel={infoPanel}
      overlay={overlay}
      onExit={onExit}
      onRestart={handleRestart}
    />
  );
}

const styles = StyleSheet.create({
  completeOverlay: SHARED_STYLES.completeOverlay,
  completeTitle: {
    ...SHARED_STYLES.titleText,
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
  actionButton: SHARED_STYLES.actionButton,
  actionButtonText: SHARED_STYLES.buttonText,
});

export default PuzzleScreen;
