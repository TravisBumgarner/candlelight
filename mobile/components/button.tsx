import { FONT_SIZES } from "@/constants/theme";
import { Pressable, StyleSheet, Text } from "react-native";

interface PixelMenuButtonProps {
  label: string;
  onPress: () => void;
  fullWidth?: boolean;
  disabled?: boolean;
}

export default function PixelMenuButton({
  label,
  onPress,
  fullWidth = false,
  disabled = false,
}: PixelMenuButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.wrapper, fullWidth && styles.fullWidth]}
      disabled={disabled}
    >
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#3B7EA0",
    paddingVertical: 6,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 2,
    borderBottomWidth: 6,
    borderBottomColor: "#5bc1f4",
    marginVertical: 4,
  },
  fullWidth: {
    alignSelf: "stretch",
  },
  text: {
    fontFamily: "DepartureMonoRegular",
    color: "#FFFFFF",
    fontSize: FONT_SIZES.MEDIUM.INT,
    fontWeight: "bold",
    letterSpacing: 1,
    textAlign: "center",
  },
});
