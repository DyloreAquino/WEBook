// components/ReignModal.tsx
import { useState, useEffect } from "react"
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, ActivityIndicator } from "react-native"
import Ionicons from "@expo/vector-icons/Ionicons"
import { colors, fonts } from "@/styles/theme"
import { TitleReign } from "@/types/title_reign"
import { useWrestlerLookup } from "@/hooks/useWrestlerLookup"
import { useCreateReign, useUpdateReign, useEndReign } from "@/hooks/useReignMutations"
import SelectField from "@/components/SelectField"
import WrestlerMultiPicker from "@/components/WrestlerMultiPicker"
import WrestlerSmallCard from "@/components/WrestlerSmallCard"

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]
const MONTHS = MONTH_NAMES.map((label, i) => ({ value: i + 1, label }))
const WEEKS = [1, 2, 3, 4].map((w) => ({ value: w, label: `Week ${w}` }))

type Props = {
  visible: boolean
  championshipId: number
  reign: TitleReign | null   // null = create mode, otherwise edit
  onClose: () => void
}

export default function ReignModal({ visible, championshipId, reign, onClose }: Props) {
  const isEdit = reign != null
  const { data: lookup } = useWrestlerLookup()
  const create = useCreateReign(championshipId)
  const update = useUpdateReign(championshipId, reign?.id ?? 0)
  const end = useEndReign(championshipId)

  const [yearStart, setYearStart] = useState("")
  const [monthStart, setMonthStart] = useState(1)
  const [weekStart, setWeekStart] = useState(1)
  const [wrestlerIds, setWrestlerIds] = useState<number[]>([])
  const [pickerOpen, setPickerOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // seed from the reign when editing, or reset when creating
  useEffect(() => {
    if (!visible) return
    if (reign) {
      setYearStart(String(reign.yearStart))
      setMonthStart(reign.monthStart)
      setWeekStart(reign.weekStart)
      setWrestlerIds((reign.wrestlers ?? []).map((w) => w.id))
    } else {
      setYearStart(""); setMonthStart(1); setWeekStart(1); setWrestlerIds([])
    }
    setError(null)
  }, [visible, reign])

  const toggleWrestler = (id: number) =>
    setWrestlerIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]))

  const pending = create.isPending || update.isPending || end.isPending

  const save = () => {
    const year = Number(yearStart)
    if (!yearStart.trim() || !Number.isFinite(year)) return setError("Start year is required.")
    if (wrestlerIds.length === 0) return setError("At least one holder is required.")
    setError(null)

    if (isEdit) {
      update.mutate(
        { yearStart: year, monthStart, weekStart, wrestlerIds },
        { onSuccess: onClose }
      )
    } else {
      create.mutate(
        { championshipId, yearStart: year, monthStart, weekStart, yearEnd: null, monthEnd: null, weekEnd: null, wrestlerIds },
        { onSuccess: onClose }
      )
    }
  }

  const endThisReign = () => {
    if (reign) end.mutate(reign.id, { onSuccess: onClose })
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}><Ionicons name="close" color={colors.text} size={26} /></TouchableOpacity>
            <Text style={styles.title}>{isEdit ? "Edit Reign" : "New Reign"}</Text>
            <TouchableOpacity onPress={save} disabled={pending}>
              {pending ? <ActivityIndicator color={colors.accent} size="small" /> : <Ionicons name="checkmark" color={colors.accent} size={26} />}
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.body}>
            {error && <Text style={styles.error}>{error}</Text>}

            <Text style={styles.section}>HOLDERS</Text>
            <TouchableOpacity style={styles.add_btn} onPress={() => setPickerOpen(true)} activeOpacity={0.7}>
              <Ionicons name="add" color={colors.accent} size={18} />
              <Text style={styles.add_text}>Select Holders</Text>
            </TouchableOpacity>
            {wrestlerIds.length > 0 && (
              <View style={styles.cards}>
                {wrestlerIds.map((id) => {
                  const w = lookup?.get(id)
                  return w ? <WrestlerSmallCard key={id} wrestler={w} /> : null
                })}
              </View>
            )}

            <Text style={styles.section}>WON ON</Text>
            <View style={styles.field}>
              <Text style={styles.label}>Year</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={yearStart}
                onChangeText={(t) => setYearStart(t.replace(/[^0-9]/g, ""))}
                placeholder="Year"
                placeholderTextColor={colors.textMuted}
              />
            </View>
            <SelectField label="Month" value={monthStart} options={MONTHS} onChange={setMonthStart} />
            <SelectField label="Week" value={weekStart} options={WEEKS} onChange={setWeekStart} />

            {/* end reign — only in edit mode, only if still current */}
            {isEdit && reign?.yearEnd == null && (
              <TouchableOpacity style={styles.end_btn} onPress={endThisReign} disabled={pending} activeOpacity={0.7}>
                <Ionicons name="flag" color={colors.primary} size={18} />
                <Text style={styles.end_text}>End This Reign</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </View>

      <WrestlerMultiPicker
        visible={pickerOpen}
        selectedIds={wrestlerIds}
        onToggle={toggleWrestler}
        onClose={() => setPickerOpen(false)}
      />
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "flex-end" },
  sheet: { backgroundColor: colors.background, borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: "90%", paddingTop: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 24, marginBottom: 16 },
  title: { fontFamily: fonts.bold, fontSize: 18, color: colors.text },
  body: { paddingHorizontal: 24, paddingBottom: 30 },
  section: { fontFamily: fonts.heading, fontSize: 13, color: colors.textMuted, marginTop: 12, marginBottom: 12 },
  add_btn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: colors.accent, borderStyle: "dashed" },
  add_text: { fontFamily: fonts.medium, fontSize: 14, color: colors.accent },
  cards: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 14 },
  field: { marginBottom: 14 },
  label: { fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted, marginBottom: 6 },
  input: { backgroundColor: colors.surface, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, color: colors.text, fontFamily: fonts.regular, fontSize: 15, borderWidth: 1, borderColor: colors.border },
  end_btn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: colors.primary, marginTop: 20 },
  end_text: { fontFamily: fonts.medium, fontSize: 14, color: colors.primary },
  error: { fontFamily: fonts.regular, fontSize: 13, color: colors.primary, textAlign: "center", marginBottom: 12 },
})