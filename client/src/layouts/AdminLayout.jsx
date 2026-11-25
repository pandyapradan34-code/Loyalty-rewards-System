import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'
import Icon from '../components/Icon'

const links = [
  { to: '/admin', label: 'Overview', icon: 'chart', end: true },
  { to: '/admin/products', label: 'Products', icon: 'tag' },
  { to: '/admin/batches', label: 'Code batches', icon: 'layers' },
  { to: '/admin/rewards', label: 'Rewards', icon: 'gift' },
  { to: '/admin/redemptions', label: 'Redemptions', icon: 'inbox' },
]

export default function AdminLayout() {
  const { admin, logoutAdmin } = useAuth()
  const navigate = useNavigate()

  function logout() {
    logoutAdmin()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen md:flex bg-paper">
      <aside className="md:w-64 md:h-screen md:sticky md:top-0 bg-white border-b md:border-b-0 md:border-r border-slate-200 flex flex-col">
        <div className="h-16 px-5 flex items-center justify-between">
          <Logo to="/admin" suffix="Owner" />
          <button onClick={logout} className="md:hidden text-slate-500" aria-label="Sign out">
            <Icon name="logout" />
          </button>
        </div>

        <nav className="px-3 pb-3 md:py-2 flex md:flex-col gap-1 overflow-x-auto" aria-label="Owner">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive ? 'bg-ink text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-ink'
                }`
              }
            >
              <Icon name={l.icon} className="w-[18px] h-[18px]" />
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:block mt-auto p-4 border-t border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-kraft-light text-kraft-dark font-bold flex items-center justify-center">
              {admin?.name?.[0] || 'O'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-ink truncate">{admin?.name}</p>
              <p className="text-xs text-slate-500 truncate">{admin?.email}</p>
            </div>
            <button onClick={logout} className="text-slate-400 hover:text-red-600" title="Sign out" aria-label="Sign out">
              <Icon name="logout" className="w-[18px] h-[18px]" />
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
