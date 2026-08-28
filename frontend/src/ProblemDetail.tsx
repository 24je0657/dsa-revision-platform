import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import type { Problem, SubmissionResult } from './data'
import { useAuth } from './AuthContext'
import { API_URL } from './api'

function ProblemDetail() {
  const { slug } = useParams()
  const { token } = useAuth()

  const [problem, setProblem] = useState<Problem | null>(null)
  const [loading, setLoading] = useState(true)
  const [hintsShown, setHintsShown] = useState(0)
  const [code, setCode] = useState('// Write your solution here\n')
  const [verdict, setVerdict] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submissions, setSubmissions] = useState<SubmissionResult[]>([])

  useEffect(() => {
    setLoading(true)
    setProblem(null)
    setHintsShown(0)
    setSubmissions([])

    fetch(`${API_URL}/problems/${slug}`)
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

  const fetchSubmissions = async () => {
    if (!problem) return

    try {
      const res = await fetch(
        `${API_URL}/problems/${problem.slug}/submissions`
      )

      if (!res.ok) {
        throw new Error('Failed to fetch submissions')
      }

      const data = await res.json()
      setSubmissions(data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (problem) {
      fetchSubmissions()
    }
  }, [problem])

  async function handleSubmit() {
    if (!token) {
      return
    }

    setSubmitting(true)
    setVerdict(null)

    try {
      const res = await fetch(`${API_URL}/submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          problem_id: problem!.id,
          code: code,
          language: 'cpp',
        }),
      })

      if (!res.ok) {
        throw new Error('Submission failed')
      }

      const data = await res.json()

      setVerdict(data.verdict)

      await fetchSubmissions()
    } catch (error) {
      console.error(error)
    } finally {
      setSubmitting(false)
    }
  }

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

  const safeHints = problem.hints ?? []

  const revealNextHint = () => {
    setHintsShown((prev) =>
      Math.min(prev + 1, safeHints.length)
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

      {problem.description && (
        <p className="mt-4 text-lg">
          {problem.description}
        </p>
      )}

      <h2 className="text-2xl font-bold mt-8">
        Hints
      </h2>

      {safeHints.length === 0 ? (
        <p className="mt-4 text-gray-600">
          No hints available for this problem.
        </p>
      ) : (
        <>
          <div className="mt-4">
            {safeHints
              .slice(0, hintsShown)
              .map((hint, index) => (
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
            disabled={hintsShown === safeHints.length}
            className="mt-3 px-4 py-2 rounded bg-blue-600 text-white disabled:bg-gray-400"
          >
            {hintsShown === safeHints.length
              ? 'All Hints Revealed'
              : `Reveal Hint (${hintsShown + 1}/${safeHints.length})`}
          </button>
        </>
      )}

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

      <button
        onClick={handleSubmit}
        disabled={submitting || !token}
        className="mt-4 px-5 py-2 rounded bg-green-600 text-white disabled:bg-gray-400"
      >
        {submitting ? 'Submitting...' : 'Submit'}
      </button>

      {!token && (
        <p className="mt-2 text-gray-600">
          <Link
            to="/login"
            className="text-blue-600 hover:underline"
          >
            Log in
          </Link>{' '}
          to submit your solution.
        </p>
      )}

      {verdict && (
        <p
          className={`mt-4 font-bold ${
            verdict === 'Accepted'
              ? 'text-green-600'
              : 'text-red-600'
          }`}
        >
          Verdict: {verdict}
        </p>
      )}

      <h2 className="text-2xl font-bold mt-8">
        Submission History
      </h2>

      <div className="mt-4">
        {submissions.length === 0 && (
          <p>No submissions yet.</p>
        )}

        {submissions.map((s) => (
          <div
            key={s.id}
            className="p-3 mb-2 rounded bg-gray-100 flex justify-between"
          >
            <span>
              {new Date(s.submitted_at).toLocaleString()}
            </span>

            <span
              className={
                s.verdict === 'Accepted'
                  ? 'text-green-600 font-bold'
                  : 'text-red-600 font-bold'
              }
            >
              {s.verdict}
            </span>
          </div>
        ))}
      </div>

    </div>
  )
}

export default ProblemDetail