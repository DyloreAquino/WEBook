import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { Wrestler } from "@/types/wrestler"

export function useWrestlerLookup() {
  const query = useQuery({
    queryKey: ["wrestlers", "lookup"],   // separate key from the filtered roster
    queryFn: async () => {
      const res = await api.get<{ data: Wrestler[] }>("/wrestlers")
      return res.data.data
    },
    staleTime: 5 * 60_000,
    select: (list) => {
      // build a Map<id, Wrestler> once, memoized by react-query
      const map = new Map<number, Wrestler>()
      for (const w of list) map.set(w.id, w)
      return map
    },
  })
  return query
}