// hooks/useDeleteWrestler.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/axios"

export function useDeleteWrestler() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      // Assuming your API follows standard REST routing
      await api.delete(`/wrestlers/${id}`)
      return id
    },
    onSuccess: () => {
      // Wipes the wrestlers cache so your main list updates instantly
      qc.invalidateQueries({ queryKey: ["wrestlers"] })
    },
  })
}