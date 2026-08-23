import { useState, useEffect } from 'react'
import type { Problem } from './data'
import ProblemCard from './ProblemCard'

function ProblemList() {
  const [problems, setProblems] = useState<Problem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:8000/problems')
      .then((res) => res.json())
      .then((data) => {
        setProblems(data)
        setLoading(false)
      })
  }, [])

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
        />
      ))}
    </div>
  )
}

export default ProblemList