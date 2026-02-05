/**
 * PauseMenu - Shared pause menu overlay component.
 */

import React from 'react';
import { View, StyleSheet, Text, Pressable, Modal } from 'react-native';
import { GAME_COLORS, FONT_SIZES, SPACING, SHARED_STYLES } from '@/constants/theme';

interface PauseMenuProps {
  visible: boolean;
  onResume: () => void;
  onRestart?: () => void;
  onSettings: () => void;
  onExit: () => void;
}

export function PauseMenu({
  visible,
  onResume,
  onRestart,
  onSettings,
  onExit,
}: PauseMenuProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>PAUSED</Text>
          <Pressable style={styles.button} onPress={onResume}>
            <Text style={styles.buttonText}>Resume</Text>
          </Pressable>
          {onRestart && (
            <Pressable style={styles.button} onPress={onRestart}>
              <Text style={styles.buttonText}>Restart</Text>
            </Pressable>
          )}
          <Pressable style={styles.button} onPress={onSettings}>
            <Text style={styles.buttonText}>Settings</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={onExit}>
            <Text style={styles.buttonText}>Exit</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: SHARED_STYLES.modalOverlay,
  container: SHARED_STYLES.menuContainer,
  title: {
    fontFamily: 'DepartureMonoRegular',
    fontSize: FONT_SIZES.LARGE.INT,
    color: GAME_COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.MEDIUM.INT,
    textAlign: 'center',
  },
  button: SHARED_STYLES.menuButton,
  buttonText: SHARED_STYLES.buttonText,
});

export default PauseMenu;
