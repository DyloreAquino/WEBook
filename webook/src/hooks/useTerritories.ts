// hooks/useTerritories.ts
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { Territory } from "@/types/territory"
import { useActiveUniverse } from "@/context/UniverseContext" // 1. Import context

export function useTerritories() {
  const { activeUniverse } = useActiveUniverse() // 2. Get active universe
  const universeId = activeUniverse?.id

  return useQuery({
    // 3. Prepend universeId to keep territories separated across slots
    queryKey: ["universe", universeId, "territories"],
    
    queryFn: async () => {
      const res = await api.get<{ data: Territory[] }>("/territories")
      return res.data.data
    },
    
    // 4. Require an active universe profile before fetching
    enabled: !!universeId,
    
    staleTime: 5 * 60_000,
  })
}