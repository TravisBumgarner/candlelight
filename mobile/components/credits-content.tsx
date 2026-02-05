/**
 * CreditsContent - Shared credits content component.
 * Used by both the Credits tab and CreditsScreen modal.
 */

import { useCallback } from 'react';
import { StyleSheet, Text, View, Pressable, Linking } from 'react-native';
import { GAME_COLORS, FONT_SIZES, SPACING, SHARED_STYLES } from '@/constants/theme';

interface CreditLinkProps {
  role: string;
  name: string;
  url: string;
}

function CreditLink({ role, name, url }: CreditLinkProps) {
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
}

export function CreditsContent() {
  return (
    <>
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
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    ...SHARED_STYLES.titleText,
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
    alignItems: 'center',
  },
  roleText: {
    fontFamily: 'DepartureMonoRegular',
    fontSize: FONT_SIZES.SMALL.INT,
    color: GAME_COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.TINY.INT,
    textAlign: 'center',
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
    fontFamily: 'DepartureMonoRegular',
    fontSize: FONT_SIZES.LARGE.INT,
    color: GAME_COLORS.BUTTON_HIGHLIGHT,
    textAlign: 'center',
  },
  footer: {
    marginTop: SPACING.XLARGE.INT,
    alignItems: 'center',
  },
  footerText: {
    fontFamily: 'DepartureMonoRegular',
    fontSize: FONT_SIZES.MEDIUM.INT,
    color: GAME_COLORS.TEXT_PRIMARY,
  },
  versionText: {
    fontFamily: 'DepartureMonoRegular',
    fontSize: FONT_SIZES.SMALL.INT,
    color: GAME_COLORS.TEXT_SECONDARY,
    marginTop: SPACING.TINY.INT,
  },
});

export default CreditsContent;
