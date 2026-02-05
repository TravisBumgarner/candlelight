/**
 * GameInfoPanel - Displays target gem and score info.
 */

import React, { ReactNode } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { GAME_COLORS, FONT_SIZES, SPACING } from '@/constants/theme';
import type { GameMode } from '../types';

interface GameInfoPanelProps {
  mode: GameMode;
  level?: number;
  worldNumber?: number;
  levelNumber?: number;
  score?: number;
  bestScore?: number | null;
  children?: ReactNode; // For target gem
}

export function GameInfoPanel({
  mode,
  level,
  worldNumber,
  levelNumber,
  score,
  bestScore,
  children,
}: GameInfoPanelProps) {
  const renderScoreInfo = () => {
    switch (mode) {
      case 'tutorial':
        return null;

      case 'freeplay':
        return <Text style={styles.text}>Level {level}</Text>;

      case 'daily':
        return (
          <>
            <Text style={styles.text}>Score: {score}</Text>
            {bestScore !== null && bestScore !== undefined && (
              <Text style={styles.subText}>Best: {bestScore}</Text>
            )}
          </>
        );

      case 'puzzle':
        return (
          <>
            <Text style={styles.text}>{worldNumber}_{levelNumber}</Text>
            <Text style={styles.text}>Score: {score}</Text>
            {bestScore !== null && bestScore !== undefined && bestScore !== -1 && (
              <Text style={styles.subText}>Best: {bestScore}</Text>
            )}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {children}
      <View style={styles.scoreSection}>
        {renderScoreInfo()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.SMALL.INT,
  },
  scoreSection: {
    alignItems: 'flex-start',
  },
  text: {
    fontFamily: 'DepartureMonoRegular',
    fontSize: FONT_SIZES.SMALL.INT,
    color: GAME_COLORS.TEXT_PRIMARY,
  },
  subText: {
    fontFamily: 'DepartureMonoRegular',
    fontSize: FONT_SIZES.SMALL.INT,
    color: GAME_COLORS.TEXT_SECONDARY,
  },
});

export default GameInfoPanel;
