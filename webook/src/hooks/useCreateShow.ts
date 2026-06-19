// hooks/useCreateShow.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { Show, ShowType } from "@/types/show"
import { useActiveUniverse } from "@/context/UniverseContext" // 1. Import context

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
  const { activeUniverse } = useActiveUniverse() // 2. Get active universe
  const universeId = activeUniverse?.id

  return useMutation({
    mutationFn: async (body: ShowCreate) => {
      const res = await api.post<{ data: Show }>("/shows", body)
      return res.data.data
    },
    onSuccess: () => {
      // 3. Invalidate using the universe-scoped cache key
      qc.invalidateQueries({ queryKey: ["universe", universeId, "shows"] })
    },
  })
}