// hooks/useUpdateChampionship.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { Championship, Division } from "@/types/championship"

export type ChampionshipUpdate = Partial<{ name: string; division: Division }>

export function useUpdateChampionship(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (body: ChampionshipUpdate) => {
      const res = await api.patch<{ data: Championship }>(`/championships/${id}`, body)
      return res.data.data
    },
    onSuccess: (updated) => {
      qc.setQueryData(["championship", id], updated)
      qc.invalidateQueries({ queryKey: ["championships"] })
    },
  })
}