import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from './AuthContext'

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { token } = useAuth()

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute