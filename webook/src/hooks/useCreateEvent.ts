// hooks/useCreateEvent.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { Event, EventType, Placement } from "@/types/event"
import { useActiveUniverse } from "@/context/UniverseContext" // 1. Import context

export type EventCreate = {
  type: EventType
  placement: Placement
  matchTypeId: number | null
  championshipId: number | null
  showId: number
  rating: number | null
  wrestlerIds: number[]
  stipulationIds: number[]
}

export function useCreateEvent() {
  const qc = useQueryClient()
  const { activeUniverse } = useActiveUniverse() // 2. Get active universe
  const universeId = activeUniverse?.id

  return useMutation({
    mutationFn: async (input: EventCreate) => {
      // 1. create the base event
      const res = await api.post<{ data: Event }>("/events", {
        type: input.type,
        placement: input.placement,
        matchTypeId: input.matchTypeId,
        championshipId: input.championshipId,
        showId: input.showId,
        rating: input.rating
      })
      const event = res.data.data

      // 2. assign wrestlers (required array — only if any picked)
      if (input.wrestlerIds.length > 0) {
        await api.put(`/events/${event.id}/wrestlers`, { wrestlerIds: input.wrestlerIds })
      }

      // 3. assign stipulations (only if any picked)
      if (input.stipulationIds.length > 0) {
        await api.put(`/events/${event.id}/stipulations`, { stipulationIds: input.stipulationIds })
      }

      return event
    },
    onSuccess: (event) => {
      // 3. Invalidate using the localized universe keys
      qc.invalidateQueries({ queryKey: ["universe", universeId, "show", event.showId] })
      qc.invalidateQueries({ queryKey: ["universe", universeId, "shows"] })
    },
  })
}