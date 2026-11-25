import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { customerGoogleLogin } from '../../api/mockApi'
import { useAuth } from '../../context/AuthContext'
import Icon from '../../components/Icon'
import { Alert, Card, Container, Input } from '../../components/ui'

function GoogleG() {
  return (
    <svg viewBox="0 0 48 48" className="w-5 h-5" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.6 5.4 2.6 13.3l7.8 6C12.3 13.6 17.7 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.5 5.8c4.4-4 6.8-10 6.8-17.2z" />
      <path fill="#FBBC05" d="M10.4 28.7c-.5-1.4-.8-3-.8-4.7s.3-3.2.8-4.7l-7.8-6C.9 16.6 0 20.2 0 24s.9 7.4 2.6 10.7l7.8-6z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.3 0-11.7-4.1-13.6-9.8l-7.8 6C6.6 42.6 14.6 48 24 48z" />
    </svg>
  )
}

// TEMPORARY: until the backend exists, "Sign in with Google" is simulated.
// Type any name + email to act as a Google account. Two different emails let you
// demo two customers (e.g. one trying to reuse the other's code).
export default function Login() {
  const { loginCustomer } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from
  const redirectTo = from ? from.pathname + from.search : '/wallet'
  const comingToClaim = from?.pathname === '/claim'

  const [name, setName] = useState('Priya Shah')
  const [email, setEmail] = useState('priya@example.com')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Enter a valid email address, for example name@gmail.com.')
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
    <Container className="py-10 md:py-16">
      <div className="grid md:grid-cols-2 gap-10 items-center max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">
            {comingToClaim ? 'Sign in to add these points to your wallet' : 'Sign in to your rewards wallet'}
          </h1>
          <ul className="mt-6 space-y-3 text-slate-600">
            {[
              'Your points are saved to your Google account',
              'Track every code you have claimed',
              'Redeem vouchers and free products',
            ].map((t) => (
              <li key={t} className="flex gap-2.5">
                <Icon name="check" className="w-5 h-5 text-emerald-600 shrink-0" strokeWidth={2.5} /> {t}
              </li>
            ))}
          </ul>
        </div>

        <Card className="p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleLogin} className="space-y-4">
            <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
            <Input label="Google email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
            <Alert>{error}</Alert>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white py-3 font-semibold text-ink hover:bg-slate-50 hover:border-slate-400 disabled:opacity-60"
            >
              <GoogleG />
              {loading ? 'Signing in…' : 'Continue with Google'}
            </button>
            <p className="text-xs text-slate-500 text-center">
              Demo mode: Google sign-in is simulated until the server is connected.
            </p>
          </form>
        </Card>
      </div>
    </Container>
  )
}
