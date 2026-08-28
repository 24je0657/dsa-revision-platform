import { useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import type { TopicAnalytics } from './data'
import { API_URL } from './api'

function Analytics() {
  const { token } = useAuth()

  const [analytics, setAnalytics] = useState<TopicAnalytics[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    fetch(`${API_URL}/analytics/topics`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            `Failed to fetch topic analytics: ${res.status}`
          )
        }

        return res.json()
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error('Invalid topic analytics response')
        }

        setAnalytics(data)
      })
      .catch((error) => {
        console.error(error)
        setAnalytics([])
      })
      .finally(() => {
        setLoading(false)
      })
  }, [token])

  if (loading) {
    return <p className="p-6">Loading analytics...</p>
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Weak Topic Analytics
      </h1>

      {analytics.length === 0 ? (
        <p>No topic analytics available yet.</p>
      ) : (
        <div className="flex flex-wrap gap-6">
          {analytics.map((item) => {
            let statusIcon = '🟡'

            if (item.status === 'weak') {
              statusIcon = '🔴'
            } else if (item.status === 'strong') {
              statusIcon = '🟢'
            }

            return (
              <div
                key={item.topic}
                className="card"
              >
                <h2 className="text-xl font-bold">
                  {item.topic}
                </h2>

                <p>
                  {statusIcon}{' '}
                  {item.status.replaceAll('_', ' ')}
                </p>

                <p>
                  Coverage: {item.coverage}%
                </p>

                <p>
                  Acceptance Rate: {item.acceptance_rate}%
                </p>

                <p>
                  Attempted: {item.attempted} / {item.total_problems}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Analytics