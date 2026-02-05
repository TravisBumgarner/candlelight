/**
 * FreePlayScreen - Free Play mode game screen.
 * Infinite play mode with level progression and auto-save.
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { PauseMenu } from './pause-menu';
import { SafeAreaWrapper } from '@/components/safe-area-wrapper';
import SettingsScreen from '@/components/settings-screen';
import { GAME_COLORS, FONT_SIZES, SPACING } from '@/constants/theme';
import {
  shouldAutoSave,
  type FreePlaySlot,
  type FreePlaySaveData,
} from '../modes/free-play';
import {
  saveFreePlayGame,
  loadFreePlayGame,
  loadSettings,
} from '@/services/storage';
import type { Direction } from '../types';

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
    isPaused,
    movePlayer,
    rotatePlayer,
    placeShape,
    undo,
    initGame,
    nextLevel,
    pause,
    resume,
    reset,
  } = useGameStore();

  const [isLoading, setIsLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [leftHanded, setLeftHanded] = useState(false);
  const slotRef = useRef(slot);

  // Load or initialize game
  useEffect(() => {
    const loadGame = async () => {
      setIsLoading(true);

      // Load settings
      const settings = await loadSettings();
      setLeftHanded(settings.leftHanded);

      const savedData = await loadFreePlayGame(slot);

      if (savedData) {
        // Load saved game
        initGame('freeplay', {
          level: savedData.level,
          targetGem: savedData.targetGem,
          queue: savedData.queueShapes,
        });
        // The board state needs to be restored separately
        // For now, we start fresh but preserve level
      } else {
        // New game
        initGame('freeplay', { level: 1 });
      }
      setIsLoading(false);
    };

    loadGame();
    slotRef.current = slot;
  }, [slot, initGame]);

  // Play completion sound
  useEffect(() => {
    if (isLevelComplete) {
      playSound('one_gem');
    }
  }, [isLevelComplete]);

  // Auto-save after level complete
  const handleNextLevel = useCallback(async () => {
    const currentLevel = level;
    nextLevel();

    // Auto-save if level > 1
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

  // Action handlers with audio feedback
  const handleMove = useCallback(
    (direction: Direction) => {
      const success = movePlayer(direction);
      playSound(success ? 'movement' : 'non_movement');
    },
    [movePlayer]
  );

  const handlePlace = useCallback(() => {
    const success = placeShape();
    if (success) playSound('movement');
  }, [placeShape]);

  const handleRotate = useCallback(() => {
    const success = rotatePlayer();
    playSound(success ? 'movement' : 'non_movement');
  }, [rotatePlayer]);

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

  const handleExit = useCallback(() => {
    reset();
    onExit();
  }, [reset, onExit]);

  // Compute player cells from destructured state to ensure React tracks dependencies
  const playerCells = useMemo(() => {
    if (!player) return [];
    return getPlayerOverlay(player, board);
  }, [player, board]);

  const isInteractionDisabled = isLevelComplete || isPaused;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
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
        <GameInfoPanel mode="freeplay" level={level}>
          {targetGem.length > 0 && <TargetGem gem={targetGem} cellSize={8} showLabel={false} />}
        </GameInfoPanel>
      </GameControlsPad>

      {/* Level complete overlay */}
      <LevelCompleteOverlay
        visible={isLevelComplete}
        level={level}
        onContinue={handleNextLevel}
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
  container: {
    flex: 1,
    backgroundColor: '#0a1015',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0a1015',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'DepartureMonoRegular',
    fontSize: FONT_SIZES.LARGE.INT,
    color: GAME_COLORS.TEXT_PRIMARY,
  },
  boardContainer: {
    marginVertical: SPACING.MEDIUM.INT,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
