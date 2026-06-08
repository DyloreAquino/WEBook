// hooks/useDeleteEvent.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/axios"

export function useDeleteEvent(showId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => { await api.delete(`/events/${id}`) },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["show", showId] })
    },
  })
}