import axios from "axios"
import { resolveBaseUrl } from "@/lib/apiBaseUrl"

export const api = axios.create({
  baseURL: resolveBaseUrl(),
  timeout: 10000,
  headers: { Accept: "application/json" },
})

