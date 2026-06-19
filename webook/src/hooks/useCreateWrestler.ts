// hooks/useCreateWrestler.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { Wrestler } from "@/types/wrestler"
import { useActiveUniverse } from "@/context/UniverseContext" // 1. Import context

// everything required on create + optional relationships
export type WrestlerCreate = {
  name: string
  gender: Wrestler["gender"]
  allegiance: Wrestler["allegiance"]
  role: Wrestler["role"]
  territoryId: number
  promotionId: number
  finisherName: string
  popularity: number
  managerId?: number | null
  partnerId?: number | null
  storyFriendId?: number | null
  storyEnemyId?: number | null
  realFriendId?: number | null
  realEnemyId?: number | null
  injured?: boolean
}

export function useCreateWrestler() {
  const qc = useQueryClient()
  const { activeUniverse } = useActiveUniverse() // 2. Get active universe
  const universeId = activeUniverse?.id

  return useMutation({
    mutationFn: async (body: WrestlerCreate) => {
      const res = await api.post<{ data: Wrestler }>("/wrestlers", body)
      return res.data.data
    },
    onSuccess: () => {
      // 3. Invalidate using the universe-scoped cache key
      qc.invalidateQueries({ queryKey: ["universe", universeId, "wrestlers"] })  // refresh roster + lookup
    },
  })
}