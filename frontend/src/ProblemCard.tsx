type ProblemCardProps = {
  title: string
  difficulty: string
  topic: string
  description: string
}

function ProblemCard({ title, difficulty, topic, description }: ProblemCardProps) {
  return (
    <div className="card">
      <h2>{title}</h2>

      <span className="difficulty">{difficulty}</span>

      <span className="topic">{topic}</span>

      <p>{description}</p>

      <button>Revise Now</button>
    </div>
  )
}

export default ProblemCard