import '@testing-library/jest-dom'
import { beforeAll, afterEach, afterAll } from 'vitest'
import { cleanup } from '@testing-library/react'
import { server } from './mocks/server'

// Start MSW server
beforeAll(() => server.listen())

// Clean up after each test case
afterEach(() => {
  cleanup()
  server.resetHandlers()
})

// Clean up after the tests are finished
afterAll(() => server.close())

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    store: {} as Record<string, string>,
    getItem: function (key: string) {
      return this.store[key] || null
    },
    setItem: function (key: string, value: string) {
      this.store[key] = value
    },
    removeItem: function (key: string) {
      delete this.store[key]
    },
    clear: function () {
      this.store = {}
    },
  },
  writable: true,
})

// Mock fetch globally
global.fetch = fetch