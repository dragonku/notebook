import { describe, it, expect } from 'vitest'
import { userApi } from '../user'

describe('User API', () => {
  describe('completeOnboarding', () => {
    it('should successfully complete onboarding', async () => {
      const onboardingData = {
        favoriteGenres: ['FICTION', 'SCIENCE'],
        readingGoalMonthly: 5,
        privacyLevel: 'PRIVATE',
      }

      const result = await userApi.completeOnboarding(onboardingData)

      expect(result.favoriteGenres).toEqual(['FICTION', 'SCIENCE'])
      expect(result.readingGoalMonthly).toBe(5)
      expect(result.privacyLevel).toBe('PRIVATE')
      expect(result.onboardingCompleted).toBe(true)
    })
  })

  describe('getCurrentUser', () => {
    it('should get current user information', async () => {
      const result = await userApi.getCurrentUser()

      expect(result.id).toBe(1)
      expect(result.email).toBe('test@example.com')
      expect(result.nickname).toBe('testuser')
      expect(result.onboardingCompleted).toBe(true)
    })
  })

  describe('getOnboardingStatus', () => {
    it('should get onboarding status', async () => {
      const result = await userApi.getOnboardingStatus()

      expect(result.onboardingCompleted).toBe(true)
    })
  })
})