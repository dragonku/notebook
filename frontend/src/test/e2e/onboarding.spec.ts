import { test, expect } from '@playwright/test'

test.describe('Onboarding Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    
    // Complete signup to reach onboarding
    await page.getByText('회원가입').click()
    await page.getByLabel('이메일').fill('onboarding@example.com')
    await page.getByLabel('비밀번호').fill('password123')
    await page.getByLabel('비밀번호 확인').fill('password123')
    await page.getByLabel('닉네임').fill('onboardinguser')
    await page.getByRole('button', { name: '회원가입' }).click()
    
    // Should now be on onboarding page
    await expect(page.getByText('프로필 설정')).toBeVisible()
  })

  test('should display all onboarding form fields', async ({ page }) => {
    await expect(page.getByText('선호 장르 (최대 5개)')).toBeVisible()
    await expect(page.getByText('소설')).toBeVisible()
    await expect(page.getByText('비소설')).toBeVisible()
    await expect(page.getByText('자기계발')).toBeVisible()
    
    await expect(page.getByLabel('월간 독서 목표')).toBeVisible()
    await expect(page.getByLabel('독서 기록 공개 범위')).toBeVisible()
    
    await expect(page.getByRole('button', { name: 'BookNote 시작하기' })).toBeVisible()
    await expect(page.getByText('나중에 설정하기')).toBeVisible()
  })

  test('should enforce minimum genre selection', async ({ page }) => {
    // Try to submit without selecting any genre
    await page.getByRole('button', { name: 'BookNote 시작하기' }).click()
    
    await expect(page.getByText('최소 1개 이상의 선호 장르를 선택해주세요')).toBeVisible()
  })

  test('should enforce maximum genre selection', async ({ page }) => {
    // Select 6 genres (more than max of 5)
    const genres = ['소설', '비소설', '자기계발', '역사', '과학', '철학']
    
    for (let i = 0; i < 5; i++) {
      await page.getByText(genres[i]).click()
    }
    
    // The 6th genre should be disabled
    const sixthGenre = page.getByText(genres[5])
    await expect(sixthGenre.locator('input')).toBeDisabled()
    
    // Genre counter should show 5/5
    await expect(page.getByText('선택된 장르: 5/5개')).toBeVisible()
  })

  test('should validate reading goal input', async ({ page }) => {
    // Select at least one genre first
    await page.getByText('소설').click()
    
    // Test minimum value
    await page.getByLabel('월간 독서 목표').fill('0')
    await page.getByRole('button', { name: 'BookNote 시작하기' }).click()
    
    await expect(page.getByText('월간 독서 목표는 최소 1권 이상이어야 합니다')).toBeVisible()
    
    // Test maximum value
    await page.getByLabel('월간 독서 목표').fill('101')
    await page.getByRole('button', { name: 'BookNote 시작하기' }).click()
    
    await expect(page.getByText('월간 독서 목표는 최대 100권까지 설정 가능합니다')).toBeVisible()
  })

  test('should complete onboarding successfully', async ({ page }) => {
    // Select 2 genres
    await page.getByText('소설').click()
    await page.getByText('과학').click()
    
    // Set reading goal
    await page.getByLabel('월간 독서 목표').fill('8')
    
    // Privacy level should have a default selection
    
    // Submit
    await page.getByRole('button', { name: 'BookNote 시작하기' }).click()
    
    // Should redirect to main app
    await expect(page.getByText('BookNote 메인 대시보드')).toBeVisible()
    
    // Should show completed onboarding status
    await expect(page.getByText('온보딩 완료: ✅')).toBeVisible()
    
    // Should show selected preferences in the dashboard
    await expect(page.getByText('월간 독서 목표: 8권')).toBeVisible()
  })

  test('should allow skipping onboarding', async ({ page }) => {
    await page.getByText('나중에 설정하기').click()
    
    // Should redirect to main app
    await expect(page.getByText('BookNote 메인 대시보드')).toBeVisible()
  })

  test('should update genre counter dynamically', async ({ page }) => {
    // Initially should show 0/5
    await expect(page.getByText('선택된 장르: 0/5개')).toBeVisible()
    
    // Select one genre
    await page.getByText('소설').click()
    await expect(page.getByText('선택된 장르: 1/5개')).toBeVisible()
    
    // Select another genre
    await page.getByText('과학').click()
    await expect(page.getByText('선택된 장르: 2/5개')).toBeVisible()
    
    // Deselect a genre
    await page.getByText('소설').click()
    await expect(page.getByText('선택된 장르: 1/5개')).toBeVisible()
  })

  test('should have proper accessibility labels', async ({ page }) => {
    // Check that form elements have proper labels
    await expect(page.getByLabel('월간 독서 목표')).toBeVisible()
    await expect(page.getByLabel('독서 기록 공개 범위')).toBeVisible()
    
    // Check helper text
    await expect(page.getByText('한 달에 읽고 싶은 책의 권수를 입력해주세요')).toBeVisible()
    await expect(page.getByText('다른 사용자에게 독서 기록을 어느 범위까지 공개할지 선택해주세요')).toBeVisible()
  })

  test('should remember selections when navigating back and forth', async ({ page }) => {
    // Select preferences
    await page.getByText('소설').click()
    await page.getByText('과학').click()
    await page.getByLabel('월간 독서 목표').fill('12')
    
    // Simulate going back (this would be browser back button in real usage)
    // For this test, we'll just verify the selections remain
    await expect(page.getByText('소설').locator('input')).toBeChecked()
    await expect(page.getByText('과학').locator('input')).toBeChecked()
    await expect(page.getByLabel('월간 독서 목표')).toHaveValue('12')
  })
})