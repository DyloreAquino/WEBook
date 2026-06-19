// hooks/useStipulations.ts
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { useActiveUniverse } from "@/context/UniverseContext" // 1. Import context

type Stipulation = { id: number; name: string }

export function useStipulations() {
  const { activeUniverse } = useActiveUniverse() // 2. Get active universe
  const universeId = activeUniverse?.id

  return useQuery({
    // 3. Prepend universeId to keep stipulations isolated per universe file
    queryKey: ["universe", universeId, "stipulations"],
    
    queryFn: async () => {
      const res = await api.get<{ data: Stipulation[] }>("/stipulations")
      return res.data.data
    },
    
    // 4. Do not execute until a valid universe slot is active
    enabled: !!universeId,
    
    staleTime: 10 * 60_000,
  })
}