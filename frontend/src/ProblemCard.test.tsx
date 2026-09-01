import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import ProblemCard from './ProblemCard'

function renderCard(overrides = {}) {
  const defaultProps = {
    slug: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    topic: 'Arrays',
    description: 'Find two numbers that add up to a target.',
    hints: ['Think about the complement.', 'Use a hash map.'],
    nextReviewDue: null,
  }

  return render(
    <MemoryRouter>
      <ProblemCard {...defaultProps} {...overrides} />
    </MemoryRouter>
  )
}

describe('ProblemCard', () => {
  it('renders the title, difficulty, and topic', () => {
    renderCard()

    expect(
      screen.getByText('Two Sum')
    ).toBeInTheDocument()

    expect(
      screen.getByText('easy')
    ).toBeInTheDocument()

    expect(
      screen.getByText('arrays')
    ).toBeInTheDocument()
  })

  it('shows a due badge when nextReviewDue is in the past', () => {
    renderCard({
      nextReviewDue: '2020-01-01T00:00:00Z',
    })

    expect(
      screen.getByText('due_today')
    ).toBeInTheDocument()
  })

  it('does not show a due badge when nextReviewDue is in the future', () => {
    renderCard({
      nextReviewDue: '2099-01-01T00:00:00Z',
    })

    expect(
      screen.queryByText('due_today')
    ).not.toBeInTheDocument()
  })

  it('reveals hints one at a time when clicking the reveal button', async () => {
    const user = userEvent.setup()

    renderCard()

    expect(
      screen.queryByText(/Think about the complement/)
    ).not.toBeInTheDocument()

    await user.click(
      screen.getByText(/reveal_hint/)
    )

    expect(
      screen.getByText(/Think about the complement/)
    ).toBeInTheDocument()

    await user.click(
      screen.getByText(/reveal_hint/)
    )

    expect(
      screen.getByText(/Use a hash map/)
    ).toBeInTheDocument()
  })

  it('disables the reveal button once all hints are shown', async () => {
    const user = userEvent.setup()

    renderCard()

    await user.click(
      screen.getByText(/reveal_hint/)
    )

    await user.click(
      screen.getByText(/reveal_hint/)
    )

    expect(
      screen.getByText('all_hints_revealed')
    ).toBeInTheDocument()
  })

  it('handles a problem with no hints gracefully', () => {
    renderCard({
      hints: null,
    })

    expect(
      screen.queryByText(/reveal_hint/)
    ).not.toBeInTheDocument()
  })
})