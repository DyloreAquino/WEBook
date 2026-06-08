// add to lib/eventTags.ts or a new lib/championshipTags.ts
import { Division } from "@/types/championship"

export const DIVISION_TAG: Record<Division, { bg: string; label: string }> = {
  WORLD: { bg: "#5a3a1a", label: "World" },    // gold — top tier
  MID: { bg: "#2a2a5a", label: "Mid" },        // indigo
  TAG: { bg: "#1a4a4a", label: "Tag" },        // teal
  WOMENS: { bg: "#5f2742", label: "Women's" }, // maroon
}