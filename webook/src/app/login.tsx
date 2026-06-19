// app/login.tsx
import React, { useState } from "react"
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Platform, KeyboardAvoidingView, ScrollView, ActivityIndicator } from "react-native"
import { Link } from "expo-router"
import { useAuth } from "@/context/AuthContext"
import { api } from "@/lib/axios"
import { colors, fonts } from "@/styles/theme"

export default function LoginScreen() {
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    try {
      setError("")
      setLoading(true)
      const res = await api.post("/login", { email, password })
      const { token, user } = res.data
      await login(token, user)
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid credentials.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>

          <Text style={styles.eyebrow}>WEBOOK</Text>
          <Text style={styles.heading}>Sign in</Text>
          <Text style={styles.sub}>Access your wrestling universe.</Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor={colors.textMuted}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoCorrect={false}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor={colors.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.btn, (!email || !password || loading) && styles.btn_disabled]}
            onPress={handleLogin}
            activeOpacity={0.8}
            disabled={!email || !password || loading}
          >
            {loading
              ? <ActivityIndicator color={colors.text} size="small" />
              : <Text style={styles.btn_text}>Sign in</Text>
            }
          </TouchableOpacity>

          <Link href="/register" style={styles.link}>
            No account? <Text style={styles.link_accent}>Create one</Text>
          </Link>

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
  },
  error: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: "#e05c5c",
    backgroundColor: "#2a1212",
    borderRadius: 6,
    padding: 10,
    marginBottom: 16,
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
    marginBottom: 18,
  },
  btn: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4,
    marginBottom: 20,
  },
  btn_disabled: { opacity: 0.45 },
  btn_text: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.text,
    letterSpacing: 0.5,
  },
  link: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: "center",
  },
  link_accent: {
    color: colors.accent,
    fontFamily: fonts.medium,
  },
})