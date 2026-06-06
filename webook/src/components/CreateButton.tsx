import { colors } from "@/styles/theme"
import { StyleSheet, TouchableOpacity } from "react-native"
import { router, Href } from "expo-router"
import Ionicons from "@expo/vector-icons/Ionicons"
import { ComponentProps } from "react"

type CreateButtonProps = {
  href: Href
  accessibilityLabel?: string
}

export default function CreateButton({ href, accessibilityLabel = "Create" }: CreateButtonProps) {
  return (
    <TouchableOpacity
      style={styles.fab}
      onPress={() => router.push(href)}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <Ionicons name="add" color={colors.text} size={32} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
})