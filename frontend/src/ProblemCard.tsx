import { useState } from 'react'

type ProblemCardProps = {
  title: string
  difficulty: string
  topic: string
  description: string
  hint: string
}
function getDifficultyClass(difficulty: string) {
  if (difficulty === "Easy") return "difficulty easy"
  if (difficulty === "Medium") return "difficulty medium"
  if (difficulty === "Hard") return "difficulty hard"
  return "difficulty"
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

      <span className={getDifficultyClass(difficulty)}>{difficulty}</span>

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