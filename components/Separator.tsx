import { View, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';

type Props = {
  horizontal?: boolean;
};

export function Separator({ horizontal = true }: Props) {
  return <View style={[styles.base, horizontal ? styles.horizontal : styles.vertical]} />;
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: theme.colors.gold,
    opacity: 0.5,
  },
  horizontal: {
    width: '100%',
    height: StyleSheet.hairlineWidth,
    marginVertical: theme.spacing.sm,
  },
  vertical: {
    height: '100%',
    width: StyleSheet.hairlineWidth,
    marginHorizontal: theme.spacing.sm,
  },
});
