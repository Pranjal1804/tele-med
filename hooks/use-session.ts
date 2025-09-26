import { useState, useEffect } from 'react'
import { authClient, type User } from '@/lib/auth-client'

interface SessionData {
  user: User | null
  token: string | null // Add token to the interface
  isLoading: boolean
  error: string | null
}

export function useSession(): SessionData {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null) // Add state for the token
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadSession = async () => {
      try {
        setIsLoading(true)
        const sessionUser = await authClient.getSession()
        const sessionToken = authClient.getToken() // Get the token
        setUser(sessionUser)
        setToken(sessionToken) // Set the token in state
        setError(null)
      } catch (err) {
        console.error('Session load error:', err)
        setError('Failed to load session')
        setUser(null)
        setToken(null) // Clear token on error
      } finally {
        setIsLoading(false)
      }
    }

    loadSession()
  }, [])

  return { user, token, isLoading, error } // Return the token
}