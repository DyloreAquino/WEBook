import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { NamedEntity } from "@/types/common"

export function useTerritories() {
  return useQuery({
    queryKey: ["territories"],
    queryFn: async () => {
      const res = await api.get<{ data: NamedEntity[] }>("/territories")
      return res.data.data
    },
    staleTime: 5 * 60_000, // lookup data — rarely changes
  })
}