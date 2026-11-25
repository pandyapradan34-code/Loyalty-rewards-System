import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminLogin } from '../../api/mockApi'
import { useAuth } from '../../context/AuthContext'
import { Alert, Button, Card, Input } from '../../components/ui'

export default function AdminLogin() {
  const { loginAdmin } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const admin = await adminLogin(email, password)
      loginAdmin(admin)
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <h1 className="text-xl font-bold text-center">Owner Login</h1>
        <p className="text-sm text-gray-500 text-center mt-1">Factory rewards management</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Alert>{error}</Alert>
          <Button type="submit" disabled={loading} className="w-full">{loading ? 'Signing in…' : 'Sign in'}</Button>
          <p className="text-xs text-gray-400 text-center">Demo: admin@factory.com / admin123</p>
        </form>
      </Card>
    </div>
  )
}
