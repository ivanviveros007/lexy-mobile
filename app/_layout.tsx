import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Provider } from 'jotai';
import { Colors } from '../constants/colors';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    // Descarga OpenDyslexic de: https://opendyslexic.org
    // y colócala en assets/fonts/
    OpenDyslexic: require('../assets/fonts/OpenDyslexic-Regular.otf'),
    'OpenDyslexic-Bold': require('../assets/fonts/OpenDyslexic-Bold.otf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <Provider>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.backgroundCream } }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </Provider>
  );
}
