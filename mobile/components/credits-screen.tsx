/**
 * CreditsScreen - Credits modal wrapper with back button.
 * Used in pause menus.
 */

import { StyleSheet, Text, View, Pressable } from 'react-native';
import { CreditsContent } from './credits-content';
import { GAME_COLORS, SPACING, SHARED_STYLES } from '@/constants/theme';

interface CreditsScreenProps {
  onBack: () => void;
}

const CreditsScreen = ({ onBack }: CreditsScreenProps) => {
  return (
    <View style={styles.container}>
      <CreditsContent />

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
  backButton: {
    ...SHARED_STYLES.backButton,
    marginTop: SPACING.XLARGE.INT,
  },
  backButtonText: SHARED_STYLES.buttonText,
});

export default CreditsScreen;
