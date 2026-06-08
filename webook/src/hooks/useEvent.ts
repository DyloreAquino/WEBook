import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { Event } from "@/types/event"

export function useEvent(id: number) {
  return useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const res = await api.get<{ data: Event }>(`/events/${id}`)
      return res.data.data
    },
    enabled: Number.isFinite(id),
  })
}