import { Event } from "./event"

export type ShowType = 'TV' | 'PPV' | 'SPECIAL'

export type Show = {
  id: number
  name: string | null
  year: number
  month: number
  week: number
  type: ShowType
  territoryId: number
  createdAt: string
  updatedAt: string
  events?: Event[]
}