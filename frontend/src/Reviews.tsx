import { useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import ProblemCard from './ProblemCard'
import type {DueReview} from './data'
import { API_URL } from './api'


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
          throw new Error('Failed to fetch due reviews')
        }

        return res.json()
      })
      .then((data) => {
        setDueReviews(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error(error)
        setLoading(false)
      })
  }, [token])

  if (loading) {
    return <p className="p-6">Loading reviews...</p>
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Due for Review
      </h1>

      {dueReviews.length === 0 ? (
        <p>
          Nothing due for review right now — nice work!
        </p>
      ) : (
        <div className="flex flex-wrap gap-6">
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
      )}
    </div>
  )
}

export default Reviews