import { useParams, Link } from 'react-router-dom'
import { problems } from './data'

function ProblemDetail() {
  const { slug } = useParams()

  const problem = problems.find((p) => p.slug === slug)

  if (!problem) {
    return (
      <div className="p-6">
        <h1>Problem not found</h1>
        <Link to="/">Back to Problems</Link>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Link to="/">← Back to Problems</Link>

      <h1 className="text-3xl font-bold mt-6">
        {problem.title}
      </h1>

      <div className="mt-3">
        <span className={`difficulty ${problem.difficulty.toLowerCase()}`}>
          {problem.difficulty}
        </span>

        <span className="topic ml-2">
          {problem.topic}
        </span>
      </div>

      <p className="mt-6">
        {problem.description}
      </p>

      <h2 className="text-2xl font-bold mt-8">
        Hints
      </h2>

      <div className="mt-4">
        {problem.hints.map((hint, index) => (
          <p key={index} className="mb-3">
            <strong>Hint {index + 1}:</strong> {hint}
          </p>
        ))}
      </div>
    </div>
  )
}

export default ProblemDetail