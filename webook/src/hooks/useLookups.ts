import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { useActiveUniverse } from "@/context/UniverseContext" // 1. Import context

type Named = { id: number; name: string }

// Factory pattern transformed to return a custom hook functional component pattern
function lookupHook(path: string, key: string) {
  return () => {
    const { activeUniverse } = useActiveUniverse() // 2. Extract active universe state
    const universeId = activeUniverse?.id

    return useQuery({
      // 3. Prepend the universeId to separate these lookups by save file
      queryKey: ["universe", universeId, key],
      
      queryFn: async () => {
        const res = await api.get<{ data: Named[] }>(path)
        const map = new Map<number, string>()
        for (const item of res.data.data) map.set(item.id, item.name)
        return map
      },
      
      // 4. Block lookup fetching until a save file is active
      enabled: !!universeId,
      
      staleTime: 10 * 60_000, // lookups rarely change
    })
  }
}

export const useMatchTypes = lookupHook("/match_types", "matchTypes")