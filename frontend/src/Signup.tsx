import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { API_URL } from './api'

function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.detail || 'Signup failed')
        return
      }

      navigate('/login')
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
            Sign Up
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-muted">
            Create an account to start building your revision library.
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
              placeholder="Create a password"
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
            Sign Up
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-muted">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-accent transition-colors hover:text-text hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Signup