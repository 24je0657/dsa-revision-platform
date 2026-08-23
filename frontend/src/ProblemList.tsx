import { problems } from './data'
import ProblemCard from './ProblemCard'

function ProblemList() {
  return (
    <div className="flex flex-wrap gap-6 p-6">
      {problems.map((problem) => (
        <ProblemCard
          key={problem.slug}
          slug={problem.slug}
          title={problem.title}
          difficulty={problem.difficulty}
          topic={problem.topic}
          description={problem.description}
          hints={problem.hints}
        />
      ))}
    </div>
  )
}

export default ProblemList