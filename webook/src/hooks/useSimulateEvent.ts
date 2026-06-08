// hooks/useSimulateEvent.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { Event, FinishType } from "@/types/event"

export type SimulateResult = {
  wrestlerId: number
  isWinner: boolean
  finishType: FinishType
}

export type SimulatePayload = {
  results: SimulateResult[]
  notes?: string   // backend column pending — add server-side before relying on this
}

export function useSimulateEvent(eventId: number, showId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: SimulatePayload) => {
      const res = await api.patch<{ data: Event }>(`/events/${eventId}/simulate`, payload)
      return res.data.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["event", eventId] })
      qc.invalidateQueries({ queryKey: ["show", showId] })
    },
  })
}