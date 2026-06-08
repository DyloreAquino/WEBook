// hooks/useCreateChampionship.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { Championship, Division } from "@/types/championship"

export type ChampionshipCreate = {
  name: string
  division: Division
  promotionId: number
}

export function useCreateChampionship() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (body: ChampionshipCreate) => {
      const res = await api.post<{ data: Championship }>("/championships", body)
      return res.data.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["championships"] })
    },
  })
}