import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import { problems } from './data'

function ProblemDetail() {
  const { slug } = useParams()

  const problem = problems.find((p) => p.slug === slug)

  const [hintsShown, setHintsShown] = useState(0)

  const [code, setCode] = useState(
    '// Write your solution here\n'
  )

  if (!problem) {
    return (
      <div className="p-6">
        <h1>Problem not found</h1>
        <Link to="/">Back to Problems</Link>
      </div>
    )
  }

  function revealNextHint() {
    setHintsShown((prev) =>
      Math.min(prev + 1, problem.hints.length)
    )
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">

      <Link to="/">
        ← Back to Problems
      </Link>

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
        {problem.hints
          .slice(0, hintsShown)
          .map((hint, index) => (
            <p key={index} className="mb-3">
              <strong>Hint {index + 1}:</strong> {hint}
            </p>
          ))}
      </div>

      <button
        onClick={revealNextHint}
        disabled={hintsShown === problem.hints.length}
      >
        {hintsShown === problem.hints.length
          ? 'All Hints Revealed'
          : `Reveal Hint (${hintsShown + 1}/${problem.hints.length})`}
      </button>

      <h2 className="text-2xl font-bold mt-8">
        Your Solution
      </h2>

      <Editor
        height="400px"
        defaultLanguage="cpp"
        value={code}
        onChange={(value) => setCode(value ?? '')}
        theme="vs-dark"
      />

    </div>
  )
}

export default ProblemDetail