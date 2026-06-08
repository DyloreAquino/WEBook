// components/ChampionshipCard.tsx
import { colors, fonts } from "@/styles/theme"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { router } from "expo-router"
import { Championship } from "@/types/championship"
import { DIVISION_TAG } from "@/lib/championshipTags"

export default function ChampionshipCard({ championship }: { championship: Championship }) {
  const holders = championship.currentReign?.wrestlers ?? []
  const holderNames = holders.length > 0 ? holders.map((w) => w.name).join(" & ") : "Vacant"
  const div = DIVISION_TAG[championship.division]

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => router.push({ pathname: "/championship/[id]", params: { id: championship.id } })}
      accessibilityRole="button"
      accessibilityLabel={`View ${championship.name}`}
    >
      <View style={styles.header}>
        <Text style={styles.name} numberOfLines={1}>{championship.name}</Text>
        <View style={[styles.div_tag, { backgroundColor: div?.bg ?? "#3a3a3a" }]}>
          <Text style={styles.div_text}>{(div?.label ?? championship.division).toUpperCase()}</Text>
        </View>
      </View>
      <Text style={styles.holders} numberOfLines={1}>
        {holders.length > 0 ? "Held by " : ""}{holderNames}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 6 },
  name: { fontFamily: fonts.bold, fontSize: 17, color: colors.text, flex: 1, marginRight: 8 },
  div_tag: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 3 },
  div_text: { fontFamily: fonts.bold, fontSize: 10, color: colors.text },
  holders: { fontFamily: fonts.regular, fontSize: 14, color: colors.textMuted },
})