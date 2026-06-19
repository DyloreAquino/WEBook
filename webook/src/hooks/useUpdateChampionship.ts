// hooks/useUpdateChampionship.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { Championship, Division } from "@/types/championship"
import { useActiveUniverse } from "@/context/UniverseContext" // 1. Import context

export type ChampionshipUpdate = Partial<{ name: string; division: Division }>

export function useUpdateChampionship(id: number) {
  const qc = useQueryClient()
  const { activeUniverse } = useActiveUniverse() // 2. Get active universe
  const universeId = activeUniverse?.id

  return useMutation({
    mutationFn: async (body: ChampionshipUpdate) => {
      const res = await api.patch<{ data: Championship }>(`/championships/${id}`, body)
      return res.data.data
    },
    onSuccess: (updated) => {
      // 3. Match the universe partition for both the detailed entity and global lists
      qc.setQueryData(["universe", universeId, "championship", id], updated)
      qc.invalidateQueries({ queryKey: ["universe", universeId, "championships"] })
    },
  })
}