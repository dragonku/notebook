import { describe, it, expect, beforeEach } from 'vitest'
import { ApiError, apiRequest } from '../client'

describe('API Client', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('ApiError', () => {
    it('should create an error with status and message', () => {
      const error = new ApiError(404, 'Not found')
      
      expect(error).toBeInstanceOf(Error)
      expect(error.name).toBe('ApiError')
      expect(error.status).toBe(404)
      expect(error.message).toBe('Not found')
      expect(error.data).toBeUndefined()
    })

    it('should create an error with data', () => {
      const data = { field: 'value' }
      const error = new ApiError(400, 'Bad request', data)
      
      expect(error.status).toBe(400)
      expect(error.message).toBe('Bad request')
      expect(error.data).toEqual(data)
    })
  })

  describe('apiRequest', () => {
    it('should make a successful GET request', async () => {
      const result = await apiRequest<{ message: string }>('/auth/check-email?email=test@example.com')
      
      expect(result).toEqual({
        available: true,
        message: 'Email is available',
      })
    })

    it('should make a successful POST request', async () => {
      const requestData = {
        email: 'test@example.com',
        password: 'password123',
        nickname: 'testuser',
      }

      const result = await apiRequest('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(requestData),
      })

      expect(result.data.user.email).toBe('test@example.com')
      expect(result.data.accessToken).toBe('mock-access-token')
    })

    it('should include Authorization header when token exists', async () => {
      localStorage.setItem('accessToken', 'test-token')
      
      // This request should include the Authorization header
      const result = await apiRequest('/users/me')
      
      expect(result.email).toBe('test@example.com')
    })

    it('should not include Authorization header for auth endpoints', async () => {
      localStorage.setItem('accessToken', 'test-token')
      
      const result = await apiRequest('/auth/check-email?email=test@example.com')
      
      expect(result.available).toBe(true)
    })

    it('should handle network errors', async () => {
      // Mock fetch to reject
      const originalFetch = global.fetch
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

      await expect(apiRequest('/test')).rejects.toThrow('네트워크 오류가 발생했습니다')

      global.fetch = originalFetch
    })
  })
})