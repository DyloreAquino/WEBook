import { WrestlerFilters } from "@/types/filters"

// produces { "gender[eq]": "MALE", "popularity[gt]": 70, ... }
// axios url-encodes the brackets; Laravel decodes them back fine.
export function serializeFilters(f: WrestlerFilters): Record<string, string | number> {
  const params: Record<string, string | number> = {}

  if (f.name) params["name[like]"] = f.name
  if (f.gender) params["gender[eq]"] = f.gender
  if (f.allegiance) params["allegiance[eq]"] = f.allegiance
  if (f.role) params["role[eq]"] = f.role
  if (f.territoryId != null) params["territoryId[eq]"] = f.territoryId
  if (f.promotionId != null) params["promotionId[eq]"] = f.promotionId

  if (f.stats) {
    for (const [stat, range] of Object.entries(f.stats)) {
      if (range?.gt != null) params[`${stat}[gt]`] = range.gt
      if (range?.lt != null) params[`${stat}[lt]`] = range.lt
    }
  }

  return params
}

// for the active-filter badge count
export function countActiveFilters(f: WrestlerFilters): number {
  let n = 0
  if (f.name) n++
  if (f.gender) n++
  if (f.allegiance) n++
  if (f.role) n++
  if (f.territoryId != null) n++
  if (f.promotionId != null) n++
  if (f.stats) {
    for (const range of Object.values(f.stats)) {
      if (range?.gt != null) n++
      if (range?.lt != null) n++
    }
  }
  return n
}