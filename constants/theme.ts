export const theme = {
  colors: {
    background: '#FAF0EE',
    primary: '#C4857A',
    gold: '#C9A84C',
    text: '#5C3D35',
    textLight: '#9E7B6E',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 40,
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 20,
  },
  typography: {
    title: { fontSize: 28, fontWeight: '700' as const },
    subtitle: { fontSize: 18, fontWeight: '600' as const },
    body: { fontSize: 16, fontWeight: '400' as const },
    caption: { fontSize: 12, fontWeight: '400' as const },
  },
} as const;

export type Theme = typeof theme;
