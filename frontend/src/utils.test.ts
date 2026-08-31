import { describe, it, expect } from 'vitest'
import { getDifficultyColor } from './utils'

describe('getDifficultyColor', () => {
  it('returns strong color classes for Easy', () => {
    expect(getDifficultyColor('Easy')).toContain('text-strong')
  })

  it('returns practice color classes for Medium', () => {
    expect(getDifficultyColor('Medium')).toContain('text-practice')
  })

  it('returns weak color classes for Hard', () => {
    expect(getDifficultyColor('Hard')).toContain('text-weak')
  })

  it('returns a muted fallback for an unrecognized difficulty', () => {
    expect(getDifficultyColor('Unknown')).toContain('text-muted')
  })
})