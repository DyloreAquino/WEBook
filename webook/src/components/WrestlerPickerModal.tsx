// components/WrestlerPickerModal.tsx
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
  excludeId?: number              // hide the wrestler being edited (can't relate to self)
  currentId?: number | null       // highlight current selection
  onSelect: (id: number | null) => void
  onClose: () => void
}

export default function WrestlerPickerModal({ visible, excludeId, currentId, onSelect, onClose }: Props) {
  const { data: lookupMap } = useWrestlerLookup()
  const { data: territories } = useTerritories()
  const { data: promotions } = usePromotions()
  
  const [search, setSearch] = useState("")
  const [groupBy, setGroupBy] = useState<GroupCategory | "alphabetical">("gender")

  const wrestlers = lookupMap ? Array.from(lookupMap.values()) : []

  // Filter out excluded wrestler and apply search query
  const filtered = wrestlers
    .filter((w) => w.id !== excludeId)
    .filter((w) => w.name.toLowerCase().includes(search.trim().toLowerCase()))

  const labelMaps = useMemo(() => ({
    territoryId: Object.fromEntries((territories ?? []).map((t) => [String(t.id), t.name])),
    promotionId: Object.fromEntries((promotions ?? []).map((p) => [String(p.id), p.name])),
  }), [territories, promotions])

  // Process sections and format data blocks into rows for the grid layout trick
  const sections = useMemo(() => {
    if (groupBy === "alphabetical") {
      const sortedWrestlers = [...filtered].sort((a, b) => 
        (a.name || "").localeCompare(b.name || "")
      )

      const groups: Record<string, typeof filtered> = {}
      sortedWrestlers.forEach((wrestler) => {
        const firstLetter = wrestler.name ? wrestler.name.charAt(0).toUpperCase() : "#"
        const key = /[A-Z]/.test(firstLetter) ? firstLetter : "#"
        
        if (!groups[key]) groups[key] = []
        groups[key].push(wrestler)
      })

      return Object.keys(groups)
        .sort((a, b) => {
          if (a === "#") return 1
          if (b === "#") return -1
          return a.localeCompare(b)
        })
        .map((letter) => ({
          title: letter,
          data: [groups[letter]],
        }))
    }

    const grouped = groupWrestlers(filtered, groupBy as GroupCategory, labelMaps)
    return grouped.map((s) => ({ title: s.title, data: [s.data] }))
  }, [filtered, groupBy, labelMaps])

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} accessibilityLabel="Close picker">
              <Ionicons name="close" color={colors.text} size={26} />
            </TouchableOpacity>
            <Text style={styles.title}>Select Wrestler</Text>
            <View style={{ width: 26 }} />
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

          <GroupByBar active={groupBy as any} onChange={setGroupBy as any} />

          <SectionList
            sections={sections}
            keyExtractor={(item, index) => `row-${index}`}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.list}
            stickySectionHeadersEnabled
            ListHeaderComponent={
              <TouchableOpacity
                style={[styles.none_button, currentId == null && styles.none_button_active]}
                onPress={() => {
                  onSelect(null)
                  onClose()
                }}
                activeOpacity={0.7}
              >
                <Text style={[styles.none_text, currentId == null && styles.none_text_active]}>
                  None / Clear Selection
                </Text>
                {currentId == null && <Ionicons name="checkmark-circle" color={colors.text} size={18} />}
              </TouchableOpacity>
            }
            renderItem={({ item }) => (
              <View style={styles.grid}>
                {item.map((w) => (
                  <WrestlerSmallCard
                    key={w.id}
                    wrestler={w}
                    selectable
                    selected={currentId === w.id}
                    onPress={() => {
                      onSelect(w.id)
                      onClose()
                    }}
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
  list: { paddingHorizontal: 24, paddingBottom: 40 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 8 },
  section_header: {
    fontFamily: fonts.heading, fontSize: 13, color: colors.textMuted,
    backgroundColor: colors.background, paddingVertical: 8,
  },
  none_button: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    backgroundColor: colors.surface, borderStyle: "dashed", borderWidth: 1, borderColor: colors.border,
    borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginTop: 4, marginBottom: 12,
  },
  none_button_active: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  none_text: { fontFamily: fonts.medium, fontSize: 14, color: colors.textMuted },
  none_text_active: { color: colors.text },
})