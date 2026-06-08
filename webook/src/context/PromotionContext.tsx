// context/PromotionContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

const STORAGE_KEY = "managedPromotionId"

type PromotionContextValue = {
  promotionId: number | null
  setPromotionId: (id: number) => void
  loading: boolean   // true while reading from storage on boot
}

const PromotionContext = createContext<PromotionContextValue | null>(null)

export function PromotionProvider({ children }: { children: ReactNode }) {
  const [promotionId, setId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  // load persisted value once on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => { if (stored) setId(Number(stored)) })
      .finally(() => setLoading(false))
  }, [])

  const setPromotionId = (id: number) => {
    setId(id)
    AsyncStorage.setItem(STORAGE_KEY, String(id))  // persist
  }

  return (
    <PromotionContext.Provider value={{ promotionId, setPromotionId, loading }}>
      {children}
    </PromotionContext.Provider>
  )
}

export function useManagedPromotion() {
  const ctx = useContext(PromotionContext)
  if (!ctx) throw new Error("useManagedPromotion must be used within PromotionProvider")
  return ctx
}