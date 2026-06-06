import { useState } from "react"
import { colors, fonts } from "@/styles/theme"
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from "react-native"
import Ionicons from "@expo/vector-icons/Ionicons"

type Option<T> = { value: T; label: string }

type SelectFieldProps<T> = {
  label: string
  value: T
  options: Option<T>[]
  onChange: (value: T) => void
}

export default function SelectField<T extends string | number>({
  label, value, options, onChange,
}: SelectFieldProps<T>) {
  const [open, setOpen] = useState(false)
  const current = options.find((o) => o.value === value)

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.trigger}
        activeOpacity={0.7}
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${current?.label ?? "select"}`}
      >
        <Text style={styles.trigger_text}>{current?.label ?? "Select…"}</Text>
        <Ionicons name="chevron-down" color={colors.textMuted} size={18} />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={() => setOpen(false)}>
          <View style={styles.sheet}>
            <Text style={styles.sheet_title}>{label.toUpperCase()}</Text>
            <FlatList
              data={options}
              keyExtractor={(o) => String(o.value)}
              renderItem={({ item }) => {
                const active = item.value === value
                return (
                  <TouchableOpacity
                    style={styles.option}
                    activeOpacity={0.7}
                    onPress={() => { onChange(item.value); setOpen(false) }}
                  >
                    <Text style={[styles.option_text, active && styles.option_text_active]}>
                      {item.label}
                    </Text>
                    {active && <Ionicons name="checkmark" color={colors.accent} size={20} />}
                  </TouchableOpacity>
                )
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  field: { marginBottom: 14 },
  label: { fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted, marginBottom: 6 },
  trigger: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    backgroundColor: colors.surface, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12,
    borderWidth: 1, borderColor: colors.border,
  },
  trigger_text: { fontFamily: fonts.medium, fontSize: 15, color: colors.text },
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", padding: 32 },
  sheet: {
    backgroundColor: colors.background, borderRadius: 20, padding: 16,
    maxHeight: "70%", borderWidth: 1, borderColor: colors.border,
  },
  sheet_title: { fontFamily: fonts.heading, fontSize: 13, color: colors.textMuted, marginBottom: 12, paddingHorizontal: 8 },
  option: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingVertical: 14, paddingHorizontal: 8,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  option_text: { fontFamily: fonts.regular, fontSize: 16, color: colors.text },
  option_text_active: { color: colors.accent, fontFamily: fonts.medium },
})