// hooks/useWrestler.ts
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { Wrestler } from "@/types/wrestler"

export function useWrestler(id: number) {
  return useQuery({
    queryKey: ["wrestler", id],
    queryFn: async () => {
      const res = await api.get<{ data: Wrestler }>(`/wrestlers/${id}`)
      return res.data.data
    },
    enabled: Number.isFinite(id),  // don't fire on a bad/NaN id
  })
}