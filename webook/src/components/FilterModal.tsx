import { useEffect, useState } from "react"
import {
  Modal, View, Text, ScrollView, StyleSheet,
  TouchableOpacity, TextInput,
} from "react-native"
import { colors, fonts } from "@/styles/theme"
import { Gender, Allegiance, Role } from "@/types/wrestler"
import { WrestlerFilters, StatKey, STAT_KEYS } from "@/types/filters"
import FilterChipGroup from "@/components/FilterChipGroup"
import { useTerritories } from "@/hooks/useTerritories"
import { usePromotions } from "@/hooks/usePromotions"
import Ionicons from "@expo/vector-icons/Ionicons"

const GENDERS: Gender[] = ["MALE", "FEMALE", "N/A"]
const ALLEGIANCES: Allegiance[] = ["FACE", "HEEL", "TWEENER"]
const ROLES: Role[] = ["WRESTLER", "MANAGER", "REFEREE", "BOOKER", "CIVILIAN"]

const STAT_LABELS: Record<StatKey, string> = {
  popularity: "Popularity", strength: "Strength", skill: "Skill",
  agility: "Agility", stamina: "Stamina", attitude: "Attitude",
}

type FilterModalProps = {
  visible: boolean
  applied: WrestlerFilters
  onApply: (filters: WrestlerFilters) => void
  onClose: () => void
}

export default function FilterModal({ visible, applied, onApply, onClose }: FilterModalProps) {
  // draft = local edits; only pushed up on Apply
  const [draft, setDraft] = useState<WrestlerFilters>(applied)
  const { data: territories } = useTerritories()
  const { data: promotions } = usePromotions()

  // re-sync draft to the applied state each time the modal opens
  useEffect(() => {
    if (visible) setDraft(applied)
  }, [visible, applied])

  const setStat = (stat: StatKey, bound: "gte" | "lte", raw: string) => {
    const value = raw.trim() === "" ? undefined : Number(raw)
    setDraft((d) => ({
      ...d,
      stats: { ...d.stats, [stat]: { ...d.stats?.[stat], [bound]: value } },
    }))
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.heading}>Filters</Text>
            <View style={{ width: 26 }} />
            <TouchableOpacity onPress={onClose} accessibilityRole="button" accessibilityLabel="Close filters">
              <Ionicons name="close" color={colors.text} size={26} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
            <View style={styles.group}>
              <Text style={styles.field_title}>NAME</Text>
              <TextInput
                style={styles.input}
                placeholder="Search name…"
                placeholderTextColor={colors.textMuted}
                value={draft.name ?? ""}
                onChangeText={(t) => setDraft((d) => ({ ...d, name: t || undefined }))}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>   

            <FilterChipGroup
              title="Gender"
              options={GENDERS.map((g) => ({ value: g, label: g }))}
              selected={draft.gender ?? []}
              onChange={(v) => setDraft((d) => ({ ...d, gender: v.length ? v : undefined }))}
            />
            <FilterChipGroup
              title="Allegiance"
              options={ALLEGIANCES.map((a) => ({ value: a, label: a }))}
              selected={draft.allegiance ?? []}
              onChange={(v) => setDraft((d) => ({ ...d, allegiance: v.length ? v : undefined }))}
            />
            <FilterChipGroup
              title="Role"
              options={ROLES.map((r) => ({ value: r, label: r }))}
              selected={draft.role ?? []}
              onChange={(v) => setDraft((d) => ({ ...d, role: v.length ? v : undefined }))}
            />

            {territories && territories.length > 0 && (
              <FilterChipGroup
                title="Territory"
                options={territories.map((t) => ({ value: t.id, label: t.name }))}
                selected={draft.territoryId ?? []}
                onChange={(v) => setDraft((d) => ({ ...d, territoryId: v.length ? v : undefined }))}
              />
            )}
            {promotions && promotions.length > 0 && (
              <FilterChipGroup
                title="Promotion"
                options={promotions.map((p) => ({ value: p.id, label: p.name }))}
                selected={draft.promotionId ?? []}
                onChange={(v) => setDraft((d) => ({ ...d, promotionId: v.length ? v : undefined }))}
              />
            )}

            <Text style={styles.field_title}>STATS</Text>
            {STAT_KEYS.map((stat) => (
              <View key={stat} style={styles.stat_row}>
                <Text style={styles.stat_label}>{STAT_LABELS[stat]}</Text>
                <TextInput
                  style={styles.stat_input}
                  placeholder="min"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                  value={draft.stats?.[stat]?.gte?.toString() ?? ""}
                  onChangeText={(t) => setStat(stat, "gte", t)}
                />
                <TextInput
                  style={styles.stat_input}
                  placeholder="max"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                  value={draft.stats?.[stat]?.lte?.toString() ?? ""}
                  onChangeText={(t) => setStat(stat, "lte", t)}
                />
              </View>
            ))}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.reset_button} 
              onPress={() => { setDraft({}); onApply({}); onClose() }}
              activeOpacity={0.7}
            >
              <Text style={styles.reset_text}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.apply}
              onPress={() => { onApply(draft); onClose() }}
              activeOpacity={0.7}
            >
              <Text style={styles.apply_text}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: { 
    flex: 1,
    justifyContent: "flex-end"
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    maxHeight: "85%", paddingTop: 20,
      // shadow:
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -128 },  // negative height = shadow casts upward
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 20,  // android
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  heading: { fontFamily: fonts.bold, fontSize: 22, color: colors.text },
  body: { paddingHorizontal: 24, paddingBottom: 20 },
  group: { marginBottom: 20 },
  field_title: { fontFamily: fonts.heading, fontSize: 13, color: colors.textMuted, marginBottom: 10 },
  input: {
    backgroundColor: colors.surface, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12,
    color: colors.text, fontFamily: fonts.regular, fontSize: 15,
  },
  stat_row: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  stat_label: { flex: 1, fontFamily: fonts.regular, fontSize: 15, color: colors.text },
  stat_input: {
    width: 80, backgroundColor: colors.surface, borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 8,
    color: colors.text, fontFamily: fonts.regular, fontSize: 14, textAlign: "center",
  },
  footer: {
    flexDirection: "row", gap: 12, padding: 24,
    borderTopWidth: 1, borderTopColor: colors.border,
  },
  reset_button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: "center",
  },
  reset_text: { fontFamily: fonts.medium, fontSize: 15, color: colors.accent },
  apply: {
    flex: 2, paddingVertical: 14, borderRadius: 12,
    backgroundColor: colors.accent, alignItems: "center",
  },
  apply_text: { fontFamily: fonts.bold, fontSize: 15, color: colors.text },
})