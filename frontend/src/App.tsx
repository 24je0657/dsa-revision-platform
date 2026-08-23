import ProblemCard from './ProblemCard'
import './App.css'

const problems = [
  {
    title: "Binary Search",
    difficulty: "Medium",
    topic: "Searching",
    description: "Find an element efficiently in a sorted array."
  },
  {
    title: "Two Sum",
    difficulty: "Easy",
    topic: "Arrays",
    description: "Find two numbers that add up to a given target."
  },
  {
    title: "Number of Islands",
    difficulty: "Medium",
    topic: "Graphs",
    description: "Count the number of connected islands in a grid."
  },
  {
    title: "Longest Common Subsequence",
    difficulty: "Hard",
    topic: "Dynamic Programming",
    description: "Find the longest subsequence common to two strings."
  },
]

function App() {
  return (
    <div>
      {problems.map((problem) => (
        <ProblemCard
          key={problem.title}
          title={problem.title}
          difficulty={problem.difficulty}
          topic={problem.topic}
          description={problem.description}
        />
      ))}
    </div>
  )
}

export default App