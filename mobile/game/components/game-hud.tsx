/**
 * GameHUD component - just the menu button at top right.
 */

import React from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { GAME_COLORS, FONT_SIZES, SPACING } from '@/constants/theme';

interface GameHUDProps {
  onMenu?: () => void;
}

/**
 * GameHUD displays the menu button at the top right.
 */
export function GameHUD({ onMenu }: GameHUDProps) {
  if (!onMenu) return null;

  return (
    <View style={styles.container}>
      <View style={styles.flex} />
      <Pressable style={styles.menuButton} onPress={onMenu}>
        <Text style={styles.menuIcon}>☰</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.SMALL.INT,
    paddingVertical: SPACING.SMALL.INT,
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: GAME_COLORS.BUTTON_PRIMARY,
    borderRadius: 8,
  },
  menuIcon: {
    fontSize: FONT_SIZES.LARGE.INT,
    color: GAME_COLORS.TEXT_PRIMARY,
  },
});

export default GameHUD;
