// hooks/useChampionship.ts
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { Championship } from "@/types/championship"
import { useActiveUniverse } from "@/context/UniverseContext" // 1. Import your new context hook

export function useChampionship(id: number) {
  const { activeUniverse } = useActiveUniverse() // 2. Grab the active universe state
  const universeId = activeUniverse?.id

  return useQuery({
    // 3. Prepend the universeId to the queryKey array
    queryKey: ["universe", universeId, "championship", id],
    
    // 4. Leave the queryFn completely alone. Axios handles the headers now!
    queryFn: async () => {
      const res = await api.get<{ data: Championship }>(`/championships/${id}`)
      return res.data.data
    },
    
    // 5. Ensure the query won't fire until both a valid ID and a Universe exist
    enabled: Number.isFinite(id) && !!universeId,
  })
}