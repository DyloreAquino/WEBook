// hooks/useShowsByMonth.ts
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { Show } from "@/types/show"
import { useActiveUniverse } from "@/context/UniverseContext" // 1. Import context

export function useShowsByMonth(year: number, month: number, promotionId: number | null, enabled = true) {
  const { activeUniverse } = useActiveUniverse() // 2. Get active universe
  const universeId = activeUniverse?.id

  return useQuery({
    // 3. Prepend the universeId to segment calendar data per save file slot
    queryKey: ["universe", universeId, "shows", { year, month, promotionId }],
    
    queryFn: async () => {
      const res = await api.get<{ data: Show[] }>("/shows", {
        params: {
          "year[eq]": year,
          "month[eq]": month,
          "promotionId[eq]": promotionId,   // filter to managed promotion
        },
      })
      return res.data.data
    },
    
    // 4. Require an active universe profile alongside your promotion gate
    enabled: enabled && promotionId != null && !!universeId,
  })
}