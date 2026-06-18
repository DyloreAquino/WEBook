// hooks/useDeleteEvent.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/axios"

export function useDeleteEvent(showId: number) {
  const qc = useQueryClient()

  return useMutation({
    // Simplified syntax: directly return the promise instead of using async/await wrapping
    mutationFn: (id: number) => api.delete(`/events/${id}`),
    
    // We pass variables (the event id) to onSuccess so we know exactly which event was deleted
    onSuccess: (_, id) => {
      // 1. Refresh the specific show detail view
      qc.invalidateQueries({ queryKey: ["show", showId] })
      
      // 2. Refresh the global shows dashboard list (keeps event counts accurate)
      qc.invalidateQueries({ queryKey: ["shows"] })
      
      // 3. Completely scrub the deleted event's data from active memory cache
      qc.removeQueries({ queryKey: ["event", id] })
    },
  })
}