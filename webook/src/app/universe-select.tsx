// app/universe-select.tsx
import React from "react"
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList, Platform } from "react-native"
import { useActiveUniverse, Universe } from "@/context/UniverseContext"
import { colors, fonts } from "@/styles/theme"
import Ionicons from "@expo/vector-icons/Ionicons"

export default function UniverseSelectScreen() {
  const { universes, switchActiveUniverse, loading } = useActiveUniverse()

  const handleSelect = async (universe: Universe) => {
    try {
      await switchActiveUniverse(universe.id)
    } catch (e: any) {
      console.log("FAILED:", e.response?.status, e.response?.data)
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    )
  }

  return (
    <View style={styles.root}>
      <View style={styles.inner}>

        <Text style={styles.eyebrow}>WEBOOK</Text>
        <Text style={styles.heading}>Your universes</Text>
        <Text style={styles.sub}>Select a save file to continue booking.</Text>

        <FlatList
          data={universes}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          scrollEnabled={universes.length > 4}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => handleSelect(item)}
              activeOpacity={0.75}
            >
              <View style={styles.card_left}>
                <Text style={styles.card_name}>{item.name}</Text>
                <Text style={styles.card_sub}>Universe #{item.id}</Text>
              </View>
              <Ionicons name="chevron-forward" color={colors.accent} size={18} />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.empty_box}>
              <Text style={styles.empty}>No universes found.</Text>
              <Text style={styles.empty_sub}>Something may have gone wrong loading your data.</Text>
            </View>
          }
        />

      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: Platform.OS === "web" ? "center" : "stretch",
    justifyContent: Platform.OS === "web" ? "center" : "flex-start",
  },
  inner: {
    width: "100%",
    maxWidth: Platform.OS === "web" ? 480 : undefined,
    paddingTop: Platform.OS === "web" ? 0 : 72,
    paddingHorizontal: 24,
    flex: 1,
  },
  center: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  eyebrow: {
    fontFamily: fonts.heading,
    fontSize: 12,
    letterSpacing: 3,
    color: colors.accent,
    marginBottom: 12,
  },
  heading: {
    fontFamily: fonts.bold,
    fontSize: 32,
    color: colors.text,
    marginBottom: 4,
  },
  sub: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 28,
  },
  list: { gap: 10 },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  card_left: { flex: 1 },
  card_name: {
    fontFamily: fonts.bold,
    fontSize: 19,
    color: colors.text,
  },
  card_sub: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 3,
  },
  empty_box: { alignItems: "center", marginTop: 48 },
  empty: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.textMuted,
    marginBottom: 6,
  },
  empty_sub: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: "center",
  },
})