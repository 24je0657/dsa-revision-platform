function Loading({ label = 'loading' }: { label?: string }) {
  return (
    <div className="p-6 flex items-center gap-2 font-mono text-sm text-muted">
      <span>{label}</span>
      <span className="animate-pulse text-accent">▌</span>
    </div>
  )
}

export default Loading