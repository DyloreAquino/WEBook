import { useState } from "react"
import { ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native"
import { router } from "expo-router"
import Ionicons from "@expo/vector-icons/Ionicons"
import { colors, fonts } from "@/styles/theme"
import { Gender, Allegiance, Role } from "@/types/wrestler"
import { useTerritories } from "@/hooks/useTerritories"
import { usePromotions } from "@/hooks/usePromotions"
import { useWrestlerLookup } from "@/hooks/useWrestlerLookup"
import { useCreateWrestler, WrestlerCreate } from "@/hooks/useCreateWrestler"
import SelectField from "@/components/SelectField"
import WrestlerPickerModal from "@/components/WrestlerPickerModal"

const GENDERS: Gender[] = ["MALE", "FEMALE", "N/A"]
const ALLEGIANCES: Allegiance[] = ["FACE", "HEEL", "TWEENER"]
const ROLES: Role[] = ["WRESTLER", "MANAGER", "REFEREE", "BOOKER", "CIVILIAN"]
const STAT_KEYS = ["popularity", "strength", "skill", "agility", "stamina", "attitude"] as const
const RELATIONS = [
  ["Manager", "managerId"], ["Partner", "partnerId"],
  ["Story Friend", "storyFriendId"], ["Story Enemy", "storyEnemyId"],
  ["Real Friend", "realFriendId"], ["Real Enemy", "realEnemyId"],
] as const

// stats are strings in the form so they can be left blank; converted to numbers on submit
type FormState = Omit<WrestlerCreate, typeof STAT_KEYS[number]> & {
  popularity: string; strength: string; skill: string
  agility: string; stamina: string; attitude: string
}

const INITIAL: FormState = {
  name: "", gender: "MALE", allegiance: "FACE", role: "WRESTLER",
  territoryId: 0, promotionId: 0, finisherName: "",
  popularity: "", strength: "", skill: "", agility: "", stamina: "", attitude: "",
  managerId: null, partnerId: null, storyFriendId: null,
  storyEnemyId: null, realFriendId: null, realEnemyId: null,
}

export default function CreateWrestlerScreen() {
  const [form, setForm] = useState<FormState>(INITIAL)
  const [pickerField, setPickerField] = useState<typeof RELATIONS[number][1] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const { data: territories } = useTerritories()
  const { data: promotions } = usePromotions()
  const { data: lookup } = useWrestlerLookup()
  const create = useCreateWrestler()

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const setStat = (key: typeof STAT_KEYS[number], raw: string) => {
    const digitsOnly = raw.replace(/[^0-9]/g, "")
    setForm((f) => ({ ...f, [key]: digitsOnly }))
  }

  // show the picked wrestler's name, falling back to the id until the lookup loads
  const relationLabel = (id: number | null | undefined) =>
    id != null ? lookup?.get(id)?.name ?? `#${id}` : "None"

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

  const submit = () => {
    // text + selects
    if (form.name.trim() === "") return setError("Name is required.")
    if (form.finisherName.trim() === "") return setError("Finisher is required.")
    if (form.territoryId <= 0) return setError("Territory is required.")
    if (form.promotionId <= 0) return setError("Promotion is required.")

    // each stat must be filled and within 50–100
    for (const key of STAT_KEYS) {
      const value = form[key]
      if (value.trim() === "") return setError(`${capitalize(key)} is required.`)
      const num = Number(value)
      if (num < 50 || num > 100) return setError(`${capitalize(key)} must be between 50 and 100.`)
    }

    setError(null)

    const payload: WrestlerCreate = {
      ...form,
      popularity: Number(form.popularity),
      strength: Number(form.strength),
      skill: Number(form.skill),
      agility: Number(form.agility),
      stamina: Number(form.stamina),
      attitude: Number(form.attitude),
    }

    create.mutate(payload, {
      onSuccess: (created) =>
        router.replace({ pathname: "/wrestler/[id]", params: { id: created.id } }),
    })
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>New Wrestler</Text>
        <TouchableOpacity
          style={styles.save}
          disabled={create.isPending}
          onPress={submit}
          accessibilityLabel="Create wrestler"
        >
          {create.isPending
            ? <ActivityIndicator color={colors.text} size="small" />
            : <Ionicons name="checkmark" color={colors.text} size={22} />}
        </TouchableOpacity>
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
      {create.isError && <Text style={styles.error}>Couldn't create wrestler.</Text>}

      <View style={styles.field}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={form.name}
          onChangeText={(t) => set("name", t)}
          placeholder="Wrestler name"
          placeholderTextColor={colors.textMuted}
        />
      </View>

      <SelectField label="Gender" value={form.gender}
        options={GENDERS.map((g) => ({ value: g, label: g }))}
        onChange={(v) => set("gender", v)} />
      <SelectField label="Allegiance" value={form.allegiance}
        options={ALLEGIANCES.map((a) => ({ value: a, label: a }))}
        onChange={(v) => set("allegiance", v)} />
      <SelectField label="Role" value={form.role}
        options={ROLES.map((r) => ({ value: r, label: r }))}
        onChange={(v) => set("role", v)} />
      <SelectField label="Territory" value={form.territoryId}
        options={(territories ?? []).map((t) => ({ value: t.id, label: t.name }))}
        onChange={(v) => set("territoryId", v)} />
      <SelectField label="Promotion" value={form.promotionId}
        options={(promotions ?? []).map((p) => ({ value: p.id, label: p.name }))}
        onChange={(v) => set("promotionId", v)} />

      <View style={styles.field}>
        <Text style={styles.label}>Finisher</Text>
        <TextInput
          style={styles.input}
          value={form.finisherName}
          onChangeText={(t) => set("finisherName", t)}
          placeholder="Finisher name"
          placeholderTextColor={colors.textMuted}
        />
      </View>

      <Text style={styles.section}>STATS</Text>
      {STAT_KEYS.map((key) => (
        <View key={key} style={styles.stat_row}>
          <Text style={styles.stat_label}>{capitalize(key)}</Text>
          <TextInput
            style={styles.stat_input}
            keyboardType="numeric"
            value={form[key]}
            onChangeText={(t) => setStat(key, t)}
            placeholder="50–100"
            placeholderTextColor={colors.textMuted}
          />
        </View>
      ))}

      <Text style={styles.section}>RELATIONSHIPS</Text>
      {RELATIONS.map(([label, field]) => (
        <TouchableOpacity key={field} style={styles.relation_row} onPress={() => setPickerField(field)} activeOpacity={0.7}>
          <Text style={styles.relation_label}>{label}</Text>
          <View style={styles.relation_value}>
            <Text style={styles.relation_name}>{relationLabel(form[field])}</Text>
            <Ionicons name="chevron-forward" color={colors.textMuted} size={18} />
          </View>
        </TouchableOpacity>
      ))}

      <WrestlerPickerModal
        visible={pickerField !== null}
        currentId={pickerField ? form[pickerField] : null}
        onSelect={(id) => {
          if (pickerField) set(pickerField, id)
          setPickerField(null)
        }}
        onClose={() => setPickerField(null)}
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
  field: { marginBottom: 14 },
  label: { fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted, marginBottom: 6 },
  input: {
    backgroundColor: colors.surface, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12,
    color: colors.text, fontFamily: fonts.regular, fontSize: 15, borderWidth: 1, borderColor: colors.border,
  },
  section: { fontFamily: fonts.heading, fontSize: 14, color: colors.textMuted, marginTop: 12, marginBottom: 14 },
  stat_row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  stat_label: { fontFamily: fonts.regular, fontSize: 15, color: colors.text },
  stat_input: {
    width: 90, backgroundColor: colors.surface, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8,
    textAlign: "center", color: colors.text, fontFamily: fonts.medium, fontSize: 15, borderWidth: 1, borderColor: colors.border,
  },
  relation_row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  relation_label: { fontFamily: fonts.regular, fontSize: 15, color: colors.textMuted },
  relation_value: { flexDirection: "row", alignItems: "center", gap: 6 },
  relation_name: { fontFamily: fonts.medium, fontSize: 15, color: colors.text },
  error: { fontFamily: fonts.regular, fontSize: 13, color: colors.primary, textAlign: "center" },
})