import { describe, it, expect } from 'vitest'
import { authApi } from '../auth'

describe('Auth API', () => {
  describe('signup', () => {
    it('should successfully sign up a user', async () => {
      const signupData = {
        email: 'test@example.com',
        password: 'password123',
        nickname: 'testuser',
      }

      const result = await authApi.signup(signupData)

      expect(result.user.email).toBe('test@example.com')
      expect(result.user.nickname).toBe('testuser')
      expect(result.user.onboardingCompleted).toBe(false)
      expect(result.accessToken).toBe('mock-access-token')
      expect(result.refreshToken).toBe('mock-refresh-token')
    })
  })

  describe('login', () => {
    it('should successfully log in a user', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      }

      const result = await authApi.login(loginData)

      expect(result.user.email).toBe('test@example.com')
      expect(result.user.onboardingCompleted).toBe(true)
      expect(result.accessToken).toBe('mock-access-token')
      expect(result.refreshToken).toBe('mock-refresh-token')
    })
  })

  describe('refreshToken', () => {
    it('should refresh the access token', async () => {
      const refreshData = {
        refreshToken: 'old-refresh-token',
      }

      const result = await authApi.refreshToken(refreshData)

      expect(result.accessToken).toBe('new-mock-access-token')
      expect(result.refreshToken).toBe('new-mock-refresh-token')
    })
  })

  describe('logout', () => {
    it('should successfully log out', async () => {
      await expect(authApi.logout('refresh-token')).resolves.toBeUndefined()
    })
  })

  describe('checkEmail', () => {
    it('should return available for new email', async () => {
      const result = await authApi.checkEmail('new@example.com')

      expect(result.available).toBe(true)
      expect(result.message).toBe('Email is available')
    })

    it('should return unavailable for taken email', async () => {
      const result = await authApi.checkEmail('taken@example.com')

      expect(result.available).toBe(false)
      expect(result.message).toBe('Email already exists')
    })
  })

  describe('checkNickname', () => {
    it('should return available for new nickname', async () => {
      const result = await authApi.checkNickname('newnickname')

      expect(result.available).toBe(true)
      expect(result.message).toBe('Nickname is available')
    })

    it('should return unavailable for taken nickname', async () => {
      const result = await authApi.checkNickname('takennickname')

      expect(result.available).toBe(false)
      expect(result.message).toBe('Nickname already exists')
    })
  })
})