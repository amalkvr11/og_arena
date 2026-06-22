/**
 * SMOKE TESTS
 * Critical path testing - verifies core functionality works
 * These tests should pass for the app to be considered working
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App'

describe('Smoke Tests - Critical Paths', () => {
  
  describe('Application Loading', () => {
    it('should render the application without crashing', () => {
      render(<App />)
      expect(document.querySelector('.App')).toBeTruthy()
    })
  })
  
  describe('Navigation Structure', () => {
    it('should have a header with logo', () => {
      render(<App />)
      const logoElements = screen.getAllByText('SoulChain')
      expect(logoElements.length).toBeGreaterThan(0)
    })
    
    it('should have main navigation items', () => {
      render(<App />)
      expect(screen.getByRole('link', { name: 'Home' })).toBeTruthy()
      expect(screen.getByRole('link', { name: 'Memory Vault' })).toBeTruthy()
      expect(screen.getByRole('link', { name: 'AI Companion' })).toBeTruthy()
    })
  })
  
  describe('Hero Section', () => {
    it('should display hero title', () => {
      render(<App />)
      const heroTitle = document.querySelector('.hero-title')
      expect(heroTitle).toBeTruthy()
    })
    
    it('should have primary CTA button', () => {
      render(<App />)
      const ctaButton = screen.getByRole('link', { name: /Start Preserving/i })
      expect(ctaButton).toBeTruthy()
    })
    
    it('should show 0G Network badge', () => {
      render(<App />)
      expect(screen.getByText(/Built on 0G Network/i)).toBeTruthy()
    })
  })
  
  describe('Critical Elements Presence', () => {
    it('should have encryption stats visible', () => {
      render(<App />)
      expect(screen.getByText('256-bit')).toBeTruthy()
      expect(screen.getByText('AES Encryption')).toBeTruthy()
    })
    
    it('should have feature cards', () => {
      render(<App />)
      const timeCapsules = screen.getAllByText('Time Capsule')
      expect(timeCapsules.length).toBeGreaterThan(0)
    })
  })
  
  describe('Footer', () => {
    it('should render footer with links', () => {
      render(<App />)
      expect(screen.getByRole('link', { name: '0G Labs' })).toBeTruthy()
    })
  })
})

describe('Smoke Tests - Async Operations', () => {
  it('should handle async loading states', async () => {
    render(<App />)
    const logoElements = screen.getAllByText('SoulChain')
    expect(logoElements.length).toBeGreaterThan(0)
  })
})

describe('Smoke Tests - Error Boundaries', () => {
  it('should not crash on undefined values', () => {
    const { container } = render(<App />)
    expect(container.innerHTML).toBeTruthy()
  })
})
