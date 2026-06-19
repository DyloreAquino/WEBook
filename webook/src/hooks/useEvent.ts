// hooks/useEvent.ts
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { Event } from "@/types/event"
import { useActiveUniverse } from "@/context/UniverseContext" // 1. Import context

export function useEvent(id: number) {
  const { activeUniverse } = useActiveUniverse() // 2. Get active universe
  const universeId = activeUniverse?.id

  return useQuery({
    // 3. Prepend the universeId to the cache array
    queryKey: ["universe", universeId, "event", id],
    
    queryFn: async () => {
      const res = await api.get<{ data: Event }>(`/events/${id}`)
      return res.data.data
    },
    
    // 4. Do not fire until a valid ID is present and a save slot is active
    enabled: Number.isFinite(id) && !!universeId,
  })
}