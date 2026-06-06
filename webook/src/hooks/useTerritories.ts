import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { Territory } from "@/types/territory"

export function useTerritories() {
  return useQuery({
    queryKey: ["territories"],
    queryFn: async () => {
      const res = await api.get<{ data: Territory[] }>("/territories")
      return res.data.data
    },
    staleTime: 5 * 60_000,
  })
}