import { EventType, Placement } from "@/types/event"

export const TYPE_TAG: Record<EventType, { bg: string; label: string }> = {
  MATCH: { bg: "#3d2459", label: "Match" },     // violet
  PROMO: { bg: "#1a4a4a", label: "Promo" },     // teal
  SEGMENT: { bg: "#2a2a5a", label: "Segment" }, // indigo
  BRAWL: { bg: "#5f2742", label: "Brawl" },     // maroon
}

export const PLACEMENT_TAG: Record<Placement, { bg: string; label: string }> = {
  UNDER: { bg: "#43352a", label: "Undercard" },  // taupe
  MID: { bg: "#2a2a5a", label: "Mid Card" },     // indigo
  SEMI: { bg: "#5a3a1a", label: "Semi Main" },   // amber
  MAIN: { bg: "#993c1d", label: "Main Event" },  // strong coral — biggest slot, hottest color
}

// winner gets face-green, loser neutral
export const RESULT_COLORS = { won: "#1f4a2e", lost: "#2A1F1F" }