import ProblemCard from './ProblemCard'
import './App.css'

function App() {
  return (
    <div>
      <ProblemCard
        title="Binary Search"
        difficulty="Medium"
        topic="Binary Search"
        description="Learn how to efficiently search in a sorted array."
      />

      <ProblemCard
        title="Breadth First Search"
        difficulty="Easy"
        topic="Graphs"
        description="Learn how to traverse a graph level by level."
      />
    </div>
  )
}

export default App