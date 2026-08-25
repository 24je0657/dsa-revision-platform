import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from './AuthContext'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()
  const { login } = useAuth()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    try {
      const res = await fetch('http://localhost:8000/login', {
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

      navigate('/')
    } catch (error) {
      console.error(error)
      setError('Unable to connect to the server')
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Log In
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3"
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
          required
        />

        {error && (
          <p className="text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded"
        >
          Log In
        </button>
      </form>

      <p className="mt-4">
        Don't have an account?{' '}
        <Link
          to="/signup"
          className="text-blue-600"
        >
          Sign up
        </Link>
      </p>
    </div>
  )
}

export default Login