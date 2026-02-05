/**
 * TutorialInstructions component.
 * Displays the current tutorial stage instructions.
 */

import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { GAME_COLORS, FONT_SIZES, SPACING } from '@/constants/theme';
import { TUTORIAL_STAGES } from '../constants';
import {
  getCurrentStageConfig,
  getMoveActionStatus,
} from '../modes/tutorial';

interface TutorialInstructionsProps {
  stage: number;
  performedActions: Record<string, boolean>;
}

/**
 * Action indicator for the move stage.
 */
function ActionIndicator({
  label,
  completed,
}: {
  label: string;
  completed: boolean;
}) {
  return (
    <View style={[styles.actionIndicator, completed && styles.actionCompleted]}>
      <Text
        style={[
          styles.actionText,
          completed && styles.actionTextCompleted,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

/**
 * Move stage instructions with action indicators.
 */
function MoveStageInstructions({
  performedActions,
}: {
  performedActions: Record<string, boolean>;
}) {
  const actions = getMoveActionStatus(performedActions);

  return (
    <View style={styles.moveContainer}>
      <View style={styles.actionRow}>
        {actions.slice(0, 4).map(({ action, completed }) => (
          <ActionIndicator
            key={action}
            label={action.toUpperCase()}
            completed={completed}
          />
        ))}
      </View>
      <View style={styles.actionRow}>
        <ActionIndicator
          label="ROTATE"
          completed={actions[4].completed}
        />
      </View>
    </View>
  );
}

/**
 * TutorialInstructions displays stage-specific instructions.
 */
export function TutorialInstructions({
  stage,
  performedActions,
}: TutorialInstructionsProps) {
  const stageConfig = getCurrentStageConfig(stage);

  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>{stageConfig.instruction}</Text>

      {stageConfig.subInstruction && (
        <Text style={styles.subInstruction}>{stageConfig.subInstruction}</Text>
      )}

      {stage === TUTORIAL_STAGES.MOVE && (
        <MoveStageInstructions performedActions={performedActions} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: SPACING.MEDIUM.INT,
  },
  instruction: {
    fontFamily: 'DepartureMonoRegular',
    fontSize: FONT_SIZES.LARGE.INT,
    color: GAME_COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: SPACING.SMALL.INT,
  },
  subInstruction: {
    fontFamily: 'DepartureMonoRegular',
    fontSize: FONT_SIZES.SMALL.INT,
    color: GAME_COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: SPACING.MEDIUM.INT,
  },
  moveContainer: {
    marginTop: SPACING.SMALL.INT,
    gap: SPACING.SMALL.INT,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.SMALL.INT,
  },
  actionIndicator: {
    backgroundColor: GAME_COLORS.BOARD_BACKGROUND,
    borderWidth: 1,
    borderColor: GAME_COLORS.BOARD_BORDER,
    paddingVertical: SPACING.TINY.INT,
    paddingHorizontal: SPACING.SMALL.INT,
    borderRadius: 4,
    minWidth: 60,
    alignItems: 'center',
  },
  actionCompleted: {
    backgroundColor: GAME_COLORS.BUTTON_PRIMARY,
    borderColor: GAME_COLORS.BUTTON_HIGHLIGHT,
    opacity: 0.5,
  },
  actionText: {
    fontFamily: 'DepartureMonoRegular',
    fontSize: FONT_SIZES.SMALL.INT,
    color: GAME_COLORS.TEXT_PRIMARY,
  },
  actionTextCompleted: {
    color: GAME_COLORS.TEXT_SECONDARY,
  },
});

export default TutorialInstructions;
