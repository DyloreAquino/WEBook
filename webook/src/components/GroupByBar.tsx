import { View, ScrollView, StyleSheet } from "react-native"
import { colors } from "@/styles/theme"
import { GroupCategory } from "@/types/wrestler"
import GroupByButton from "@/components/GroupByButton"

// display labels for each category. territoryId/promotionId shortened for the chip.
const CATEGORIES: { key: GroupCategory; label: string }[] = [
  { key: "gender", label: "Gender" },
  { key: "allegiance", label: "Allegiance" },
  { key: "role", label: "Role" },
  { key: "territoryId", label: "Territory" },
  { key: "promotionId", label: "Promotion" },
]

type GroupByBarProps = {
  active: GroupCategory
  onChange: (category: GroupCategory) => void
}

export default function GroupByBar({ active, onChange }: GroupByBarProps) {
  return (
    <View style={styles.bar}>
      <View style={styles.content}>
        {CATEGORIES.map((c) => (
          <GroupByButton
            key={c.key}
            label={c.label}
            active={active === c.key}
            onPress={() => onChange(active === c.key ? "none" : c.key)}
          />
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  content: {
    flexDirection: "row",
    flexWrap: "wrap",      // pills wrap to a second line instead of clipping
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
})