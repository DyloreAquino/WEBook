import React, { createContext, useContext, useState, ReactNode, useEffect } from "react"
import { api } from "@/lib/axios"

// Structural schema map for your updated backend resource
export type Universe = {
  id: number
  name: string
  current_promotion_id: number | null
}

type UniverseContextValue = {
  activeUniverse: Universe | null
  setActiveUniverse: (universe: Universe | null) => void
  updateCurrentPromotion: (promotionId: number) => Promise<void>
  loading: boolean
}

const UniverseContext = createContext<UniverseContextValue | null>(null)

export function UniverseProvider({ children }: { children: ReactNode }) {
  const [activeUniverse, setActiveUniverse] = useState<Universe | null>(null)
  const [loading, setLoading] = useState(false)

  // Dynamic Multi-Tenant Network Interceptor Injection
  useEffect(() => {
    // Intercept outbound HTTP operations to inject the universe state seamlessly
    const interceptor = api.interceptors.request.use((config) => {
      if (activeUniverse?.id) {
        config.headers["X-Universe-Id"] = String(activeUniverse.id)
      }
      return config
    }, (error) => {
      return Promise.reject(error)
    })

    // Eject structural interceptor reference trace on component tree unmounts
    return () => {
      api.interceptors.request.eject(interceptor)
    }
  }, [activeUniverse])

  // Triggers persistence and updates the active promotion
  const updateCurrentPromotion = async (promotionId: number) => {
    if (!activeUniverse) return

    try {
      // Fires using your customized, interceptor-aware Axios wrapper client
      await api.patch(`/universes/${activeUniverse.id}`, {
        current_promotion_id: promotionId
      })

      // Sync local reactive state properties 
      setActiveUniverse({
        ...activeUniverse,
        current_promotion_id: promotionId
      })
    } catch (error) {
      console.error("Failed to update active promotion code inside database instance:", error)
      throw error // Let the calling screen/button state framework catch UI alerts
    }
  }

  return (
    <UniverseContext.Provider value={{ activeUniverse, setActiveUniverse, updateCurrentPromotion, loading }}>
      {children}
    </UniverseContext.Provider>
  )
}

export function useActiveUniverse() {
  const ctx = useContext(UniverseContext)
  if (!ctx) throw new Error("useActiveUniverse must be used within a UniverseProvider")
  return ctx
}