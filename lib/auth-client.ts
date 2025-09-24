import { createAuthClient } from "better-auth/react"

export const { 
  signIn: betterAuthSignIn, 
  signUp: betterAuthSignUp, 
  signOut: betterAuthSignOut, 
  useSession,
  getSession: betterAuthGetSession 
} = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
})

interface LoginCredentials {
  email: string
  password: string
}

interface SignupData {
  email: string
  password: string
  name: string
  userType: 'patient' | 'doctor'
  phone?: string
  specialty?: string
  licenseNumber?: string
}

interface User {
  id: string
  email: string
  name: string
  userType: 'patient' | 'doctor'
  specialty?: string
}

interface AuthResponse {
  success: boolean
  token?: string
  user?: User
  message?: string
  error?: string
}

class AuthClient {
  private baseURL: string
  private token: string | null = null

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001'
    this.token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
  }

  async signUp(data: SignupData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseURL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok && result.token) {
        this.setToken(result.token)
        return {
          success: true,
          token: result.token,
          user: result.user,
          message: result.message
        }
      } else {
        return {
          success: false,
          error: result.error || 'Signup failed'
        }
      }
    } catch (error) {
      console.error('Signup error:', error)
      return {
        success: false,
        error: 'Network error occurred'
      }
    }
  }

  async signIn(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseURL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      const result = await response.json()

      if (response.ok && result.token) {
        this.setToken(result.token)
        return {
          success: true,
          token: result.token,
          user: result.user,
          message: result.message
        }
      } else {
        return {
          success: false,
          error: result.error || 'Login failed'
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      return {
        success: false,
        error: 'Network error occurred'
      }
    }
  }

  async signOut(): Promise<void> {
    this.setToken(null)
  }

  async getSession(): Promise<User | null> {
    if (!this.token) return null

    try {
      const response = await fetch(`${this.baseURL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      })

      if (response.ok) {
        const result = await response.json()
        return result.user
      } else {
        this.setToken(null)
        return null
      }
    } catch (error) {
      console.error('Get session error:', error)
      this.setToken(null)
      return null
    }
  }

  private setToken(token: string | null): void {
    this.token = token
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token)
      } else {
        localStorage.removeItem('auth_token')
      }
    }
  }

  getToken(): string | null {
    return this.token
  }

  isAuthenticated(): boolean {
    return !!this.token
  }
}

export const authClient = new AuthClient()

// Export functions for compatibility
export const signUp = (data: SignupData) => authClient.signUp(data)
export const signIn = (credentials: LoginCredentials) => authClient.signIn(credentials)
export const signOut = () => authClient.signOut()
export const getSession = () => authClient.getSession()

// Export types
export type { User, AuthResponse, LoginCredentials, SignupData }