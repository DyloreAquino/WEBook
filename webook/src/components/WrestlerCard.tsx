import { colors, fonts } from "@/styles/theme"
import { View, Text, StyleSheet, TouchableOpacity, Platform } from "react-native"
import { router } from "expo-router"
import Ionicons from "@expo/vector-icons/Ionicons"
import { Wrestler } from "@/types/wrestler"
import WrestlerTag from "@/components/WrestlerTag"

type Props = {
  wrestler: Wrestler
  isWinner?: boolean        // when provided, shows a win/loss badge
  finishType?: string | null
}

export default function WrestlerCard({ wrestler, isWinner, finishType }: Props) {
  const showResult = isWinner !== undefined  // badge only renders when result data is passed

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`View ${wrestler.name}`}
      onPress={() => router.push({ pathname: "/wrestler/[id]", params: { id: wrestler.id } })}
    >
      <View style={styles.top_row}>
        <Text style={styles.name_text} numberOfLines={1}>
          {wrestler.name}
        </Text>
        {showResult && (
          <View style={[styles.result, { backgroundColor: isWinner ? "#1f4a2e" : "#3a3a3a" }]}>
            <Ionicons name={isWinner ? "trophy" : "close"} color={colors.text} size={12} />
            <Text style={styles.result_text}>
              {isWinner ? "WON" : "LOST"}{finishType ? ` · ${finishType}` : ""}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.tag_container}>
        <WrestlerTag type="gender" value={wrestler.gender} />
        <WrestlerTag type="allegiance" value={wrestler.allegiance} />
        <WrestlerTag type="role" value={wrestler.role} />
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    width: Platform.OS === "web" ? 320 : "100%",  // grid cell on web, full row on mobile
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 20,
  },
  top_row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  name_text: {
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: 20,
    flex: 1,
  },
  result: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  result_text: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: colors.text,
  },
  tag_container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
})