// hooks/useSimulateEvent.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { Event, FinishType } from "@/types/event"
import { useActiveUniverse } from "@/context/UniverseContext" // 1. Import context

export type SimulateResult = {
  wrestlerId: number
  isWinner: boolean
  finishType: FinishType
}

export type SimulatePayload = {
  results: SimulateResult[]
  rating: number | null
  notes?: string   // backend column pending — add server-side before relying on this
}

export function useSimulateEvent(eventId: number, showId: number) {
  const qc = useQueryClient()
  const { activeUniverse } = useActiveUniverse() // 2. Get active universe
  const universeId = activeUniverse?.id

  return useMutation({
    mutationFn: async (payload: SimulatePayload) => {
      const res = await api.patch<{ data: Event }>(`/events/${eventId}/simulate`, payload)
      return res.data.data
    },
    onSuccess: () => {
      // 3. Invalidate using the universe-scoped cache keys
      qc.invalidateQueries({ queryKey: ["universe", universeId, "event", eventId] })
      qc.invalidateQueries({ queryKey: ["universe", universeId, "show", showId] })
    },
  })
}