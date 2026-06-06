import { Gender, Allegiance, Role } from "@/types/wrestler"

export type StatKey =
  | "popularity" | "strength" | "skill" | "agility" | "stamina" | "attitude"

export const STAT_KEYS: StatKey[] = [
  "popularity", "strength", "skill", "agility", "stamina", "attitude",
]

export type StatRange = { gte?: number; lte?: number }  // inclusive now

export type WrestlerFilters = {
  name?: string
  gender?: Gender[]           // multi-select
  allegiance?: Allegiance[]
  role?: Role[]
  territoryId?: number[]      // multi-select
  promotionId?: number[]
  stats?: Partial<Record<StatKey, StatRange>>
}