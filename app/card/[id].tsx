import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { theme } from '@/constants/theme';

export default function CardScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  // TODO: révélation de la carte avec animation
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Carte #{id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  label: {
    color: theme.colors.textLight,
    ...theme.typography.body,
  },
});
