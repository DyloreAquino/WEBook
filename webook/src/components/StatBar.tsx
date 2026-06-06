import { colors, fonts } from "@/styles/theme"
import { View, Text, StyleSheet } from "react-native"

const MIN = 50
const MAX = 100
const SEGMENTS = 10  // the [||||  ] blocks

export default function StatBar({ label, value }: { label: string; value: number }) {
  const clamped = Math.max(MIN, Math.min(MAX, value))
  const pct = (clamped - MIN) / (MAX - MIN)          // 50->0, 100->1
  const filled = Math.round(pct * SEGMENTS)

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      <View style={styles.bar}>
        {Array.from({ length: SEGMENTS }).map((_, i) => (
          <View
            key={i}
            style={[styles.segment, i < filled ? styles.segment_filled : styles.segment_empty]}
          />
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  label: { width: 90, fontFamily: fonts.regular, fontSize: 14, color: colors.text },
  value: {
    width: 36, textAlign: "right", marginRight: 12,
    fontFamily: fonts.bold, fontSize: 15, color: colors.text,
  },
  bar: { flex: 1, flexDirection: "row", gap: 3 },
  segment: { flex: 1, height: 14, borderRadius: 3 },
  segment_filled: { backgroundColor: colors.accent },
  segment_empty: { backgroundColor: colors.surface },
})