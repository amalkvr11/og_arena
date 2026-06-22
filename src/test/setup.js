import '@testing-library/jest-dom'
import { vi } from 'vitest'

HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
  clearRect: vi.fn(),
  fillRect: vi.fn(),
  getImageData: vi.fn(() => ({ data: [] })),
  putImageData: vi.fn(),
  createImageData: vi.fn(() => []),
  setTransform: vi.fn(),
  resetTransform: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  scale: vi.fn(),
  rotate: vi.fn(),
  translate: vi.fn(),
  transform: vi.fn(),
  beginPath: vi.fn(),
  closePath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  stroke: vi.fn(),
  fill: vi.fn(),
  arc: vi.fn(),
  rect: vi.fn(),
  clip: vi.fn(),
  measureText: vi.fn(() => ({ width: 0 })),
  strokeText: vi.fn(),
  fillText: vi.fn(),
  drawImage: vi.fn()
}))

const mockSubtle = {
  generateKey: vi.fn().mockResolvedValue({
    type: 'secret',
    algorithm: { name: 'AES-GCM', length: 256 }
  }),
  exportKey: vi.fn().mockResolvedValue(new Uint8Array(32)),
  encrypt: vi.fn().mockResolvedValue(new Uint8Array(64)),
  decrypt: vi.fn().mockResolvedValue(new TextEncoder().encode('test memory')),
  importKey: vi.fn().mockResolvedValue({})
}

Object.defineProperty(window, 'crypto', {
  value: {
    subtle: mockSubtle,
    getRandomValues: (arr) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256)
      }
      return arr
    }
  }
})

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn().mockResolvedValue(undefined)
  }
})

global.fetch = vi.fn()

afterEach(() => {
  vi.clearAllMocks()
})
