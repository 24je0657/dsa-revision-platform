import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { API_URL } from './api'

function AddProblem() {
  const { token } = useAuth()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [leetcodeUrl, setLeetcodeUrl] = useState('')
  const [difficulty, setDifficulty] = useState('Easy')
  const [topic, setTopic] = useState('')
  const [description, setDescription] = useState('')
  const [solutionCode, setSolutionCode] = useState('')

  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      if (!token) {
        setError('You must be logged in to add a problem.')
        return
      }

      const res = await fetch(`${API_URL}/problems`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          leetcode_url: leetcodeUrl || null,
          difficulty,
          topic,
          description: description || null,
          solution_code: solutionCode || null,
          language: solutionCode ? 'cpp' : null,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)

        throw new Error(
          data?.detail || `Failed to add problem: ${res.status}`
        )
      }

      const data = await res.json()

      navigate(`/problem/${data.slug}`)
    } catch (error) {
      console.error(error)

      setError(
        error instanceof Error
          ? error.message
          : 'Failed to add problem'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-10">
      <div className="mb-6">
        <p className="font-mono text-xs uppercase tracking-wider text-accent">
          add_problem
        </p>

        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-text">
          Add Problem
        </h1>

        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
          Add a problem you've already learned to your personal revision
          library and practice it again later.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-white/10 bg-surface p-6 shadow-lg shadow-black/20 sm:p-8"
      >
        <div className="flex flex-col gap-5">

          <div>
            <label className="mb-1.5 block font-mono text-xs text-muted">
              title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border border-white/10 bg-bg px-3 py-2.5 text-sm text-text placeholder:text-muted outline-none transition-colors focus:border-accent"
              placeholder="e.g. Sliding Window Maximum"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block font-mono text-xs text-muted">
              leetcode_url
            </label>

            <input
              type="url"
              value={leetcodeUrl}
              onChange={(e) => setLeetcodeUrl(e.target.value)}
              className="w-full rounded-md border border-white/10 bg-bg px-3 py-2.5 text-sm text-text placeholder:text-muted outline-none transition-colors focus:border-accent"
              placeholder="https://leetcode.com/problems/..."
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

            <div>
              <label className="mb-1.5 block font-mono text-xs text-muted">
                difficulty
              </label>

              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full rounded-md border border-white/10 bg-bg px-3 py-2.5 text-sm text-text outline-none transition-colors focus:border-accent"
                required
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block font-mono text-xs text-muted">
                topic
              </label>

              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full rounded-md border border-white/10 bg-bg px-3 py-2.5 text-sm text-text placeholder:text-muted outline-none transition-colors focus:border-accent"
                placeholder="e.g. Arrays"
                required
              />
            </div>

          </div>

          <div>
            <label className="mb-1.5 block font-mono text-xs text-muted">
              description
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full resize-y rounded-md border border-white/10 bg-bg px-3 py-2.5 text-sm text-text placeholder:text-muted outline-none transition-colors focus:border-accent"
              rows={5}
              placeholder="Optional problem description"
            />
          </div>

          <div>
            <label className="mb-1.5 block font-mono text-xs text-muted">
              solution_code
            </label>

            <textarea
              value={solutionCode}
              onChange={(e) => setSolutionCode(e.target.value)}
              className="w-full resize-y rounded-md border border-white/10 bg-bg px-3 py-2.5 font-mono text-sm text-text placeholder:text-muted outline-none transition-colors focus:border-accent"
              rows={12}
              placeholder="Optional: paste your previous solution"
            />

            <p className="mt-1.5 text-xs text-muted">
              This will be stored as your first submission for the problem.
            </p>
          </div>

          {error && (
            <div className="rounded-md border border-weak/30 bg-weak/10 px-3 py-2.5">
              <p className="font-mono text-xs text-weak">
                {error}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between gap-4 pt-2">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="font-mono text-sm text-muted transition-colors hover:text-text"
            >
              cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-bg transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {submitting ? 'adding_problem…' : 'add_problem'}
            </button>
          </div>

        </div>
      </form>
    </div>
  )
}

export default AddProblem