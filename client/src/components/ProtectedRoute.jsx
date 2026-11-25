import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Sends the user to the login page if they are not logged in.
// `from` remembers where they were going, so we can send them back after login
// (important for the QR flow: scan -> login -> back to /claim?code=...).
export function RequireCustomer({ children }) {
  const { customer } = useAuth()
  const location = useLocation()
  if (!customer) return <Navigate to="/login" replace state={{ from: location }} />
  return children
}

export function RequireAdmin({ children }) {
  const { admin } = useAuth()
  if (!admin) return <Navigate to="/admin/login" replace />
  return children
}
