// types/title_reign.ts
import { Wrestler } from "./wrestler"

export type TitleReign = {
  id: number
  championshipId: number
  yearStart: number
  monthStart: number
  weekStart: number
  yearEnd: number | null
  monthEnd: number | null
  weekEnd: number | null
  createdAt: string
  updatedAt: string
  wrestlers?: Wrestler[]   // nested holders
}