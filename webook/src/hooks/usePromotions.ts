import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { Promotion } from "@/types/promotion"

export function usePromotions() {
  return useQuery({
    queryKey: ["promotions"],
    queryFn: async () => {
      const res = await api.get<{ data: Promotion[] }>("/promotions")
      return res.data.data
    },
    staleTime: 5 * 60_000,
  })
}