import { colors, fonts } from "@/styles/theme"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"

type Option<T> = { value: T; label: string }

type FilterChipGroupProps<T> = {
  title: string
  options: Option<T>[]
  selected: T[]                          // array now
  onChange: (next: T[]) => void
}

export default function FilterChipGroup<T extends string | number>({
  title, options, selected, onChange,
}: FilterChipGroupProps<T>) {
  const toggle = (value: T) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value))   // remove
    } else {
      onChange([...selected, value])                   // add
    }
  }

  return (
    <View style={styles.group}>
      <Text style={styles.title}>{title.toUpperCase()}</Text>
      <View style={styles.chips}>
        {options.map((opt) => {
          const active = selected.includes(opt.value)
          return (
            <TouchableOpacity
              key={String(opt.value)}
              style={[styles.chip, active && styles.chip_active]}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => toggle(opt.value)}
            >
              <Text style={[styles.chip_text, active && styles.chip_text_active]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  group: { marginBottom: 20 },
  title: { fontFamily: fonts.heading, fontSize: 13, color: colors.textMuted, marginBottom: 10 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
  },
  chip_active: { backgroundColor: colors.accent, borderColor: colors.accent },
  chip_text: { fontFamily: fonts.medium, fontSize: 14, color: colors.textMuted },
  chip_text_active: { color: colors.text },
})