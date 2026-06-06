import { colors, fonts } from "@/styles/theme"
import { View, Text, StyleSheet } from "react-native"
import Ionicons from "@expo/vector-icons/Ionicons"
import { ComponentProps } from "react"

type IoniconName = ComponentProps<typeof Ionicons>["name"]

type EventTagProps = {
  label: string
  bg: string
  icon?: IoniconName
}

export default function EventTag({ label, bg, icon }: EventTagProps) {
  return (
    <View style={[styles.tag, { backgroundColor: bg }]}>
      {icon && <Ionicons name={icon} color={colors.text} size={12} />}
      <Text style={styles.text} numberOfLines={1}>{label.toUpperCase()}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  tag: {
    flexDirection: "row", alignItems: "center", gap: 4,
    borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3,
  },
  text: { fontSize: 11, color: colors.text, fontFamily: fonts.regular },
})