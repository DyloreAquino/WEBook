// app/register.tsx
import React, { useState } from "react"
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Platform, KeyboardAvoidingView, ScrollView, ActivityIndicator } from "react-native"
import { Link } from "expo-router"
import { useAuth } from "@/context/AuthContext"
import { api } from "@/lib/axios"
import { colors, fonts } from "@/styles/theme"

export default function RegisterScreen() {
  const { login } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirmation, setPasswordConfirmation] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    try {
      setError("")
      setLoading(true)

      // 1. Send the data using your exact state variables
      await api.post("/register", {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      })

      // 2. Automatically sign them in on success
      const loginRes = await api.post("/login", { email, password })
      const { token, user } = loginRes.data
      await login(token, user)

    } catch (err: any) {
      if (err.response && err.response.status === 422) {
        // 3. Extract and display the exact validation error message from Laravel
        const validationErrors = err.response.data.errors
        const firstKey = Object.keys(validationErrors)[0]
        setError(validationErrors[firstKey][0])
      } else {
        setError(err.response?.data?.message || "Registration failed. Check your values.")
      }
    } finally {
      setLoading(false)
    }
  }

  const isValid = name.trim() && email.trim() && password && passwordConfirmation

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>

          <Text style={styles.eyebrow}>WEBOOK</Text>
          <Text style={styles.heading}>Create account</Text>
          <Text style={styles.sub}>Start booking your wrestling universe.</Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Your name"
            placeholderTextColor={colors.textMuted}
            value={name}
            onChangeText={setName}
            autoCorrect={false}
          />

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

          <Text style={styles.label}>Confirm password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor={colors.textMuted}
            value={passwordConfirmation}
            onChangeText={setPasswordConfirmation}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.btn, (!isValid || loading) && styles.btn_disabled]}
            onPress={handleRegister}
            activeOpacity={0.8}
            disabled={!isValid || loading}
          >
            {loading
              ? <ActivityIndicator color={colors.text} size="small" />
              : <Text style={styles.btn_text}>Create account</Text>
            }
          </TouchableOpacity>

          <Link href="/login" style={styles.link}>
            Already have an account? <Text style={styles.link_accent}>Sign in</Text>
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