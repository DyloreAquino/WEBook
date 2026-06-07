// hooks/useStipulations.ts
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"

type Stipulation = { id: number; name: string }

export function useStipulations() {
  return useQuery({
    queryKey: ["stipulations"],
    queryFn: async () => {
      const res = await api.get<{ data: Stipulation[] }>("/stipulations")
      return res.data.data
    },
    staleTime: 10 * 60_000,
  })
}