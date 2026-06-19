// lib/axios.ts
import axios from "axios";
import { resolveBaseUrl } from "@/lib/apiBaseUrl";
import { universeStore } from "@/lib/universeStore"; // Import the store

export const api = axios.create({
  baseURL: resolveBaseUrl(),
  timeout: 10000,
  headers: { Accept: "application/json" },
});

// Automatically inject the header into every request
api.interceptors.request.use((config) => {
  const universeId = universeStore.id
  console.log("REQUEST:", config.url, "| X-Universe-ID:", universeId)
  if (universeId !== null) {
    config.headers["X-Universe-ID"] = String(universeId)
  }
  return config
})