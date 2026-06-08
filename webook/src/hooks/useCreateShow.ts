// hooks/useCreateShow.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { Show, ShowType } from "@/types/show"

export type ShowCreate = {
  name: string | null
  type: ShowType
  territoryId: number
  year: number
  month: number
  week: number
  promotionId: number
}

export function useCreateShow() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (body: ShowCreate) => {
      const res = await api.post<{ data: Show }>("/shows", body)
      return res.data.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["shows"] })
    },
  })
}