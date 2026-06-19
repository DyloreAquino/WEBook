// hooks/usePromotions.ts
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { Promotion } from "@/types/promotion"
import { useActiveUniverse } from "@/context/UniverseContext" // 1. Import context

export function usePromotions() {
  const { activeUniverse } = useActiveUniverse() // 2. Get active universe
  const universeId = activeUniverse?.id

  return useQuery({
    // 3. Prepend the universeId to scope the cached promotions array
    queryKey: ["universe", universeId, "promotions"],
    
    queryFn: async () => {
      const res = await api.get<{ data: Promotion[] }>("/promotions")
      return res.data.data
    },
    
    // 4. Block execution until a universe is active
    enabled: !!universeId,
    
    staleTime: 5 * 60_000,
  })
}