import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { theme } from '@/constants/theme';

export default function RootLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text,
          headerTitleStyle: theme.typography.subtitle,
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Oracle des Clefs de Lumière' }} />
        <Stack.Screen name="card/[id]" options={{ title: 'Tirage' }} />
        <Stack.Screen name="detail/[id]" options={{ title: 'Interprétation' }} />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
