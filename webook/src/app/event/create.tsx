import { useMemo, useState } from "react"
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native"
import { router, useLocalSearchParams } from "expo-router"
import Ionicons from "@expo/vector-icons/Ionicons"
import { colors, fonts } from "@/styles/theme"
import { EventType, Placement } from "@/types/event"
import { useMatchTypes } from "@/hooks/useLookups"
import { useChampionships } from "@/hooks/useChampionships"
import { useStipulations } from "@/hooks/useStipulations"
import { useWrestlerLookup } from "@/hooks/useWrestlerLookup"
import { useCreateEvent, EventCreate } from "@/hooks/useCreateEvent"
import SelectField from "@/components/SelectField"
import WrestlerMultiPicker from "@/components/WrestlerMultiPicker"
import WrestlerSmallCard from "@/components/WrestlerSmallCard"
import StarRating from "@/components/StarRating"
import { useShow } from "@/hooks/useShow"

const EVENT_TYPES: EventType[] = ["MATCH", "PROMO", "SEGMENT", "BRAWL"]
const PLACEMENTS: Placement[] = ["UNDER", "MID", "SEMI", "MAIN"]
const PLACEMENT_LABELS: Record<Placement, string> = {
  UNDER: "Undercard", MID: "Mid Card", SEMI: "Semi Main", MAIN: "Main Event",
}

export default function CreateEventScreen() {
  const { showId, placement: initialPlacement } = useLocalSearchParams<{ 
    showId: string; 
    placement?: Placement 
  }>()
  
  const showIdNum = Number(showId)
  const { data: show } = useShow(showIdNum)

  const [type, setType] = useState<EventType>("MATCH")
  const [placement, setPlacement] = useState<Placement>(initialPlacement ?? "MID")
  const [matchTypeId, setMatchTypeId] = useState<number | null>(null)
  const [championshipId, setChampionshipId] = useState<number | null>(null)
  const [rating, setRating] = useState<number | null>(null)
  const [wrestlerIds, setWrestlerIds] = useState<number[]>([])
  const [stipulationIds, setStipulationIds] = useState<number[]>([])
  const [pickerOpen, setPickerOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { data: matchTypes } = useMatchTypes()
  const { data: championships } = useChampionships()
  const { data: stipulations } = useStipulations()
  const { data: lookup } = useWrestlerLookup()
  const create = useCreateEvent()

  const wrestlersAlreadyOnShow = useMemo(() => {
    if (!show?.events) return [];
    return show.events.flatMap(event => 
      event.wrestlers?.map(w => w.id) || []
    );
  }, [show]);

  const promotionChampionships = show
    ? Array.from(championships?.values() ?? []).filter((c) => c.promotionId === show.promotionId)
    : []

  const toggleWrestler = (id: number) =>
    setWrestlerIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]))
  const toggleStip = (id: number) =>
    setStipulationIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]))

  const submit = () => {
    if (type === "MATCH" && matchTypeId == null) return setError("Match type is required for matches.")
    if (wrestlerIds.length === 0) return setError("At least one wrestler is required.")
    setError(null)

    const payload: EventCreate = {
      type, placement, showId: showIdNum,
      matchTypeId: type === "MATCH" ? matchTypeId : null,
      championshipId,
      wrestlerIds, stipulationIds,
      rating,
    }
    create.mutate(payload, { onSuccess: () => router.back() })
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>New Event</Text>
        <TouchableOpacity style={styles.save} disabled={create.isPending} onPress={submit} accessibilityLabel="Create event">
          {create.isPending
            ? <ActivityIndicator color={colors.text} size="small" />
            : <Ionicons name="checkmark" color={colors.text} size={22} />}
        </TouchableOpacity>
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
      {create.isError && <Text style={styles.error}>Couldn't create event.</Text>}

      <SelectField label="Type" value={type}
        options={EVENT_TYPES.map((t) => ({ value: t, label: t }))}
        onChange={setType} />
      <SelectField label="Placement" value={placement}
        options={PLACEMENTS.map((p) => ({ value: p, label: PLACEMENT_LABELS[p] }))}
        onChange={setPlacement} />

      {type === "MATCH" && (
        <SelectField label="Match Type" value={matchTypeId ?? 0}
          options={[...(matchTypes ? Array.from(matchTypes, ([id, name]) => ({ value: id, label: name })) : [])]}
          onChange={(v) => setMatchTypeId(v || null)} />
      )}

      <SelectField label="Championship (optional)" value={championshipId ?? 0}
        options={[
          { value: 0, label: "None" },
          ...promotionChampionships.map((c) => ({ value: c.id, label: c.name })),
        ]}
        onChange={(v) => setChampionshipId(v || null)} />

      <Text style={styles.section}>MATCH RATING (OPTIONAL)</Text>
      <StarRating rating={rating} interactive onChange={setRating} />

      <Text style={styles.section}>WRESTLERS</Text>
      <TouchableOpacity style={styles.add_btn} onPress={() => setPickerOpen(true)} activeOpacity={0.7}>
        <Ionicons name="add" color={colors.accent} size={18} />
        <Text style={styles.add_text}>Add Wrestlers</Text>
      </TouchableOpacity>
      {wrestlerIds.length > 0 && (
        <View style={styles.small_cards}>
          {wrestlerIds.map((id) => {
            const w = lookup?.get(id)
            return w ? <WrestlerSmallCard key={id} wrestler={w} /> : null
          })}
        </View>
      )}

      <Text style={styles.section}>STIPULATIONS</Text>
      <View style={styles.chips}>
        {(stipulations ?? []).map((s) => {
          const active = stipulationIds.includes(s.id)
          return (
            <TouchableOpacity
              key={s.id}
              style={[styles.chip, active && styles.chip_active]}
              onPress={() => toggleStip(s.id)}
              activeOpacity={0.7}
            >
              <Text style={[styles.chip_text, active && styles.chip_text_active]}>{s.name}</Text>
            </TouchableOpacity>
          )
        })}
      </View>

      <WrestlerMultiPicker
        visible={pickerOpen}
        selectedIds={wrestlerIds}
        alreadyBookedIds={wrestlersAlreadyOnShow}
        onToggle={toggleWrestler}
        onClose={() => setPickerOpen(false)}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 24, paddingBottom: 60 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  title: { fontFamily: fonts.bold, fontSize: 28, color: colors.text },
  save: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" },
  section: { fontFamily: fonts.heading, fontSize: 14, color: colors.textMuted, marginTop: 12, marginBottom: 14 },
  add_btn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: colors.accent, borderStyle: "dashed" },
  add_text: { fontFamily: fonts.medium, fontSize: 14, color: colors.accent },
  small_cards: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 14 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  chip_active: { backgroundColor: colors.accent, borderColor: colors.accent },
  chip_text: { fontFamily: fonts.medium, fontSize: 14, color: colors.textMuted },
  chip_text_active: { color: colors.text },
  error: { fontFamily: fonts.regular, fontSize: 13, color: colors.primary, marginBottom: 16, textAlign: "center" },
})