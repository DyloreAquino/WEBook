import { useFonts, Rajdhani_600SemiBold, Rajdhani_700Bold } from "@expo-google-fonts/rajdhani"
import { Inter_400Regular, Inter_500Medium } from "@expo-google-fonts/inter"
import * as SplashScreen from "expo-splash-screen"
import { useEffect } from "react"
import { Stack } from 'expo-router';

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {

  const [loaded] = useFonts({
    Rajdhani_600SemiBold,
    Rajdhani_700Bold,
    Inter_400Regular,
    Inter_500Medium,
  })

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync()
  }, [loaded])

  if (!loaded) return null

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }}/>
    </Stack>
  );
}