import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { WrestlerFilters } from "@/types/filters"
import { serializeFilters } from "@/lib/serializeFilters"

export function useWrestlers(filters: WrestlerFilters = {}) {
  const params = serializeFilters(filters)
  return useQuery({
    queryKey: ["wrestlers", params],
    queryFn: async () => {
      console.log("FETCHING URL:", api.getUri({ url: "/wrestlers", params }))
      const res = await api.get("/wrestlers", { params })
      console.log("GOT", res.data.data.length, "wrestlers")
      return res.data.data
    },
    staleTime: 0,        // <- force stale so it always refetches
    gcTime: 0,           // <- don't keep old cache
  })
}