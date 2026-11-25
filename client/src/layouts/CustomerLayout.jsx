import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { getWallet } from '../api/mockApi'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'
import Icon from '../components/Icon'
import { formatPoints } from '../components/format'

const nav = [
  { to: '/claim', label: 'Claim code', icon: 'scan' },
  { to: '/wallet', label: 'Wallet', icon: 'wallet' },
  { to: '/rewards', label: 'Rewards', icon: 'gift' },
]

export default function CustomerLayout() {
  const { customer, logoutCustomer } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [balance, setBalance] = useState(null)

  // Keep the points pill in the header up to date.
  // Pages fire a "points-changed" event after a claim or redemption.
  useEffect(() => {
    if (!customer) return
    let active = true
    const refresh = () => getWallet(customer.id).then((w) => active && setBalance(w.balance))
    refresh()
    window.addEventListener('points-changed', refresh)
    return () => {
      active = false
      window.removeEventListener('points-changed', refresh)
    }
  }, [customer, location.pathname])

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive ? 'text-ink bg-kraft-light' : 'text-slate-600 hover:text-ink'
    }`

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Logo />

          <nav className="hidden md:flex items-center gap-1" aria-label="Main">
            {nav.map((n) => (
              <NavLink key={n.to} to={n.to} className={linkClass}>{n.label}</NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {customer ? (
              <>
                <NavLink
                  to="/wallet"
                  className="flex items-center gap-1.5 rounded-full bg-marigold-soft text-ink pl-1.5 pr-3 py-1 text-sm font-semibold"
                  title="Your points"
                >
                  <span className="w-6 h-6 rounded-full bg-marigold flex items-center justify-center">
                    <Icon name="coin" className="w-4 h-4" strokeWidth={2} />
                  </span>
                  {balance === null ? '…' : formatPoints(balance)} pts
                </NavLink>
                <button
                  onClick={() => {
                    logoutCustomer()
                    navigate('/')
                  }}
                  className="w-9 h-9 rounded-full bg-ink text-white font-semibold text-sm flex items-center justify-center"
                  title={`Signed in as ${customer.email}. Click to sign out.`}
                  aria-label="Sign out"
                >
                  {customer.name?.[0]?.toUpperCase() || '?'}
                </button>
              </>
            ) : (
              <NavLink to="/login" className="bg-ink text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-ink-soft">
                Sign in
              </NavLink>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 pb-20 md:pb-0">
        <Outlet />
      </main>

      {/* Bottom tab bar on phones (customers mostly arrive by scanning with a phone) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-slate-200 grid grid-cols-3" aria-label="Main">
        {nav.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium ${isActive ? 'text-ink' : 'text-slate-500'}`
            }
          >
            <Icon name={n.icon} className="w-5 h-5" />
            {n.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
