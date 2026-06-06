import { Wrestler } from "@/types/wrestler"

export type Territory = {
  id: number
  name: string
  likes: number
  dislikes: number
  updatedAt: string
  wrestlers?: Wrestler[]   // only present whenLoaded
}