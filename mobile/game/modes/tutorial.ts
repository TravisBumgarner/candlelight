/**
 * Tutorial mode game logic.
 * Guides new players through 6 progressive instruction stages.
 */

import { TUTORIAL_STAGES, ACTION } from '../constants';
import type { Action } from '../types';

/**
 * Tutorial stage configuration.
 */
export interface TutorialStage {
  id: number;
  name: string;
  instruction: string;
  subInstruction?: string;
}

/**
 * Tutorial stages with instructions.
 */
export const TUTORIAL_STAGE_CONFIG: TutorialStage[] = [
  {
    id: TUTORIAL_STAGES.MOVE,
    name: '0_Move',
    instruction: 'MOVE YOUR PIECE',
    subInstruction: 'Swipe to move, tap to rotate',
  },
  {
    id: TUTORIAL_STAGES.PLACE,
    name: '1_Place',
    instruction: 'PLACE YOUR PIECE',
    subInstruction: 'Tap on the board to place',
  },
  {
    id: TUTORIAL_STAGES.STACK,
    name: '2_Stack',
    instruction: 'STACK PIECES',
    subInstruction: 'Place pieces on top of each other to change colors',
  },
  {
    id: TUTORIAL_STAGES.UNDO,
    name: '3_Undo',
    instruction: 'UNDO A MOVE',
    subInstruction: 'Press UNDO to take back your last placement',
  },
  {
    id: TUTORIAL_STAGES.SCORE,
    name: '4_Score',
    instruction: 'MATCH THE TARGET',
    subInstruction: 'Create the shape shown in the target area',
  },
  {
    id: TUTORIAL_STAGES.QUEUE,
    name: '5_Queue',
    instruction: 'USE THE QUEUE',
    subInstruction: 'Plan ahead using the shapes in the queue',
  },
  {
    id: TUTORIAL_STAGES.DONE,
    name: '6_Done',
    instruction: 'TUTORIAL COMPLETE!',
    subInstruction: 'You\'re ready to play!',
  },
];

/**
 * Actions that become available at each stage.
 */
export const STAGE_ACTION_AVAILABILITY: Record<Action, number> = {
  up: TUTORIAL_STAGES.MOVE,
  down: TUTORIAL_STAGES.MOVE,
  left: TUTORIAL_STAGES.MOVE,
  right: TUTORIAL_STAGES.MOVE,
  rotate: TUTORIAL_STAGES.MOVE,
  select: TUTORIAL_STAGES.PLACE,
  undo: TUTORIAL_STAGES.UNDO,
  escape: TUTORIAL_STAGES.MOVE, // Always available
};

/**
 * Check if an action is available at the current tutorial stage.
 */
export function isActionAvailable(action: Action, currentStage: number): boolean {
  // Escape is always available
  if (action === 'escape') return true;

  const requiredStage = STAGE_ACTION_AVAILABILITY[action];
  return currentStage >= requiredStage;
}

/**
 * Tutorial state tracking.
 */
export interface TutorialState {
  stage: number;
  performedActions: Record<string, boolean>;
  isComplete: boolean;
}

/**
 * Create initial tutorial state.
 */
export function createTutorialState(): TutorialState {
  return {
    stage: TUTORIAL_STAGES.MOVE,
    performedActions: {
      up: false,
      down: false,
      left: false,
      right: false,
      rotate: false,
      select: false,
      undo: false,
    },
    isComplete: false,
  };
}

/**
 * Record that an action was performed.
 */
export function recordAction(
  state: TutorialState,
  action: Action
): TutorialState {
  if (action === 'escape') return state;

  return {
    ...state,
    performedActions: {
      ...state.performedActions,
      [action]: true,
    },
  };
}

/**
 * Check if the current stage is complete based on performed actions.
 * Returns the new stage if advanced, or current stage if not.
 */
export function checkStageProgress(
  state: TutorialState,
  hasLightShapes: boolean
): { newStage: number; shouldAdvance: boolean } {
  const { stage, performedActions } = state;

  // Stages after UNDO complete in different ways
  if (stage > TUTORIAL_STAGES.UNDO) {
    return { newStage: stage, shouldAdvance: false };
  }

  let shouldAdvance = false;

  switch (stage) {
    case TUTORIAL_STAGES.MOVE:
      // Must perform all movement actions
      const moveActions = ['up', 'down', 'left', 'right', 'rotate'];
      shouldAdvance = moveActions.every((action) => performedActions[action]);
      break;

    case TUTORIAL_STAGES.PLACE:
      // Must place a piece
      shouldAdvance = performedActions.select === true;
      break;

    case TUTORIAL_STAGES.STACK:
      // Must create a light-colored shape (stacked)
      shouldAdvance = hasLightShapes;
      break;

    case TUTORIAL_STAGES.UNDO:
      // Must undo
      shouldAdvance = performedActions.undo === true;
      break;
  }

  return {
    newStage: shouldAdvance ? stage + 1 : stage,
    shouldAdvance,
  };
}

/**
 * Advance to the next stage after level complete.
 */
export function advanceStage(state: TutorialState): TutorialState {
  const newStage = state.stage + 1;
  return {
    ...state,
    stage: newStage,
    isComplete: newStage >= TUTORIAL_STAGES.DONE,
  };
}

/**
 * Get the current stage configuration.
 */
export function getCurrentStageConfig(stage: number): TutorialStage {
  return TUTORIAL_STAGE_CONFIG[stage] ?? TUTORIAL_STAGE_CONFIG[TUTORIAL_STAGES.DONE];
}

/**
 * Check what UI elements should be visible at the current stage.
 */
export function getVisibility(stage: number): {
  showTargetGem: boolean;
  showQueue: boolean;
  showHUD: boolean;
} {
  return {
    showTargetGem: stage >= TUTORIAL_STAGES.SCORE,
    showQueue: stage >= TUTORIAL_STAGES.QUEUE,
    showHUD: false, // Tutorial never shows HUD
  };
}

/**
 * Get the list of movement actions with their completion status.
 */
export function getMoveActionStatus(
  performedActions: Record<string, boolean>
): { action: string; completed: boolean }[] {
  return [
    { action: 'up', completed: performedActions.up ?? false },
    { action: 'down', completed: performedActions.down ?? false },
    { action: 'left', completed: performedActions.left ?? false },
    { action: 'right', completed: performedActions.right ?? false },
    { action: 'rotate', completed: performedActions.rotate ?? false },
  ];
}
