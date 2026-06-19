// context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/axios"

const TOKEN_KEY = "auth_token"

type User = { id: number; email: string; username: string }

type AuthContextValue = {
  user: User | null
  token: string | null
  login: (token: string, user: User) => Promise<void>
  logout: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const qc = useQueryClient()

  // 1. App Boot: Restructure session state from storage
  useEffect(() => {
    async function bootstrapAsync() {
      try {
        const storedToken = await AsyncStorage.getItem(TOKEN_KEY)
        if (storedToken) {
          api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`  // ← before any requests
          setToken(storedToken)
          const res = await api.get<User>("/user")
          setUser(res.data)
        }
      } catch (e) {
        console.error("Failed to restore auth session:", e)
        await AsyncStorage.removeItem(TOKEN_KEY)
      } finally {
        setLoading(false)
      }
    }
    bootstrapAsync()
  }, [])
  
  const login = async (newToken: string, newUser: User) => {
    api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`  // ← set immediately
    setToken(newToken)
    setUser(newUser)
    await AsyncStorage.setItem(TOKEN_KEY, newToken)
  }

  const logout = async () => {
    delete api.defaults.headers.common["Authorization"]  // ← clear immediately
    setToken(null)
    setUser(null)
    await AsyncStorage.removeItem(TOKEN_KEY)
    qc.clear()
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider")
  return ctx
}