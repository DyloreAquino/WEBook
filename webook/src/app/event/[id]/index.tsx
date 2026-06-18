import { useState, useEffect } from "react"
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput } from "react-native"
import { router, useLocalSearchParams } from "expo-router"
import Ionicons from "@expo/vector-icons/Ionicons"
import { colors, fonts } from "@/styles/theme"
import { EventType, Placement } from "@/types/event"
import { useEvent } from "@/hooks/useEvent"
import { useUpdateEvent, EventUpdate } from "@/hooks/useUpdateEvent"
import { useDeleteEvent } from "@/hooks/useDeleteEvent"
import { useMatchTypes } from "@/hooks/useLookups"
import { useChampionships } from "@/hooks/useChampionships"
import { useStipulations } from "@/hooks/useStipulations"
import { useWrestlerLookup } from "@/hooks/useWrestlerLookup"
import { useShow } from "@/hooks/useShow"
import SelectField from "@/components/SelectField"
import EventTag from "@/components/EventTag"
import WrestlerCard from "@/components/WrestlerCard"
import WrestlerMultiPicker from "@/components/WrestlerMultiPicker"
import ConfirmModal from "@/components/ConfirmModal"
import StarRating from "@/components/StarRating"
import { TYPE_TAG, PLACEMENT_TAG } from "@/lib/eventTags"

