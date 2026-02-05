/**
 * TutorialScreen - Tutorial mode game screen.
 * Extends the base game with tutorial-specific logic and UI.
 */

import React, { useCallback, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  Modal,
} from 'react-native';
import { useGameStore } from '@/stores/game-store';
import { useGameGestures } from '@/hooks/use-game-gestures';
import { GameBoard } from './game-board';
import { TargetGem } from './target-gem';
import { QueueDisplay } from './queue-display';
import { GameControls } from './game-controls';
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
    player,
    queue,
    targetGem,
    isLevelComplete,
    getPlayerCells,
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

  // Wrapped action handlers with availability checks
  const handleMove = useCallback(
    (direction: Direction) => {
      if (!isActionAvailable(direction, tutorialState.stage)) return;
      const success = movePlayer(direction);
      handleAction(direction, success);
    },
    [tutorialState.stage, movePlayer, handleAction]
  );

  const handleRotate = useCallback(() => {
    if (!isActionAvailable('rotate', tutorialState.stage)) return;
    const success = rotatePlayer();
    handleAction('rotate', success);
  }, [tutorialState.stage, rotatePlayer, handleAction]);

  const handlePlace = useCallback(() => {
    if (!isActionAvailable('select', tutorialState.stage)) return;
    const success = placeShape();
    handleAction('select', success);
  }, [tutorialState.stage, placeShape, handleAction]);

  const handleUndo = useCallback(() => {
    if (!isActionAvailable('undo', tutorialState.stage)) return;
    const success = undo();
    handleAction('undo', success);
  }, [tutorialState.stage, undo, handleAction]);

  const handleExit = useCallback(() => {
    reset();
    onExit();
  }, [reset, onExit]);

  const handleComplete = useCallback(() => {
    reset();
    onComplete();
  }, [reset, onComplete]);

  // Gesture handlers
  const gestureHandlers = useGameGestures({
    onMove: handleMove,
    onPlace: handlePlace,
    onRotate: handleRotate,
  });

  // Get visibility for current stage
  const visibility = getVisibility(tutorialState.stage);
  const playerCells = getPlayerCells();
  const isInteractionDisabled =
    isLevelComplete || tutorialState.isComplete || isProcessing;

  return (
    <View style={styles.container}>
      {/* Tutorial Instructions */}
      <TutorialInstructions
        stage={tutorialState.stage}
        performedActions={tutorialState.performedActions}
      />

      {/* Main game area */}
      <View style={styles.gameArea}>
        {/* Side panels */}
        <View style={styles.sidePanel}>
          {visibility.showTargetGem && <TargetGem gem={targetGem} />}
        </View>

        {/* Game board with gesture handling */}
        <View
          style={styles.boardContainer}
          onTouchStart={gestureHandlers.onTouchStart}
          onTouchEnd={gestureHandlers.onTouchEnd}
        >
          <GameBoard
            board={board}
            playerCells={playerCells}
            disabled={isInteractionDisabled}
          />
        </View>

        {/* Queue panel */}
        <View style={styles.sidePanel}>
          {visibility.showQueue && queue && (
            <QueueDisplay queue={queue.queue} />
          )}
        </View>
      </View>

      {/* Controls */}
      <GameControls
        onRotate={handleRotate}
        onUndo={handleUndo}
        onPause={handleExit}
        disabled={isInteractionDisabled}
      />

      {/* Stage complete flash */}
      <StageCompleteOverlay
        visible={showStageComplete}
        stageName={`Stage ${tutorialState.stage}`}
      />

      {/* Tutorial complete */}
      <TutorialCompleteOverlay
        visible={tutorialState.isComplete}
        onContinue={handleComplete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1015',
  },
  gameArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.SMALL.INT,
  },
  sidePanel: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
    marginBottom: SPACING.MEDIUM.INT,
    textAlign: 'center',
  },
  menuButton: {
    backgroundColor: GAME_COLORS.BUTTON_PRIMARY,
    paddingVertical: SPACING.SMALL.INT,
    paddingHorizontal: SPACING.LARGE.INT,
    borderRadius: 4,
    marginVertical: SPACING.TINY.INT,
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
