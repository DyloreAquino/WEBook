import { useFonts, Rajdhani_600SemiBold, Rajdhani_700Bold } from "@expo-google-fonts/rajdhani"
import { Inter_400Regular, Inter_500Medium } from "@expo-google-fonts/inter"
import * as SplashScreen from "expo-splash-screen"
import { useEffect } from "react"
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
})

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
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }}/>
      </Stack>
    </QueryClientProvider>
  );
}