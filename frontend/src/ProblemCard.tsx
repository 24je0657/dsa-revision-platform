import { useState } from 'react'

type ProblemCardProps = {
  title: string
  difficulty: string
  topic: string
  description: string
  hint: string
}

function ProblemCard({
  title,
  difficulty,
  topic,
  description,
  hint
}: ProblemCardProps) {
  const [showHint, setShowHint] = useState(false)

  return (
    <div className="card">
      <h2>{title}</h2>

      <span className="difficulty">{difficulty}</span>

      <span className="topic">{topic}</span>

      <p>{description}</p>

      <button onClick={() => setShowHint(!showHint)}>
        {showHint ? 'Hide Hint' : 'Reveal Hint'}
      </button>

      {showHint && (
        <p>{hint}</p>
      )}

      <button>Revise Now</button>
    </div>
  )
}

export default ProblemCard