// hooks/useWrestler.ts
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { Wrestler } from "@/types/wrestler"
import { useActiveUniverse } from "@/context/UniverseContext" // 1. Import context

export function useWrestler(id: number) {
  const { activeUniverse } = useActiveUniverse() // 2. Get active universe
  const universeId = activeUniverse?.id

  return useQuery({
    // 3. Prepend universeId to partition wrestler data by save slot
    queryKey: ["universe", universeId, "wrestler", id],
    
    queryFn: async () => {
      const res = await api.get<{ data: Wrestler }>(`/wrestlers/${id}`)
      return res.data.data
    },
    
    // 4. Do not execute until we have both a valid ID and an active save file slot
    enabled: Number.isFinite(id) && !!universeId,
  })
}