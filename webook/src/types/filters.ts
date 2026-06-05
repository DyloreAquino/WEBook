import { Gender, Allegiance, Role } from "@/types/wrestler"

export type StatKey =
  | "popularity"
  | "strength"
  | "skill"
  | "agility"
  | "stamina"
  | "attitude"

export const STAT_KEYS: StatKey[] = [
  "popularity", "strength", "skill", "agility", "stamina", "attitude",
]

// each stat can have an exclusive lower (gt) and/or upper (lt) bound
export type StatRange = { gt?: number; lt?: number }

export type WrestlerFilters = {
  name?: string            // eq only — exact match (weak until backend adds 'like')
  gender?: Gender          // eq, single
  allegiance?: Allegiance  // eq, single
  role?: Role              // eq, single
  territoryId?: number     // eq, single
  promotionId?: number     // eq, single
  stats?: Partial<Record<StatKey, StatRange>>
}