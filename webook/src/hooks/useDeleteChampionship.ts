// hooks/useDeleteChampionship.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/axios"

export function useDeleteChampionship() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => { await api.delete(`/championships/${id}`) },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["championships"] }) },
  })
}