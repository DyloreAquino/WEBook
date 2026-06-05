import { colors, fonts } from "@/styles/theme"
import { Text, StyleSheet, TouchableOpacity } from "react-native"

type GroupByButtonProps = {
  label: string
  active: boolean
  onPress: () => void
}

export default function GroupByButton({ label, active, onPress }: GroupByButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, active && styles.button_active]}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
    >
      <Text style={[styles.label, active && styles.label_active]}>{label}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999, // pill
    backgroundColor: colors.surface,
  },
  button_active: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textMuted,
  },
  label_active: {
    color: colors.text,
  },
})