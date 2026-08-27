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
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Sign Up
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
          Sign Up
        </button>
      </form>

      <p className="mt-4">
        Already have an account?{' '}
        <Link
          to="/login"
          className="text-blue-600"
        >
          Log in
        </Link>
      </p>
    </div>
  )
}

export default Signup