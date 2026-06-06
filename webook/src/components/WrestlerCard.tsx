import { colors, fonts } from "@/styles/theme"
import { View, Text, StyleSheet, TouchableOpacity, Platform } from "react-native"
import { router } from "expo-router"
import { Wrestler } from "@/types/wrestler"
import WrestlerTag from "@/components/WrestlerTag"

export default function WrestlerCard({ wrestler }: { wrestler: Wrestler }) {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`View ${wrestler.name}`}
      onPress={() => router.push({ pathname: "/wrestler/[id]", params: { id: wrestler.id } })}
    >
      <Text style={styles.name_text} numberOfLines={1}>
        {wrestler.name}
      </Text>
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
  tag_container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  name_text: {
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: 20,
  },
})