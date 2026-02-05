/**
 * DailyScreen - Daily mode game screen.
 * Date-seeded daily challenge with best score tracking.
 */

import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { useGameStore } from '@/stores/game-store';
import { BaseGameScreen } from './base-game-screen';
import { TargetGem } from './target-gem';
import { GameInfoPanel } from './game-info-panel';
import { GAME_COLORS, FONT_SIZES, SPACING } from '@/constants/theme';
import {
  getTodayDateKey,
  getTodaySeed,
  getTodayTargetGem,
  isNewBestScore,
} from '../modes/daily';
import { getDailyBestScore, saveDailyScore } from '@/services/storage';

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
    targetGem,
    alchemizations,
    isLevelComplete,
    initGame,
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

  const handleRestart = useCallback(() => {
    initializeGame();
  }, [initializeGame]);

  const handleExit = useCallback(() => {
    reset();
    onExit();
  }, [reset, onExit]);

  const infoPanel = (
    <GameInfoPanel mode="daily" score={alchemizations} bestScore={savedBestScore}>
      {targetGem.length > 0 && <TargetGem gem={targetGem} cellSize={8} showLabel={false} />}
    </GameInfoPanel>
  );

  const overlay = (
    <DailyCompleteOverlay
      visible={isLevelComplete}
      score={alchemizations}
      bestScore={savedBestScore}
      isNewBest={isNewBest}
      onRestart={handleRestart}
      onExit={handleExit}
    />
  );

  return (
    <BaseGameScreen
      isLoading={isLoading}
      isGameDisabled={isLevelComplete}
      infoPanel={infoPanel}
      overlay={overlay}
      onExit={onExit}
    />
  );
}

const styles = StyleSheet.create({
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
