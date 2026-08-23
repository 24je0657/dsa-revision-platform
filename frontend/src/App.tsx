import ProblemCard from './ProblemCard'
import './App.css'

const problems = [
  {
    title: "Binary Search",
    difficulty: "Medium",
    topic: "Searching",
    description: "Find an element efficiently in a sorted array.",
    hint: "Think about checking the middle element and eliminating half the search space."
  },
  {
    title: "Two Sum",
    difficulty: "Easy",
    topic: "Arrays",
    description: "Find two numbers that add up to a given target.",
    hint: "Can you remember numbers you have already seen?"
  },
  {
    title: "Number of Islands",
    difficulty: "Medium",
    topic: "Graphs",
    description: "Count the number of connected islands in a grid.",
    hint: "Think about DFS or BFS from every unvisited land cell."
  },
  {
    title: "Longest Common Subsequence",
    difficulty: "Hard",
    topic: "Dynamic Programming",
    description: "Find the longest subsequence common to two strings.",
    hint: "Try defining a DP state using positions in the two strings."
  }
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
          hint={problem.hint}
        />
      ))}
    </div>
  )
}

export default App