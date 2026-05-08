import { Pressable, Text, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';

type Props = {
  id: string;
  title: string;
  onPress?: () => void;
};

export function OracleCard({ id, title, onPress }: Props) {
  // TODO: illustration, animation de retournement
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Text style={styles.title}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  title: {
    color: theme.colors.background,
    ...theme.typography.subtitle,
  },
});
