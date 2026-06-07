// hooks/useShowsByMonth.ts
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { Show } from "@/types/show"

export function useShowsByMonth(year: number, month: number, enabled = true) {
  return useQuery({
    queryKey: ["shows", { year, month }],
    queryFn: async () => {
      const res = await api.get<{ data: Show[] }>("/shows", {
        params: { "year[eq]": year, "month[eq]": month },
      })
      return res.data.data
    },
    enabled,
  })
}