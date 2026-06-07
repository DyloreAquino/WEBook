// hooks/useShow.ts — single show WITH events, fetched on selection
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { Show } from "@/types/show"

export function useShow(id: number | null) {
  return useQuery({
    queryKey: ["show", id],
    queryFn: async () => {
      const res = await api.get<{ data: Show }>(`/shows/${id}`)
      return res.data.data
    },
    enabled: id != null,   // only fetch when a week with a show is selected
  })
}