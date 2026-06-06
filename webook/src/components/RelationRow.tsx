import { colors, fonts } from "@/styles/theme"
import { View, Text, StyleSheet } from "react-native"
import { Wrestler } from "@/types/wrestler"
import WrestlerSmallCard from "@/components/WrestlerSmallCard"

export default function RelationRow({ label, wrestler }: { label: string; wrestler?: Wrestler | null }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      {wrestler ? (
        <WrestlerSmallCard wrestler={wrestler} />
      ) : (
        <Text style={styles.none}>—</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  label: { fontFamily: fonts.regular, fontSize: 15, color: colors.textMuted },
  none: { fontFamily: fonts.regular, fontSize: 15, color: colors.textMuted, paddingRight: 12 },
})