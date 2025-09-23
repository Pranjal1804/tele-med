import { useState, useEffect } from 'react'
import { authClient, type User } from '@/lib/auth-client'

interface SessionData {
  user: User | null
  isLoading: boolean
  error: string | null
}

export function useSession(): SessionData {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadSession = async () => {
      try {
        setIsLoading(true)
        const sessionUser = await authClient.getSession()
        setUser(sessionUser)
        setError(null)
      } catch (err) {
        console.error('Session load error:', err)
        setError('Failed to load session')
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadSession()
  }, [])

  return { user, isLoading, error }
}