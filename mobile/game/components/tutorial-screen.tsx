/**
 * TutorialScreen - Tutorial mode game screen.
 * Extends the base game with tutorial-specific logic and UI.
 */

import React, { useCallback, useState, useEffect, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  Modal,
} from 'react-native';
import { useGameStore } from '@/stores/game-store';
import { playSound } from '@/services/audio';
import { getPlayerOverlay } from '../engine';
import { GameBoard } from './game-board';
import { TargetGem } from './target-gem';
import { HorizontalQueueDisplay } from './queue-display';
import { GameHUD } from './game-hud';
import { GameInfoPanel } from './game-info-panel';
import { GameControlsPad } from './game-controls-pad';
import { TutorialInstructions } from './tutorial-instructions';
import { SafeAreaWrapper } from '@/components/safe-area-wrapper';
import SettingsScreen from '@/components/settings-screen';
import { PauseMenu } from './pause-menu';
import { GAME_COLORS, FONT_SIZES, SPACING } from '@/constants/theme';
import { TUTORIAL_STAGES } from '../constants';
import {
  createTutorialState,
  recordAction,
  checkStageProgress,
  advanceStage,
  isActionAvailable,
  getVisibility,
  type TutorialState,
} from '../modes/tutorial';
import { findShapes } from '../engine';
import { loadSettings } from '@/services/storage';
import type { Direction, Action } from '../types';

interface TutorialScreenProps {
  onComplete: () => void;
  onExit: () => void;
}

/**
 * Tutorial complete overlay.
 */
function TutorialCompleteOverlay({
  visible,
  onContinue,
}: {
  visible: boolean;
  onContinue: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.menuContainer}>
          <Text style={styles.menuTitle}>TUTORIAL COMPLETE!</Text>
          <Text style={styles.completeText}>
            You're ready to play Candlelight!
          </Text>
          <Pressable style={styles.menuButton} onPress={onContinue}>
            <Text style={styles.menuButtonText}>Continue</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

/**
 * Stage complete overlay (brief transition).
 */
function StageCompleteOverlay({
  visible,
  stageName,
}: {
  visible: boolean;
  stageName: string;
}) {
  if (!visible) return null;

  return (
    <View style={styles.stageCompleteOverlay}>
      <Text style={styles.stageCompleteText}>{stageName} Complete!</Text>
    </View>
  );
}

/**
 * TutorialScreen component.
 */
export function TutorialScreen({ onComplete, onExit }: TutorialScreenProps) {
  const {
    board,
    player,
    queue,
    targetGem,
    isLevelComplete,
    movePlayer,
    rotatePlayer,
    placeShape,
    undo,
    initGame,
    nextLevel,
    reset,
  } = useGameStore();

  // Tutorial-specific state
  const [tutorialState, setTutorialState] = useState<TutorialState>(
    createTutorialState()
  );
  const [showStageComplete, setShowStageComplete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [leftHanded, setLeftHanded] = useState(false);

  // Initialize tutorial game
  useEffect(() => {
    const init = async () => {
      const settings = await loadSettings();
      setLeftHanded(settings.leftHanded);
      initGame('tutorial', { level: 1 });
    };
    init();
  }, [initGame]);

  // Handle stage transitions
  useEffect(() => {
    if (isLevelComplete && !isProcessing) {
      setIsProcessing(true);
      playSound('one_gem');

      // Brief delay then advance stage
      setTimeout(() => {
        const newState = advanceStage(tutorialState);
        setTutorialState(newState);

        if (!newState.isComplete) {
          nextLevel();
        }
        setIsProcessing(false);
      }, 1500);
    }
  }, [isLevelComplete, tutorialState, nextLevel, isProcessing]);

  // Handle action and check progress
  const handleAction = useCallback(
    (action: Action, success: boolean) => {
      if (!success) return;

      // Record action
      const newState = recordAction(tutorialState, action);
      setTutorialState(newState);

      // Check if we should advance (for stages 0-3)
      const hasLightShapes = findShapes(board, 'light').length > 0;
      const { newStage, shouldAdvance } = checkStageProgress(
        newState,
        hasLightShapes
      );

      if (shouldAdvance && newStage <= TUTORIAL_STAGES.UNDO) {
        setShowStageComplete(true);
        setTimeout(() => {
          setTutorialState((prev) => ({ ...prev, stage: newStage }));
          setShowStageComplete(false);
        }, 1000);
      }
    },
    [tutorialState, board]
  );

  // Wrapped action handlers with availability checks and audio
  const handleMove = useCallback(
    (direction: Direction) => {
      if (!isActionAvailable(direction, tutorialState.stage)) return;
      const success = movePlayer(direction);
      playSound(success ? 'movement' : 'non_movement');
      handleAction(direction, success);
    },
    [tutorialState.stage, movePlayer, handleAction]
  );

  const handlePlace = useCallback(() => {
    if (!isActionAvailable('select', tutorialState.stage)) return;
    const success = placeShape();
    if (success) playSound('movement');
    handleAction('select', success);
  }, [tutorialState.stage, placeShape, handleAction]);

  const handleRotate = useCallback(() => {
    if (!isActionAvailable('rotate', tutorialState.stage)) return;
    const success = rotatePlayer();
    playSound(success ? 'movement' : 'non_movement');
    handleAction('rotate', success);
  }, [tutorialState.stage, rotatePlayer, handleAction]);

  const handleUndo = useCallback(() => {
    if (!isActionAvailable('undo', tutorialState.stage)) return;
    const success = undo();
    playSound(success ? 'movement' : 'non_movement');
    handleAction('undo', success);
  }, [tutorialState.stage, undo, handleAction]);

  const handlePause = useCallback(() => {
    setIsPaused(true);
  }, []);

  const handleResume = useCallback(() => {
    setIsPaused(false);
  }, []);

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

  const handleComplete = useCallback(() => {
    reset();
    onComplete();
  }, [reset, onComplete]);

  // Get visibility for current stage
  const visibility = getVisibility(tutorialState.stage);

  // Compute player cells from destructured state to ensure React tracks dependencies
  const playerCells = useMemo(() => {
    if (!player) return [];
    return getPlayerOverlay(player, board);
  }, [player, board]);

  const isInteractionDisabled =
    isLevelComplete || tutorialState.isComplete || isProcessing || isPaused;

  return (
    <SafeAreaWrapper>
      {/* Menu button */}
      <GameHUD onMenu={handlePause} />

      {/* Tutorial Instructions */}
      <TutorialInstructions
        stage={tutorialState.stage}
        performedActions={tutorialState.performedActions}
      />

      {/* Queue */}
      {visibility.showQueue && queue && (
        <HorizontalQueueDisplay queue={queue.queue} />
      )}

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
        <GameInfoPanel mode="tutorial">
          {visibility.showTargetGem && <TargetGem gem={targetGem} cellSize={8} showLabel={false} />}
        </GameInfoPanel>
      </GameControlsPad>

      {/* Stage complete flash */}
      <StageCompleteOverlay
        visible={showStageComplete}
        stageName={`Stage ${tutorialState.stage}`}
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

      {/* Tutorial complete */}
      <TutorialCompleteOverlay
        visible={tutorialState.isComplete}
        onContinue={handleComplete}
      />
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1015',
  },
  boardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stageCompleteOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stageCompleteText: {
    fontFamily: 'DepartureMonoRegular',
    fontSize: FONT_SIZES.HUGE.INT,
    color: GAME_COLORS.TEXT_PRIMARY,
  },
});

export default TutorialScreen;
