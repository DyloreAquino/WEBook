// hooks/useChampionshipsByPromotion.ts
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { Championship } from "@/types/championship"

export function useChampionshipsByPromotion(promotionId: number | null) {
  return useQuery({
    queryKey: ["championships", { promotionId }],
    queryFn: async () => {
      const res = await api.get<{ data: Championship[] }>("/championships", {
        params: { "promotionId[eq]": promotionId },
      })
      return res.data.data
    },
    enabled: promotionId != null,
  })
}