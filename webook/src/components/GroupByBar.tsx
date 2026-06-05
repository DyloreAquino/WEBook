import { ScrollView, StyleSheet } from "react-native"
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
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.bar}
      contentContainerStyle={styles.content}
    >
      {CATEGORIES.map((c) => (
        <GroupByButton
          key={c.key}
          label={c.label}
          active={active === c.key}
          // tap active category again -> ungroup. remove this branch for pure radio.
          onPress={() => onChange(active === c.key ? "none" : c.key)}
        />
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexGrow: 0, // stop ScrollView from eating vertical space
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
})