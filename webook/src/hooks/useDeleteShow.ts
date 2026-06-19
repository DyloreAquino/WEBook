// hooks/useDeleteShow.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { useActiveUniverse } from "@/context/UniverseContext" // 1. Import context

export function useDeleteShow() {
  const qc = useQueryClient()
  const { activeUniverse } = useActiveUniverse() // 2. Get active universe
  const universeId = activeUniverse?.id

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/shows/${id}`)
      return id
    },
    onSuccess: () => {
      // 3. Invalidate using the universe-scoped cache key
      qc.invalidateQueries({ queryKey: ["universe", universeId, "shows"] })
    },
  })
}