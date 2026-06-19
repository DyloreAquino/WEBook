// context/PromotionContext.tsx
import { createContext, useContext, ReactNode } from "react"
import { useActiveUniverse } from "./UniverseContext"

type PromotionContextValue = {
  promotionId: number | null
  setPromotionId: (id: number) => Promise<void>
  loading: boolean 
}

const PromotionContext = createContext<PromotionContextValue | null>(null)

export function PromotionProvider({ children }: { children: ReactNode }) {
  // 1. Consume the reactive universe context state layout
  const { activeUniverse, updateCurrentPromotion, loading: universeLoading } = useActiveUniverse()

  // 2. Derive the current selected promotion strictly from the active save slot
  const promotionId = activeUniverse ? activeUniverse.current_promotion_id : null

  // 3. Delegate state setting mutations up to the active save slot
  const setPromotionId = async (id: number) => {
    if (!activeUniverse) return
    await updateCurrentPromotion(id)
  }

  return (
    <PromotionContext.Provider 
      value={{ 
        promotionId, 
        setPromotionId, 
        loading: universeLoading // loading is now tied to the universe initialization sequence
      }}
    >
      {children}
    </PromotionContext.Provider>
  )
}

export function useManagedPromotion() {
  const ctx = useContext(PromotionContext)
  if (!ctx) throw new Error("useManagedPromotion must be used within PromotionProvider")
  return ctx
}