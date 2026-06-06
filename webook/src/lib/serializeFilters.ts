import { WrestlerFilters } from "@/types/filters"

export function serializeFilters(f: WrestlerFilters): Record<string, string | number> {
  const params: Record<string, string | number> = {}

  if (f.name) params["name[like]"] = f.name

  // arrays -> comma-joined [in], only if non-empty
  if (f.gender?.length) params["gender[in]"] = f.gender.join(",")
  if (f.allegiance?.length) params["allegiance[in]"] = f.allegiance.join(",")
  if (f.role?.length) params["role[in]"] = f.role.join(",")
  if (f.territoryId?.length) params["territoryId[in]"] = f.territoryId.join(",")
  if (f.promotionId?.length) params["promotionId[in]"] = f.promotionId.join(",")

  if (f.stats) {
    for (const [stat, range] of Object.entries(f.stats)) {
      if (range?.gte != null) params[`${stat}[gte]`] = range.gte
      if (range?.lte != null) params[`${stat}[lte]`] = range.lte
    }
  }

  return params
}

export function countActiveFilters(f: WrestlerFilters): number {
  let n = 0
  if (f.name) n++
  if (f.gender?.length) n++
  if (f.allegiance?.length) n++
  if (f.role?.length) n++
  if (f.territoryId?.length) n++
  if (f.promotionId?.length) n++
  if (f.stats) {
    for (const range of Object.values(f.stats)) {
      if (range?.gte != null) n++
      if (range?.lte != null) n++
    }
  }
  return n
}