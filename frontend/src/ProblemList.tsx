import { useState, useEffect } from 'react'
import type { Problem } from './data'
import ProblemCard from './ProblemCard'
import { useAuth } from './AuthContext'

function ProblemList() {
  const { token } = useAuth()

  const [problems, setProblems] = useState<Problem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:8000/problems', {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
    })
      .then((res) => res.json())
      .then((data) => {
        setProblems(data)
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