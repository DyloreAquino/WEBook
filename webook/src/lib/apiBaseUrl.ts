import { Platform } from "react-native"

const PORT = 8000
const API_VERSION = "v1"
const API_PATH = `/api/${API_VERSION}`

export function resolveBaseUrl(): string {
  if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL
  if (Platform.OS === "web") return `http://localhost:${PORT}${API_PATH}`
  // mobile (android device + ios): your machine's LAN IP
  return `http://192.168.254.105:${PORT}${API_PATH}`
}

console.log(`[${Platform.OS}] BASE URL:`, resolveBaseUrl())