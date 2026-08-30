import { useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import type { TopicAnalytics } from './data'
import { API_URL } from './api'
import Loading from './Loading'

function statusColor(status: string) {
  if (status === 'strong') {
    return 'text-strong bg-strong/10 border-strong/30'
  }

  if (status === 'weak') {
    return 'text-weak bg-weak/10 border-weak/30'
  }

  return 'text-practice bg-practice/10 border-practice/30'
}

function barColor(status: string) {
  if (status === 'strong') {
    return 'bg-strong'
  }

  if (status === 'weak') {
    return 'bg-weak'
  }

  return 'bg-practice'
}

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
    return <Loading label="loading_analytics" />
  }

  const strongCount = analytics.filter(
    (item) => item.status === 'strong'
  ).length

  const weakCount = analytics.filter(
    (item) => item.status === 'weak'
  ).length

  const practiceCount = analytics.filter(
    (item) =>
      item.status !== 'strong' &&
      item.status !== 'weak'
  ).length

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-accent">
          analytics
        </p>

        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-text">
          Weak Topic Analytics
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Understand where your revision effort should go based on
          coverage, attempts, and acceptance.
        </p>
      </div>

      {analytics.length === 0 ? (
        <div className="mt-8 rounded-xl border border-white/10 bg-surface p-6">
          <p className="font-mono text-sm text-muted">
            no_topic_analytics_available
          </p>

          <p className="mt-2 text-sm text-muted">
            Add and revise some problems to build topic-level analytics.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-surface p-5">
              <p className="font-mono text-xs uppercase tracking-wide text-muted">
                topics
              </p>

              <p className="mt-2 font-display text-3xl font-semibold text-text">
                {analytics.length}
              </p>

              <p className="mt-1 text-xs text-muted">
                topics with available analytics
              </p>
            </div>

            <div className="rounded-xl border border-strong/20 bg-surface p-5">
              <p className="font-mono text-xs uppercase tracking-wide text-muted">
                strong
              </p>

              <p className="mt-2 font-display text-3xl font-semibold text-strong">
                {strongCount}
              </p>

              <p className="mt-1 text-xs text-muted">
                topics currently performing well
              </p>
            </div>

            <div className="rounded-xl border border-practice/20 bg-surface p-5">
              <p className="font-mono text-xs uppercase tracking-wide text-muted">
                needs_work
              </p>

              <p className="mt-2 font-display text-3xl font-semibold text-practice">
                {weakCount + practiceCount}
              </p>

              <p className="mt-1 text-xs text-muted">
                topics needing more revision
              </p>
            </div>
          </div>

          <div className="mt-10">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-xl font-semibold text-text">
                  Topic Performance
                </h2>

                <p className="mt-1 text-sm text-muted">
                  Coverage and acceptance by topic.
                </p>
              </div>

              <span className="font-mono text-xs text-muted">
                {analytics.length} topics
              </span>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              {analytics.map((item) => (
                <div
                  key={item.topic}
                  className="rounded-xl border border-white/10 bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-lg hover:shadow-black/20"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="font-display text-lg font-semibold text-text">
                        {item.topic}
                      </h3>

                      <p className="mt-1 font-mono text-xs text-muted">
                        attempted {item.attempted} / {item.total_problems}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full border px-2 py-1 font-mono text-[11px] font-medium ${statusColor(
                        item.status
                      )}`}
                    >
                      {item.status.replaceAll('_', ' ')}
                    </span>
                  </div>

                  <div className="mt-5">
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="text-muted">
                        coverage
                      </span>

                      <span className="text-text">
                        {item.coverage}%
                      </span>
                    </div>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className={`h-full rounded-full transition-all ${barColor(
                          item.status
                        )}`}
                        style={{
                          width: `${Math.min(
                            Math.max(item.coverage, 0),
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="text-muted">
                        acceptance
                      </span>

                      <span className="text-text">
                        {item.acceptance_rate}%
                      </span>
                    </div>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className={`h-full rounded-full transition-all ${barColor(
                          item.status
                        )}`}
                        style={{
                          width: `${Math.min(
                            Math.max(item.acceptance_rate, 0),
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Analytics