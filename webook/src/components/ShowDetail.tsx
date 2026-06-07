// components/ShowDetail.tsx
import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator } from "react-native"
import { router } from "expo-router"
import Ionicons from "@expo/vector-icons/Ionicons"
import { colors, fonts } from "@/styles/theme"
import { Show, ShowType } from "@/types/show"
import { Placement } from "@/types/event"
import { useTerritories } from "@/hooks/useTerritories"
import { useMatchTypes } from "@/hooks/useLookups"
import { useChampionships } from "@/hooks/useChampionships"
import { useUpdateShow, ShowUpdate } from "@/hooks/useUpdateShow"
import { useDeleteShow } from "@/hooks/useDeleteShow"
import SelectField from "@/components/SelectField"
import ShowEventCard from "@/components/ShowEventCard"
import ConfirmModal from "@/components/ConfirmModal"

const SHOW_TYPES: ShowType[] = ["TV", "PPV", "SPECIAL"]  // verify your enum

// placement sections in card running order
const PLACEMENT_ORDER: { key: Placement; label: string }[] = [
  { key: "MAIN", label: "Main Event" },
  { key: "SEMI", label: "Semi Main" },
  { key: "MID", label: "Mid Card" },
  { key: "UNDER", label: "Undercard" },
]

export default function ShowDetail({ show, loading }: { show: Show; loading?: boolean }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<ShowUpdate>({})

  const { data: territories } = useTerritories()
  const { data: matchTypes } = useMatchTypes()
  const { data: championships } = useChampionships()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const update = useUpdateShow(show.id)
  const del = useDeleteShow()

  useEffect(() => {
    if (editing) setDraft({ name: show.name, type: show.type, territoryId: show.territoryId })
  }, [editing, show])

  const hasChanges =
    editing &&
    (draft.name !== show.name || draft.type !== show.type || draft.territoryId !== show.territoryId)

  const onEditPress = () => {
    if (!editing) setEditing(true)
    else if (hasChanges) update.mutate(draft, { onSuccess: () => setEditing(false) })
    else setEditing(false)
  }

  const territoryName = territories?.find((t) => t.id === show.territoryId)?.name ?? ""

  // group events by placement
  const sections = PLACEMENT_ORDER
    .map(({ key, label }) => ({
      label,
      data: (show.events ?? []).filter((e) => e.placement === key),
    }))
    .filter((s) => s.data.length > 0)

  return (
    <View style={styles.card}>
      {/* centered header — display or edit */}
      <View style={styles.header}>
        {editing ? (
          <View style={styles.edit_fields}>
            <TextInput
              style={styles.name_input}
              value={draft.name ?? ""}
              onChangeText={(t) => setDraft((d) => ({ ...d, name: t || null }))}
              placeholder="Show name"
              placeholderTextColor={colors.textMuted}
            />
            <SelectField label="Type" value={draft.type ?? show.type}
              options={SHOW_TYPES.map((t) => ({ value: t, label: t }))}
              onChange={(v) => setDraft((d) => ({ ...d, type: v }))} />
            <SelectField label="Territory" value={draft.territoryId ?? show.territoryId}
              options={(territories ?? []).map((t) => ({ value: t.id, label: t.name }))}
              onChange={(v) => setDraft((d) => ({ ...d, territoryId: v }))} />
          </View>
        ) : (
          <>
            <Text style={styles.title}>{show.name ?? "Untitled Show"}</Text>
            <Text style={styles.sub}>{[territoryName, `Week ${show.week}`].filter(Boolean).join(" · ")}</Text>
            <View style={styles.type_tag}><Text style={styles.type_text}>{show.type.toUpperCase()}</Text></View>
          </>
        )}
      </View>

      {/* actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.btn} onPress={onEditPress} disabled={update.isPending} activeOpacity={0.7}>
          {update.isPending
            ? <ActivityIndicator color={colors.text} size="small" />
            : <Ionicons name={!editing ? "pencil" : hasChanges ? "checkmark" : "close"}
                color={hasChanges ? colors.accent : colors.text} size={16} />}
          <Text style={styles.btn_text}>{!editing ? "Edit" : hasChanges ? "Save" : "Cancel"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={() => { /* simulate page — later */ }} activeOpacity={0.7}>
          <Ionicons name="play" color={colors.text} size={16} />
          <Text style={styles.btn_text}>Simulate</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.delete_btn} onPress={() => setConfirmOpen(true)} activeOpacity={0.7} accessibilityLabel="Delete show">
          <Ionicons name="trash" color={colors.primary} size={18} />
        </TouchableOpacity>
      </View>

      {/* add event */}
      <TouchableOpacity
        style={styles.add_event}
        onPress={() => router.push({ pathname: "/event/create", params: { showId: String(show.id) } })}
        activeOpacity={0.7}
      >
        <Ionicons name="add" color={colors.accent} size={18} />
        <Text style={styles.add_event_text}>Add Event</Text>
      </TouchableOpacity>

      {/* events grouped by placement */}
      <View style={styles.events}>
        {loading ? (
          <ActivityIndicator color={colors.accent} style={{ marginVertical: 20 }} />
        ) : sections.length === 0 ? (
          <Text style={styles.no_events}>No events booked yet</Text>
        ) : (
          sections.map((section) => (
            <View key={section.label}>
              <Text style={styles.section_title}>{section.label.toUpperCase()}</Text>
              {section.data.map((ev) => (
                <ShowEventCard
                  key={ev.id}
                  event={ev}
                  matchTypeName={ev.matchTypeId != null ? matchTypes?.get(ev.matchTypeId) ?? null : null}
                  championshipName={ev.championshipId != null ? championships?.get(ev.championshipId)?.name ?? null : null}
                  show={show}
                />
              ))}
            </View>
          ))
        )}
      </View>
      <ConfirmModal
        visible={confirmOpen}
        title="Delete show?"
        message="This removes the show and its events. This can't be undone."
        confirmLabel="Delete"
        destructive
        loading={del.isPending}
        onConfirm={() => del.mutate(show.id, { onSuccess: () => { setConfirmOpen(false); router.back() } })}
        onCancel={() => setConfirmOpen(false)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: 18, padding: 20 },
  header: { alignItems: "center", marginBottom: 16 },
  edit_fields: { width: "100%" },
  name_input: {
    backgroundColor: colors.background, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12,
    color: colors.text, fontFamily: fonts.bold, fontSize: 18, textAlign: "center", marginBottom: 12,
    borderWidth: 1, borderColor: colors.border,
  },
  title: { fontFamily: fonts.bold, fontSize: 20, color: colors.text, textAlign: "center" },
  sub: { fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted, marginTop: 4, marginBottom: 8 },
  type_tag: { backgroundColor: colors.accent, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 3 },
  type_text: { fontFamily: fonts.bold, fontSize: 11, color: colors.text },
  actions: { flexDirection: "row", gap: 8, marginBottom: 12 },
  btn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6,
    backgroundColor: colors.background, borderRadius: 10, paddingVertical: 12, borderWidth: 1, borderColor: colors.border,
  },
  btn_text: { fontFamily: fonts.medium, fontSize: 13, color: colors.text },
  delete_btn: {
    width: 44, backgroundColor: colors.background, borderRadius: 10,
    alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border,
  },
  add_event: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6,
    paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: colors.accent,
    borderStyle: "dashed", marginBottom: 18,
  },
  add_event_text: { fontFamily: fonts.medium, fontSize: 14, color: colors.accent },
  events: {},
  section_title: { fontFamily: fonts.heading, fontSize: 13, color: colors.textMuted, marginBottom: 10, marginTop: 6 },
  no_events: { fontFamily: fonts.regular, fontSize: 14, color: colors.textMuted, textAlign: "center", paddingVertical: 20 },
})