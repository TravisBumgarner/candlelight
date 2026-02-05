/**
 * GameControls component for touch-based game input.
 * Provides action buttons for rotate, undo, and pause.
 */

import React from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { GAME_COLORS, FONT_SIZES, SPACING } from '@/constants/theme';

interface GameControlsProps {
  onRotate: () => void;
  onUndo: () => void;
  onPause: () => void;
  disabled?: boolean;
}

/**
 * Control button component.
 */
function ControlButton({
  label,
  onPress,
  disabled,
  variant = 'default',
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'default' | 'primary';
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        variant === 'primary' && styles.buttonPrimary,
        pressed && styles.buttonPressed,
        disabled && styles.buttonDisabled,
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          disabled && styles.buttonTextDisabled,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

/**
 * GameControls provides action buttons for the game.
 */
export function GameControls({
  onRotate,
  onUndo,
  onPause,
  disabled = false,
}: GameControlsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.leftControls}>
        <ControlButton
          label="UNDO"
          onPress={onUndo}
          disabled={disabled}
        />
      </View>

      <View style={styles.centerControls}>
        <ControlButton
          label="ROTATE"
          onPress={onRotate}
          disabled={disabled}
          variant="primary"
        />
      </View>

      <View style={styles.rightControls}>
        <ControlButton
          label="MENU"
          onPress={onPause}
          disabled={false} // Menu always accessible
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.MEDIUM.INT,
    paddingVertical: SPACING.SMALL.INT,
  },
  leftControls: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerControls: {
    flex: 1,
    alignItems: 'center',
  },
  rightControls: {
    flex: 1,
    alignItems: 'flex-end',
  },
  button: {
    backgroundColor: GAME_COLORS.BOARD_BACKGROUND,
    paddingVertical: SPACING.SMALL.INT,
    paddingHorizontal: SPACING.MEDIUM.INT,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: GAME_COLORS.BOARD_BORDER,
    minWidth: 80,
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: GAME_COLORS.BUTTON_PRIMARY,
    borderColor: GAME_COLORS.BUTTON_HIGHLIGHT,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    fontFamily: 'DepartureMonoRegular',
    fontSize: FONT_SIZES.SMALL.INT,
    color: GAME_COLORS.TEXT_PRIMARY,
    fontWeight: 'bold',
  },
  buttonTextDisabled: {
    color: GAME_COLORS.TEXT_SECONDARY,
  },
});

export default GameControls;
