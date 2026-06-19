// hooks/useDeleteEvent.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { useActiveUniverse } from "@/context/UniverseContext" // 1. Import context

export function useDeleteEvent(showId: number) {
  const qc = useQueryClient()
  const { activeUniverse } = useActiveUniverse() // 2. Get active universe
  const universeId = activeUniverse?.id

  return useMutation({
    mutationFn: (id: number) => api.delete(`/events/${id}`),
    
    onSuccess: (_, id) => {
      // 3. Invalidate and remove query keys matching your universe partition layout
      qc.invalidateQueries({ queryKey: ["universe", universeId, "show", showId] })
      qc.invalidateQueries({ queryKey: ["universe", universeId, "shows"] })
      qc.removeQueries({ queryKey: ["universe", universeId, "event", id] })
    },
  })
}