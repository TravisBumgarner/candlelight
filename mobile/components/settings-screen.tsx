/**
 * SettingsScreen - Settings modal wrapper with back button.
 * Used in pause menus and main menu.
 */

import { StyleSheet, Text, View, Pressable } from "react-native";
import { SettingsContent } from "./settings-content";
import { GAME_COLORS, FONT_SIZES, SPACING } from "@/constants/theme";

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
    backgroundColor: "#0a1015",
    padding: SPACING.LARGE.INT,
    justifyContent: "center",
  },
  title: {
    fontFamily: "DepartureMonoRegular",
    fontSize: FONT_SIZES.HUGE.INT,
    color: GAME_COLORS.TEXT_PRIMARY,
    textAlign: "center",
    marginBottom: SPACING.MEDIUM.INT,
  },
  backButton: {
    backgroundColor: GAME_COLORS.BUTTON_PRIMARY,
    paddingVertical: SPACING.MEDIUM.INT,
    paddingHorizontal: SPACING.LARGE.INT,
    borderRadius: 4,
    alignSelf: "center",
    marginTop: SPACING.SMALL.INT,
    width: '100%',
  },
  backButtonText: {
    textAlign: 'center',
    fontFamily: "DepartureMonoRegular",
    fontSize: FONT_SIZES.MEDIUM.INT,
    color: GAME_COLORS.TEXT_PRIMARY,
  },
});

export default SettingsScreen;
