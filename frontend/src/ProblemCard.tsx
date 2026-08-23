import { useState } from 'react'
import { Link } from 'react-router-dom'

type ProblemCardProps = {
  slug: string
  title: string
  difficulty: string
  topic: string
  description: string
  hints: string[]
}

function getDifficultyClass(difficulty: string) {
  if (difficulty === "Easy") return "difficulty easy"
  if (difficulty === "Medium") return "difficulty medium"
  if (difficulty === "Hard") return "difficulty hard"
  return "difficulty"
}

function ProblemCard({
  slug,
  title,
  difficulty,
  topic,
  description,
  hints
}: ProblemCardProps) {

  const [hintsShown, setHintsShown] = useState(0)

  function revealNextHint() {
    setHintsShown(prev => Math.min(prev + 1, hints.length))
  }

  return (
    <div className="card">

      <h2>{title}</h2>

      <span className={getDifficultyClass(difficulty)}>
        {difficulty}
      </span>

      <span className="topic">
        {topic}
      </span>

      <p>{description}</p>

      {/* Progressive hints */}
      {hints.slice(0, hintsShown).map((hint, index) => (
        <p key={index}>
          <strong>Hint {index + 1}:</strong> {hint}
        </p>
      ))}

      {/* Reveal hint button */}
      <button
        onClick={revealNextHint}
        disabled={hintsShown === hints.length}
      >
        {hintsShown === hints.length
          ? "All Hints Revealed"
          : `Reveal Hint (${hintsShown + 1}/${hints.length})`}
      </button>

      {/* Navigate to problem page */}
      <Link
        to={`/problem/${slug}`}
        className="revise-button"
      >
        Revise Now
      </Link>

    </div>
  )
}

export default ProblemCard