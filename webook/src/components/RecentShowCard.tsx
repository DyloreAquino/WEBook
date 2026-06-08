// components/RecentShowCard.tsx
import { colors, fonts } from "@/styles/theme"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { router } from "expo-router"
import { Show } from "@/types/show"
import { formatShow } from "@/lib/formatShow"

export default function RecentShowCard({ show }: { show: Show }) {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => router.push({ pathname: "/(tabs)/shows", params: { showId: String(show.id) } })}
      accessibilityRole="button"
      accessibilityLabel={`View ${show.name ?? "show"}`}
    >
      <Text style={styles.label}>MOST RECENT SHOW</Text>
      <Text style={styles.name}>{show.name ?? "Untitled Show"}</Text>
      <Text style={styles.meta}>{formatShow(show)}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: 18, padding: 18, marginBottom: 24, borderWidth: 1, borderColor: colors.accent },
  label: { fontFamily: fonts.heading, fontSize: 11, color: colors.accent, marginBottom: 6 },
  name: { fontFamily: fonts.bold, fontSize: 22, color: colors.text, marginBottom: 4 },
  meta: { fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted },
})