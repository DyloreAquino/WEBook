// hooks/useUpdateWrestler.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { Wrestler } from "@/types/wrestler"
import { useActiveUniverse } from "@/context/UniverseContext" // 1. Import context

export type WrestlerUpdate = Partial<
  Pick<Wrestler,
    | "name"
    | "gender" | "allegiance" | "role" | "territoryId" | "promotionId" | "finisherName"
    | "popularity" | "injured"
    | "managerId" | "partnerId" | "storyFriendId" | "storyEnemyId" | "realFriendId" | "realEnemyId"
  >
>

export function useUpdateWrestler(id: number) {
  const qc = useQueryClient()
  const { activeUniverse } = useActiveUniverse() // 2. Get active universe
  const universeId = activeUniverse?.id

  return useMutation({
    mutationFn: async (body: WrestlerUpdate) => {
      const start = Date.now()
      const res = await api.patch<{ data: Wrestler }>(`/wrestlers/${id}`, body)
      console.log("PATCH took", Date.now() - start, "ms")
      return res.data.data // 3. Explicitly return the payload for onSuccess
    },
    onSuccess: (updated) => {
      // 4. Update and invalidate using the universe-scoped cache prefix layout
      qc.setQueryData(["universe", universeId, "wrestler", id], updated)
      qc.invalidateQueries({ queryKey: ["universe", universeId, "wrestlers"] })
    },
  })
}