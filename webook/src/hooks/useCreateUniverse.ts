import { useState } from "react"
import { useRouter } from "expo-router" // 1. Import router
import { api } from "@/lib/axios"
import { Universe, useActiveUniverse } from "../context/UniverseContext"

export const useCreateUniverse = () => {
  const [loading, setLoading] = useState(false)
  const { refreshUniverses, setActiveUniverse } = useActiveUniverse()
  const router = useRouter() // 2. Initialize router

  const createUniverse = async (name: string) => {
    setLoading(true)
    try {
      const { data } = await api.post<{ data: Universe }>("/universes", { name })
      
      // Update context
      await refreshUniverses()
      setActiveUniverse(data.data) 
      
      // 3. Force navigate home after success
      router.replace("/home") 
      
      return data.data
    } catch (error) {
      console.error("Failed to create universe:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return { createUniverse, loading }
}