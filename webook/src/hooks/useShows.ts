import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { Show } from "@/types/show"

export function useShows() {
  return useQuery({
    queryKey: ["shows"],
    queryFn: async () => {
      const res = await api.get<{ data: Show[] }>("/shows")
      const map = new Map<number, Show>()
      for (const s of res.data.data) map.set(s.id, s)
      return map
    },
    staleTime: 10 * 60_000,
  })
}