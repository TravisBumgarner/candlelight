/**
 * Settings tab - uses shared SettingsContent component.
 */

import { StyleSheet, Text, View } from "react-native";
import TabWrapper from "@/components/tab-wrapper";
import { SettingsContent } from "@/components/settings-content";
import { GAME_COLORS, FONT_SIZES, SPACING } from "@/constants/theme";

const Settings = () => {
  return (
    <TabWrapper background="settings">
      <View style={styles.container}>
        <Text style={styles.title}>SETTINGS</Text>
        <SettingsContent />
      </View>
    </TabWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.LARGE.INT,
    justifyContent: "center",
  },
  title: {
    fontFamily: "DepartureMonoRegular",
    fontSize: FONT_SIZES.HUGE.INT,
    color: GAME_COLORS.TEXT_PRIMARY,
    textAlign: "center",
    marginBottom: SPACING.XLARGE.INT,
  },
});

export default Settings;
