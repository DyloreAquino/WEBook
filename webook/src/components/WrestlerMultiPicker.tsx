// components/WrestlerMultiPicker.tsx
import { useState, useMemo } from "react"
import { Modal, View, Text, TextInput, SectionList, StyleSheet, TouchableOpacity } from "react-native"
import Ionicons from "@expo/vector-icons/Ionicons"
import { colors, fonts } from "@/styles/theme"
import { GroupCategory } from "@/types/wrestler"
import { useWrestlerLookup } from "@/hooks/useWrestlerLookup"
import { useTerritories } from "@/hooks/useTerritories"
import { usePromotions } from "@/hooks/usePromotions"
import { groupWrestlers } from "@/lib/groupWrestlers"
import GroupByBar from "@/components/GroupByBar"
import WrestlerSmallCard from "@/components/WrestlerSmallCard"

type Props = {
  visible: boolean
  selectedIds: number[]
  onToggle: (id: number) => void
  onClose: () => void
}

export default function WrestlerMultiPicker({ visible, selectedIds, onToggle, onClose }: Props) {
  const { data: lookup } = useWrestlerLookup()
  const { data: territories } = useTerritories()
  const { data: promotions } = usePromotions()
  const [search, setSearch] = useState("")
  const [groupBy, setGroupBy] = useState<GroupCategory>("gender")

  const wrestlers = lookup ? Array.from(lookup.values()) : []

  const filtered = wrestlers.filter((w) =>
    w.name.toLowerCase().includes(search.trim().toLowerCase())
  )

  const labelMaps = useMemo(() => ({
    territoryId: Object.fromEntries((territories ?? []).map((t) => [String(t.id), t.name])),
    promotionId: Object.fromEntries((promotions ?? []).map((p) => [String(p.id), p.name])),
  }), [territories, promotions])

  // group, then wrap each section's data into a single row-array (grid trick)
  const sections = useMemo(() => {
    const grouped = groupWrestlers(filtered, groupBy, labelMaps)
    return grouped.map((s) => ({ title: s.title, data: [s.data] }))
  }, [filtered, groupBy, labelMaps])

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View style={{ width: 26 }} />
            <Text style={styles.title}>Select Wrestlers</Text>
            <TouchableOpacity onPress={onClose} accessibilityLabel="Done">
              <Ionicons name="checkmark" color={colors.accent} size={26} />
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.search}
            placeholder="Search…"
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <GroupByBar active={groupBy} onChange={setGroupBy} />

          <SectionList
            sections={sections}
            keyExtractor={(item, index) => `row-${index}`}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.list}
            stickySectionHeadersEnabled
            renderItem={({ item }) => (
              <View style={styles.grid}>
                {item.map((w) => (
                  <WrestlerSmallCard
                    key={w.id}
                    wrestler={w}
                    selectable
                    selected={selectedIds.includes(w.id)}
                    onPress={() => onToggle(w.id)}
                  />
                ))}
              </View>
            )}
            renderSectionHeader={({ section }) =>
              section.title ? <Text style={styles.section_header}>{section.title.toUpperCase()}</Text> : null
            }
          />
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "flex-end" },
  sheet: { backgroundColor: colors.background, borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: "85%", paddingTop: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 24, marginBottom: 16 },
  title: { fontFamily: fonts.bold, fontSize: 18, color: colors.text },
  search: {
    marginHorizontal: 24, marginBottom: 12, backgroundColor: colors.surface, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12, color: colors.text, fontFamily: fonts.regular, fontSize: 15,
  },
  list: { paddingHorizontal: 24, paddingBottom: 24 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 8 },
  section_header: {
    fontFamily: fonts.heading, fontSize: 13, color: colors.textMuted,
    backgroundColor: colors.background, paddingVertical: 8,
  },
})