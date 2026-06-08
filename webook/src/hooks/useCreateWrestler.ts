// hooks/useCreateWrestler.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { Wrestler } from "@/types/wrestler"

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
}

export function useCreateWrestler() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (body: WrestlerCreate) => {
      const res = await api.post<{ data: Wrestler }>("/wrestlers", body)
      return res.data.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["wrestlers"] })  // refresh roster + lookup
    },
  })
}