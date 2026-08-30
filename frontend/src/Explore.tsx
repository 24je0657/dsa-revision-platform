import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { API_URL } from './api'
import { getDifficultyColor } from './utils'
import Loading from './Loading'

type ExploreProblem = {
  id: number
  slug: string
  title: string
  difficulty: string
  topic: string
  description: string | null
  hints: string[] | null
  in_library: boolean
}

function Explore() {
  const { token } = useAuth()
  const navigate = useNavigate()

  const [problems, setProblems] = useState<ExploreProblem[]>([])
  const [loading, setLoading] = useState(true)
  const [addingId, setAddingId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    fetch(`${API_URL}/explore`, {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            `Failed to fetch explore catalog: ${res.status}`
          )
        }

        return res.json()
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error('Invalid explore catalog response')
        }

        setProblems(data)
      })
      .catch((error) => {
        console.error(error)
        setProblems([])

        setError(
          error instanceof Error
            ? error.message
            : 'Failed to load explore catalog'
        )
      })
      .finally(() => {
        setLoading(false)
      })
  }, [token])

  async function handleAdd(problemId: number) {
    if (!token) {
      navigate('/login')
      return
    }

    setAddingId(problemId)
    setError(null)

    try {
      const res = await fetch(`${API_URL}/user-problems`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          problem_id: problemId,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)

        throw new Error(
          data?.detail || `Failed to add problem: ${res.status}`
        )
      }

      setProblems((prev) =>
        prev.map((problem) =>
          problem.id === problemId
            ? { ...problem, in_library: true }
            : problem
        )
      )
    } catch (error) {
      console.error(error)

      setError(
        error instanceof Error
          ? error.message
          : 'Failed to add problem'
      )
    } finally {
      setAddingId(null)
    }
  }

  if (loading) {
    return <Loading label="loading_catalog" />
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-accent">
          explore
        </p>

        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-text">
          Shared Catalog
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Browse problems from the shared catalog and add the ones you want
          to practice to your personal revision library.
        </p>
      </div>

      {error && (
        <div className="mt-6 rounded-lg border border-weak/30 bg-weak/10 px-4 py-3">
          <p className="font-mono text-xs text-weak">
            {error}
          </p>
        </div>
      )}

      {problems.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-white/10 py-16 text-center">
          <p className="font-mono text-sm text-muted">
            no_problems_in_catalog
          </p>

          <p className="mt-2 text-sm text-muted">
            The shared catalog is currently empty.
          </p>
        </div>
      ) : (
        <div className="mt-8">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-semibold text-text">
                Available Problems
              </h2>

              <p className="mt-1 text-sm text-muted">
                {problems.length} problem
                {problems.length === 1 ? '' : 's'} in the shared catalog.
              </p>
            </div>

            <span className="font-mono text-xs text-muted">
              public_catalog
            </span>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {problems.map((problem) => (
              <div
                key={problem.id}
                className="flex h-full w-full flex-col rounded-xl border border-white/10 bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-lg hover:shadow-black/20"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="min-w-0 font-display text-lg font-semibold leading-tight text-text">
                    {problem.title}
                  </h2>

                  {problem.in_library && (
                    <span className="shrink-0 rounded-full border border-strong/30 bg-strong/10 px-2 py-1 font-mono text-[11px] font-medium text-strong">
                      in_library
                    </span>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap gap-2 font-mono text-xs">
                  <span
                    className={`rounded-full border px-2 py-1 ${getDifficultyColor(
                      problem.difficulty
                    )}`}
                  >
                    {problem.difficulty.toLowerCase()}
                  </span>

                  <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-muted">
                    {problem.topic.toLowerCase()}
                  </span>
                </div>

                {problem.description && (
                  <p className="mt-4 text-sm leading-relaxed text-muted">
                    {problem.description}
                  </p>
                )}

                <div className="mt-auto pt-5">
                  {problem.in_library ? (
                    <div className="rounded-md border border-strong/30 bg-strong/10 py-2.5 text-center font-mono text-sm text-strong">
                      ✓ in your library
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAdd(problem.id)}
                      disabled={addingId === problem.id}
                      className="w-full rounded-md bg-accent py-2.5 text-sm font-medium text-bg transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {addingId === problem.id
                        ? 'adding…'
                        : '+ Add to My Problems'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Explore