const EVENT_TYPES: EventType[] = ["MATCH", "PROMO", "SEGMENT", "BRAWL"]
const PLACEMENTS: Placement[] = ["UNDER", "MID", "SEMI", "MAIN"]
const PLACEMENT_LABELS: Record<Placement, string> = {
  UNDER: "Undercard", MID: "Mid Card", SEMI: "Semi Main", MAIN: "Main Event",
}

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const eventId = Number(id)
  const { data: event, isLoading, isError } = useEvent(eventId)

  const { data: matchTypes } = useMatchTypes()
  const { data: championships } = useChampionships()
  const { data: stipulations } = useStipulations()
  const { data: lookup } = useWrestlerLookup()
  const { data: show } = useShow(event?.showId ?? null)

  const update = useUpdateEvent(eventId, event?.showId ?? 0)
  const del = useDeleteEvent(event?.showId ?? 0)

  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<EventUpdate>({})
  const [pickerOpen, setPickerOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  useEffect(() => {
    if (editing && event) {
      setDraft({
        type: event.type, placement: event.placement,
        matchTypeId: event.matchTypeId, championshipId: event.championshipId,
        notes: event.notes,
        wrestlerIds: (event.wrestlers ?? []).map((w) => w.id),
        stipulationIds: (event.stipulations ?? []).map((s) => s.id),
        rating: event.rating ?? null,
      })
    }
  }, [editing, event])

  if (isLoading) return <View style={[styles.screen, styles.center]}><ActivityIndicator color={colors.accent} size="large" /></View>
  if (isError || !event) return <View style={[styles.screen, styles.center]}><Text style={styles.err}>Couldn't load event.</Text></View>

  const matchTypeName = event.matchTypeId != null ? matchTypes?.get(event.matchTypeId) ?? null : null
  const championshipName = event.championshipId != null ? championships?.get(event.championshipId)?.name ?? null : null

  const promotionChampionships = show
    ? Array.from(championships?.values() ?? []).filter((c) => c.promotionId === show.promotionId)
    : []

  const toggleWrestler = (wid: number) =>
    setDraft((d) => {
      const ids = d.wrestlerIds ?? []
      return { ...d, wrestlerIds: ids.includes(wid) ? ids.filter((x) => x !== wid) : [...ids, wid] }
    })
  const toggleStip = (sid: number) =>
    setDraft((d) => {
      const ids = d.stipulationIds ?? []
      return { ...d, stipulationIds: ids.includes(sid) ? ids.filter((x) => x !== sid) : [...ids, sid] }
    })

  const save = () => update.mutate(draft, { onSuccess: () => setEditing(false) })

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>{TYPE_TAG[event.type]?.label ?? event.type}</Text>
        <View style={styles.header_btns}>
          {!editing && (
            <TouchableOpacity
              style={styles.icon_btn}
              onPress={() => router.push({ pathname: "/event/[id]/simulate", params: { id: eventId } })}
              accessibilityLabel="Simulate event"
            >
              <Ionicons name="play" color={colors.text} size={20} />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.icon_btn} onPress={() => editing ? save() : setEditing(true)} disabled={update.isPending}>
            {update.isPending
              ? <ActivityIndicator color={colors.text} size="small" />
              : <Ionicons name={editing ? "checkmark" : "pencil"} color={editing ? colors.accent : colors.text} size={20} />}
          </TouchableOpacity>
          {editing && (
            <TouchableOpacity style={styles.icon_btn} onPress={() => setEditing(false)}>
              <Ionicons name="close" color={colors.text} size={20} />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.icon_btn} onPress={() => setConfirmOpen(true)} accessibilityLabel="Delete event">
            <Ionicons name="trash" color={colors.primary} size={20} />
          </TouchableOpacity>
        </View>
      </View>

      {editing ? (
        <View style={styles.edit}>
          <SelectField label="Type" value={draft.type ?? event.type}
            options={EVENT_TYPES.map((t) => ({ value: t, label: t }))}
            onChange={(v) => setDraft((d) => ({ ...d, type: v }))} />
          <SelectField label="Placement" value={draft.placement ?? event.placement}
            options={PLACEMENTS.map((p) => ({ value: p, label: PLACEMENT_LABELS[p] }))}
            onChange={(v) => setDraft((d) => ({ ...d, placement: v }))} />
          {(draft.type ?? event.type) === "MATCH" && (
            <SelectField label="Match Type" value={draft.matchTypeId ?? 0}
              options={matchTypes ? Array.from(matchTypes, ([mid, name]) => ({ value: mid, label: name })) : []}
              onChange={(v) => setDraft((d) => ({ ...d, matchTypeId: v || null }))} />
          )}
          <SelectField label="Championship" value={draft.championshipId ?? 0}
            options={[{ value: 0, label: "None" }, ...promotionChampionships.map((c) => ({ value: c.id, label: c.name }))]}
            onChange={(v) => setDraft((d) => ({ ...d, championshipId: v || null }))} />

          <Text style={styles.section}>MATCH RATING</Text>
          <StarRating 
            rating={draft.rating !== undefined ? draft.rating : (event.rating ?? null)} 
            interactive 
            onChange={(r) => setDraft((d) => ({ ...d, rating: r }))} 
          />

          <Text style={styles.section}>NOTES</Text>
          <TextInput
            style={styles.notes_input}
            value={draft.notes ?? ""}
            onChangeText={(t) => setDraft((d) => ({ ...d, notes: t || null }))}
            placeholder="Match notes…"
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <Text style={styles.section}>WRESTLERS</Text>
          <TouchableOpacity style={styles.add_btn} onPress={() => setPickerOpen(true)} activeOpacity={0.7}>
            <Ionicons name="add" color={colors.accent} size={18} />
            <Text style={styles.add_text}>Edit Wrestlers</Text>
          </TouchableOpacity>

          <Text style={styles.section}>STIPULATIONS</Text>
          <View style={styles.chips}>
            {(stipulations ?? []).map((s) => {
              const active = (draft.stipulationIds ?? []).includes(s.id)
              return (
                <TouchableOpacity key={s.id} style={[styles.chip, active && styles.chip_active]} onPress={() => toggleStip(s.id)} activeOpacity={0.7}>
                  <Text style={[styles.chip_text, active && styles.chip_text_active]}>{s.name}</Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>
      ) : (
        <>
          <View style={styles.tags}>
            {matchTypeName && <EventTag label={matchTypeName} bg="#1a4a4a" />}
            <EventTag label={PLACEMENT_TAG[event.placement]?.label ?? event.placement}
                      bg={PLACEMENT_TAG[event.placement]?.bg ?? "#3a3a3a"} />
            {event.stipulations?.map((s) => <EventTag key={s.id} label={s.name} bg="#43352a" />)}
          </View>
          {championshipName ? <Text style={styles.meta}>{championshipName}</Text> : null}

          <View style={styles.rating_display_box}>
            <StarRating rating={event.rating ?? null} />
          </View>

          {event.notes ? (
            <>
              <View style={styles.notes_box}>
                <Text style={styles.notes_text}>{event.notes}</Text>
              </View>
            </>
          ) : null}

          <Text style={styles.section}>WRESTLERS</Text>
          <View style={styles.wrestler_list}>
            {(event.wrestlers ?? []).map((w) => (
              <WrestlerCard key={w.id} wrestler={w} isWinner={Boolean(w.isWinner)} finishType={w.finishType ?? null} />
            ))}
          </View>
        </>
      )}

      <WrestlerMultiPicker
        visible={pickerOpen}
        selectedIds={draft.wrestlerIds ?? []}
        onToggle={toggleWrestler}
        onClose={() => setPickerOpen(false)}
      />
      <ConfirmModal
        visible={confirmOpen}
        title="Delete event?"
        message="This removes the event from the show. This can't be undone."
        confirmLabel="Delete"
        destructive
        loading={del.isPending}
        onConfirm={() => del.mutate(eventId, { onSuccess: () => { setConfirmOpen(false); router.back() } })}
        onCancel={() => setConfirmOpen(false)}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  notes_box: { padding: 8, borderBottomWidth:1, borderColor:colors.surface, marginTop:8 },
  notes_text: { fontFamily: fonts.regular, fontSize: 14, color: colors.text, lineHeight: 21 },
  wrestler_list: { gap:12 },
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 24, paddingBottom: 60 },
  center: { justifyContent: "center", alignItems: "center" },
  err: { fontFamily: fonts.bold, fontSize: 16, color: colors.text },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  title: { fontFamily: fonts.bold, fontSize: 28, color: colors.text, flex: 1 },
  header_btns: { flexDirection: "row", gap: 8 },
  icon_btn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 10 },
  meta: { fontFamily: fonts.regular, fontSize: 14, color: colors.textMuted, marginBottom: 10 },
  section: { fontFamily: fonts.heading, fontSize: 14, color: colors.textMuted, marginTop: 16, marginBottom: 12 },
  edit: {},
  add_btn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: colors.accent, borderStyle: "dashed" },
  add_text: { fontFamily: fonts.medium, fontSize: 14, color: colors.accent },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  chip_active: { backgroundColor: colors.accent, borderColor: colors.accent },
  chip_text: { fontFamily: fonts.medium, fontSize: 14, color: colors.textMuted },
  chip_text_active: { color: colors.text },
  notes_input: { backgroundColor: colors.surface, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, color: colors.text, fontFamily: fonts.regular, fontSize: 15, borderWidth: 1, borderColor: colors.border, minHeight: 100 },
  rating_display_box: { marginBottom: 10, marginTop: 4 },
})