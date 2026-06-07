// hooks/useUpdateShow.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { Show } from "@/types/show"

export type ShowUpdate = Partial<Pick<Show, "name" | "type" | "territoryId">>

export function useUpdateShow(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (body: ShowUpdate) => {
      const res = await api.patch<{ data: Show }>(`/shows/${id}`, body)
      return res.data.data
    },
    onSuccess: (updated) => {
      qc.setQueryData(["show", id], updated)
      qc.invalidateQueries({ queryKey: ["shows"] })
    },
  })
}