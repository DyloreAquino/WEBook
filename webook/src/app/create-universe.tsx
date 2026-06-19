// app/create-universe.tsx
import React, { useState } from "react"
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Platform, KeyboardAvoidingView, ScrollView, ActivityIndicator } from "react-native"
import { useCreateUniverse } from "@/hooks/useCreateUniverse"
import { colors, fonts } from "@/styles/theme"

export default function CreateUniverseScreen() {
  const [name, setName] = useState("")
  const { createUniverse, loading } = useCreateUniverse()

  const handlePress = async () => {
    if (!name.trim()) return
    await createUniverse(name.trim())
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>

          <Text style={styles.eyebrow}>NEW SAVE FILE</Text>
          <Text style={styles.heading}>Name your universe</Text>
          <Text style={styles.sub}>
            This is your save slot. You can create multiple universes to run separate timelines.
          </Text>

          <Text style={styles.label}>Universe name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Attitude Era Reboot"
            placeholderTextColor={colors.textMuted}
            value={name}
            onChangeText={setName}
            autoCorrect={false}
            autoFocus
          />

          <TouchableOpacity
            style={[styles.btn, (!name.trim() || loading) && styles.btn_disabled]}
            onPress={handlePress}
            activeOpacity={0.8}
            disabled={!name.trim() || loading}
          >
            {loading
              ? <ActivityIndicator color={colors.text} size="small" />
              : <Text style={styles.btn_text}>Create universe</Text>
            }
          </TouchableOpacity>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const CARD_MAX = 420

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: CARD_MAX,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 32,
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
    lineHeight: 20,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 12,
    letterSpacing: 1,
    color: colors.textMuted,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 13,
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: 15,
    marginBottom: 24,
  },
  btn: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  btn_disabled: { opacity: 0.45 },
  btn_text: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.text,
    letterSpacing: 0.5,
  },
})