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
import { router } from "expo-router"

type Props = {
  visible: boolean
  selectedIds: number[]
  alreadyBookedIds?: number[] // 1. Add new prop for wrestlers already on the show
  onToggle: (id: number) => void
  onClose: () => void
}

export default function WrestlerMultiPicker({ 
  visible, 
  selectedIds, 
  alreadyBookedIds = [], // Default to empty array
  onToggle, 
  onClose 
}: Props) {
  const { data: lookup } = useWrestlerLookup()
  const { data: territories } = useTerritories()
  const { data: promotions } = usePromotions()
  const [search, setSearch] = useState("")
  const [groupBy, setGroupBy] = useState<GroupCategory | "alphabetical">("gender")

  const wrestlers = lookup ? Array.from(lookup.values()) : []

  const filtered = wrestlers.filter((w) =>
    w.name.toLowerCase().includes(search.trim().toLowerCase())
  )

  // 2. Optimize lookup efficiency using a Memoized Set
  const alreadyBookedSet = useMemo(() => new Set(alreadyBookedIds), [alreadyBookedIds])

  const labelMaps = useMemo(() => ({
    territoryId: Object.fromEntries((territories ?? []).map((t) => [String(t.id), t.name])),
    promotionId: Object.fromEntries((promotions ?? []).map((p) => [String(p.id), p.name])),
  }), [territories, promotions])

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

          <GroupByBar active={groupBy as any} onChange={setGroupBy as any} />

          <SectionList
            sections={sections}
            keyExtractor={(item, index) => `row-${index}`}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.list}
            stickySectionHeadersEnabled
            renderItem={({ item }) => (
              <View style={styles.grid}>
                {item.map((w) => {
                  // 3. Determine if this specific wrestler is booked elsewhere on the show
                  const isAlreadyBooked = alreadyBookedSet.has(w.id)

                  return (
                    <View 
                      key={w.id} 
                      style={[
                        styles.cardContainer,
                        isAlreadyBooked && styles.greyedOut
                      ]}
                    >
                      <WrestlerSmallCard
                        wrestler={w}
                        selectable
                        selected={selectedIds.includes(w.id)}
                        onPress={() => onToggle(w.id)}
                        onLongPress={() => router.push({ pathname: "/wrestler/[id]", params: { id: w.id } })}
                      />
                      
                      {/* 4. Overlay badge indicator to clearly explain why they're greyed out */}
                      {isAlreadyBooked && (
                        <View style={styles.bookedBadge}>
                          <Ionicons name="book" color={colors.text} size={16} />
                        </View>
                      )}
                    </View>
                  )
                })}
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
  // 5. Layout changes for the warning indicator treatment
  cardContainer: {
    position: "relative",
  },
  greyedOut: {
    opacity: 0.55, // Visually separates them while keeping press handlers active
  },
  bookedBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: colors.surface, // Uses theme surface fallback context
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  bookedBadgeText: {
    fontFamily: fonts.bold,
    fontSize: 8,
    color: colors.textMuted,
  },
})