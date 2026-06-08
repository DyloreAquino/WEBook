// hooks/useChampionship.ts
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { Championship } from "@/types/championship"

export function useChampionship(id: number) {
  return useQuery({
    queryKey: ["championship", id],
    queryFn: async () => {
      const res = await api.get<{ data: Championship }>(`/championships/${id}`)
      return res.data.data
    },
    enabled: Number.isFinite(id),
  })
}