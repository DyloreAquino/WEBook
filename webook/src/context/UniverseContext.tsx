import React, { createContext, useContext, useState, ReactNode, useEffect } from "react"
import { api } from "@/lib/axios"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { universeStore } from "@/lib/universeStore"
import { useAuth } from "@/context/AuthContext"

// Structural schema map for your updated backend resource
export type Universe = {
  id: number
  name: string
  current_promotion_id: number | null
}

type UniverseContextValue = {
  activeUniverse: Universe | null
  universes: Universe[]
  hasUniverses: boolean
  setActiveUniverse: (universe: Universe | null) => void
  switchActiveUniverse: (universeId: number) => Promise<void>
  updateCurrentPromotion: (promotionId: number) => Promise<void>
  refreshUniverses: () => Promise<void>
  clearUniverse: () => void   // ← add this
  loading: boolean
}

const UniverseContext = createContext<UniverseContextValue | null>(null)

export function UniverseProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth()
  const [activeUniverse, setActiveUniverse] = useState<Universe | null>(null)
  const [universes, setUniverses] = useState<Universe[]>([])
  const [loading, setLoading] = useState(true)

  // Always use this instead of setActiveUniverse directly —
  // keeps universeStore.id in sync before any downstream effects fire
  const setActiveUniverseAndStore = (universe: Universe | null) => {
    universeStore.id = universe?.id ?? null
    setActiveUniverse(universe)
  }

  // Hydrate from AsyncStorage on mount
  useEffect(() => {
    const loadPersistedUniverse = async () => {
      const saved = await AsyncStorage.getItem("active_universe")
      if (saved) {
        const parsed = JSON.parse(saved)
        setActiveUniverseAndStore(parsed)
      }
    }
    loadPersistedUniverse()
  }, [])

  // Persist activeUniverse to AsyncStorage whenever it changes
  useEffect(() => {
    if (activeUniverse) {
      AsyncStorage.setItem("active_universe", JSON.stringify(activeUniverse))
    } else {
      AsyncStorage.removeItem("active_universe")
    }
  }, [activeUniverse])

  // Only fetch universes once we have a token
  useEffect(() => {
    if (token) {
      refreshUniverses()
    } else {
      setLoading(false)
    }
  }, [token])

  const refreshUniverses = async () => {
    try {
      setLoading(true)
      const { data } = await api.get<{ data: Universe[] }>("/universes")
      setUniverses(data.data)
    } catch (e) {
      console.error("Failed to load universes", e)
    } finally {
      setLoading(false)
    }
  }

  const clearUniverse = () => {
    setActiveUniverseAndStore(null)
    setUniverses([])
    AsyncStorage.removeItem("active_universe")
  }

  const switchActiveUniverse = async (universeId: number) => {
    console.log("universes in state:", universes)  // ← is this populated?
    console.log("switching to:", universeId)
    try {
      const res = await api.patch("/user/active-universe", { universe_id: universeId })
      console.log("switch response:", res.data)
      const universe = universes.find(u => u.id === universeId) ?? null
      setActiveUniverseAndStore(universe)
    } catch (e: any) {
      console.log("switch error:", e.response?.status, e.response?.data)  // ← what does this say
      throw e
    }
  }

  const updateCurrentPromotion = async (promotionId: number) => {
    if (!activeUniverse) return

    try {
      // 1. Update backend
      await api.patch(`/universes/${activeUniverse.id}`, {
        current_promotion_id: promotionId
      })

      // 2. Update local state for immediate UI feedback
      const updated = { ...activeUniverse, current_promotion_id: promotionId }
      setActiveUniverseAndStore(updated)

      // 3. Keep the list consistent
      setUniverses(prev => prev.map(u =>
        u.id === activeUniverse.id ? { ...u, current_promotion_id: promotionId } : u
      ))
    } catch (e: any) {
      if (e.response && e.response.status === 422) {
        console.log("VALIDATION FAILED:", e.response.data.errors)
      } else {
        console.error("OTHER ERROR:", e)
      }
    }
  }

  return (
    <UniverseContext.Provider value={{
      activeUniverse,
      universes,
      hasUniverses: universes.length > 0,
      setActiveUniverse: setActiveUniverseAndStore,
      switchActiveUniverse,
      updateCurrentPromotion,
      refreshUniverses,
      clearUniverse,   // ← add this
      loading,
    }}>
      {children}
    </UniverseContext.Provider>
  )
}

export function useActiveUniverse() {
  const ctx = useContext(UniverseContext)
  if (!ctx) throw new Error("useActiveUniverse must be used within a UniverseProvider")
  return ctx
}