// hooks/useWrestlers.ts
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { Wrestler } from "@/types/wrestler"

async function fetchWrestlers(): Promise<Wrestler[]> {
  // Laravel API Resource collections wrap rows in { data: [...] }.
  // adjust if your endpoint returns a bare array.
  const res = await api.get<{ data: Wrestler[] }>("/wrestlers")
  return res.data.data
}

export function useWrestlers() {
  return useQuery({
    queryKey: ["wrestlers"],
    queryFn: fetchWrestlers,
  })
}