import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import type { Problem } from './data'

function ProblemDetail() {
  const { slug } = useParams()

  const [problem, setProblem] = useState<Problem | null>(null)
  const [loading, setLoading] = useState(true)
  const [hintsShown, setHintsShown] = useState(0)
  const [code, setCode] = useState('// Write your solution here\n')

  useEffect(() => {
    setLoading(true)
    setProblem(null)
    setHintsShown(0)

    fetch(`http://localhost:8000/problems/${slug}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Problem not found')
        }

        return res.json()
      })
      .then((data) => {
        setProblem(data)
        setLoading(false)
      })
      .catch(() => {
        setProblem(null)
        setLoading(false)
      })
  }, [slug])

  if (loading) {
    return <p className="p-6">Loading...</p>
  }

  if (!problem) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Problem not found</h1>

        <Link
          to="/"
          className="text-blue-600 hover:underline"
        >
          Back to Problems
        </Link>
      </div>
    )
  }

  const revealNextHint = () => {
    setHintsShown((prev) =>
      Math.min(prev + 1, problem.hints.length)
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">

      <Link
        to="/"
        className="text-blue-600 hover:underline"
      >
        ← Back to Problems
      </Link>

      <h1 className="text-4xl font-bold mt-4">
        {problem.title}
      </h1>

      <div className="flex gap-3 mt-3">
        <span className="difficulty">
          {problem.difficulty}
        </span>

        <span className="topic">
          {problem.topic}
        </span>
      </div>

      <p className="mt-4 text-lg">
        {problem.description}
      </p>

      <h2 className="text-2xl font-bold mt-8">
        Hints
      </h2>

      <div className="mt-4">
        {problem.hints.slice(0, hintsShown).map((hint, index) => (
          <p
            key={index}
            className="mb-3 p-3 rounded bg-gray-100"
          >
            <strong>Hint {index + 1}:</strong> {hint}
          </p>
        ))}
      </div>

      <button
        onClick={revealNextHint}
        disabled={hintsShown === problem.hints.length}
        className="mt-3 px-4 py-2 rounded bg-blue-600 text-white disabled:bg-gray-400"
      >
        {hintsShown === problem.hints.length
          ? 'All Hints Revealed'
          : `Reveal Hint (${hintsShown + 1}/${problem.hints.length})`}
      </button>

      <button
        className="revise-button ml-3"
        onClick={() => {}}
      >
        Revise Now
      </button>

      <h2 className="text-2xl font-bold mt-8">
        Your Solution
      </h2>

      <div className="mt-4">
        <Editor
          height="400px"
          defaultLanguage="cpp"
          value={code}
          onChange={(value) => setCode(value ?? '')}
          theme="vs-dark"
        />
      </div>

      <button className="mt-4 px-5 py-2 rounded bg-green-600 text-white">
        Submit
      </button>

    </div>
  )
}

export default ProblemDetail