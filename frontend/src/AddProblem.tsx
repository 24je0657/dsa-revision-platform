import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { API_URL } from './api'

function AddProblem() {
  const { token } = useAuth()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [leetcodeUrl, setLeetcodeUrl] = useState('')
  const [difficulty, setDifficulty] = useState('Easy')
  const [topic, setTopic] = useState('')
  const [description, setDescription] = useState('')
  const [solutionCode, setSolutionCode] = useState('')

  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      if (!token) {
        setError('You must be logged in to add a problem.')
        return
      }

      const res = await fetch(`${API_URL}/problems`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          leetcode_url: leetcodeUrl || null,
          difficulty,
          topic,
          description: description || null,
          solution_code: solutionCode || null,
          language: solutionCode ? 'cpp' : null,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)

        throw new Error(
          data?.detail || `Failed to add problem: ${res.status}`
        )
      }

      const data = await res.json()

      navigate(`/problem/${data.slug}`)
    } catch (error) {
      console.error(error)

      setError(
        error instanceof Error
          ? error.message
          : 'Failed to add problem'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        Add Problem
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        <div>
          <label className="block font-medium mb-1">
            Title
          </label>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 rounded w-full"
            placeholder="e.g. Sliding Window Maximum"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">
            LeetCode URL
          </label>

          <input
            type="url"
            value={leetcodeUrl}
            onChange={(e) => setLeetcodeUrl(e.target.value)}
            className="border p-2 rounded w-full"
            placeholder="https://leetcode.com/problems/..."
          />
        </div>

        <div>
          <label className="block font-medium mb-1">
            Difficulty
          </label>

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="border p-2 rounded w-full"
            required
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">
            Topic
          </label>

          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="border p-2 rounded w-full"
            placeholder="e.g. Arrays"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">
            Description
          </label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 rounded w-full"
            rows={5}
            placeholder="Optional problem description"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">
            Previous Solution
          </label>

          <textarea
            value={solutionCode}
            onChange={(e) => setSolutionCode(e.target.value)}
            className="border p-2 rounded w-full font-mono"
            rows={10}
            placeholder="Optional: paste your previous solution"
          />
        </div>

        {error && (
          <p className="text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white py-2 rounded disabled:bg-gray-400"
        >
          {submitting ? 'Adding Problem...' : 'Add Problem'}
        </button>
      </form>
    </div>
  )
}

export default AddProblem