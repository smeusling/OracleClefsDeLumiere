import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';

export default function HomeScreen() {
  // TODO: liste des cartes + bouton de tirage
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Oracle des Clefs de Lumière</Text>
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
  title: {
    color: theme.colors.text,
    ...theme.typography.title,
    textAlign: 'center',
  },
});
