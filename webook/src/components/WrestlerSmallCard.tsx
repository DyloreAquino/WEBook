import { colors, fonts, tagColors } from "@/styles/theme"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { router } from "expo-router"
import Ionicons from "@expo/vector-icons/Ionicons"
import { ComponentProps } from "react"
import { Wrestler } from "@/types/wrestler"

type Props = {
  wrestler: Wrestler
  selectable?: boolean      // when true, acts as a toggle button instead of a link
  selected?: boolean
  onPress?: () => void      // override (selection toggle) when selectable
  onLongPress?: () => void
}

type IoniconName = ComponentProps<typeof Ionicons>["name"]

const GENDER_ICON: Record<Wrestler["gender"], IoniconName> = {
  MALE: "man", FEMALE: "woman", "N/A": "notifications",
}
const ALLEGIANCE_ICON: Record<Wrestler["allegiance"], IoniconName> = {
  FACE: "happy", HEEL: "skull", TWEENER: "help",
}
const ROLE_ICON: Record<Wrestler["role"], IoniconName> = {
  WRESTLER: "barbell", MANAGER: "people", REFEREE: "megaphone",
  BOOKER: "book", CIVILIAN: "person",
}

function dot(bg: string, icon: IoniconName, key: string) {
  return (
    <View key={key} style={[styles.dot, { backgroundColor: bg }]}>
      <Ionicons name={icon} color={colors.text} size={14} />
    </View>
  )
}

export default function WrestlerSmallCard({ wrestler, selectable, selected, onPress, onLongPress }: Props) {
  const handlePress = onPress ?? (() => router.push({ pathname: "/wrestler/[id]", params: { id: wrestler.id } }))
  
  return (
    <TouchableOpacity
      style={[styles.card, selectable && selected && styles.card_selected]}
      activeOpacity={0.7}
      onPress={handlePress}
      onLongPress={onLongPress}     // add
      accessibilityRole="button"
      accessibilityState={selectable ? { selected } : undefined}
      accessibilityLabel={selectable ? `Select ${wrestler.name}` : `View ${wrestler.name}`}
    >
      <Text style={styles.name} numberOfLines={2}>{wrestler.name}</Text>
      <View style={styles.dots}>
        {dot(tagColors.gender[wrestler.gender] ?? "#3a3a3a", GENDER_ICON[wrestler.gender] ?? "help", "g")}
        {dot(tagColors.allegiance[wrestler.allegiance] ?? "#3a3a3a", ALLEGIANCE_ICON[wrestler.allegiance] ?? "help", "a")}
        {dot(tagColors.role[wrestler.role] ?? "#3a3a3a", ROLE_ICON[wrestler.role] ?? "help", "r")}
      </View>
      {selectable && selected && (
        <View style={styles.check}>
          <Ionicons name="checkmark-circle" color={colors.accent} size={20} />
        </View>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card_selected: { borderWidth: 2, borderColor: colors.accent },
  check: { position: "absolute", top: 6, right: 6 },
  card: {
    width: 144,
    padding: 12,
    backgroundColor: colors.surface,
    borderRadius: 16,
  },
  name: { fontFamily: fonts.bold, fontSize: 15, color: colors.text, marginBottom: 10 },
  dots: { flexDirection: "row", gap: 6 },
  dot: {
    width: 28, height: 28, borderRadius: 8,
    alignItems: "center", justifyContent: "center",
  },
})