import { Show } from "@/types/show"

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
]

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"]
  const v = n % 100
  return n + (s[(v - 20) % 10] ?? s[v] ?? s[0])
}

export function formatShow(show: Show): string {
  const monthName = MONTHS[show.month - 1] ?? String(show.month)
  const when = `${ordinal(show.week)} week of ${monthName}, ${show.year}`
  // type | title (if any) | when
  return [show.type, show.name, when].filter(Boolean).join(" | ")
}