// hooks/useDeleteShow.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/axios"

export function useDeleteShow() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/shows/${id}`)
      return id
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["shows"] })
    },
  })
}