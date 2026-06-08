// app/championship/[id].tsx
import { useState, useEffect } from "react"
import { ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native"
import { router, useLocalSearchParams } from "expo-router"
import Ionicons from "@expo/vector-icons/Ionicons"
import { colors, fonts } from "@/styles/theme"
import { Division } from "@/types/championship"
import { useChampionship } from "@/hooks/useChampionship"
import { useUpdateChampionship, ChampionshipUpdate } from "@/hooks/useUpdateChampionship"
import { useDeleteChampionship } from "@/hooks/useDeleteChampionship"
import { reignSortValue } from "@/lib/formatReign"
import { DIVISION_TAG } from "@/lib/championshipTags"
import SelectField from "@/components/SelectField"
import TitleReignCard from "@/components/TitleReignCard"
import ConfirmModal from "@/components/ConfirmModal"
import ReignModal from "@/components/ReignModal"
import { TitleReign } from "@/types/title_reign"

const DIVISIONS: Division[] = ["WORLD", "MID", "TAG", "WOMENS"]

export default function ChampionshipDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const champId = Number(id)
  const { data: champ, isLoading, isError } = useChampionship(champId)
  const update = useUpdateChampionship(champId)
  const del = useDeleteChampionship()

  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<ChampionshipUpdate>({})
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [reignModalOpen, setReignModalOpen] = useState(false)
  const [editingReign, setEditingReign] = useState<TitleReign | null>(null)

  useEffect(() => {
    if (editing && champ) setDraft({ name: champ.name, division: champ.division })
  }, [editing, champ])

  if (isLoading) return <View style={[styles.screen, styles.center]}><ActivityIndicator color={colors.accent} size="large" /></View>
  if (isError || !champ) return <View style={[styles.screen, styles.center]}><Text style={styles.err}>Couldn't load championship.</Text></View>

  const hasChanges = editing && (draft.name !== champ.name || draft.division !== champ.division)
  const div = DIVISION_TAG[champ.division]

  const onEditPress = () => {
    if (!editing) setEditing(true)
    else if (hasChanges) update.mutate(draft, { onSuccess: () => setEditing(false) })
    else setEditing(false)
  }

  const reigns = [...(champ.titleReigns ?? [])].sort((a, b) => reignSortValue(b) - reignSortValue(a))

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        {editing ? (
          <TextInput
            style={styles.name_input}
            value={draft.name ?? champ.name}
            onChangeText={(t) => setDraft((d) => ({ ...d, name: t }))}
            placeholder="Championship name"
            placeholderTextColor={colors.textMuted}
          />
        ) : (
          <Text style={styles.name} numberOfLines={2}>{champ.name}</Text>
        )}
        <View style={styles.header_btns}>
          <TouchableOpacity style={styles.icon_btn} onPress={onEditPress} disabled={update.isPending}>
            {update.isPending
              ? <ActivityIndicator color={colors.accent} size="small" />
              : <Ionicons name={!editing ? "pencil" : hasChanges ? "checkmark" : "close"} color={hasChanges ? colors.accent : colors.text} size={20} />}
          </TouchableOpacity>
          <TouchableOpacity style={styles.icon_btn} onPress={() => setConfirmOpen(true)} accessibilityLabel="Delete championship">
            <Ionicons name="trash" color={colors.primary} size={20} />
          </TouchableOpacity>
        </View>
      </View>

      {editing ? (
        <SelectField label="Division" value={draft.division ?? champ.division}
          options={DIVISIONS.map((d) => ({ value: d, label: d }))}
          onChange={(v) => setDraft((d) => ({ ...d, division: v }))} />
      ) : (
        <View style={[styles.div_tag, { backgroundColor: div?.bg ?? "#3a3a3a" }]}>
          <Text style={styles.div_text}>{(div?.label ?? champ.division).toUpperCase()}</Text>
        </View>
      )}

      <View style={styles.reign_head}>
        <Text style={styles.section}>TITLE REIGNS</Text>
        <TouchableOpacity
          style={styles.add_reign}
          onPress={() => { setEditingReign(null); setReignModalOpen(true) }}
          activeOpacity={0.7}
          accessibilityLabel="Add reign"
        >
          <Ionicons name="add" color={colors.accent} size={18} />
        </TouchableOpacity>
      </View>

      {reigns.length === 0 ? (
        <Text style={styles.empty}>No title reigns yet.</Text>
      ) : (
        reigns.map((r) => (
          <TitleReignCard key={r.id} reign={r} onPress={() => { setEditingReign(r); setReignModalOpen(true) }} />
        ))
      )}

      <ConfirmModal
        visible={confirmOpen}
        title="Delete championship?"
        message="This removes the championship and its title reigns. This can't be undone."
        confirmLabel="Delete"
        destructive
        loading={del.isPending}
        onConfirm={() => del.mutate(champId, { onSuccess: () => { setConfirmOpen(false); router.back() } })}
        onCancel={() => setConfirmOpen(false)}
      />

      <ReignModal
        visible={reignModalOpen}
        championshipId={champId}
        reign={editingReign}
        onClose={() => setReignModalOpen(false)}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 24, paddingBottom: 60 },
  center: { justifyContent: "center", alignItems: "center" },
  err: { fontFamily: fonts.bold, fontSize: 16, color: colors.text },
  header: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 },
  name: { flex: 1, fontFamily: fonts.bold, fontSize: 30, color: colors.text, marginRight: 12 },
  name_input: {
    flex: 1, fontFamily: fonts.bold, fontSize: 26, color: colors.text, marginRight: 12,
    backgroundColor: colors.surface, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6,
  },
  header_btns: { flexDirection: "row", gap: 8, paddingTop: 4 },
  icon_btn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" },
  div_tag: { alignSelf: "flex-start", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 4, marginBottom: 8 },
  div_text: { fontFamily: fonts.bold, fontSize: 11, color: colors.text },
  reign_head: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 20, marginBottom: 14 },
  section: { fontFamily: fonts.heading, fontSize: 14, color: colors.textMuted },
  add_reign: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.accent, alignItems: "center", justifyContent: "center" },
  empty: { fontFamily: fonts.regular, fontSize: 14, color: colors.textMuted, textAlign: "center", marginTop: 10 },
})