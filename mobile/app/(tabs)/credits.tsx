/**
 * Credits tab - Uses shared CreditsContent component.
 */

import TabWrapper from '@/components/tab-wrapper';
import { StyleSheet, View } from 'react-native';
import { CreditsContent } from '@/components/credits-content';
import { SPACING } from '@/constants/theme';

const Credits = () => {
  return (
    <TabWrapper background="credits">
      <View style={styles.container}>
        <CreditsContent />
      </View>
    </TabWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.LARGE.INT,
    justifyContent: 'center',
  },
});

export default Credits;
