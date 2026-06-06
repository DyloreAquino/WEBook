import { Wrestler, GroupCategory } from "@/types/wrestler"

export type WrestlerSection = { title: string; data: Wrestler[] }

// optional ID -> display name maps, needed so territoryId/promotionId
// headers show real names instead of raw ids.
type LabelMaps = Partial<Record<GroupCategory, Record<string, string>>>

export function groupWrestlers(
  wrestlers: Wrestler[],
  category: GroupCategory,
  labels?: LabelMaps
): WrestlerSection[] {
  // ungrouped: single section, no title
  if (category === "none") {
    return [{ title: "", data: wrestlers }]
  }

  const buckets = new Map<string, Wrestler[]>()
  for (const w of wrestlers) {
    const raw = w[category]
    const key = raw == null ? "—" : String(raw) // null/undefined -> "—" bucket
    if (!buckets.has(key)) buckets.set(key, [])
    buckets.get(key)!.push(w)
  }

  return Array.from(buckets.entries())
    .map(([key, data]) => ({
      // resolve to a friendly label if a map was provided, else raw key
      title: labels?.[category]?.[key] ?? key,
      data,
    }))
    .sort((a, b) => a.title.localeCompare(b.title))
}