import { useFonts, Rajdhani_600SemiBold, Rajdhani_700Bold } from "@expo-google-fonts/rajdhani"
import { Inter_400Regular, Inter_500Medium } from "@expo-google-fonts/inter"
import * as SplashScreen from "expo-splash-screen"
import { useEffect } from "react"
import { Stack, useRouter } from 'expo-router';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AuthProvider } from "@/context/AuthContext"
import { UniverseProvider, useActiveUniverse } from "@/context/UniverseContext";
import { PromotionProvider } from "@/context/PromotionContext"
import { usePathname } from 'expo-router'; // Add this import
import { colors } from "@/styles/theme";

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
      <AuthProvider>
        <UniverseProvider>
          <PromotionProvider>
            <NavigationGuardInterceptor />
            
            <Stack 
              screenOptions={{
                headerStyle: {
                  backgroundColor: colors.background, // Set the background color
                },
                headerTitle: '',      // This removes the label/title
                headerTintColor: colors.text, // Ensures your back button matches your text color
                headerShadowVisible: false,   // Optional: Removes the bottom border line
              }} 
            />
          </PromotionProvider>
        </UniverseProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

function NavigationGuardInterceptor() {
  const { activeUniverse, hasUniverses, loading } = useActiveUniverse();
  const pathname = usePathname(); // Get the current path accurately
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // 1. Define the targets
    const needsUniverse = !hasUniverses;
    const needsSelection = hasUniverses && !activeUniverse;

    // 2. Logic: If we are already on the page, return immediately to break the loop
    if (needsUniverse && pathname === "/create-universe") return;
    if (needsSelection && pathname === "/universe-select") return;

    // 3. Perform the redirect only if necessary
    if (needsUniverse) {
      router.replace("/create-universe");
    } else if (needsSelection) {
      router.replace("/universe-select");
    }
  }, [activeUniverse, hasUniverses, loading, pathname]); // Depend on pathname, not segments

  return null;
}