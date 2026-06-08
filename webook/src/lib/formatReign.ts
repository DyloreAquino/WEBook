// lib/formatReign.ts
import { TitleReign } from "@/types/title_reign"

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

function datePart(year: number, month: number, week: number) {
  return `Wk ${week} ${MONTHS[month - 1] ?? month} ${year}`
}

export function reignDateRange(r: TitleReign): string {
  const start = datePart(r.yearStart, r.monthStart, r.weekStart)
  if (r.yearEnd == null || r.monthEnd == null || r.weekEnd == null) {
    return `${start} – present`
  }
  return `${start} – ${datePart(r.yearEnd, r.monthEnd, r.weekEnd)}`
}

// sort key: most recent start first
export function reignSortValue(r: TitleReign): number {
  return r.yearStart * 10000 + r.monthStart * 100 + r.weekStart
}