// hooks/useShowsByMonth.ts
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { Show } from "@/types/show"

export function useShowsByMonth(year: number, month: number, promotionId: number | null, enabled = true) {
  return useQuery({
    queryKey: ["shows", { year, month, promotionId }],
    queryFn: async () => {
      const res = await api.get<{ data: Show[] }>("/shows", {
        params: {
          "year[eq]": year,
          "month[eq]": month,
          "promotionId[eq]": promotionId,   // filter to managed promotion
        },
      })
      return res.data.data
    },
    enabled: enabled && promotionId != null,  // don't fetch until a promotion is chosen
  })
}