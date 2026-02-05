/**
 * BaseGameScreen - Shared game screen layout and behavior.
 * Eliminates duplication across Daily, FreePlay, Puzzle, and Tutorial screens.
 */

import React, { ReactNode, useMemo, useEffect } from 'react';
import { View, StyleSheet, Text, Modal } from 'react-native';
import { useGameStore } from '@/stores/game-store';
import { playSound } from '@/services/audio';
import { getPlayerOverlay } from '../engine';
import { GameBoard } from './game-board';
import { HorizontalQueueDisplay } from './queue-display';
import { GameHUD } from './game-hud';
import { GameControlsPad } from './game-controls-pad';
import { PauseMenu } from './pause-menu';
import { SafeAreaWrapper } from '@/components/safe-area-wrapper';
import SettingsScreen from '@/components/settings-screen';
import { useGameActions, useGameSettings } from '@/hooks';
import { GAME_COLORS, FONT_SIZES } from '@/constants/theme';
import type { Direction } from '../types';

interface BaseGameScreenProps {
  /** Whether the game is loading */
  isLoading?: boolean;
  /** Custom loading message */
  loadingMessage?: string;
  /** Whether game interactions should be disabled (level complete, game over, etc.) */
  isGameDisabled?: boolean;
  /** Whether to show the queue display */
  showQueue?: boolean;
  /** Content to render in the info panel (target gem, score, etc.) */
  infoPanel: ReactNode;
  /** Overlay to render on top of the game (level complete, game over, etc.) */
  overlay?: ReactNode;
  /** Additional content to render before the main game area */
  headerContent?: ReactNode;
  /** Called when exit is requested from pause menu */
  onExit: () => void;
  /** Called when restart is requested from pause menu (optional) */
  onRestart?: () => void;
  /** Callback before move action - return false to prevent */
  onBeforeMove?: (direction: Direction) => boolean;
  /** Callback before rotate action - return false to prevent */
  onBeforeRotate?: () => boolean;
  /** Callback before place action - return false to prevent */
  onBeforePlace?: () => boolean;
  /** Callback before undo action - return false to prevent */
  onBeforeUndo?: () => boolean;
  /** Callback after successful move */
  onAfterMove?: (direction: Direction, success: boolean) => void;
  /** Callback after successful rotate */
  onAfterRotate?: (success: boolean) => void;
  /** Callback after successful place */
  onAfterPlace?: (success: boolean) => void;
  /** Callback after successful undo */
  onAfterUndo?: (success: boolean) => void;
}

/**
 * Loading screen component.
 */
function LoadingScreen({ message = 'Loading...' }: { message?: string }) {
  return (
    <SafeAreaWrapper>
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>{message}</Text>
      </View>
    </SafeAreaWrapper>
  );
}

/**
 * BaseGameScreen provides the shared layout and behavior for all game modes.
 * Mode-specific logic is injected via props and callbacks.
 */
export function BaseGameScreen({
  isLoading = false,
  loadingMessage,
  isGameDisabled = false,
  showQueue = true,
  infoPanel,
  overlay,
  headerContent,
  onExit,
  onRestart,
  onBeforeMove,
  onBeforeRotate,
  onBeforePlace,
  onBeforeUndo,
  onAfterMove,
  onAfterRotate,
  onAfterPlace,
  onAfterUndo,
}: BaseGameScreenProps) {
  // Game state
  const board = useGameStore((state) => state.board);
  const player = useGameStore((state) => state.player);
  const queue = useGameStore((state) => state.queue);
  const isPaused = useGameStore((state) => state.isPaused);
  const isLevelComplete = useGameStore((state) => state.isLevelComplete);
  const reset = useGameStore((state) => state.reset);

  // Hooks
  const {
    handleMove,
    handleRotate,
    handlePlace,
    handleUndo,
    handlePause,
    handleResume,
  } = useGameActions({
    onBeforeMove,
    onBeforeRotate,
    onBeforePlace,
    onBeforeUndo,
    onAfterMove,
    onAfterRotate,
    onAfterPlace,
    onAfterUndo,
  });

  const {
    showSettings,
    leftHanded,
    openSettings,
    closeSettings,
  } = useGameSettings();

  // Play completion sound
  useEffect(() => {
    if (isLevelComplete) {
      playSound('one_gem');
    }
  }, [isLevelComplete]);

  // Compute player cells
  const playerCells = useMemo(() => {
    if (!player) return [];
    return getPlayerOverlay(player, board);
  }, [player, board]);

  // Handle exit
  const handleExit = () => {
    reset();
    onExit();
  };

  // Handle restart (if provided)
  const handleRestartFromMenu = onRestart ? () => {
    handleResume();
    onRestart();
  } : undefined;

  const isInteractionDisabled = isGameDisabled || isPaused;

  if (isLoading) {
    return <LoadingScreen message={loadingMessage} />;
  }

  return (
    <SafeAreaWrapper>
      {/* Menu button */}
      <GameHUD onMenu={handlePause} />

      {/* Optional header content (e.g., tutorial instructions) */}
      {headerContent}

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
        onMove={handleMove}
        onRotate={handleRotate}
        onPlace={handlePlace}
        onUndo={handleUndo}
        disabled={isInteractionDisabled}
        leftHanded={leftHanded}
      >
        {infoPanel}
      </GameControlsPad>

      {/* Mode-specific overlay (level complete, game over, etc.) */}
      {overlay}

      {/* Pause menu */}
      <PauseMenu
        visible={isPaused && !showSettings}
        onResume={handleResume}
        onRestart={handleRestartFromMenu}
        onSettings={openSettings}
        onExit={handleExit}
      />

      {/* Settings modal */}
      <Modal visible={showSettings} animationType="slide">
        <SettingsScreen onBack={closeSettings} />
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
});

export default BaseGameScreen;
