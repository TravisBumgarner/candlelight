/**
 * GameHUD component for displaying score and level info.
 */

import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { GAME_COLORS, FONT_SIZES, SPACING } from '@/constants/theme';
import type { GameMode } from '../types';

interface GameHUDProps {
  mode: GameMode;
  level?: number;
  worldNumber?: number;
  levelNumber?: number;
  score: number;
  bestScore?: number | null;
}

/**
 * GameHUD displays mode-specific game information.
 */
export function GameHUD({
  mode,
  level,
  worldNumber,
  levelNumber,
  score,
  bestScore,
}: GameHUDProps) {
  // Tutorial mode has no HUD
  if (mode === 'tutorial') {
    return null;
  }

  const renderContent = () => {
    switch (mode) {
      case 'freeplay':
        return (
          <>
            <Text style={styles.levelText}>Level {level}</Text>
          </>
        );

      case 'daily':
        return (
          <>
            <Text style={styles.scoreText}>Score: {score}</Text>
            {bestScore !== null && bestScore !== undefined && (
              <Text style={styles.bestText}>Best: {bestScore}</Text>
            )}
          </>
        );

      case 'puzzle':
        return (
          <>
            <Text style={styles.levelText}>
              Level {worldNumber}_{levelNumber}
            </Text>
            <Text style={styles.scoreText}>Score: {score}</Text>
            {bestScore !== null && bestScore !== undefined && bestScore !== -1 && (
              <Text style={styles.bestText}>Best: {bestScore}</Text>
            )}
          </>
        );

      default:
        return null;
    }
  };

  return <View style={styles.container}>{renderContent()}</View>;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: SPACING.SMALL.INT,
  },
  levelText: {
    fontFamily: 'DepartureMonoRegular',
    fontSize: FONT_SIZES.MEDIUM.INT,
    color: GAME_COLORS.TEXT_PRIMARY,
    textAlign: 'center',
  },
  scoreText: {
    fontFamily: 'DepartureMonoRegular',
    fontSize: FONT_SIZES.MEDIUM.INT,
    color: GAME_COLORS.TEXT_PRIMARY,
    textAlign: 'center',
  },
  bestText: {
    fontFamily: 'DepartureMonoRegular',
    fontSize: FONT_SIZES.SMALL.INT,
    color: GAME_COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
});

export default GameHUD;
