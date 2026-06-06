import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { Wrestler } from "@/types/wrestler"

// only the editable fields can be patched
// hooks/useUpdateWrestler.ts
export type WrestlerUpdate = Partial<
  Pick<Wrestler,
    | "gender" | "allegiance" | "role" | "territoryId" | "promotionId" | "finisherName"
    | "popularity" | "strength" | "skill" | "agility" | "stamina" | "attitude"
    | "managerId" | "partnerId" | "storyFriendId" | "storyEnemyId" | "realFriendId" | "realEnemyId"
  >
>

export function useUpdateWrestler(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (body: WrestlerUpdate) => {
      const start = Date.now()
      const res = await api.patch<{ data: Wrestler }>(`/wrestlers/${id}`, body)
      console.log("PATCH took", Date.now() - start, "ms")
    
    },
    onSuccess: (updated) => {
      // refresh this wrestler's detail + any roster lists
      qc.setQueryData(["wrestler", id], updated)
      qc.invalidateQueries({ queryKey: ["wrestlers"] })
    },
  })
}