export type Problem = {
  id: number
  slug: string
  title: string
  difficulty: string
  topic: string
  description: string
  hints: string[]
  next_review_due: string | null
  interval_days: number | null
}
export type SubmissionResult = {
  id: number
  problem_id: number
  user_id: number
  code: string
  language: string
  verdict: string
  submitted_at: string
}

export type DueReview = {
  problem: Problem
  next_review_due: string
  interval_days: number
}

export type TopicAnalytics = {
  topic: string
  total_problems: number
  attempted: number
  accepted: number
  coverage: number
  acceptance_rate: number
  status: string
}