// types/championship.ts
import { TitleReign } from "./title_reign"

export type Division = "TAG" | "WORLD" | "MID" | "WOMENS"

export type Championship = {
  id: number
  name: string
  division: Division
  promotionId: number
  createdAt: string
  updatedAt: string
  titleReigns?: TitleReign[]
  currentReign?: TitleReign | null
}