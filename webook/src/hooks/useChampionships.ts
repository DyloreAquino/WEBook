// hooks/useChampionships.ts — return Map<id, Championship>, not Map<id, string>
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { Championship } from "@/types/championship"

export function useChampionships() {
  return useQuery({
    queryKey: ["championships"],
    queryFn: async () => {
      const res = await api.get<{ data: Championship[] }>("/championships")
      const map = new Map<number, Championship>()
      for (const c of res.data.data) map.set(c.id, c)
      return map
    },
    staleTime: 10 * 60_000,
  })
}