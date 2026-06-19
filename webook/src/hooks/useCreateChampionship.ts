// hooks/useCreateChampionship.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { Championship, Division } from "@/types/championship"
import { useActiveUniverse } from "@/context/UniverseContext" // 1. Import context

export type ChampionshipCreate = {
  name: string
  division: Division
  promotionId: number
}

export function useCreateChampionship() {
  const qc = useQueryClient()
  const { activeUniverse } = useActiveUniverse() // 2. Get active universe
  const universeId = activeUniverse?.id

  return useMutation({
    mutationFn: async (body: ChampionshipCreate) => {
      const res = await api.post<{ data: Championship }>("/championships", body)
      return res.data.data
    },
    onSuccess: () => {
      // 3. Invalidate the exact universe-scoped cache key prefix
      qc.invalidateQueries({ queryKey: ["universe", universeId, "championships"] })
    },
  })
}