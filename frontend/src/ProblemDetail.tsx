import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import type { Problem, SubmissionResult } from './data'
import { useAuth } from './AuthContext'
import { API_URL } from './api'
import { getDifficultyColor } from './utils'
import Loading from './Loading'

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
  const [language, setLanguage] = useState('cpp')

  useEffect(() => {
    setLoading(true)
    setProblem(null)
    setHintsShown(0)
    setSubmissions([])
    setLanguage('cpp')

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

      if (data.length > 0 && data[0].language) {
        setLanguage(data[0].language)
      }
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
          language: language,
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
    return <Loading label="loading_problem" />
  }

  if (!problem) {
    return (
      <div className="mx-auto w-full max-w-3xl px-6 py-12">
        <div className="rounded-xl border border-white/10 bg-surface p-6">
          <p className="mb-4 font-mono text-sm text-weak">
            error: problem_not_found
          </p>

          <Link
            to="/"
            className="font-mono text-sm text-accent transition-colors hover:text-text"
          >
            ← back_to_problems
          </Link>
        </div>
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
    <div className="mx-auto w-full max-w-3xl px-6 py-10">

      <Link
        to="/"
        className="font-mono text-sm text-accent transition-colors hover:text-text"
      >
        ← back_to_problems
      </Link>

      <div className="mt-5">
        <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight text-text">
          {problem.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-2 font-mono text-xs">
          <span
            className={`rounded-full border px-2.5 py-1 ${getDifficultyColor(
              problem.difficulty
            )}`}
          >
            {problem.difficulty.toLowerCase()}
          </span>

          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-muted">
            {problem.topic.toLowerCase()}
          </span>
        </div>

        {problem.description && (
          <p className="mt-5 text-sm leading-7 text-muted">
            {problem.description}
          </p>
        )}
      </div>

      <section className="mt-10">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-xl font-semibold text-text">
            Hints
          </h2>

          {safeHints.length > 0 && (
            <span className="font-mono text-xs text-muted">
              {hintsShown}/{safeHints.length}
            </span>
          )}
        </div>

        {safeHints.length === 0 ? (
          <div className="mt-3 rounded-lg border border-white/10 bg-surface px-4 py-3">
            <p className="text-sm text-muted">
              No hints available for this problem.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-4 flex flex-col gap-2">
              {safeHints.slice(0, hintsShown).map((hint, index) => (
                <p
                  key={index}
                  className="rounded-lg border border-white/10 bg-surface px-4 py-3 text-sm leading-relaxed text-muted"
                >
                  <span className="mr-2 font-mono text-accent">
                    #{index + 1}
                  </span>
                  {hint}
                </p>
              ))}
            </div>

            <button
              onClick={revealNextHint}
              disabled={hintsShown === safeHints.length}
              className="mt-4 font-mono text-sm text-accent transition-colors hover:text-text disabled:cursor-default disabled:text-muted"
            >
              {hintsShown === safeHints.length
                ? 'all_hints_revealed'
                : `reveal_hint(${hintsShown + 1}/${safeHints.length})`}
            </button>
          </>
        )}
      </section>

      <section className="mt-10">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-xl font-semibold text-text">
            Your Solution
          </h2>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="rounded-md border border-white/10 bg-surface px-3 py-2 font-mono text-sm text-text outline-none transition-colors focus:border-accent"
          >
            <option value="cpp">C++</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="javascript">JavaScript</option>
          </select>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
          <Editor
            height="400px"
            language={language}
            value={code}
            onChange={(value) => setCode(value ?? '')}
            theme="vs-dark"
          />
        </div>

        <div className="mt-4 flex items-center gap-4">
          <button
            onClick={handleSubmit}
            disabled={submitting || !token}
            className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-bg transition-all hover:-translate-y-0.5 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting ? 'Submitting…' : 'Submit'}
          </button>

          {!token && (
            <p className="text-sm text-muted">
              <Link
                to="/login"
                className="text-accent transition-colors hover:text-text hover:underline"
              >
                log_in
              </Link>{' '}
              to submit.
            </p>
          )}
        </div>

        {verdict && (
          <div className="mt-4 rounded-lg border border-white/10 bg-surface px-4 py-3">
            <p
              className={`font-mono text-sm font-medium ${
                verdict === 'Accepted'
                  ? 'text-strong'
                  : 'text-weak'
              }`}
            >
              verdict: {verdict}
            </p>
          </div>
        )}
      </section>

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-text">
            Submission History
          </h2>

          <span className="font-mono text-xs text-muted">
            {submissions.length} submission
            {submissions.length === 1 ? '' : 's'}
          </span>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          {submissions.length === 0 ? (
            <div className="rounded-lg border border-white/10 bg-surface px-4 py-3">
              <p className="text-sm text-muted">
                No submissions yet.
              </p>
            </div>
          ) : (
            submissions.map((s) => (
              <div
                key={s.id}
                className="flex flex-col gap-2 rounded-lg border border-white/10 bg-surface px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-xs text-muted">
                    {new Date(s.submitted_at).toLocaleString()}
                  </span>

                  <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 font-mono text-[11px] text-muted">
                    {s.language}
                  </span>
                </div>

                <span
                  className={`font-mono text-xs font-medium ${
                    s.verdict === 'Accepted'
                      ? 'text-strong'
                      : 'text-weak'
                  }`}
                >
                  {s.verdict}
                </span>
              </div>
            ))
          )}
        </div>
      </section>

    </div>
  )
}

export default ProblemDetail