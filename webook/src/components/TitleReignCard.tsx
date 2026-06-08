// components/TitleReignCard.tsx
import { colors, fonts } from "@/styles/theme"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { TitleReign } from "@/types/title_reign"
import { reignDateRange } from "@/lib/formatReign"

export default function TitleReignCard({ reign, onPress }: { reign: TitleReign; onPress: () => void }) {
  const holders = reign.wrestlers ?? []
  const names = holders.length > 0 ? holders.map((w) => w.name).join(" & ") : "Vacant"
  const current = reign.yearEnd == null

  return (
    <TouchableOpacity style={[styles.card, current && styles.card_current]} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.row}>
        <Text style={styles.names} numberOfLines={1}>{names}</Text>
        {current && <View style={styles.badge}><Text style={styles.badge_text}>CURRENT</Text></View>}
      </View>
      <Text style={styles.dates}>{reignDateRange(reign)}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: colors.border },
  card_current: { borderColor: colors.accent },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 },
  names: { fontFamily: fonts.bold, fontSize: 16, color: colors.text, flex: 1, marginRight: 8 },
  badge: { backgroundColor: colors.accent, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  badge_text: { fontFamily: fonts.bold, fontSize: 9, color: colors.text },
  dates: { fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted },
})