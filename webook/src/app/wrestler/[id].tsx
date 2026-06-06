import { useLocalSearchParams } from "expo-router"
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native"
import Ionicons from "@expo/vector-icons/Ionicons"
import { colors, fonts } from "@/styles/theme"
import { useWrestler } from "@/hooks/useWrestler"
import { useWrestlerLookup } from "@/hooks/useWrestlerLookup"
import { useTerritories } from "@/hooks/useTerritories"
import { usePromotions } from "@/hooks/usePromotions"
import WrestlerTag from "@/components/WrestlerTag"
import StatBar from "@/components/StatBar"
import RelationRow from "@/components/RelationRow"

const STATS = [
  ["Popularity", "popularity"], ["Strength", "strength"], ["Skill", "skill"],
  ["Agility", "agility"], ["Stamina", "stamina"], ["Attitude", "attitude"],
] as const

export default function WrestlerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const wrestlerId = Number(id)
  const { data: w, isLoading, isError } = useWrestler(wrestlerId)
  const { data: lookup } = useWrestlerLookup()
  const { data: territories } = useTerritories()
  const { data: promotions } = usePromotions()
  const resolve = (id: number | null) => (id != null ? lookup?.get(id) ?? null : null)

  if (isLoading) {
    return <View style={[styles.screen, styles.center]}><ActivityIndicator color={colors.accent} size="large" /></View>
  }
  if (isError || !w) {
    return <View style={[styles.screen, styles.center]}><Text style={styles.errorText}>Couldn't load wrestler.</Text></View>
  }

  const territoryName = territories?.find((t) => t.id === w.territoryId)?.name ?? String(w.territoryId)
  const promotionName = promotions?.find((p) => p.id === w.promotionId)?.name ?? String(w.promotionId)

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {/* header: name + edit + history buttons */}
      <View style={styles.header}>
        <Text style={styles.name} numberOfLines={2}>{w.name}</Text>
        <View style={styles.header_buttons}>
          <TouchableOpacity style={styles.icon_button} accessibilityLabel="Edit wrestler" onPress={() => { /* edit mode — next pass */ }}>
            <Ionicons name="pencil" color={colors.text} size={20} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.icon_button} accessibilityLabel="Wrestler history" onPress={() => { /* history modal — next pass */ }}>
            <Ionicons name="book" color={colors.text} size={20} />
          </TouchableOpacity>
        </View>
      </View>

      {/* core attribute tags */}
      <View style={styles.tags}>
        <WrestlerTag type="gender" value={w.gender} />
        <WrestlerTag type="allegiance" value={w.allegiance} />
        <WrestlerTag type="role" value={w.role} />
      </View>

      {/* finisher + territory + promotion as simple rows */}
      <View style={styles.info_block}>
        <InfoRow label="Finisher" value={w.finisherName} />
        <InfoRow label="Territory" value={territoryName} />
        <InfoRow label="Promotion" value={promotionName} />
      </View>

      <Text style={styles.section_title}>STATS</Text>
      {STATS.map(([label, key]) => (
        <StatBar key={key} label={label} value={w[key] as number} />
      ))}

      <Text style={styles.section_title}>RELATIONSHIPS</Text>
      <RelationRow label="Manager" wrestler={resolve(w.managerId)} />
      <RelationRow label="Partner" wrestler={resolve(w.partnerId)} />
      <RelationRow label="Story Friend" wrestler={resolve(w.storyFriendId)} />
      <RelationRow label="Story Enemy" wrestler={resolve(w.storyEnemyId)} />
      <RelationRow label="Real Friend" wrestler={resolve(w.realFriendId)} />
      <RelationRow label="Real Enemy" wrestler={resolve(w.realEnemyId)} />
    </ScrollView>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.info_row}>
      <Text style={styles.info_label}>{label}</Text>
      <Text style={styles.info_value}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 24, paddingTop: 8 },  // top margin to breathe
  center: { justifyContent: "center", alignItems: "center" },
  errorText: { fontFamily: fonts.bold, fontSize: 16, color: colors.text },
  header: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 },
  name: { flex: 1, fontFamily: fonts.bold, fontSize: 32, color: colors.text, marginRight: 12 },
  header_buttons: { flexDirection: "row", gap: 8, paddingTop: 4 },
  icon_button: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.surface, alignItems: "center", justifyContent: "center",
  },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 },
  info_block: { marginBottom: 24 },
  info_row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.border },
  info_label: { fontFamily: fonts.regular, fontSize: 15, color: colors.textMuted },
  info_value: { fontFamily: fonts.medium, fontSize: 15, color: colors.text },
  section_title: { fontFamily: fonts.heading, fontSize: 14, color: colors.textMuted, marginBottom: 14, marginTop: 8 },
})