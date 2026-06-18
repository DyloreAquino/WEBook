// components/ShowDetail.tsx
import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator } from "react-native"
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

const SHOW_TYPES: ShowType[] = ["TV", "PPV", "SPECIAL"]

const PLACEMENT_ORDER: { key: Placement; label: string }[] = [
  { key: "MAIN", label: "Main Event" },
  { key: "SEMI", label: "Semi Main" },
  { key: "MID", label: "Mid Card" },
  { key: "UNDER", label: "Undercard" },
]

// Determine max events per placement based on show type
const getPlacementLimits = (type: ShowType) => {
  if (type === "TV") {
    return { MAIN: 1, SEMI: 0, MID: 2, UNDER: 3 }
  }
  return { MAIN: 1, SEMI: 2, MID: 3, UNDER: 4 }
}

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

  // Calculate limits and build sections based on current events
  const limits = getPlacementLimits(show.type)
  const sections = PLACEMENT_ORDER
    .map(({ key, label }) => {
      const limit = limits[key as keyof typeof limits]
      const data = (show.events ?? []).filter((e) => e.placement === key)
      return {
        key,
        label,
        limit,
        count: data.length,
        data,
      }
    })
    .filter((s) => s.limit > 0) // Hide sections completely if limit is 0 (e.g., SEMI on TV)

  return (
    <View style={styles.card}>
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

      <View style={styles.actions}>
        <TouchableOpacity style={styles.delete_btn} onPress={() => setConfirmOpen(true)} activeOpacity={0.7} accessibilityLabel="Delete show">
          <Ionicons name="trash" color={colors.primary} size={18} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.delete_btn} onPress={onEditPress} disabled={update.isPending} activeOpacity={0.7}>
          {update.isPending
            ? <ActivityIndicator color={colors.text} size="small" />
            : <Ionicons name={!editing ? "pencil" : hasChanges ? "checkmark" : "close"}
                color={hasChanges ? colors.accent : colors.text} size={16} />}
        </TouchableOpacity>
      </View>

      <View style={styles.events}>
        {loading ? (
          <ActivityIndicator color={colors.accent} style={{ marginVertical: 20 }} />
        ) : (
          sections.map((section) => (
            <View key={section.key} style={styles.section_container}>
              <View style={styles.section_header}>
                <Text style={styles.section_title}>{section.label.toUpperCase()}</Text>
                <Text style={styles.section_count}>{section.count} / {section.limit}</Text>
              </View>

              {section.data.map((ev) => (
                <ShowEventCard
                  key={ev.id}
                  event={ev}
                  matchTypeName={ev.matchTypeId != null ? matchTypes?.get(ev.matchTypeId) ?? null : null}
                  championshipName={ev.championshipId != null ? championships?.get(ev.championshipId)?.name ?? null : null}
                  show={show}
                />
              ))}

              {/* Only show Add button if we haven't reached the limit */}
              {section.count < section.limit && (
                <TouchableOpacity
                  style={styles.add_section_event}
                  onPress={() => router.push({ 
                    pathname: "/event/create", 
                    params: { showId: String(show.id), placement: section.key } 
                  })}
                  activeOpacity={0.7}
                >
                  <Ionicons name="add" color={colors.accent} size={16} />
                  <Text style={styles.add_section_event_text}>Add {section.label}</Text>
                </TouchableOpacity>
              )}
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
        onConfirm={() => del.mutate(show.id, { onSuccess: () => { setConfirmOpen(false); } })}
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
  actions: { flexDirection: "row", gap: 8, marginBottom: 24, justifyContent:'center' },
  delete_btn: {
    height: 44, width: 44, backgroundColor: colors.background, borderRadius: 10,
    alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border,
  },
  events: {},
  section_container: { marginBottom: 20 },
  section_header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  section_title: { fontFamily: fonts.heading, fontSize: 13, color: colors.textMuted },
  section_count: { fontFamily: fonts.medium, fontSize: 12, color: colors.textMuted },
  add_section_event: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6,
    paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: colors.accent,
    borderStyle: "dashed", marginTop: 4,
  },
  add_section_event_text: { fontFamily: fonts.medium, fontSize: 13, color: colors.accent },
})