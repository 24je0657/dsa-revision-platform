import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getDifficultyColor } from './utils'

type ProblemCardProps = {
  slug: string
  title: string
  difficulty: string
  topic: string
  description: string | null
  hints: string[] | null
  nextReviewDue: string | null
}

function ProblemCard({
  slug,
  title,
  difficulty,
  topic,
  description,
  hints,
  nextReviewDue,
}: ProblemCardProps) {
  const safeHints = hints ?? []

  const isDue =
    nextReviewDue !== null &&
    new Date(nextReviewDue) <= new Date()

  const [hintsShown, setHintsShown] = useState(0)

  function revealNextHint() {
    setHintsShown((prev) =>
      Math.min(prev + 1, safeHints.length)
    )
  }

  return (
    <div className="w-full max-w-sm rounded-xl border border-white/10 bg-surface p-5 flex flex-col gap-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-lg hover:shadow-black/20">
      <div className="flex items-start justify-between gap-3">
        <h2 className="min-w-0 font-display text-lg font-semibold leading-tight text-text">
          {title}
        </h2>

        {isDue && (
          <span className="shrink-0 rounded-full border border-practice/30 bg-practice/10 px-2 py-1 font-mono text-[11px] font-medium text-practice">
            due_today
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2 font-mono text-xs">
        <span
          className={`rounded-full border px-2 py-1 ${getDifficultyColor(
            difficulty
          )}`}
        >
          {difficulty.toLowerCase()}
        </span>

        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-muted">
          {topic.toLowerCase()}
        </span>
      </div>

      {description && (
        <p className="text-sm leading-relaxed text-muted">
          {description}
        </p>
      )}

      {safeHints.length > 0 && (
        <div className="flex flex-col gap-2">
          {safeHints
            .slice(0, hintsShown)
            .map((hint, index) => (
              <p
                key={index}
                className="rounded-md border border-white/5 bg-white/5 p-2 text-xs leading-relaxed text-muted"
              >
                <span className="mr-1 font-mono text-accent">
                  #{index + 1}
                </span>
                {hint}
              </p>
            ))}

          <button
            onClick={revealNextHint}
            disabled={hintsShown === safeHints.length}
            className="text-left font-mono text-xs text-accent transition-colors hover:text-text disabled:cursor-default disabled:text-muted"
          >
            {hintsShown === safeHints.length
              ? 'all_hints_revealed'
              : `reveal_hint(${hintsShown + 1}/${safeHints.length})`}
          </button>
        </div>
      )}

      <Link
        to={`/problem/${slug}`}
        className="mt-auto rounded-md bg-accent py-2.5 text-center text-sm font-medium text-bg transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90"
      >
        Revise Now
      </Link>
    </div>
  )
}

export default ProblemCard