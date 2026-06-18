// types/event.ts
import { Wrestler } from "./wrestler"

export type EventType = "MATCH" | "PROMO" | "SEGMENT" | "BRAWL"
export type Placement = "UNDER" | "MID" | "SEMI" | "MAIN"

export type FinishType =
  | "UNFINISHED" | "PIN" | "SUBMISSION" | "DISQUALIFICATION"
  | "COUNTOUT" | "TIMEOUT" | "ELIMINATION" | "SPECIAL"

export type Stipulation = { id: number; name: string }

export type Event = {
  id: number
  type: EventType
  placement: Placement
  matchTypeId: number | null
  championshipId: number | null
  showId: number
  notes: string | null
  rating: number | null
  createdAt: string
  updatedAt: string
  wrestlers?: EventWrestler[]          // whenLoaded — for the show view
  // pivot fields, present when the event is loaded THROUGH a wrestler (history view):
  isWinner?: number
  finishType?: FinishType
  stipulations?: Stipulation[]
}

// a wrestler inside an event carries their own pivot result
export type EventWrestler = Wrestler & {
  isWinner?: boolean
  finishType?: FinishType
}