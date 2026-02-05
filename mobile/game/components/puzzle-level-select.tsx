/**
 * PuzzleLevelSelect - Level selection screen for a specific world.
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaWrapper } from '@/components/safe-area-wrapper';
import { GAME_COLORS, FONT_SIZES, SPACING } from '@/constants/theme';
import {
  getWorldData,
  isLevelUnlocked,
  createPuzzleId,
  type PuzzleProgress,
} from '../modes/puzzle';
import { loadPuzzleProgress } from '@/services/storage';

interface PuzzleLevelSelectProps {
  worldNumber: number;
  onSelectLevel: (levelNumber: number) => void;
  onBack: () => void;
}

/**
 * Level button component.
 */
function LevelButton({
  levelNumber,
  isUnlocked,
  bestScore,
  onPress,
}: {
  levelNumber: number;
  isUnlocked: boolean;
  bestScore: number | null;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.levelButton,
        !isUnlocked && styles.levelButtonLocked,
        pressed && isUnlocked && styles.levelButtonPressed,
      ]}
      onPress={isUnlocked ? onPress : undefined}
      disabled={!isUnlocked}
    >
      <Text style={[styles.levelNumber, !isUnlocked && styles.textLocked]}>
        {levelNumber}
      </Text>
      {bestScore !== null && (
        <Text style={styles.bestScore}>{bestScore}</Text>
      )}
      {!isUnlocked && <Text style={styles.lockedIcon}>🔒</Text>}
    </Pressable>
  );
}

/**
 * PuzzleLevelSelect component.
 */
export function PuzzleLevelSelect({
  worldNumber,
  onSelectLevel,
  onBack,
}: PuzzleLevelSelectProps) {
  const [progress, setProgress] = useState<PuzzleProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const world = getWorldData(worldNumber);

  // Load progress
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const savedProgress = await loadPuzzleProgress();
      setProgress(savedProgress);
      setIsLoading(false);
    };
    load();
  }, []);

  const checkLevelUnlocked = useCallback(
    (levelNumber: number): boolean => {
      if (!progress) return levelNumber === 1 && worldNumber === 1;
      return isLevelUnlocked(
        worldNumber,
        levelNumber,
        progress.maxWorldNumber,
        progress.maxLevelNumber
      );
    },
    [progress, worldNumber]
  );

  const getBestScore = useCallback(
    (levelNumber: number): number | null => {
      if (!progress) return null;
      const puzzleId = createPuzzleId(worldNumber, levelNumber);
      return progress.levelScores[puzzleId] ?? null;
    },
    [progress, worldNumber]
  );

  if (isLoading || !world) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={GAME_COLORS.TEXT_PRIMARY} />
      </View>
    );
  }

  return (
    <SafeAreaWrapper style={styles.container}>
      <Text style={styles.title}>WORLD {worldNumber}</Text>
      <Text style={styles.worldName}>{world.worldName}</Text>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.levelsContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.levelsGrid}>
          {world.levels.map((level) => (
            <LevelButton
              key={level.uniqueId}
              levelNumber={level.levelNumber}
              isUnlocked={checkLevelUnlocked(level.levelNumber)}
              bestScore={getBestScore(level.levelNumber)}
              onPress={() => onSelectLevel(level.levelNumber)}
            />
          ))}
        </View>
      </ScrollView>

      <Pressable style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>Back</Text>
      </Pressable>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1015',
    padding: SPACING.LARGE.INT,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0a1015',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'DepartureMonoRegular',
    fontSize: FONT_SIZES.HUGE.INT,
    color: GAME_COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: SPACING.TINY.INT,
  },
  worldName: {
    fontFamily: 'DepartureMonoRegular',
    fontSize: FONT_SIZES.MEDIUM.INT,
    color: GAME_COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: SPACING.LARGE.INT,
  },
  scrollView: {
    flex: 1,
  },
  levelsContainer: {
    paddingBottom: SPACING.LARGE.INT,
  },
  levelsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.MEDIUM.INT,
  },
  levelButton: {
    width: 70,
    height: 70,
    backgroundColor: GAME_COLORS.BOARD_BACKGROUND,
    borderWidth: 2,
    borderColor: GAME_COLORS.BOARD_BORDER,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelButtonLocked: {
    opacity: 0.5,
  },
  levelButtonPressed: {
    backgroundColor: GAME_COLORS.BUTTON_PRIMARY,
  },
  levelNumber: {
    fontFamily: 'DepartureMonoRegular',
    fontSize: FONT_SIZES.LARGE.INT,
    color: GAME_COLORS.TEXT_PRIMARY,
  },
  bestScore: {
    fontFamily: 'DepartureMonoRegular',
    fontSize: FONT_SIZES.SMALL.INT,
    color: GAME_COLORS.BUTTON_HIGHLIGHT,
    marginTop: 2,
  },
  textLocked: {
    color: GAME_COLORS.TEXT_SECONDARY,
  },
  lockedIcon: {
    fontSize: FONT_SIZES.SMALL.INT,
    position: 'absolute',
    top: 4,
    right: 4,
  },
  backButton: {
    backgroundColor: GAME_COLORS.BUTTON_PRIMARY,
    paddingVertical: SPACING.SMALL.INT,
    paddingHorizontal: SPACING.XLARGE.INT,
    borderRadius: 4,
    alignSelf: 'center',
    marginTop: SPACING.MEDIUM.INT,
  },
  backButtonText: {
    fontFamily: 'DepartureMonoRegular',
    fontSize: FONT_SIZES.MEDIUM.INT,
    color: GAME_COLORS.TEXT_PRIMARY,
  },
});

export default PuzzleLevelSelect;
