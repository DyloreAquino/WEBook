import { useState } from "react"
import { colors, fonts } from "@/styles/theme"
import { Modal, View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from "react-native"
import Ionicons from "@expo/vector-icons/Ionicons"
import { useWrestlerLookup } from "@/hooks/useWrestlerLookup"

type Props = {
  visible: boolean
  excludeId?: number              // hide the wrestler being edited (can't relate to self)
  currentId?: number | null       // highlight current selection
  onSelect: (id: number | null) => void
  onClose: () => void
}

export default function WrestlerPickerModal({ visible, excludeId, currentId, onSelect, onClose }: Props) {
  const { data: lookupMap } = useWrestlerLookup()
  const wrestlers = lookupMap ? Array.from(lookupMap.values()) : []
  const [search, setSearch] = useState("")

  const filtered = (wrestlers ?? [])
    .filter((w) => w.id !== excludeId)
    .filter((w) => w.name.toLowerCase().includes(search.trim().toLowerCase()))

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} accessibilityLabel="Close picker">
              <Ionicons name="close" color={colors.text} size={26} />
            </TouchableOpacity>
            <Text style={styles.title}>Select wrestler</Text>
            <View style={{ width: 26 }} />
          </View>

          <TextInput
            style={styles.search}
            placeholder="Search…"
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
            autoCorrect={false}
            autoCapitalize="none"
          />

          <FlatList
            data={filtered}
            keyExtractor={(w) => String(w.id)}
            keyboardShouldPersistTaps="handled"
            ListHeaderComponent={
              <TouchableOpacity
                style={styles.option}
                onPress={() => onSelect(null)}
                activeOpacity={0.7}
              >
                <Text style={styles.none_text}>None</Text>
                {currentId == null && <Ionicons name="checkmark" color={colors.accent} size={20} />}
              </TouchableOpacity>
            }
            renderItem={({ item }) => {
              const active = item.id === currentId
              return (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => onSelect(item.id)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.option_text, active && styles.option_text_active]}>
                    {item.name}
                  </Text>
                  {active && <Ionicons name="checkmark" color={colors.accent} size={20} />}
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
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    maxHeight: "85%", paddingTop: 20, paddingBottom: 12,
  },
  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 24, marginBottom: 16,
  },
  title: { fontFamily: fonts.bold, fontSize: 20, color: colors.text },
  search: {
    marginHorizontal: 24, marginBottom: 12,
    backgroundColor: colors.surface, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12,
    color: colors.text, fontFamily: fonts.regular, fontSize: 15,
  },
  option: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingVertical: 16, paddingHorizontal: 24,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  option_text: { fontFamily: fonts.regular, fontSize: 16, color: colors.text },
  option_text_active: { color: colors.accent, fontFamily: fonts.medium },
  none_text: { fontFamily: fonts.medium, fontSize: 16, color: colors.textMuted },
})