// hooks/useUpdateShow.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { Show } from "@/types/show"
import { useActiveUniverse } from "@/context/UniverseContext" // 1. Import context

export type ShowUpdate = Partial<Pick<Show, "name" | "type" | "territoryId">>

export function useUpdateShow(id: number) {
  const qc = useQueryClient()
  const { activeUniverse } = useActiveUniverse() // 2. Get active universe
  const universeId = activeUniverse?.id

  return useMutation({
    mutationFn: async (body: ShowUpdate) => {
      const res = await api.patch<{ data: Show }>(`/shows/${id}`, body)
      return res.data.data
    },
    onSuccess: (updated) => {
      // 3. Keep cache updates and global collections bounded by the loaded universe slot
      qc.setQueryData(["universe", universeId, "show", id], updated)
      qc.invalidateQueries({ queryKey: ["universe", universeId, "shows"] })
    },
  })
}