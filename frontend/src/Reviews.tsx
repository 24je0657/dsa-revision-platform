import { useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import ProblemCard from './ProblemCard'
import type { DueReview } from './data'
import { API_URL } from './api'
import Loading from './Loading'

function Reviews() {
  const { token } = useAuth()

  const [dueReviews, setDueReviews] = useState<DueReview[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    fetch(`${API_URL}/reviews/due`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch due reviews: ${res.status}`)
        }

        return res.json()
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error('Invalid due reviews response')
        }

        setDueReviews(data)
      })
      .catch((error) => {
        console.error(error)
        setDueReviews([])
      })
      .finally(() => {
        setLoading(false)
      })
  }, [token])

  if (loading) {
    return <Loading label="loading_reviews" />
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-accent">
          reviews
        </p>

        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-text">
          Due for Review
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Problems whose scheduled review date has arrived.
          Try them again before looking at your previous work.
        </p>
      </div>

      {dueReviews.length === 0 ? (
        <div className="mt-8 rounded-xl border border-strong/20 bg-surface p-6">
          <p className="font-display text-lg font-semibold text-strong">
            Nothing due right now
          </p>

          <p className="mt-2 text-sm leading-relaxed text-muted">
            Nice work. Your revision schedule is currently clear.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-8 flex items-center justify-between gap-4 rounded-xl border border-practice/20 bg-surface px-5 py-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-wide text-muted">
                due_now
              </p>

              <p className="mt-1 font-display text-2xl font-semibold text-text">
                {dueReviews.length}
              </p>
            </div>

            <p className="max-w-xs text-right text-sm text-muted">
              Keep the previous solution hidden and solve from memory.
            </p>
          </div>

          <div className="mt-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-xl font-semibold text-text">
                  Your Reviews
                </h2>

                <p className="mt-1 text-sm text-muted">
                  Problems ready for another independent attempt.
                </p>
              </div>

              <span className="font-mono text-xs text-muted">
                {dueReviews.length} problem
                {dueReviews.length === 1 ? '' : 's'}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {dueReviews.map((item) => (
                <ProblemCard
                  key={item.problem.slug}
                  slug={item.problem.slug}
                  title={item.problem.title}
                  difficulty={item.problem.difficulty}
                  topic={item.problem.topic}
                  description={item.problem.description}
                  hints={item.problem.hints}
                  nextReviewDue={item.next_review_due}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Reviews