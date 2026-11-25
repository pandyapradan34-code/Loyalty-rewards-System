import { Routes, Route } from 'react-router-dom'
import CustomerLayout from './layouts/CustomerLayout'
import AdminLayout from './layouts/AdminLayout'
import { RequireCustomer, RequireAdmin } from './components/ProtectedRoute'

import Home from './pages/customer/Home'
import Claim from './pages/customer/Claim'
import Login from './pages/customer/Login'
import Wallet from './pages/customer/Wallet'
import Rewards from './pages/customer/Rewards'

import AdminLogin from './pages/admin/AdminLogin'
import Dashboard from './pages/admin/Dashboard'
import Products from './pages/admin/Products'
import Batches from './pages/admin/Batches'
import AdminRewards from './pages/admin/AdminRewards'
import Redemptions from './pages/admin/Redemptions'

import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      {/* Customer pages */}
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/claim" element={<RequireCustomer><Claim /></RequireCustomer>} />
        <Route path="/wallet" element={<RequireCustomer><Wallet /></RequireCustomer>} />
        <Route path="/rewards" element={<RequireCustomer><Rewards /></RequireCustomer>} />
      </Route>

      {/* Owner login (no sidebar) */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Owner pages */}
      <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="batches" element={<Batches />} />
        <Route path="rewards" element={<AdminRewards />} />
        <Route path="redemptions" element={<Redemptions />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
