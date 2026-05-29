export const theme = {
  colors: {
    background: '#FAF0EE',
    primary: '#C4857A',
    gold: '#C9A84C',
    goldLight: '#E8D49E',
    goldLightTransparent: 'rgba(232,212,158,0)',
    goldTransparent: 'rgba(201,168,76,0)',
    goldBorder: 'rgba(201,168,76,0.35)',
    backgroundFrosted: 'rgba(250,240,238,0.85)',
    backgroundTransparent: 'rgba(250,240,238,0)',
    primaryTransparent: 'rgba(196,133,122,0)',
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
