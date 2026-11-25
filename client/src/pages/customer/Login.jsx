import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { customerGoogleLogin } from '../../api/mockApi'
import { useAuth } from '../../context/AuthContext'
import { Alert, Button, Card, Input } from '../../components/ui'

// TEMPORARY: until the backend exists, "Sign in with Google" is simulated.
// You type a name + email to pretend to be a Google account. Using two
// different emails lets you demo two customers (e.g. trying to reuse a code).
export default function Login() {
  const { loginCustomer } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from
    ? location.state.from.pathname + location.state.from.search
    : '/wallet'

  const [name, setName] = useState('Demo Customer')
  const [email, setEmail] = useState('demo@example.com')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Enter a valid email.')
    setLoading(true)
    setError('')
    try {
      const user = await customerGoogleLogin({ name, email })
      loginCustomer(user)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-sm mx-auto">
      <Card>
        <h1 className="text-xl font-bold text-center">Sign in</h1>
        <p className="text-sm text-gray-500 text-center mt-1">Sign in to claim and use your points</p>

        <form onSubmit={handleLogin} className="mt-6 space-y-3">
          <Alert type="info">Demo mode: Google sign-in is simulated until the backend is connected.</Alert>
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Google email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Alert>{error}</Alert>
          <Button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2">
            <span className="bg-white text-indigo-600 rounded-full w-5 h-5 flex items-center justify-center font-bold text-xs">G</span>
            {loading ? 'Signing in…' : 'Continue with Google'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
