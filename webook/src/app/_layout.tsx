import { useFonts, Rajdhani_600SemiBold, Rajdhani_700Bold } from "@expo-google-fonts/rajdhani"
import { Inter_400Regular, Inter_500Medium } from "@expo-google-fonts/inter"
import * as SplashScreen from "expo-splash-screen"
import { useEffect } from "react"
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { PromotionProvider } from "@/context/PromotionContext"
import { colors } from "@/styles/theme";
import { UniverseProvider } from "@/context/UniverseContext";

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
      <UniverseProvider>
        <PromotionProvider>
          <Stack screenOptions={{
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.text,
            headerTitle: "",
            headerShadowVisible: false,
          }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }}/>
          </Stack>
        </PromotionProvider>
      </UniverseProvider>
    </QueryClientProvider>
  );
}