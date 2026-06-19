// hooks/useWrestlers.ts
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { WrestlerFilters } from "@/types/filters"
import { serializeFilters } from "@/lib/serializeFilters"
import { useActiveUniverse } from "@/context/UniverseContext" // 1. Import context

export function useWrestlers(filters: WrestlerFilters = {}) {
  const { activeUniverse } = useActiveUniverse() // 2. Get active universe
  const universeId = activeUniverse?.id
  const params = serializeFilters(filters)

  return useQuery({
    // 3. Prepend universeId to keep filtered dataset collections isolated by save slot
    queryKey: ["universe", universeId, "wrestlers", params],
    
    queryFn: async () => {
      console.log("FETCHING URL:", api.getUri({ url: "/wrestlers", params }))
      const res = await api.get("/wrestlers", { params })
      console.log("GOT", res.data.data.length, "wrestlers")
      return res.data.data
    },
    
    // 4. Do not evaluate the filtered roster until a universe slot is active
    enabled: !!universeId,
    
    staleTime: 0,        // <- force stale so it always refetches
    gcTime: 0,           // <- don't keep old cache
  })
}