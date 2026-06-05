import { Tabs } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors, fonts } from "@/styles/theme";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        // Tab Bar Styles
        tabBarInactiveTintColor: colors.text,
        tabBarActiveTintColor: colors.primary,
        tabBarHideOnKeyboard:true,
        tabBarStyle: {
          borderColor: colors.background,
          backgroundColor: colors.background,
        },
        tabBarLabelStyle:{
          fontFamily: fonts.bold
        },
        
        // Header Styles
        headerShadowVisible: false,
        headerTintColor: colors.text,
        headerStyle:{
          backgroundColor: colors.background,
        },
        headerTitleStyle:{
          fontFamily: fonts.heading,
          fontSize: 32,
        }
      }}
    >
      <Tabs.Screen name="shows" options={{ 
        title: 'Shows',
        tabBarIcon: ({ color, focused }) => (
          <Ionicons name={focused ? 'tv-sharp' : 'tv-outline'} color={color} size={24} />
        ),
      }} />
      <Tabs.Screen name="home" options={{ 
        title: 'Home',
        tabBarIcon: ({ color, focused }) => (
          <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
        ),
      }} />
      <Tabs.Screen name="roster" options={{ 
        title: 'Roster',
        tabBarIcon: ({ color, focused }) => (
          <Ionicons name={focused ? 'person-sharp' : 'person-outline'} color={color} size={24} />
        ),
      }} />
    </Tabs>
  )
  
}
