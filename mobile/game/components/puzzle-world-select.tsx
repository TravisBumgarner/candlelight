/**
 * PuzzleWorldSelect - World selection screen for Puzzle mode.
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  ScrollView,
} from 'react-native';
import { SafeAreaWrapper } from '@/components/safe-area-wrapper';
import { LoadingScreen } from '@/components/loading-screen';
import { GAME_COLORS, FONT_SIZES, SPACING, SHARED_STYLES } from '@/constants/theme';
import { getWorldsMetadata, type PuzzleProgress } from '../modes/puzzle';
import { loadPuzzleProgress } from '@/services/storage';

interface PuzzleWorldSelectProps {
  onSelectWorld: (worldNumber: number) => void;
  onBack: () => void;
}

/**
 * World button component.
 */
function WorldButton({
  worldNumber,
  worldName,
  levelCount,
  isUnlocked,
  completedLevels,
  onPress,
}: {
  worldNumber: number;
  worldName: string;
  levelCount: number;
  isUnlocked: boolean;
  completedLevels: number;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.worldButton,
        !isUnlocked && styles.worldButtonLocked,
        pressed && isUnlocked && styles.worldButtonPressed,
      ]}
      onPress={isUnlocked ? onPress : undefined}
      disabled={!isUnlocked}
    >
      <View style={styles.worldHeader}>
        <Text style={styles.worldNumber}>World {worldNumber}</Text>
        {!isUnlocked && <Text style={styles.lockedIcon}>🔒</Text>}
      </View>
      <Text style={[styles.worldName, !isUnlocked && styles.textLocked]}>
        {worldName}
      </Text>
      <Text style={[styles.levelProgress, !isUnlocked && styles.textLocked]}>
        {completedLevels} / {levelCount} levels
      </Text>
    </Pressable>
  );
}

/**
 * PuzzleWorldSelect component.
 */
export function PuzzleWorldSelect({ onSelectWorld, onBack }: PuzzleWorldSelectProps) {
  const [progress, setProgress] = useState<PuzzleProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const worlds = getWorldsMetadata();

  const getCompletedLevels = useCallback(
    (worldNumber: number, levelCount: number): number => {
      if (!progress) return 0;
      let count = 0;
      for (let i = 1; i <= levelCount; i++) {
        const puzzleId = `${worldNumber}_${i}`;
        if (progress.levelScores[puzzleId] !== undefined) {
          count++;
        }
      }
      return count;
    },
    [progress]
  );

  const isWorldUnlocked = useCallback(
    (worldNumber: number): boolean => {
      if (!progress) return worldNumber === 1;
      return worldNumber <= progress.maxWorldNumber;
    },
    [progress]
  );

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaWrapper style={styles.container}>
      <Text style={styles.title}>PUZZLE MODE</Text>
      <Text style={styles.subtitle}>Select a world</Text>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.worldsContainer}
        showsVerticalScrollIndicator={false}
      >
        {worlds.map((world) => (
          <WorldButton
            key={world.worldNumber}
            worldNumber={world.worldNumber}
            worldName={world.worldName}
            levelCount={world.levelCount}
            isUnlocked={isWorldUnlocked(world.worldNumber)}
            completedLevels={getCompletedLevels(world.worldNumber, world.levelCount)}
            onPress={() => onSelectWorld(world.worldNumber)}
          />
        ))}
      </ScrollView>

      <Pressable style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>Back</Text>
      </Pressable>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    ...SHARED_STYLES.screenContainer,
  },
  title: {
    ...SHARED_STYLES.titleText,
    marginBottom: SPACING.SMALL.INT,
  },
  subtitle: {
    fontFamily: 'DepartureMonoRegular',
    fontSize: FONT_SIZES.MEDIUM.INT,
    color: GAME_COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: SPACING.MEDIUM.INT,
  },
  scrollView: {
    flex: 1,
  },
  worldsContainer: {
    gap: SPACING.MEDIUM.INT,
    paddingBottom: SPACING.LARGE.INT,
  },
  worldButton: {
    backgroundColor: GAME_COLORS.BOARD_BACKGROUND,
    borderWidth: 2,
    borderColor: GAME_COLORS.BOARD_BORDER,
    padding: SPACING.MEDIUM.INT,
    borderRadius: 8,
  },
  worldButtonLocked: {
    opacity: 0.5,
  },
  worldButtonPressed: {
    backgroundColor: GAME_COLORS.BUTTON_PRIMARY,
  },
  worldHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  worldNumber: {
    fontFamily: 'DepartureMonoRegular',
    fontSize: FONT_SIZES.LARGE.INT,
    color: GAME_COLORS.TEXT_PRIMARY,
  },
  lockedIcon: {
    fontSize: FONT_SIZES.MEDIUM.INT,
  },
  worldName: {
    fontFamily: 'DepartureMonoRegular',
    fontSize: FONT_SIZES.MEDIUM.INT,
    color: GAME_COLORS.TEXT_SECONDARY,
    marginTop: SPACING.TINY.INT,
  },
  levelProgress: {
    fontFamily: 'DepartureMonoRegular',
    fontSize: FONT_SIZES.SMALL.INT,
    color: GAME_COLORS.TEXT_SECONDARY,
    marginTop: SPACING.TINY.INT,
  },
  textLocked: {
    color: GAME_COLORS.TEXT_SECONDARY,
  },
  backButton: {
    ...SHARED_STYLES.backButton,
    marginTop: SPACING.MEDIUM.INT,
  },
  backButtonText: SHARED_STYLES.buttonText,
});

export default PuzzleWorldSelect;
