// components/WrestlerMultiPicker.tsx
import { useState } from "react"
import { Modal, View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from "react-native"
import Ionicons from "@expo/vector-icons/Ionicons"
import { colors, fonts } from "@/styles/theme"
import { useWrestlerLookup } from "@/hooks/useWrestlerLookup"

type Props = {
  visible: boolean
  selectedIds: number[]
  onToggle: (id: number) => void
  onClose: () => void
}

export default function WrestlerMultiPicker({ visible, selectedIds, onToggle, onClose }: Props) {
  const { data: lookup } = useWrestlerLookup()
  const [search, setSearch] = useState("")

  const wrestlers = lookup ? Array.from(lookup.values()) : []
  const filtered = wrestlers.filter((w) =>
    w.name.toLowerCase().includes(search.trim().toLowerCase())
  )

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View style={{ width: 26 }} />
            <Text style={styles.title}>Select Wrestlers</Text>
            <TouchableOpacity onPress={onClose} accessibilityLabel="Done">
              <Ionicons name="checkmark" color={colors.accent} size={26} />
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.search}
            placeholder="Search…"
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <FlatList
            data={filtered}
            keyExtractor={(w) => String(w.id)}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.list}
            renderItem={({ item }) => {
              const selected = selectedIds.includes(item.id)
              return (
                <TouchableOpacity
                  style={[styles.row, selected && styles.row_selected]}
                  onPress={() => onToggle(item.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                  {selected && <Ionicons name="checkmark-circle" color={colors.accent} size={22} />}
                </TouchableOpacity>
              )
            }}
          />
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "flex-end" },
  sheet: { backgroundColor: colors.background, borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: "85%", paddingTop: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 24, marginBottom: 16 },
  title: { fontFamily: fonts.bold, fontSize: 18, color: colors.text },
  search: {
    marginHorizontal: 24, marginBottom: 12, backgroundColor: colors.surface, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12, color: colors.text, fontFamily: fonts.regular, fontSize: 15,
  },
  list: { paddingHorizontal: 24, paddingBottom: 24 },
  row: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingVertical: 14, paddingHorizontal: 4, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  row_selected: {},
  name: { fontFamily: fonts.regular, fontSize: 16, color: colors.text, flex: 1, marginRight: 8 },
})