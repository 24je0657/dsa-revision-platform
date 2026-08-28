import { useState, useEffect } from 'react'
import type { Problem } from './data'
import ProblemCard from './ProblemCard'
import { useAuth } from './AuthContext'
import { API_URL } from './api'

function ProblemList() {
  const { token } = useAuth()

  const [problems, setProblems] = useState<Problem[]>([])
  const [loading, setLoading] = useState(true)
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

  if (loading) {
    return <p>Loading problems...</p>
  }

  return (
    <div className="flex flex-wrap gap-6 p-6">
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
  )
}

export default ProblemList