import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { NamedEntity } from "@/types/common"

export function usePromotions() {
  return useQuery({
    queryKey: ["promotions"],
    queryFn: async () => {
      const res = await api.get<{ data: NamedEntity[] }>("/promotions")
      return res.data.data
    },
    staleTime: 5 * 60_000,
  })
}