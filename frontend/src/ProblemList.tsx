import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
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
    return <p className="p-6">Loading problems...</p>
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          My Problems
        </h1>

        <Link
          to="/add-problem"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Problem
        </Link>
      </div>

      {problems.length === 0 ? (
        <p>No problems in your library yet.</p>
      ) : (
        <div className="flex flex-wrap gap-6">
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
  )
}

export default ProblemList