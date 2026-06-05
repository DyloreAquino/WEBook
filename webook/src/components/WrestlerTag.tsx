import { colors, fonts, tagColors } from "@/styles/theme"
import { View, Text, StyleSheet } from "react-native"
import Ionicons from "@expo/vector-icons/Ionicons"
import { ComponentProps } from "react"
import { Wrestler } from "@/types/wrestler"

type IoniconName = ComponentProps<typeof Ionicons>["name"]

// icons stay local: not reused outside the tag. colors live in theme (shared).
const GENDER_ICON: Record<Wrestler["gender"], IoniconName> = {
  MALE: "man",
  FEMALE: "woman",
  "N/A": "notifications",
}
const ALLEGIANCE_ICON: Record<Wrestler["allegiance"], IoniconName> = {
  FACE: "happy",
  HEEL: "skull",
  TWEENER: "help",
}
const ROLE_ICON: Record<Wrestler["role"], IoniconName> = {
  WRESTLER: "barbell",
  MANAGER: "people",
  REFEREE: "megaphone",
  BOOKER: "book",
  CIVILIAN: "person",
}

const FALLBACK_ICON: IoniconName = "help"
const FALLBACK_BG = "#3a3a3a"

// discriminated union keeps type + value correlated so the lookup stays type-safe
type WrestlerTagProps =
  | { type: "gender"; value: Wrestler["gender"] }
  | { type: "allegiance"; value: Wrestler["allegiance"] }
  | { type: "role"; value: Wrestler["role"] }

function resolveTag(props: WrestlerTagProps): { icon: IoniconName; bg: string } {
  switch (props.type) {
    case "gender":
      return { icon: GENDER_ICON[props.value] ?? FALLBACK_ICON, bg: tagColors.gender[props.value] ?? FALLBACK_BG }
    case "allegiance":
      return { icon: ALLEGIANCE_ICON[props.value] ?? FALLBACK_ICON, bg: tagColors.allegiance[props.value] ?? FALLBACK_BG }
    case "role":
      return { icon: ROLE_ICON[props.value] ?? FALLBACK_ICON, bg: tagColors.role[props.value] ?? FALLBACK_BG }
  }
}

export default function WrestlerTag(props: WrestlerTagProps) {
  const { icon, bg } = resolveTag(props)
  return (
    <View style={[styles.tag, { backgroundColor: bg }]}>
      <Ionicons name={icon} color={colors.text} size={14} />
      <Text style={styles.tag_text} numberOfLines={1}>
        {props.value.toUpperCase()}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tag_text: {
    fontSize: 11,
    color: colors.text,
    fontFamily: fonts.regular,
  },
})