// hooks/useReignMutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { TitleReign } from "@/types/title_reign"
import { useActiveUniverse } from "@/context/UniverseContext" // 1. Import context

type DateFields = {
  yearStart: number; monthStart: number; weekStart: number
  yearEnd: number | null; monthEnd: number | null; weekEnd: number | null
}

export type ReignCreate = DateFields & { championshipId: number; wrestlerIds: number[] }
export type ReignUpdate = Partial<DateFields> & { wrestlerIds?: number[] }

export function useCreateReign(championshipId: number) {
  const qc = useQueryClient()
  const { activeUniverse } = useActiveUniverse() // 2. Get active universe
  const universeId = activeUniverse?.id

  return useMutation({
    mutationFn: async (input: ReignCreate) => {
      // 1. create the reign
      const res = await api.post<{ data: TitleReign }>("/title_reigns", {
        championshipId: input.championshipId,
        yearStart: input.yearStart, monthStart: input.monthStart, weekStart: input.weekStart,
        yearEnd: input.yearEnd, monthEnd: input.monthEnd, weekEnd: input.weekEnd,
      })
      const reign = res.data.data
      // 2. assign holders
      if (input.wrestlerIds.length > 0) {
        await api.put(`/title_reigns/${reign.id}/wrestlers`, { wrestlerIds: input.wrestlerIds })
      }
      return reign
    },
    onSuccess: () => {
      // 3. Invalidate using universe scope
      qc.invalidateQueries({ queryKey: ["universe", universeId, "championship", championshipId] })
    },
  })
}

export function useUpdateReign(championshipId: number, reignId: number) {
  const qc = useQueryClient()
  const { activeUniverse } = useActiveUniverse() // 2. Get active universe
  const universeId = activeUniverse?.id

  return useMutation({
    mutationFn: async (input: ReignUpdate) => {
      // base date fields PATCH
      const base: Record<string, unknown> = {}
      for (const k of ["yearStart","monthStart","weekStart","yearEnd","monthEnd","weekEnd"] as const) {
        if (input[k] !== undefined) base[k] = input[k]
      }
      if (Object.keys(base).length > 0) await api.patch(`/title_reigns/${reignId}`, base)
      // holders re-assign
      if (input.wrestlerIds) await api.put(`/title_reigns/${reignId}/wrestlers`, { wrestlerIds: input.wrestlerIds })
    },
    onSuccess: () => {
      // 3. Invalidate using universe scope
      qc.invalidateQueries({ queryKey: ["universe", universeId, "championship", championshipId] })
    },
  })
}

export function useEndReign(championshipId: number) {
  const qc = useQueryClient()
  const { activeUniverse } = useActiveUniverse() // 2. Get active universe
  const universeId = activeUniverse?.id

  return useMutation({
    mutationFn: async (reignId: number) => { await api.patch(`/title_reigns/${reignId}/end`) },
    onSuccess: () => {
      // 3. Invalidate using universe scope
      qc.invalidateQueries({ queryKey: ["universe", universeId, "championship", championshipId] })
    },
  })
}