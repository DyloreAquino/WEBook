// hooks/useUpdateEvent.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { Event, EventType, Placement } from "@/types/event"

export type EventUpdate = {
  type?: EventType
  placement?: Placement
  matchTypeId?: number | null
  championshipId?: number | null
  notes?: string | null
  rating?: number | null
  wrestlerIds?: number[]      // if present, re-assigns via PUT
  stipulationIds?: number[]   // if present, re-assigns via PUT
}

export function useUpdateEvent(id: number, showId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: EventUpdate) => {
      // base fields PATCH (only if any base field changed)
      const base: Record<string, unknown> = {}
      if (input.type !== undefined) base.type = input.type
      if (input.placement !== undefined) base.placement = input.placement
      if (input.matchTypeId !== undefined) base.matchTypeId = input.matchTypeId
      if (input.championshipId !== undefined) base.championshipId = input.championshipId
      if (input.notes !== undefined) base.notes = input.notes
      if (input.rating !== undefined) base.rating = input.rating
      if (Object.keys(base).length > 0) {
        await api.patch(`/events/${id}`, base)
      }
      // wrestlers re-assign
      if (input.wrestlerIds) {
        await api.put(`/events/${id}/wrestlers`, { wrestlerIds: input.wrestlerIds })
      }
      // stipulations re-assign
      if (input.stipulationIds) {
        await api.put(`/events/${id}/stipulations`, { stipulationIds: input.stipulationIds })
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["event", id] })
      qc.invalidateQueries({ queryKey: ["show", showId] })
    },
  })
}