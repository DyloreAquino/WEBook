// hooks/useChampionships.ts — return Map<id, Championship>, not Map<id, string>
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { Championship } from "@/types/championship"
import { useActiveUniverse } from "@/context/UniverseContext" // 1. Import context

export function useChampionships() {
  const { activeUniverse } = useActiveUniverse() // 2. Get active universe
  const universeId = activeUniverse?.id

  return useQuery({
    // 3. Prepend universeId to isolate the cache for this specific save file
    queryKey: ["universe", universeId, "championships"],
    
    queryFn: async () => {
      const res = await api.get<{ data: Championship[] }>("/championships")
      const map = new Map<number, Championship>()
      for (const c of res.data.data) map.set(c.id, c)
      return map
    },
    
    // 4. Ensure it doesn't try to fetch a map of championships without a universe
    enabled: !!universeId,
    
    staleTime: 10 * 60_000,
  })
}