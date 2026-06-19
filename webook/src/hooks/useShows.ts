// hooks/useShows.ts
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { Show } from "@/types/show"
import { useActiveUniverse } from "@/context/UniverseContext" // 1. Import context

export function useShows() {
  const { activeUniverse } = useActiveUniverse() // 2. Get active universe
  const universeId = activeUniverse?.id

  return useQuery({
    // 3. Prepend the universeId to segment global lists per save slot
    queryKey: ["universe", universeId, "shows"],
    
    queryFn: async () => {
      const res = await api.get<{ data: Show[] }>("/shows")
      const map = new Map<number, Show>()
      for (const s of res.data.data) map.set(s.id, s)
      return map
    },
    
    // 4. Require an active universe profile before fetching
    enabled: !!universeId,
    
    staleTime: 10 * 60_000,
  })
}