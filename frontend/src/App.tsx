import { Routes, Route } from 'react-router-dom'
import ProblemList from './ProblemList'
import ProblemDetail from './ProblemDetail'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<ProblemList />} />

      <Route
        path="/problem/:slug"
        element={<ProblemDetail />}
      />
    </Routes>
  )
}

export default App