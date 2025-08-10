import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Input } from '../Input'

describe('Input Component', () => {
  it('should render with default props', () => {
    render(<Input />)
    
    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'text')
  })

  it('should render with label', () => {
    render(<Input label="Email Address" />)
    
    expect(screen.getByText('Email Address')).toBeInTheDocument()
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument()
  })

  it('should render with error message', () => {
    render(<Input label="Email" error="Email is required" />)
    
    const input = screen.getByRole('textbox')
    const errorMessage = screen.getByText('Email is required')
    
    expect(errorMessage).toBeInTheDocument()
    expect(errorMessage).toHaveClass('text-red-600')
    expect(input).toHaveClass('border-red-500', 'focus:border-red-500', 'focus:ring-red-500/20')
  })

  it('should render with helper text', () => {
    render(<Input label="Password" helperText="At least 8 characters" />)
    
    const helperText = screen.getByText('At least 8 characters')
    expect(helperText).toBeInTheDocument()
    expect(helperText).toHaveClass('text-gray-500')
  })

  it('should prioritize error over helper text', () => {
    render(
      <Input 
        label="Password" 
        error="Password is required" 
        helperText="At least 8 characters" 
      />
    )
    
    expect(screen.getByText('Password is required')).toBeInTheDocument()
    expect(screen.queryByText('At least 8 characters')).not.toBeInTheDocument()
  })

  it('should handle different input types', () => {
    const { rerender } = render(<Input type="email" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email')

    rerender(<Input type="password" />)
    expect(screen.getByDisplayValue('')).toHaveAttribute('type', 'password')

    rerender(<Input type="number" />)
    expect(screen.getByRole('spinbutton')).toHaveAttribute('type', 'number')
  })

  it('should handle value changes', () => {
    const handleChange = vi.fn()
    render(<Input onChange={handleChange} />)
    
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'test value' } })
    
    expect(handleChange).toHaveBeenCalledTimes(1)
    expect(input).toHaveValue('test value')
  })

  it('should handle disabled state', () => {
    render(<Input disabled />)
    
    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
    expect(input).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50')
  })

  it('should apply custom className', () => {
    render(<Input className="custom-input" />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('custom-input')
  })

  it('should work with placeholder', () => {
    render(<Input placeholder="Enter your email" />)
    
    const input = screen.getByPlaceholderText('Enter your email')
    expect(input).toBeInTheDocument()
  })
})