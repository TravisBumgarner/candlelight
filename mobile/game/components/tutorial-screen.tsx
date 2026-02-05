/**
 * TutorialScreen - Tutorial mode game screen.
 * Extends the base game with tutorial-specific logic and UI.
 */

import React, { useCallback, useState, useEffect } from 'react';
import { View, StyleSheet, Text, Pressable, Modal } from 'react-native';
import { useGameStore } from '@/stores/game-store';
import { BaseGameScreen } from './base-game-screen';
import { TargetGem } from './target-gem';
import { GameInfoPanel } from './game-info-panel';
import { TutorialInstructions } from './tutorial-instructions';
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
    targetGem,
    isLevelComplete,
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
  const [isPausedLocal, setIsPausedLocal] = useState(false);

  // Initialize tutorial game
  useEffect(() => {
    initGame('tutorial', { level: 1 });
  }, [initGame]);

  // Handle stage transitions
  useEffect(() => {
    if (isLevelComplete && !isProcessing) {
      setIsProcessing(true);

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

  // Tutorial-specific action guards
  const onBeforeMove = useCallback(
    (direction: Direction) => isActionAvailable(direction, tutorialState.stage),
    [tutorialState.stage]
  );

  const onBeforeRotate = useCallback(
    () => isActionAvailable('rotate', tutorialState.stage),
    [tutorialState.stage]
  );

  const onBeforePlace = useCallback(
    () => isActionAvailable('select', tutorialState.stage),
    [tutorialState.stage]
  );

  const onBeforeUndo = useCallback(
    () => isActionAvailable('undo', tutorialState.stage),
    [tutorialState.stage]
  );

  // After-action callbacks to track tutorial progress
  const onAfterMove = useCallback(
    (direction: Direction, success: boolean) => handleAction(direction, success),
    [handleAction]
  );

  const onAfterRotate = useCallback(
    (success: boolean) => handleAction('rotate', success),
    [handleAction]
  );

  const onAfterPlace = useCallback(
    (success: boolean) => handleAction('select', success),
    [handleAction]
  );

  const onAfterUndo = useCallback(
    (success: boolean) => handleAction('undo', success),
    [handleAction]
  );

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

  const isInteractionDisabled =
    isLevelComplete || tutorialState.isComplete || isProcessing || isPausedLocal;

  const headerContent = (
    <TutorialInstructions
      stage={tutorialState.stage}
      performedActions={tutorialState.performedActions}
    />
  );

  const infoPanel = (
    <GameInfoPanel mode="tutorial">
      {visibility.showTargetGem && <TargetGem gem={targetGem} cellSize={8} showLabel={false} />}
    </GameInfoPanel>
  );

  const overlay = (
    <>
      <StageCompleteOverlay
        visible={showStageComplete}
        stageName={`Stage ${tutorialState.stage}`}
      />
      <TutorialCompleteOverlay
        visible={tutorialState.isComplete}
        onContinue={handleComplete}
      />
    </>
  );

  return (
    <BaseGameScreen
      isGameDisabled={isInteractionDisabled}
      showQueue={visibility.showQueue}
      headerContent={headerContent}
      infoPanel={infoPanel}
      overlay={overlay}
      onExit={handleExit}
      onBeforeMove={onBeforeMove}
      onBeforeRotate={onBeforeRotate}
      onBeforePlace={onBeforePlace}
      onBeforeUndo={onBeforeUndo}
      onAfterMove={onAfterMove}
      onAfterRotate={onAfterRotate}
      onAfterPlace={onAfterPlace}
      onAfterUndo={onAfterUndo}
    />
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    backgroundColor: GAME_COLORS.BOARD_BACKGROUND,
    borderWidth: 2,
    borderColor: GAME_COLORS.BOARD_BORDER,
    padding: SPACING.LARGE.INT,
    borderRadius: 8,
    minWidth: 250,
    alignItems: 'center',
  },
  menuTitle: {
    fontFamily: 'DepartureMonoRegular',
    fontSize: FONT_SIZES.LARGE.INT,
    color: GAME_COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.MEDIUM.INT,
    textAlign: 'center',
  },
  completeText: {
    fontFamily: 'DepartureMonoRegular',
    fontSize: FONT_SIZES.MEDIUM.INT,
    color: GAME_COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.LARGE.INT,
    textAlign: 'center',
  },
  menuButton: {
    backgroundColor: GAME_COLORS.BUTTON_PRIMARY,
    paddingVertical: SPACING.SMALL.INT,
    paddingHorizontal: SPACING.LARGE.INT,
    borderRadius: 4,
    minWidth: 150,
    alignItems: 'center',
  },
  menuButtonText: {
    fontFamily: 'DepartureMonoRegular',
    fontSize: FONT_SIZES.MEDIUM.INT,
    color: GAME_COLORS.TEXT_PRIMARY,
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
