import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminLogin } from '../../api/mockApi'
import { useAuth } from '../../context/AuthContext'
import Icon from '../../components/Icon'
import Logo from '../../components/Logo'
import { Alert, Button, Input } from '../../components/ui'

const features = [
  ['layers', 'Generate and release code batches for packaging'],
  ['alert', 'Spot suspicious claim attempts as they happen'],
  ['inbox', 'Approve reward requests and manage stock'],
]

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
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between bg-ink text-white p-12">
        <Logo light suffix="Owner" />
        <div>
          <h1 className="text-4xl font-bold text-white leading-tight max-w-md">Every code, claim and reward in one place.</h1>
          <ul className="mt-8 space-y-4">
            {features.map(([icon, text]) => (
              <li key={text} className="flex items-center gap-3 text-white/80">
                <span className="w-9 h-9 rounded-lg bg-white/10 text-marigold flex items-center justify-center">
                  <Icon name={icon} className="w-5 h-5" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-sm text-white/50">Owner access only</p>
      </div>

      <div className="flex items-center justify-center p-6 bg-paper">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8"><Logo suffix="Owner" /></div>
          <h2 className="text-2xl font-bold">Sign in</h2>
          <p className="mt-1 text-slate-500">Use your owner account to manage rewards.</p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required />
            <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
            <Alert>{error}</Alert>
            <Button type="submit" size="lg" disabled={loading} className="w-full">{loading ? 'Signing in…' : 'Sign in'}</Button>
          </form>
          <p className="mt-6 text-xs text-slate-500 rounded-lg border border-dashed border-slate-300 p-3">
            Demo account: admin@factory.com / admin123
          </p>
        </div>
      </div>
    </div>
  )
}
