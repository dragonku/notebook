import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useAuth } from '../useAuth'

describe('useAuth Hook', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useAuth())
    
    expect(result.current.user).toBeNull()
    expect(result.current.accessToken).toBeNull()
    expect(result.current.refreshToken).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should handle successful login', async () => {
    const { result } = renderHook(() => useAuth())
    
    await act(async () => {
      await result.current.login({
        email: 'test@example.com',
        password: 'password123',
      })
    })

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.user?.email).toBe('test@example.com')
      expect(result.current.accessToken).toBe('mock-access-token')
      expect(result.current.refreshToken).toBe('mock-refresh-token')
      expect(localStorage.getItem('accessToken')).toBe('mock-access-token')
    })
  })

  it('should handle successful signup', async () => {
    const { result } = renderHook(() => useAuth())
    
    await act(async () => {
      await result.current.signup({
        email: 'test@example.com',
        password: 'password123',
        nickname: 'testuser',
      })
    })

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.user?.email).toBe('test@example.com')
      expect(result.current.user?.nickname).toBe('testuser')
      expect(result.current.user?.onboardingCompleted).toBe(false)
    })
  })

  it('should handle successful token refresh', async () => {
    const { result } = renderHook(() => useAuth())
    
    // Set initial tokens
    await act(async () => {
      await result.current.login({
        email: 'test@example.com',
        password: 'password123',
      })
    })

    // Refresh token
    await act(async () => {
      const success = await result.current.refreshTokenFn()
      expect(success).toBe(true)
    })

    await waitFor(() => {
      expect(result.current.accessToken).toBe('new-mock-access-token')
      expect(result.current.refreshToken).toBe('new-mock-refresh-token')
    })
  })

  it('should handle logout', async () => {
    const { result } = renderHook(() => useAuth())
    
    // Login first
    await act(async () => {
      await result.current.login({
        email: 'test@example.com',
        password: 'password123',
      })
    })

    // Then logout
    await act(async () => {
      await result.current.logout()
    })

    await waitFor(() => {
      expect(result.current.user).toBeNull()
      expect(result.current.accessToken).toBeNull()
      expect(result.current.refreshToken).toBeNull()
      expect(result.current.isAuthenticated).toBe(false)
      expect(localStorage.getItem('accessToken')).toBeNull()
    })
  })

  it('should handle login error', async () => {
    const { result } = renderHook(() => useAuth())
    
    // Mock server error response
    const originalConsoleError = console.error
    console.error = vi.fn() // Suppress error logs in test
    
    await act(async () => {
      try {
        await result.current.login({
          email: 'invalid@example.com',
          password: 'wrongpassword',
        })
      } catch (error) {
        // Expected to throw
      }
    })

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.error).toBeTruthy()
    })

    console.error = originalConsoleError
  })

  it('should update user information', async () => {
    const { result } = renderHook(() => useAuth())
    
    const updatedUser = {
      id: 1,
      email: 'test@example.com',
      nickname: 'updateduser',
      favoriteGenres: ['FICTION'],
      readingGoalMonthly: 10,
      privacyLevel: 'PUBLIC',
      onboardingCompleted: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    }

    act(() => {
      result.current.setUser(updatedUser)
    })

    expect(result.current.user).toEqual(updatedUser)
  })

  it('should clear error', async () => {
    const { result } = renderHook(() => useAuth())
    
    // Set an error first
    await act(async () => {
      try {
        await result.current.login({
          email: 'invalid@example.com',
          password: 'wrongpassword',
        })
      } catch (error) {
        // Expected to throw
      }
    })

    // Clear error
    act(() => {
      result.current.clearError()
    })

    expect(result.current.error).toBeNull()
  })

  it('should set loading state', () => {
    const { result } = renderHook(() => useAuth())
    
    act(() => {
      result.current.setLoading(true)
    })

    expect(result.current.isLoading).toBe(true)

    act(() => {
      result.current.setLoading(false)
    })

    expect(result.current.isLoading).toBe(false)
  })
})