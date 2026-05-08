import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { theme } from '@/constants/theme';

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  // TODO: interprétation complète, symbolique, mots-clés
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Détail #{id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
  label: {
    color: theme.colors.textLight,
    ...theme.typography.body,
  },
});
