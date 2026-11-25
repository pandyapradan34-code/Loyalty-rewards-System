import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/admin', label: '📊 Dashboard', end: true },
  { to: '/admin/products', label: '📦 Products' },
  { to: '/admin/batches', label: '🔢 Code Batches' },
  { to: '/admin/rewards', label: '🎁 Rewards' },
  { to: '/admin/redemptions', label: '✅ Redemptions' },
]

export default function AdminLayout() {
  const { admin, logoutAdmin } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      <aside className="md:w-56 bg-gray-900 text-gray-200 p-4 flex flex-col">
        <h1 className="text-lg font-bold text-white mb-6">Owner Panel</h1>
        <nav className="flex md:flex-col gap-1 overflow-x-auto">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `px-3 py-2 rounded whitespace-nowrap ${isActive ? 'bg-indigo-600 text-white' : 'hover:bg-gray-800'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto pt-6 text-xs text-gray-400 hidden md:block">
          <p>{admin?.email}</p>
          <button
            onClick={() => {
              logoutAdmin()
              navigate('/admin/login')
            }}
            className="mt-2 text-red-400 hover:text-red-300"
          >
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 p-4 md:p-6 overflow-x-auto">
        <Outlet />
      </main>
    </div>
  )
}
