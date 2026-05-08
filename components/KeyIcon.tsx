import { View, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';

type Props = {
  size?: number;
  color?: string;
};

export function KeyIcon({ size = 24, color = theme.colors.gold }: Props) {
  // TODO: remplacer par un SVG ou @expo/vector-icons lorsque les assets sont prêts
  return (
    <View
      style={[styles.placeholder, { width: size, height: size, borderColor: color }]}
    />
  );
}

const styles = StyleSheet.create({
  placeholder: {
    borderWidth: 2,
    borderRadius: 4,
  },
});
