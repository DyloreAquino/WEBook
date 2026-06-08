import { useLocalSearchParams } from "expo-router"
import { View, Text } from "react-native"
import { colors } from "@/styles/theme"

export default function ChampionshipDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 24 }}>
      <Text style={{ color: colors.text }}>Championship {id}</Text>
    </View>
  )
}