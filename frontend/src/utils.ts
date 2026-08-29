export function getDifficultyColor(difficulty: string) {
  if (difficulty === 'Easy') return 'text-strong border-strong/30 bg-strong/10'
  if (difficulty === 'Medium') return 'text-practice border-practice/30 bg-practice/10'
  if (difficulty === 'Hard') return 'text-weak border-weak/30 bg-weak/10'
  return 'text-muted border-white/10 bg-white/5'
}