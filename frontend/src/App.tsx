import ProblemCard from './ProblemCard'
import './App.css'

const problems = [
  {
    title: "Binary Search",
    difficulty: "Medium",
    topic: "Searching",
    description: "Find an element efficiently in a sorted array.",
    hints: [
      "Think about checking the middle element.",
      "Eliminate half of the search space after each comparison.",
      "Continue until you find the target or the search space is empty."
    ]
  },

  {
    title: "Two Sum",
    difficulty: "Easy",
    topic: "Arrays",
    description: "Find two numbers that add up to a given target.",
    hints: [
      "Think about what complement each number needs.",
      "Can you remember numbers you have already seen?"
    ]
  },

  {
    title: "Number of Islands",
    difficulty: "Medium",
    topic: "Graphs",
    description: "Count the number of connected islands in a grid.",
    hints: [
      "Think about DFS or BFS from every unvisited land cell.",
      "Mark visited land so you do not count the same island again.",
      "One complete traversal covers one entire island."
    ]
  },

  {
    title: "Longest Common Subsequence",
    difficulty: "Hard",
    topic: "Dynamic Programming",
    description: "Find the longest subsequence common to two strings.",
    hints: [
      "Try defining a DP state using positions in the two strings.",
      "Consider what happens when the current characters are equal.",
      "If they differ, consider the two possibilities of skipping one character."
    ]
  }
]

function App() {
  return (
    <div className="flex flex-wrap gap-6 p-6">
      {problems.map((problem) => (
        <ProblemCard
          key={problem.title}
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

export default App