import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from '../LoginForm'

// Mock useAuth hook
const mockLogin = vi.fn()
const mockUseAuth = {
  login: mockLogin,
  isLoading: false,
  error: null,
}

vi.mock('../../../hooks/useAuth', () => ({
  useAuth: () => mockUseAuth,
}))

describe('LoginForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseAuth.isLoading = false
    mockUseAuth.error = null
  })

  it('should render login form', () => {
    render(<LoginForm />)
    
    expect(screen.getByRole('heading', { name: '로그인' })).toBeInTheDocument()
    expect(screen.getByLabelText('이메일')).toBeInTheDocument()
    expect(screen.getByLabelText('비밀번호')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /로그인/i })).toBeInTheDocument()
  })

  it('should validate required fields', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)
    
    const submitButton = screen.getByRole('button', { name: /로그인/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('이메일을 입력해주세요')).toBeInTheDocument()
      expect(screen.getByText('비밀번호를 입력해주세요')).toBeInTheDocument()
    })
  })

  it('should prevent login with invalid email', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)
    
    const emailInput = screen.getByLabelText('이메일')
    const passwordInput = screen.getByLabelText('비밀번호')
    const submitButton = screen.getByRole('button', { name: /로그인/i })
    
    // Enter invalid email and valid password
    await user.type(emailInput, 'not-an-email')
    await user.type(passwordInput, 'password123')
    
    // Try to submit form
    await user.click(submitButton)
    
    // Since HTML5 validation or React Hook Form should prevent the form submission,
    // the login function should not be called
    await waitFor(() => {
      expect(mockLogin).not.toHaveBeenCalled()
    }, { timeout: 1000 })
  })

  it('should submit valid form', async () => {
    const user = userEvent.setup()
    const onSuccess = vi.fn()
    
    render(<LoginForm onSuccess={onSuccess} />)
    
    const emailInput = screen.getByLabelText('이메일')
    const passwordInput = screen.getByLabelText('비밀번호')
    const submitButton = screen.getByRole('button', { name: /로그인/i })
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    })
  })

  it('should show loading state', () => {
    mockUseAuth.isLoading = true
    render(<LoginForm />)
    
    const submitButton = screen.getByRole('button', { name: /로그인/i })
    expect(submitButton).toBeDisabled()
    expect(submitButton).toContainHTML('svg') // Loading spinner
  })

  it('should handle switch to signup', async () => {
    const user = userEvent.setup()
    const onSwitchToSignup = vi.fn()
    
    render(<LoginForm onSwitchToSignup={onSwitchToSignup} />)
    
    const switchButton = screen.getByText('회원가입')
    await user.click(switchButton)
    
    expect(onSwitchToSignup).toHaveBeenCalledTimes(1)
  })

  it('should handle login error', async () => {
    const user = userEvent.setup()
    const loginError = new Error('Invalid credentials')
    mockLogin.mockRejectedValueOnce(loginError)
    
    render(<LoginForm />)
    
    const emailInput = screen.getByLabelText('이메일')
    const passwordInput = screen.getByLabelText('비밀번호')
    const submitButton = screen.getByRole('button', { name: /로그인/i })
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'wrongpassword')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/로그인 중 오류가 발생했습니다/i)).toBeInTheDocument()
    })
  })
})