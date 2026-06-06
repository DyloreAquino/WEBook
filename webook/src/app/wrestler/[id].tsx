import { useLocalSearchParams } from "expo-router"
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native"
import Ionicons from "@expo/vector-icons/Ionicons"
import { colors, fonts } from "@/styles/theme"
import { useWrestler } from "@/hooks/useWrestler"
import { useWrestlerLookup } from "@/hooks/useWrestlerLookup"
import { useTerritories } from "@/hooks/useTerritories"
import { usePromotions } from "@/hooks/usePromotions"
import WrestlerTag from "@/components/WrestlerTag"
import StatBar from "@/components/StatBar"
import RelationRow from "@/components/RelationRow"
import { useState, useEffect } from "react"
import { TextInput } from "react-native"
import SelectField from "@/components/SelectField"
import { useUpdateWrestler, WrestlerUpdate } from "@/hooks/useUpdateWrestler"
import { Gender, Allegiance, Role } from "@/types/wrestler"
import WrestlerPickerModal from "@/components/WrestlerPickerModal"
import HistoryModal from "@/components/HistoryModal"

const STAT_KEYS = ["popularity", "strength", "skill", "agility", "stamina", "attitude"] as const
const RELATIONS = [
  ["Manager", "managerId"],
  ["Partner", "partnerId"],
  ["Story Friend", "storyFriendId"],
  ["Story Enemy", "storyEnemyId"],
  ["Real Friend", "realFriendId"],
  ["Real Enemy", "realEnemyId"],
] as const

const GENDERS: Gender[] = ["MALE", "FEMALE", "N/A"]
const ALLEGIANCES: Allegiance[] = ["FACE", "HEEL", "TWEENER"]
const ROLES: Role[] = ["WRESTLER", "MANAGER", "REFEREE", "BOOKER", "CIVILIAN"]

const STATS = [
  ["Popularity", "popularity"], ["Strength", "strength"], ["Skill", "skill"],
  ["Agility", "agility"], ["Stamina", "stamina"], ["Attitude", "attitude"],
] as const

