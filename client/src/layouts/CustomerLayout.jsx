import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function CustomerLayout() {
  const { customer, logoutCustomer } = useAuth()
  const navigate = useNavigate()

  const linkClass = ({ isActive }) =>
    isActive ? 'text-indigo-600 font-semibold' : 'text-gray-600 hover:text-indigo-600'

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <nav className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link to="/" className="text-lg font-bold text-indigo-600 whitespace-nowrap">🎁 Loyalty Rewards</Link>
          <div className="flex items-center gap-4 text-sm">
            <NavLink to="/claim" className={linkClass}>Claim</NavLink>
            <NavLink to="/wallet" className={linkClass}>Wallet</NavLink>
            <NavLink to="/rewards" className={linkClass}>Rewards</NavLink>
            {customer ? (
              <button
                onClick={() => {
                  logoutCustomer()
                  navigate('/')
                }}
                className="text-gray-600 hover:text-red-600"
              >
                Logout
              </button>
            ) : (
              <NavLink to="/login" className={linkClass}>Login</NavLink>
            )}
          </div>
        </nav>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
