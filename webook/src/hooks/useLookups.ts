import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"

type Named = { id: number; name: string }

// TODO: Replace with actual lookups for match type championships and shows later
function lookupHook(path: string, key: string) {
  return () =>
    useQuery({
      queryKey: [key],
      queryFn: async () => {
        const res = await api.get<{ data: Named[] }>(path)
        const map = new Map<number, string>()
        for (const item of res.data.data) map.set(item.id, item.name)
        return map
      },
      staleTime: 10 * 60_000,  // lookups rarely change
    })
}

export const useMatchTypes = lookupHook("/match_types", "matchTypes")