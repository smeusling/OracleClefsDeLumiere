import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {
  CormorantGaramond_400Regular,
  CormorantGaramond_400Regular_Italic,
} from '@expo-google-fonts/cormorant-garamond';
import { Lato_300Light, Lato_400Regular } from '@expo-google-fonts/lato';
import { theme } from '@/constants/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    CormorantGaramond_400Regular,
    CormorantGaramond_400Regular_Italic,
    Lato_300Light,
    Lato_400Regular,
  });

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            fontFamily: 'CormorantGaramond_400Regular',
            fontSize: 18,
          },
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="card/[id]" options={{ title: 'Tirage' }} />
        <Stack.Screen name="detail/[id]" options={{ title: 'Interprétation' }} />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
