// Small reusable UI pieces so every page looks consistent.

export function Card({ children, className = '' }) {
  return <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-5 ${className}`}>{children}</div>
}

export function Button({ children, variant = 'primary', className = '', ...props }) {
  const styles = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
    secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    success: 'bg-green-600 text-white hover:bg-green-700',
  }
  return (
    <button
      className={`px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function Input({ label, ...props }) {
  return (
    <label className="block">
      {label && <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>}
      <input
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        {...props}
      />
    </label>
  )
}

export function Alert({ type = 'error', children }) {
  if (!children) return null
  const styles = {
    error: 'bg-red-50 text-red-700 border-red-200',
    success: 'bg-green-50 text-green-700 border-green-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
  }
  return <div className={`border rounded-lg px-4 py-3 text-sm ${styles[type]}`}>{children}</div>
}

export function Badge({ status }) {
  const styles = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
    GENERATED: 'bg-gray-100 text-gray-700',
    ACTIVE: 'bg-green-100 text-green-800',
    VOIDED: 'bg-red-100 text-red-800',
    SUCCESS: 'bg-green-100 text-green-800',
    EARN: 'bg-green-100 text-green-800',
    REDEEM: 'bg-orange-100 text-orange-800',
    REFUND: 'bg-blue-100 text-blue-800',
  }
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${styles[status] || 'bg-red-100 text-red-800'}`}>
      {status}
    </span>
  )
}

export function Spinner() {
  return <div className="text-sm text-gray-500 py-6 text-center">Loading…</div>
}
