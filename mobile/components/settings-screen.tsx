/**
 * SettingsScreen - Settings modal wrapper with back button.
 * Used in pause menus and main menu.
 */

import { StyleSheet, Text, View, Pressable } from 'react-native';
import { SettingsContent } from './settings-content';
import { GAME_COLORS, SPACING, SHARED_STYLES } from '@/constants/theme';

interface SettingsScreenProps {
  onBack: () => void;
}

const SettingsScreen = ({ onBack }: SettingsScreenProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>SETTINGS</Text>

      <SettingsContent />

      <Pressable style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>Back</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GAME_COLORS.SCREEN_BACKGROUND,
    padding: SPACING.LARGE.INT,
    justifyContent: 'center',
  },
  title: {
    ...SHARED_STYLES.titleText,
    marginBottom: SPACING.MEDIUM.INT,
  },
  backButton: {
    ...SHARED_STYLES.backButton,
    marginTop: SPACING.SMALL.INT,
    width: '100%',
    paddingVertical: SPACING.MEDIUM.INT,
  },
  backButtonText: SHARED_STYLES.buttonText,
});

export default SettingsScreen;
