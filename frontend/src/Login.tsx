import { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { API_URL } from './api'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.detail || 'Login failed')
        return
      }

      const data = await res.json()

      login(data.access_token)

      const from = location.state?.from?.pathname || '/'

      navigate(from, { replace: true })
    } catch (error) {
      console.error(error)
      setError('Unable to connect to the server')
    }
  }

  return (
    <div className="mx-auto w-full max-w-sm px-6 py-16">
      <div className="rounded-xl border border-white/10 bg-surface p-6 shadow-lg shadow-black/20">

        <div className="mb-6">
          <p className="font-mono text-xs uppercase tracking-wider text-accent">
            authentication
          </p>

          <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-text">
            Log In
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-muted">
            Sign in to access your personal revision library.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          <div>
            <label className="mb-1.5 block font-mono text-xs text-muted">
              email
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-white/10 bg-bg px-3 py-2.5 text-sm text-text placeholder:text-muted outline-none transition-colors focus:border-accent"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block font-mono text-xs text-muted">
              password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-white/10 bg-bg px-3 py-2.5 text-sm text-text placeholder:text-muted outline-none transition-colors focus:border-accent"
              required
            />
          </div>

          {error && (
            <div className="rounded-md border border-weak/30 bg-weak/10 px-3 py-2">
              <p className="font-mono text-xs text-weak">
                {error}
              </p>
            </div>
          )}

          <button
            type="submit"
            className="mt-1 rounded-md bg-accent py-2.5 text-sm font-medium text-bg transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90"
          >
            Log In
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-muted">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="text-accent transition-colors hover:text-text hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login