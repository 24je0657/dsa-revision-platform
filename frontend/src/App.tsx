import { Routes, Route } from 'react-router-dom'
import ProblemList from './ProblemList'
import ProblemDetail from './ProblemDetail'
import Signup from './Signup'
import Login from './Login'

function App() {
  return (
    <Routes>
      <Route path="/" element={<ProblemList />} />
      <Route path="/problem/:slug" element={<ProblemDetail />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  )
}

export default App