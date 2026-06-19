// hooks/useLatestShow.ts — just to seed the initial calendar position
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { Show } from "@/types/show"
import { useActiveUniverse } from "@/context/UniverseContext" // 1. Import context

export function useLatestShow() {
  const { activeUniverse } = useActiveUniverse() // 2. Get active universe
  const universeId = activeUniverse?.id

  return useQuery({
    // 3. Prepend the universeId to separate this tracking across slots
    queryKey: ["universe", universeId, "shows", "latest"],
    
    queryFn: async () => {
      const res = await api.get<{ data: Show[] }>("/shows")
      const shows = res.data.data
      if (shows.length === 0) return null
      // most recently created
      return shows.reduce((latest, s) =>
        new Date(s.createdAt) > new Date(latest.createdAt) ? s : latest
      )
    },
    
    // 4. Block fetching until the save file context is active
    enabled: !!universeId,
    
    staleTime: 60_000,
  })
}