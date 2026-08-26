import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

function Navbar() {
  const { token, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-900 text-white">
      <Link to="/" className="text-lg font-bold">
        DSA Revision Platform
      </Link>

      <div className="flex gap-4 items-center">
        {token ? (
          <button onClick={handleLogout} className="hover:underline">
            Log Out
          </button>
        ) : (
          <>
            <Link to="/login" className="hover:underline">
              Log In
            </Link>
            <Link to="/signup" className="hover:underline">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar