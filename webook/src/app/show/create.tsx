import { useState } from "react"
import { ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native"
import { router, useLocalSearchParams } from "expo-router"
import Ionicons from "@expo/vector-icons/Ionicons"
import { colors, fonts } from "@/styles/theme"
import { ShowType } from "@/types/show"
import { useTerritories } from "@/hooks/useTerritories"
import { useCreateShow, ShowCreate } from "@/hooks/useCreateShow"
import SelectField from "@/components/SelectField"

const SHOW_TYPES: ShowType[] = ["TV", "PPV", "SPECIAL"]  // verify your enum
const MONTHS = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: monthName(i + 1) }))
const WEEKS = [1, 2, 3, 4].map((w) => ({ value: w, label: `Week ${w}` }))

function monthName(m: number) {
  return ["January","February","March","April","May","June","July","August","September","October","November","December"][m - 1]
}

export default function CreateShowScreen() {
  // optional prefill from the calendar slot
  const params = useLocalSearchParams<{ year?: string; month?: string; week?: string }>()
  const now = new Date()

  const [name, setName] = useState("")
  const [type, setType] = useState<ShowType>("TV")
  const [territoryId, setTerritoryId] = useState(0)
  const [year, setYear] = useState(params.year ? Number(params.year) : now.getFullYear())
  const [month, setMonth] = useState(params.month ? Number(params.month) : now.getMonth() + 1)
  const [week, setWeek] = useState(params.week ? Number(params.week) : 1)
  const [error, setError] = useState<string | null>(null)

  const { data: territories } = useTerritories()
  const create = useCreateShow()

  const submit = () => {
    if (territoryId <= 0) return setError("Territory is required.")
    if (year < 1 || month < 1 || week < 1) return setError("Date is required.")
    setError(null)

    const payload: ShowCreate = {
      name: name.trim() === "" ? null : name.trim(),  // name optional
      type, territoryId, year, month, week,
    }
    create.mutate(payload, {
      onSuccess: () => router.back(),  // return to calendar; it refetches via invalidate
    })
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>New Show</Text>
        <TouchableOpacity style={styles.save} disabled={create.isPending} onPress={submit} accessibilityLabel="Create show">
          {create.isPending
            ? <ActivityIndicator color={colors.text} size="small" />
            : <Ionicons name="checkmark" color={colors.text} size={22} />}
        </TouchableOpacity>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Name (optional)</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Show name"
          placeholderTextColor={colors.textMuted}
        />
      </View>

      <SelectField label="Type" value={type}
        options={SHOW_TYPES.map((t) => ({ value: t, label: t }))}
        onChange={setType} />
      <SelectField label="Territory" value={territoryId}
        options={(territories ?? []).map((t) => ({ value: t.id, label: t.name }))}
        onChange={setTerritoryId} />

      <Text style={styles.section}>DATE</Text>
      <SelectField label="Month" value={month}
        options={MONTHS} onChange={setMonth} />
      <SelectField label="Week" value={week}
        options={WEEKS} onChange={setWeek} />
      <View style={styles.field}>
        <Text style={styles.label}>Year</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={String(year)}
          onChangeText={(t) => setYear(Number(t.replace(/[^0-9]/g, "")) || 0)}
          placeholder="Year"
          placeholderTextColor={colors.textMuted}
        />
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
      {create.isError && <Text style={styles.error}>Couldn't create show.</Text>}
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
  error: { fontFamily: fonts.regular, fontSize: 13, color: colors.primary, marginTop: 16, textAlign: "center" },
})