import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

function Navbar() {
  const { token, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [menuOpen, setMenuOpen] = useState(false)

  function handleLogout() {
    logout()
    setMenuOpen(false)
    navigate('/login')
  }

  function getLinkClass(path: string) {
    const isActive = location.pathname === path

    return `
      transition-colors
      ${
        isActive
          ? 'text-text'
          : 'text-muted hover:text-text'
      }
    `
  }

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-surface/95 backdrop-blur">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        <Link
          to="/"
          onClick={closeMenu}
          className="font-display text-xl font-semibold tracking-tight text-text"
        >
          DSA<span className="text-accent">::</span>Revise
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-5 font-mono text-sm md:flex">
          {/* Public link */}
          <Link
            to="/explore"
            className={getLinkClass('/explore')}
          >
            explore
          </Link>

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
                className="rounded-md bg-accent px-4 py-2 font-medium text-bg transition-all hover:-translate-y-0.5 hover:opacity-90"
              >
                sign_up
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="rounded-md border border-white/10 px-3 py-2 font-mono text-xl leading-none text-text transition-colors hover:border-accent hover:text-accent md:hidden"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile navigation */}
      {menuOpen && (
        <div className="border-t border-white/10 px-4 pb-4 md:hidden">
          <div className="flex flex-col gap-1 pt-2 font-mono text-sm">

            {/* Public link */}
            <Link
              to="/explore"
              onClick={closeMenu}
              className={`rounded-md px-3 py-2 ${getLinkClass('/explore')}`}
            >
              explore
            </Link>

            {token ? (
              <>
                <Link
                  to="/"
                  onClick={closeMenu}
                  className={`rounded-md px-3 py-2 ${getLinkClass('/')}`}
                >
                  my_problems
                </Link>

                <Link
                  to="/reviews"
                  onClick={closeMenu}
                  className={`rounded-md px-3 py-2 ${getLinkClass('/reviews')}`}
                >
                  due_reviews
                </Link>

                <Link
                  to="/analytics"
                  onClick={closeMenu}
                  className={`rounded-md px-3 py-2 ${getLinkClass('/analytics')}`}
                >
                  analytics
                </Link>

                <button
                  onClick={handleLogout}
                  className="rounded-md px-3 py-2 text-left text-muted transition-colors hover:text-weak"
                >
                  log_out()
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className={`rounded-md px-3 py-2 ${getLinkClass('/login')}`}
                >
                  log_in
                </Link>

                <Link
                  to="/signup"
                  onClick={closeMenu}
                  className="rounded-md px-3 py-2 font-medium text-accent transition-colors hover:text-text"
                >
                  sign_up
                </Link>
              </>
            )}

          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar