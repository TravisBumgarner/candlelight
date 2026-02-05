import { useCallback } from "react";
import { StyleSheet, Text, View, Pressable, Linking } from "react-native";
import { GAME_COLORS, FONT_SIZES, SPACING } from "@/constants/theme";

interface CreditLinkProps {
  role: string;
  name: string;
  url: string;
}

const CreditLink = ({ role, name, url }: CreditLinkProps) => {
  const handlePress = useCallback(() => {
    Linking.openURL(url);
  }, [url]);

  return (
    <View style={styles.creditItem}>
      <Text style={styles.roleText}>{role}</Text>
      <Pressable
        style={({ pressed }) => [
          styles.linkButton,
          pressed && styles.linkButtonPressed,
        ]}
        onPress={handlePress}
      >
        <Text style={styles.nameText}>{name}</Text>
      </Pressable>
    </View>
  );
};

interface CreditsScreenProps {
  onBack: () => void;
}

const CreditsScreen = ({ onBack }: CreditsScreenProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>CREDITS</Text>

      <View style={styles.creditsContainer}>
        <CreditLink
          role="Game Design, Art, Code, Sound"
          name="Travis Bumgarner"
          url="https://travisbumgarner.dev/"
        />

        <CreditLink
          role="Music"
          name="Ricky Brandes"
          url="https://rickybrandes.com/"
        />

        <CreditLink
          role="Font"
          name="Helena Zhang"
          url="https://departuremono.com/"
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Candlelight</Text>
        <Text style={styles.versionText}>Mobile Version</Text>
      </View>

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
    marginBottom: SPACING.XLARGE.INT,
  },
  creditsContainer: {
    gap: SPACING.LARGE.INT,
  },
  creditItem: {
    backgroundColor: GAME_COLORS.BOARD_BACKGROUND,
    borderWidth: 2,
    borderColor: GAME_COLORS.BOARD_BORDER,
    borderRadius: 8,
    padding: SPACING.MEDIUM.INT,
    alignItems: "center",
  },
  roleText: {
    fontFamily: "DepartureMonoRegular",
    fontSize: FONT_SIZES.SMALL.INT,
    color: GAME_COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.TINY.INT,
    textAlign: "center",
  },
  linkButton: {
    paddingVertical: SPACING.SMALL.INT,
    paddingHorizontal: SPACING.MEDIUM.INT,
    borderRadius: 4,
  },
  linkButtonPressed: {
    backgroundColor: GAME_COLORS.BUTTON_PRIMARY,
  },
  nameText: {
    fontFamily: "DepartureMonoRegular",
    fontSize: FONT_SIZES.LARGE.INT,
    color: GAME_COLORS.BUTTON_HIGHLIGHT,
    textAlign: "center",
  },
  footer: {
    marginTop: SPACING.XLARGE.INT,
    alignItems: "center",
  },
  footerText: {
    fontFamily: "DepartureMonoRegular",
    fontSize: FONT_SIZES.MEDIUM.INT,
    color: GAME_COLORS.TEXT_PRIMARY,
  },
  versionText: {
    fontFamily: "DepartureMonoRegular",
    fontSize: FONT_SIZES.SMALL.INT,
    color: GAME_COLORS.TEXT_SECONDARY,
    marginTop: SPACING.TINY.INT,
  },
  backButton: {
    backgroundColor: GAME_COLORS.BUTTON_PRIMARY,
    paddingVertical: SPACING.MEDIUM.INT,
    paddingHorizontal: SPACING.LARGE.INT,
    borderRadius: 4,
    alignSelf: "center",
    marginTop: SPACING.XLARGE.INT,
  },
  backButtonText: {
    fontFamily: "DepartureMonoRegular",
    fontSize: FONT_SIZES.MEDIUM.INT,
    color: GAME_COLORS.TEXT_PRIMARY,
  },
});

export default CreditsScreen;