export default function WrestlerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const wrestlerId = Number(id)
  const { data: w, isLoading, isError } = useWrestler(wrestlerId)
  const { data: lookup } = useWrestlerLookup()
  const { data: territories } = useTerritories()
  const { data: promotions } = usePromotions()
  const resolve = (id: number | null) => (id != null ? lookup?.get(id) ?? null : null)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<WrestlerUpdate>({})
  const [pickerField, setPickerField] = useState<typeof RELATIONS[number][1] | null>(null)
  const update = useUpdateWrestler(wrestlerId)
  const [historyOpen, setHistoryOpen] = useState(false)


  // which fields are editable — compare draft against the loaded wrestler
  const EDITABLE_KEYS = [
    "name",
    "gender", "allegiance", "role", "territoryId", "promotionId", "finisherName",
    ...STAT_KEYS,
    "managerId", "partnerId", "storyFriendId", "storyEnemyId", "realFriendId", "realEnemyId",
  ] as const

  const hasChanges =
  editing && w
    ? EDITABLE_KEYS.some((k) => draft[k] !== undefined && draft[k] !== w[k])
    : false

  useEffect(() => {
    if (editing && w) {
      setDraft({
        name: w.name,
        gender: w.gender, allegiance: w.allegiance, role: w.role,
        territoryId: w.territoryId, promotionId: w.promotionId, finisherName: w.finisherName,
        popularity: w.popularity, strength: w.strength, skill: w.skill,
        agility: w.agility, stamina: w.stamina, attitude: w.attitude,
        managerId: w.managerId, partnerId: w.partnerId,
        storyFriendId: w.storyFriendId, storyEnemyId: w.storyEnemyId,
        realFriendId: w.realFriendId, realEnemyId: w.realEnemyId,
      })
    }
  }, [editing, w])

  const applyEdits = () => {
    const clamped = { ...draft }
    for (const k of STAT_KEYS) {
      if (clamped[k] != null) clamped[k] = Math.max(50, Math.min(100, clamped[k] as number))
    }
    update.mutate(clamped, { onSuccess: () => setEditing(false) })
  }

  const setStat = (key: typeof STAT_KEYS[number], raw: string) => {
    const v = raw.trim() === "" ? undefined : Number(raw)
    setDraft((d) => ({ ...d, [key]: v }))
  }


  if (isLoading) {
    return <View style={[styles.screen, styles.center]}><ActivityIndicator color={colors.accent} size="large" /></View>
  }
  if (isError || !w) {
    return <View style={[styles.screen, styles.center]}><Text style={styles.errorText}>Couldn't load wrestler.</Text></View>
  }

  const territoryName = territories?.find((t) => t.id === w.territoryId)?.name ?? String(w.territoryId)
  const promotionName = promotions?.find((p) => p.id === w.promotionId)?.name ?? String(w.promotionId)

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {/* header: name + edit + history buttons */}
      <View style={styles.header}>
        {editing ? (
          <TextInput
            style={styles.name_input}
            value={draft.name ?? w.name}
            onChangeText={(t) => setDraft((d) => ({ ...d, name: t }))}
            placeholder="Wrestler name"
            placeholderTextColor={colors.textMuted}
            numberOfLines={1}
          />
        ) : (
          <Text style={styles.name} numberOfLines={2}>{w.name}</Text>
        )}
        <View style={styles.header_buttons}>
          <TouchableOpacity
            style={styles.icon_button}
            disabled={update.isPending}
            accessibilityLabel={
              !editing ? "Edit wrestler" : hasChanges ? "Save changes" : "Cancel edit"
            }
            onPress={() => {
              if (!editing) {
                setEditing(true)
              } else if (hasChanges) {
                applyEdits()        // commit + exits on success
              } else {
                setEditing(false)   // nothing changed, just leave edit mode
              }
            }}
          >
            {update.isPending ? (
              <ActivityIndicator color={colors.accent} size="small" />
            ) : (
              <Ionicons
                name={!editing ? "pencil" : hasChanges ? "checkmark" : "close"}
                color={hasChanges ? colors.accent : colors.text}
                size={20}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.icon_button} accessibilityLabel="Wrestler history" onPress={() => setHistoryOpen(true)}>
            <Ionicons name="book" color={colors.text} size={20} />
          </TouchableOpacity>
        </View>
      </View>

      {editing ? (
        <>
          {update.isError && <Text style={styles.edit_error}>Couldn't save changes.</Text>}

          <View style={styles.edit_block}>
            <SelectField
              label="Gender" value={draft.gender ?? w.gender}
              options={GENDERS.map((g) => ({ value: g, label: g }))}
              onChange={(v) => setDraft((d) => ({ ...d, gender: v }))}
            />
            <SelectField
              label="Allegiance" value={draft.allegiance ?? w.allegiance}
              options={ALLEGIANCES.map((a) => ({ value: a, label: a }))}
              onChange={(v) => setDraft((d) => ({ ...d, allegiance: v }))}
            />
            <SelectField
              label="Role" value={draft.role ?? w.role}
              options={ROLES.map((r) => ({ value: r, label: r }))}
              onChange={(v) => setDraft((d) => ({ ...d, role: v }))}
            />
            <SelectField
              label="Territory" value={draft.territoryId ?? w.territoryId}
              options={(territories ?? []).map((t) => ({ value: t.id, label: t.name }))}
              onChange={(v) => setDraft((d) => ({ ...d, territoryId: v }))}
            />
            <SelectField
              label="Promotion" value={draft.promotionId ?? w.promotionId}
              options={(promotions ?? []).map((p) => ({ value: p.id, label: p.name }))}
              onChange={(v) => setDraft((d) => ({ ...d, promotionId: v }))}
            />
            <View style={styles.field}>
              <Text style={styles.edit_label}>Finisher</Text>
              <TextInput
                style={styles.text_input}
                value={draft.finisherName ?? w.finisherName}
                onChangeText={(t) => setDraft((d) => ({ ...d, finisherName: t }))}
                placeholder="Finisher name"
                placeholderTextColor={colors.textMuted}
              />
            </View>
          </View>
        </>
      ) : (
        <>
          <View style={styles.tags}>
            <WrestlerTag type="gender" value={w.gender} />
            <WrestlerTag type="allegiance" value={w.allegiance} />
            <WrestlerTag type="role" value={w.role} />
          </View>
          <View style={styles.info_block}>
            <InfoRow label="Finisher" value={w.finisherName} />
            <InfoRow label="Territory" value={territoryName} />
            <InfoRow label="Promotion" value={promotionName} />
          </View>
        </>
      )}

      <Text style={styles.section_title}>STATS</Text>
      {editing ? (
        STAT_KEYS.map((key) => (
          <View key={key} style={styles.stat_edit_row}>
            <Text style={styles.stat_edit_label}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
            <TextInput
              style={styles.stat_edit_input}
              keyboardType="numeric"
              value={draft[key]?.toString() ?? ""}
              onChangeText={(t) => setStat(key, t)}
              placeholder="50–100"
              placeholderTextColor={colors.textMuted}
            />
          </View>
        ))
      ) : (
        STATS.map(([label, key]) => (
          <StatBar key={key} label={label} value={w[key] as number} />
        ))
      )}

      <Text style={styles.section_title}>RELATIONSHIPS</Text>
      {editing ? (
        RELATIONS.map(([label, field]) => {
          const current = resolve(draft[field] as number | null)
          return (
            <TouchableOpacity
              key={field}
              style={styles.relation_edit_row}
              onPress={() => setPickerField(field)}
              activeOpacity={0.7}
            >
              <Text style={styles.relation_edit_label}>{label}</Text>
              <View style={styles.relation_edit_value}>
                <Text style={styles.relation_edit_name}>{current?.name ?? "None"}</Text>
                <Ionicons name="chevron-forward" color={colors.textMuted} size={18} />
              </View>
            </TouchableOpacity>
          )
        })
      ) : (
        RELATIONS.map(([label, field]) => (
          <RelationRow key={field} label={label} wrestler={resolve(w[field] as number | null)} />
        ))
      )}

      <WrestlerPickerModal
        visible={pickerField !== null}
        excludeId={w.id}
        currentId={pickerField ? (draft[pickerField] as number | null) : null}
        onSelect={(id) => {
          if (pickerField) setDraft((d) => ({ ...d, [pickerField]: id }))
          setPickerField(null)
        }}
        onClose={() => setPickerField(null)}
      />
      <HistoryModal 
        visible={historyOpen} 
        wrestlerName={w.name} 
        events={[...(w.events ?? [])].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )}
        onClose={() => setHistoryOpen(false)} />
    </ScrollView>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.info_row}>
      <Text style={styles.info_label}>{label}</Text>
      <Text style={styles.info_value}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 24, paddingTop: 8 },  // top margin to breathe
  center: { justifyContent: "center", alignItems: "center" },
  errorText: { fontFamily: fonts.bold, fontSize: 16, color: colors.text },
  header: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 },
  name: { flex: 1, fontFamily: fonts.bold, fontSize: 32, color: colors.text, marginRight: 12 },
  name_input: {
    flex: 1,
    fontFamily: fonts.bold,
    fontSize: 32,
    color: colors.text,
    marginRight: 12,
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 56,        // fixed single-line height for the 32px font
    width: 56
  },
  header_buttons: { flexDirection: "row", gap: 8, paddingTop: 4 },
  icon_button: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.surface, alignItems: "center", justifyContent: "center",
  },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 },
  info_block: { marginBottom: 24 },
  info_row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.border },
  info_label: { fontFamily: fonts.regular, fontSize: 15, color: colors.textMuted },
  info_value: { fontFamily: fonts.medium, fontSize: 15, color: colors.text },
  section_title: { fontFamily: fonts.heading, fontSize: 14, color: colors.textMuted, marginBottom: 14, marginTop: 8 },
  edit_block: { marginBottom: 24 },
  field: { marginBottom: 14 },
  edit_label: { fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted, marginBottom: 6 },
  text_input: {
    backgroundColor: colors.surface, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12,
    color: colors.text, fontFamily: fonts.regular, fontSize: 15,
    borderWidth: 1, borderColor: colors.border,
  },
  apply: { backgroundColor: colors.accent, borderRadius: 12, paddingVertical: 14, alignItems: "center", marginTop: 8, marginBottom:16 },
  apply_disabled: { opacity: 0.6 },
  apply_text: { fontFamily: fonts.bold, fontSize: 15, color: colors.text },
  edit_error: { fontFamily: fonts.regular, fontSize: 13, color: colors.primary, marginTop: 8, textAlign: "center" },
  stat_edit_row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  stat_edit_label: { fontFamily: fonts.regular, fontSize: 15, color: colors.text },
  stat_edit_input: {
    width: 90, backgroundColor: colors.surface, borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 8, textAlign: "center",
    color: colors.text, fontFamily: fonts.medium, fontSize: 15,
    borderWidth: 1, borderColor: colors.border,
  },
  relation_edit_row: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  relation_edit_label: { fontFamily: fonts.regular, fontSize: 15, color: colors.textMuted },
  relation_edit_value: { flexDirection: "row", alignItems: "center", gap: 6 },
  relation_edit_name: { fontFamily: fonts.medium, fontSize: 15, color: colors.text },
})