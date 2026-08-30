import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { Problem, TopicAnalytics } from './data'
import ProblemCard from './ProblemCard'
import Loading from './Loading'
import { useAuth } from './AuthContext'
import { API_URL } from './api'

function ProblemList() {
  const { token } = useAuth()

  const [problems, setProblems] = useState<Problem[]>([])
  const [loading, setLoading] = useState(true)

  const [dueCount, setDueCount] = useState(0)
  const [topicStats, setTopicStats] = useState<TopicAnalytics[]>([])

  useEffect(() => {
    fetch(`${API_URL}/problems`, {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch problems: ${res.status}`)
        }

        return res.json()
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error('Invalid problems response')
        }

        setProblems(data)
      })
      .catch((error) => {
        console.error(error)
        setProblems([])
      })
      .finally(() => {
        setLoading(false)
      })
  }, [token])

  useEffect(() => {
    if (!token) {
      return
    }

    fetch(`${API_URL}/reviews/due`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setDueCount(Array.isArray(data) ? data.length : 0)
      })
      .catch(() => {
        setDueCount(0)
      })

    fetch(`${API_URL}/analytics/topics`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setTopicStats(Array.isArray(data) ? data : [])
      })
      .catch(() => {
        setTopicStats([])
      })
  }, [token])

  if (loading) {
    return <Loading label="loading_problems" />
  }

  const strongCount = topicStats.filter(
    (topic) => topic.status === 'strong'
  ).length

  const needsPracticeCount = topicStats.filter(
    (topic) =>
      topic.status === 'weak' ||
      topic.status === 'needs_more_practice'
  ).length

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="mb-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-accent">
              my_revision
            </p>

            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-text">
              My Problems
            </h1>

            <p className="mt-2 text-sm text-muted">
              Keep the problems you've learned fresh.
            </p>
          </div>

          <Link
            to="/add-problem"
            className="inline-flex w-fit items-center rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-bg transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90"
          >
            + Add Problem
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-surface p-4">
            <p className="font-mono text-xs uppercase tracking-wide text-muted">
              due_today
            </p>

            <p className="mt-1 font-display text-3xl font-semibold text-accent">
              {dueCount}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-surface p-4">
            <p className="font-mono text-xs uppercase tracking-wide text-muted">
              strong
            </p>

            <p className="mt-1 font-display text-3xl font-semibold text-strong">
              {strongCount}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-surface p-4">
            <p className="font-mono text-xs uppercase tracking-wide text-muted">
              needs_practice
            </p>

            <p className="mt-1 font-display text-3xl font-semibold text-practice">
              {needsPracticeCount}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-surface p-4">
            <p className="font-mono text-xs uppercase tracking-wide text-muted">
              total
            </p>

            <p className="mt-1 font-display text-3xl font-semibold text-text">
              {problems.length}
            </p>
          </div>
        </div>

        {dueCount > 0 && (
          <Link
            to="/reviews"
            className="mt-4 inline-flex items-center rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-bg transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90"
          >
            Start Today's Revision →
          </Link>
        )}
      </div>

      <div>
        <div className="mb-5">
          <h2 className="font-display text-xl font-semibold text-text">
            Your Library
          </h2>

          <p className="mt-1 text-sm text-muted">
            Problems you've added for revision.
          </p>
        </div>

        {problems.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/10 py-16 text-center">
            <p className="text-muted">
              Your library is empty.
            </p>

            <Link
              to="/add-problem"
              className="mt-2 inline-block text-sm text-accent hover:underline"
            >
              Add your first problem →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {problems.map((problem) => (
              <ProblemCard
                key={problem.slug}
                slug={problem.slug}
                title={problem.title}
                difficulty={problem.difficulty}
                topic={problem.topic}
                description={problem.description}
                hints={problem.hints}
                nextReviewDue={problem.next_review_due}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProblemList