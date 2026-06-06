import { Wrestler } from "@/types/wrestler"
import { Championship } from "@/types/championship"

export type Promotion = {
  id: number
  name: string
  wrestlers?: Wrestler[]        // whenLoaded
  championships?: Championship[] // whenLoaded
}