// hooks/useLatestShow.ts — just to seed the initial calendar position
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { Show } from "@/types/show"

export function useLatestShow() {
  return useQuery({
    queryKey: ["shows", "latest"],
    queryFn: async () => {
      const res = await api.get<{ data: Show[] }>("/shows")
      const shows = res.data.data
      if (shows.length === 0) return null
      // most recently created
      return shows.reduce((latest, s) =>
        new Date(s.createdAt) > new Date(latest.createdAt) ? s : latest
      )
    },
    staleTime: 60_000,
  })
}