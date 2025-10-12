import { ImageBackground, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const backgrounds = {
  credits: require("@/assets/backgrounds/credits.png"),
  game: require("@/assets/backgrounds/game.png"),
  home: require("@/assets/backgrounds/home.png"),
  "select-game-save": require("@/assets/backgrounds/select-game-save.png"),
  settings: require("@/assets/backgrounds/settings.png"),
  splash: require("@/assets/backgrounds/splash.png"),
} as const;

type Background = keyof typeof backgrounds;

interface BackgroundPickerProps {
  children: React.ReactNode;
  background: Background;
}

export default function BackgroundPicker({
  children,
  background,
}: BackgroundPickerProps) {
  return (
    <ImageBackground
      source={backgrounds[background]}
      style={styles.backgroundImage}
    >
      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
        {children}
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
});
