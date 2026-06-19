// hooks/useWrestlerLookup.ts
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { Wrestler } from "@/types/wrestler"
import { useActiveUniverse } from "@/context/UniverseContext" // 1. Import context

export function useWrestlerLookup() {
  const { activeUniverse } = useActiveUniverse() // 2. Get active universe
  const universeId = activeUniverse?.id

  const query = useQuery({
    // 3. Prepend universeId to partition the key lookup profile by save file
    queryKey: ["universe", universeId, "wrestlers", "lookup"], 
    
    queryFn: async () => {
      const res = await api.get<{ data: Wrestler[] }>("/wrestlers")
      return res.data.data
    },
    
    // 4. Don't query until a save file is selected and loaded
    enabled: !!universeId,
    
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