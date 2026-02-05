/**
 * LoadingScreen - Shared loading indicator component.
 */

import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { GAME_COLORS, FONT_SIZES, SHARED_STYLES } from '@/constants/theme';

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message }: LoadingScreenProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={GAME_COLORS.TEXT_PRIMARY} />
      {message && <Text style={styles.text}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: SHARED_STYLES.loadingContainer,
  text: {
    fontFamily: 'DepartureMonoRegular',
    fontSize: FONT_SIZES.LARGE.INT,
    color: GAME_COLORS.TEXT_PRIMARY,
    marginTop: 16,
  },
});

export default LoadingScreen;
