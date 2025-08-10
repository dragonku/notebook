import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

// Define handlers for API endpoints
const handlers = [
  // Auth endpoints
  http.post('/api/auth/signup', () => {
    return HttpResponse.json({
      data: {
        user: {
          id: 1,
          email: 'test@example.com',
          nickname: 'testuser',
          favoriteGenres: [],
          privacyLevel: 'PRIVATE',
          onboardingCompleted: false,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      },
    })
  }),

  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json() as any
    
    // Return error for invalid credentials
    if (body.email === 'invalid@example.com' || body.password === 'wrongpassword') {
      return HttpResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      )
    }
    
    return HttpResponse.json({
      data: {
        user: {
          id: 1,
          email: 'test@example.com',
          nickname: 'testuser',
          favoriteGenres: ['FICTION'],
          privacyLevel: 'PRIVATE',
          onboardingCompleted: true,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      },
    })
  }),

  http.post('/api/auth/refresh', () => {
    return HttpResponse.json({
      data: {
        user: {
          id: 1,
          email: 'test@example.com',
          nickname: 'testuser',
          favoriteGenres: ['FICTION'],
          privacyLevel: 'PRIVATE',
          onboardingCompleted: true,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
        accessToken: 'new-mock-access-token',
        refreshToken: 'new-mock-refresh-token',
      },
    })
  }),

  http.post('/api/auth/logout', () => {
    return HttpResponse.json({ message: 'Logged out successfully' })
  }),

  http.get('/api/auth/check-email', ({ request }) => {
    const url = new URL(request.url)
    const email = url.searchParams.get('email')
    
    return HttpResponse.json({
      available: email !== 'taken@example.com',
      message: email === 'taken@example.com' ? 'Email already exists' : 'Email is available',
    })
  }),

  http.get('/api/auth/check-nickname', ({ request }) => {
    const url = new URL(request.url)
    const nickname = url.searchParams.get('nickname')
    
    return HttpResponse.json({
      available: nickname !== 'takennickname',
      message: nickname === 'takennickname' ? 'Nickname already exists' : 'Nickname is available',
    })
  }),

  // User endpoints
  http.post('/api/users/onboarding', () => {
    return HttpResponse.json({
      id: 1,
      email: 'test@example.com',
      nickname: 'testuser',
      favoriteGenres: ['FICTION', 'SCIENCE'],
      readingGoalMonthly: 5,
      privacyLevel: 'PRIVATE',
      onboardingCompleted: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    })
  }),

  http.get('/api/users/me', () => {
    return HttpResponse.json({
      id: 1,
      email: 'test@example.com',
      nickname: 'testuser',
      favoriteGenres: ['FICTION'],
      readingGoalMonthly: 5,
      privacyLevel: 'PRIVATE',
      onboardingCompleted: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    })
  }),

  http.get('/api/users/onboarding-status', () => {
    return HttpResponse.json({
      onboardingCompleted: true,
    })
  }),
]

export const server = setupServer(...handlers)