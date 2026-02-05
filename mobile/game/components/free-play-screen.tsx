/**
 * FreePlayScreen - Free Play mode game screen.
 * Infinite play mode with level progression and auto-save.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { useGameStore } from '@/stores/game-store';
import { BaseGameScreen } from './base-game-screen';
import { TargetGem } from './target-gem';
import { GameInfoPanel } from './game-info-panel';
import { GAME_COLORS, FONT_SIZES, SPACING } from '@/constants/theme';
import {
  shouldAutoSave,
  type FreePlaySlot,
  type FreePlaySaveData,
} from '../modes/free-play';
import { saveFreePlayGame, loadFreePlayGame } from '@/services/storage';

interface FreePlayScreenProps {
  slot: FreePlaySlot;
  onExit: () => void;
}

/**
 * Level complete overlay.
 */
function LevelCompleteOverlay({
  visible,
  level,
  onContinue,
}: {
  visible: boolean;
  level: number;
  onContinue: () => void;
}) {
  if (!visible) return null;

  return (
    <View style={styles.levelCompleteOverlay}>
      <Text style={styles.levelCompleteText}>Level {level} Complete!</Text>
      <Pressable style={styles.continueButton} onPress={onContinue}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </Pressable>
    </View>
  );
}

/**
 * FreePlayScreen component.
 */
export function FreePlayScreen({ slot, onExit }: FreePlayScreenProps) {
  const {
    board,
    player,
    queue,
    targetGem,
    level,
    alchemizations,
    isLevelComplete,
    initGame,
    nextLevel,
  } = useGameStore();

  const [isLoading, setIsLoading] = useState(true);
  const slotRef = useRef(slot);

  // Load or initialize game
  useEffect(() => {
    const loadGame = async () => {
      setIsLoading(true);

      const savedData = await loadFreePlayGame(slot);

      if (savedData) {
        initGame('freeplay', {
          level: savedData.level,
          targetGem: savedData.targetGem,
          queue: savedData.queueShapes,
        });
      } else {
        initGame('freeplay', { level: 1 });
      }
      setIsLoading(false);
    };

    loadGame();
    slotRef.current = slot;
  }, [slot, initGame]);

  // Auto-save after level complete
  const handleNextLevel = useCallback(async () => {
    const currentLevel = level;
    nextLevel();

    if (shouldAutoSave(currentLevel) && player?.shapeName) {
      const saveData: FreePlaySaveData = {
        level: currentLevel + 1,
        alchemizations,
        board,
        targetGem,
        currentShapeName: player.shapeName,
        queueShapes: queue?.queue ?? [],
        history: [],
        gameStartTimestamp: Date.now(),
      };
      await saveFreePlayGame(slotRef.current, saveData);
    }
  }, [level, alchemizations, board, targetGem, player, queue, nextLevel]);

  const infoPanel = (
    <GameInfoPanel mode="freeplay" level={level}>
      {targetGem.length > 0 && <TargetGem gem={targetGem} cellSize={8} showLabel={false} />}
    </GameInfoPanel>
  );

  const overlay = (
    <LevelCompleteOverlay
      visible={isLevelComplete}
      level={level}
      onContinue={handleNextLevel}
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
  levelCompleteOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelCompleteText: {
    fontFamily: 'DepartureMonoRegular',
    fontSize: FONT_SIZES.HUGE.INT,
    color: GAME_COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.LARGE.INT,
  },
  continueButton: {
    backgroundColor: GAME_COLORS.BUTTON_PRIMARY,
    paddingVertical: SPACING.MEDIUM.INT,
    paddingHorizontal: SPACING.XLARGE.INT,
    borderRadius: 4,
  },
  continueButtonText: {
    fontFamily: 'DepartureMonoRegular',
    fontSize: FONT_SIZES.LARGE.INT,
    color: GAME_COLORS.TEXT_PRIMARY,
  },
});

export default FreePlayScreen;
