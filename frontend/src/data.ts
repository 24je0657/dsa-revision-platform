export type Problem = {
  id: number
  slug: string
  title: string
  difficulty: string
  topic: string
  description: string
  hints: string[]
}

export type SubmissionResult = {
  id: number
  problem_id: number
  code: string
  language: string
  verdict: string
  submitted_at: string
}
