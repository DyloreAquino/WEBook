// hooks/useShow.ts — single show WITH events, fetched on selection
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { Show } from "@/types/show"
import { useActiveUniverse } from "@/context/UniverseContext" // 1. Import context

export function useShow(id: number | null) {
  const { activeUniverse } = useActiveUniverse() // 2. Get active universe
  const universeId = activeUniverse?.id

  return useQuery({
    // 3. Prepend universeId to keep individual shows scoped by save slot
    queryKey: ["universe", universeId, "show", id],
    
    queryFn: async () => {
      const res = await api.get<{ data: Show }>(`/shows/${id}`)
      return res.data.data
    },
    
    // 4. Do not execute until both a show ID is targeted and a universe slot is active
    enabled: id != null && !!universeId,
  })
}