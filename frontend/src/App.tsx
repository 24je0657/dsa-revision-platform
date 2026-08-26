import { Routes, Route } from 'react-router-dom'
import Navbar from './Navbar'
import ProtectedRoute from './ProtectedRoute'
import ProblemList from './ProblemList'
import ProblemDetail from './ProblemDetail'
import Signup from './Signup'
import Login from './Login'
import Reviews from './Reviews'

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<ProblemList />} />

        <Route
          path="/problem/:slug"
          element={
            <ProtectedRoute>
              <ProblemDetail />
            </ProtectedRoute>
          }
        />
        <Route path="/reviews" element={<ProtectedRoute> <Reviews />
        </ProtectedRoute>
        }/>

        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  )
}

export default App