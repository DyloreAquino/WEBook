// hooks/useChampionshipsByPromotion.ts
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { Championship } from "@/types/championship"
import { useActiveUniverse } from "@/context/UniverseContext" // 1. Import context

export function useChampionshipsByPromotion(promotionId: number | null) {
  const { activeUniverse } = useActiveUniverse() // 2. Get active universe
  const universeId = activeUniverse?.id

  return useQuery({
    // 3. Keep your nested filters safely organized under the universe key
    queryKey: ["universe", universeId, "championships", { promotionId }],
    
    queryFn: async () => {
      const res = await api.get<{ data: Championship[] }>("/championships", {
        params: { "promotionId[eq]": promotionId },
      })
      return res.data.data
    },
    
    // 4. Do not fire until we have a selected save file AND a targeted company ID
    enabled: promotionId != null && !!universeId,
  })
}