import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display login form by default', async ({ page }) => {
    await expect(page.getByText('로그인')).toBeVisible()
    await expect(page.getByLabel('이메일')).toBeVisible()
    await expect(page.getByLabel('비밀번호')).toBeVisible()
    await expect(page.getByRole('button', { name: '로그인' })).toBeVisible()
  })

  test('should switch to signup form', async ({ page }) => {
    await page.getByText('회원가입').click()
    
    await expect(page.getByText('회원가입')).toBeVisible()
    await expect(page.getByLabel('이메일')).toBeVisible()
    await expect(page.getByLabel('비밀번호')).toBeVisible()
    await expect(page.getByLabel('비밀번호 확인')).toBeVisible()
    await expect(page.getByLabel('닉네임')).toBeVisible()
  })

  test('should show validation errors for empty login form', async ({ page }) => {
    await page.getByRole('button', { name: '로그인' }).click()
    
    await expect(page.getByText('이메일을 입력해주세요')).toBeVisible()
    await expect(page.getByText('비밀번호를 입력해주세요')).toBeVisible()
  })

  test('should show email format validation', async ({ page }) => {
    await page.getByLabel('이메일').fill('invalid-email')
    await page.getByRole('button', { name: '로그인' }).click()
    
    await expect(page.getByText('올바른 이메일 형식을 입력해주세요')).toBeVisible()
  })

  test('should complete signup flow', async ({ page }) => {
    // Switch to signup
    await page.getByText('회원가입').click()
    
    // Fill signup form
    await page.getByLabel('이메일').fill('newuser@example.com')
    await page.getByLabel('비밀번호').fill('password123')
    await page.getByLabel('비밀번호 확인').fill('password123')
    await page.getByLabel('닉네임').fill('newuser')
    
    // Submit signup
    await page.getByRole('button', { name: '회원가입' }).click()
    
    // Should redirect to onboarding
    await expect(page.getByText('프로필 설정')).toBeVisible()
    await expect(page.getByText('선호 장르')).toBeVisible()
    await expect(page.getByText('월간 독서 목표')).toBeVisible()
    await expect(page.getByText('독서 기록 공개 범위')).toBeVisible()
  })

  test('should complete onboarding flow', async ({ page }) => {
    // First complete signup
    await page.getByText('회원가입').click()
    await page.getByLabel('이메일').fill('test@example.com')
    await page.getByLabel('비밀번호').fill('password123')
    await page.getByLabel('비밀번호 확인').fill('password123')
    await page.getByLabel('닉네임').fill('testuser')
    await page.getByRole('button', { name: '회원가입' }).click()
    
    // Complete onboarding
    await expect(page.getByText('프로필 설정')).toBeVisible()
    
    // Select favorite genres
    await page.getByText('소설').click()
    await page.getByText('과학').click()
    
    // Set reading goal
    await page.getByLabel('월간 독서 목표').fill('10')
    
    // Set privacy level (should be pre-selected)
    
    // Submit onboarding
    await page.getByRole('button', { name: 'BookNote 시작하기' }).click()
    
    // Should redirect to main app
    await expect(page.getByText('BookNote 메인 대시보드')).toBeVisible()
    await expect(page.getByText('온보딩 완료: ✅')).toBeVisible()
  })

  test('should handle login flow', async ({ page }) => {
    // Fill login form
    await page.getByLabel('이메일').fill('existing@example.com')
    await page.getByLabel('비밀번호').fill('password123')
    
    // Submit login
    await page.getByRole('button', { name: '로그인' }).click()
    
    // Should redirect to main app (assuming user has completed onboarding)
    await expect(page.getByText('BookNote 메인 대시보드')).toBeVisible()
  })

  test('should show loading states', async ({ page }) => {
    await page.getByLabel('이메일').fill('test@example.com')
    await page.getByLabel('비밀번호').fill('password123')
    
    const loginButton = page.getByRole('button', { name: '로그인' })
    await loginButton.click()
    
    // Should show loading state briefly
    await expect(loginButton).toBeDisabled()
  })

  test('should handle "skip onboarding" option', async ({ page }) => {
    // Complete signup first
    await page.getByText('회원가입').click()
    await page.getByLabel('이메일').fill('skipuser@example.com')
    await page.getByLabel('비밀번호').fill('password123')
    await page.getByLabel('비밀번호 확인').fill('password123')
    await page.getByLabel('닉네임').fill('skipuser')
    await page.getByRole('button', { name: '회원가입' }).click()
    
    // Skip onboarding
    await page.getByText('나중에 설정하기').click()
    
    // Should still redirect to main app
    await expect(page.getByText('BookNote 메인 대시보드')).toBeVisible()
  })
})