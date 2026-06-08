import { useState } from "react"
import { ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native"
import { router } from "expo-router"
import Ionicons from "@expo/vector-icons/Ionicons"
import { colors, fonts } from "@/styles/theme"
import { Division } from "@/types/championship"
import { useManagedPromotion } from "@/context/PromotionContext"
import { useCreateChampionship, ChampionshipCreate } from "@/hooks/useCreateChampionship"
import SelectField from "@/components/SelectField"

const DIVISIONS: Division[] = ["WORLD", "MID", "TAG", "WOMENS"]

export default function CreateChampionshipScreen() {
  const { promotionId } = useManagedPromotion()
  const [name, setName] = useState("")
  const [division, setDivision] = useState<Division>("WORLD")
  const [error, setError] = useState<string | null>(null)
  const create = useCreateChampionship()

  const submit = () => {
    if (name.trim() === "") return setError("Name is required.")
    if (promotionId == null) return setError("No promotion selected.")
    setError(null)

    const payload: ChampionshipCreate = { name: name.trim(), division, promotionId }
    create.mutate(payload, {
      onSuccess: (created) => router.replace({ pathname: "/championship/[id]", params: { id: created.id } }),
    })
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>New Championship</Text>
        <TouchableOpacity style={styles.save} disabled={create.isPending} onPress={submit} accessibilityLabel="Create championship">
          {create.isPending
            ? <ActivityIndicator color={colors.text} size="small" />
            : <Ionicons name="checkmark" color={colors.text} size={22} />}
        </TouchableOpacity>
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
      {create.isError && <Text style={styles.error}>Couldn't create championship.</Text>}

      <View style={styles.field}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Championship name"
          placeholderTextColor={colors.textMuted}
        />
      </View>

      <SelectField label="Division" value={division}
        options={DIVISIONS.map((d) => ({ value: d, label: d }))}
        onChange={setDivision} />
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
  error: { fontFamily: fonts.regular, fontSize: 13, color: colors.primary, textAlign: "center", marginBottom: 12 },
})