import { useState, useEffect } from "react"
import { ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native"
import { router, useLocalSearchParams } from "expo-router"
import Ionicons from "@expo/vector-icons/Ionicons"
import { colors, fonts } from "@/styles/theme"
import { FinishType } from "@/types/event"
import { useEvent } from "@/hooks/useEvent"
import { useSimulateEvent, SimulateResult } from "@/hooks/useSimulateEvent"
import SelectField from "@/components/SelectField"

const FINISH_TYPES: FinishType[] = [
  "UNFINISHED", "PIN", "SUBMISSION", "DISQUALIFICATION",
  "COUNTOUT", "TIMEOUT", "ELIMINATION", "SPECIAL",
]

// per-wrestler editable result in the form
type ResultDraft = { isWinner: boolean; finishType: FinishType }

export default function SimulateEventScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const eventId = Number(id)
  const { data: event, isLoading } = useEvent(eventId)
  const simulate = useSimulateEvent(eventId, event?.showId ?? 0)

  const [notes, setNotes] = useState("")
  // map of wrestlerId -> result draft
  const [results, setResults] = useState<Record<number, ResultDraft>>({})
  const [error, setError] = useState<string | null>(null)

  // seed results from the event's wrestlers (default: not winner, UNFINISHED)
  useEffect(() => {
    if (event?.wrestlers) {
      setResults((prev) => {
        const next: Record<number, ResultDraft> = {}
        for (const w of event.wrestlers!) {
          next[w.id] = prev[w.id] ?? {
            isWinner: Boolean(w.isWinner),
            finishType: (w.finishType as FinishType) ?? "UNFINISHED",
          }
        }
        return next
      })
    }
  }, [event])

  if (isLoading || !event) {
    return <View style={[styles.screen, styles.center]}><ActivityIndicator color={colors.accent} size="large" /></View>
  }

  const toggleWinner = (wid: number) =>
    setResults((r) => ({ ...r, [wid]: { ...r[wid], isWinner: !r[wid].isWinner } }))
  const setFinish = (wid: number, finishType: FinishType) =>
    setResults((r) => ({ ...r, [wid]: { ...r[wid], finishType } }))

  const submit = () => {
    const wrestlers = event.wrestlers ?? []
    // every wrestler needs a result (backend requires isWinner + finishType for all)
    const payload: SimulateResult[] = wrestlers.map((w) => ({
      wrestlerId: w.id,
      isWinner: results[w.id]?.isWinner ?? false,
      finishType: results[w.id]?.finishType ?? "UNFINISHED",
    }))
    if (payload.length === 0) return setError("This event has no wrestlers to simulate.")
    setError(null)
    simulate.mutate(
      { results: payload, notes: notes.trim() || undefined },
      { onSuccess: () => router.back() }
    )
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Simulate</Text>
        <TouchableOpacity style={styles.save} disabled={simulate.isPending} onPress={submit} accessibilityLabel="Run simulation">
          {simulate.isPending
            ? <ActivityIndicator color={colors.text} size="small" />
            : <Ionicons name="checkmark" color={colors.text} size={22} />}
        </TouchableOpacity>
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
      {simulate.isError && <Text style={styles.error}>Couldn't run simulation.</Text>}

      {/* notes */}
      <View style={styles.field}>
        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={styles.notes_input}
          value={notes}
          onChangeText={setNotes}
          placeholder="Match notes…"
          placeholderTextColor={colors.textMuted}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      {/* per-wrestler result */}
      <Text style={styles.section}>RESULTS</Text>
      {(event.wrestlers ?? []).map((w) => {
        const r = results[w.id]
        if (!r) return null
        return (
          <View key={w.id} style={styles.wrestler_block}>
            <TouchableOpacity
              style={styles.winner_row}
              onPress={() => toggleWinner(w.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.w_name} numberOfLines={1}>{w.name}</Text>
              <View style={[styles.check, r.isWinner && styles.check_on]}>
                {r.isWinner && <Ionicons name="checkmark" color={colors.text} size={16} />}
              </View>
            </TouchableOpacity>
            <SelectField
              label="Finish"
              value={r.finishType}
              options={FINISH_TYPES.map((f) => ({ value: f, label: f }))}
              onChange={(v) => setFinish(w.id, v)}
            />
          </View>
        )
      })}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 24, paddingBottom: 60 },
  center: { justifyContent: "center", alignItems: "center" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  title: { fontFamily: fonts.bold, fontSize: 28, color: colors.text },
  save: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center" },
  field: { marginBottom: 14 },
  label: { fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted, marginBottom: 6 },
  notes_input: {
    backgroundColor: colors.surface, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12,
    color: colors.text, fontFamily: fonts.regular, fontSize: 15, borderWidth: 1, borderColor: colors.border,
    minHeight: 100,
  },
  section: { fontFamily: fonts.heading, fontSize: 14, color: colors.textMuted, marginTop: 12, marginBottom: 14 },
  wrestler_block: {
    backgroundColor: colors.surface, borderRadius: 14, padding: 14, marginBottom: 12,
    borderWidth: 1, borderColor: colors.border,
  },
  winner_row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  w_name: { fontFamily: fonts.bold, fontSize: 16, color: colors.text, flex: 1, marginRight: 8 },
  check: {
    width: 28, height: 28, borderRadius: 8, borderWidth: 1, borderColor: colors.border,
    alignItems: "center", justifyContent: "center", backgroundColor: colors.background,
  },
  check_on: { backgroundColor: colors.accent, borderColor: colors.accent },
  error: { fontFamily: fonts.regular, fontSize: 13, color: colors.primary, marginTop: 16, textAlign: "center" },
})