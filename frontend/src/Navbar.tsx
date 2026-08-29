import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

function Navbar() {
  const { token, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  function getLinkClass(path: string) {
    const isActive = location.pathname === path

    return `
      transition-colors
      ${isActive
        ? 'text-text'
        : 'text-muted hover:text-text'}
    `
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-surface/95 backdrop-blur">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between px-6 lg:px-8">

        <Link
          to="/"
          className="font-display text-xl font-semibold tracking-tight text-text"
        >
          DSA<span className="text-accent">::</span>Revise
        </Link>

        <div className="flex items-center gap-5 font-mono text-sm">
          {token ? (
            <>
              <Link
                to="/"
                className={getLinkClass('/')}
              >
                my_problems
              </Link>

              <Link
                to="/reviews"
                className={getLinkClass('/reviews')}
              >
                due_reviews
              </Link>

              <Link
                to="/analytics"
                className={getLinkClass('/analytics')}
              >
                analytics
              </Link>

              <button
                onClick={handleLogout}
                className="text-muted transition-colors hover:text-weak"
              >
                log_out()
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={getLinkClass('/login')}
              >
                log_in
              </Link>

              <Link
                to="/signup"
                className="rounded-md bg-accent px-4 py-2 font-medium text-bg transition-all hover:opacity-90"
              >
                sign_up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar