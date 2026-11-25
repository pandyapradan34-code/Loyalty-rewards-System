// Shared UI building blocks so every screen looks consistent.
import Icon from './Icon'

export function Container({ children, className = '' }) {
  return <div className={`max-w-5xl mx-auto px-4 sm:px-6 ${className}`}>{children}</div>
}

// Page wrapper for customer screens
export function Page({ title, description, actions, children, narrow = false }) {
  return (
    <Container className={`py-8 md:py-10 ${narrow ? 'max-w-xl' : ''}`}>
      {(title || actions) && (
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
            {description && <p className="mt-1 text-slate-500">{description}</p>}
          </div>
          {actions}
        </div>
      )}
      {children}
    </Container>
  )
}

// Page header for owner screens
export function AdminHeader({ title, description, actions }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      </div>
      {actions}
    </div>
  )
}

export function Card({ children, className = '' }) {
  return <div className={`bg-white rounded-xl border border-slate-200/80 p-5 ${className}`}>{children}</div>
}

const buttonVariants = {
  primary: 'bg-ink text-white hover:bg-ink-soft',
  accent: 'bg-marigold text-ink hover:brightness-95',
  secondary: 'bg-white text-ink border border-slate-300 hover:border-ink',
  ghost: 'text-ink hover:bg-slate-100',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  success: 'bg-emerald-600 text-white hover:bg-emerald-700',
}
const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
}

export function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${buttonVariants[variant]} ${buttonSizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function Input({ label, hint, className = '', ...props }) {
  return (
    <label className="block">
      {label && <span className="block text-sm font-medium text-ink mb-1.5">{label}</span>}
      <input
        className={`w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-ink placeholder:text-slate-400 focus:outline-none focus:border-ink focus:ring-2 focus:ring-ink/15 ${className}`}
        {...props}
      />
      {hint && <span className="block text-xs text-slate-500 mt-1">{hint}</span>}
    </label>
  )
}

export function Select({ label, children, ...props }) {
  return (
    <label className="block">
      {label && <span className="block text-sm font-medium text-ink mb-1.5">{label}</span>}
      <select
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-ink focus:ring-2 focus:ring-ink/15"
        {...props}
      >
        {children}
      </select>
    </label>
  )
}

const alertStyles = {
  error: { box: 'bg-red-50 text-red-800 border-red-200', icon: 'alert' },
  success: { box: 'bg-emerald-50 text-emerald-800 border-emerald-200', icon: 'check' },
  info: { box: 'bg-slate-50 text-slate-700 border-slate-200', icon: 'info' },
}

export function Alert({ type = 'error', title, children }) {
  if (!children && !title) return null
  const s = alertStyles[type] || alertStyles.error
  return (
    <div role={type === 'error' ? 'alert' : 'status'} className={`flex gap-3 border rounded-lg px-4 py-3 text-sm ${s.box}`}>
      <Icon name={s.icon} className="w-5 h-5 shrink-0 mt-px" />
      <div>
        {title && <p className="font-semibold">{title}</p>}
        {children && <div>{children}</div>}
      </div>
    </div>
  )
}

// Status labels in plain words
const badgeMap = {
  PENDING: ['Pending', 'bg-amber-50 text-amber-800 ring-amber-200', 'bg-amber-500'],
  APPROVED: ['Approved', 'bg-emerald-50 text-emerald-800 ring-emerald-200', 'bg-emerald-500'],
  REJECTED: ['Rejected', 'bg-red-50 text-red-700 ring-red-200', 'bg-red-500'],
  GENERATED: ['Not active yet', 'bg-slate-100 text-slate-700 ring-slate-200', 'bg-slate-400'],
  ACTIVE: ['Active', 'bg-emerald-50 text-emerald-800 ring-emerald-200', 'bg-emerald-500'],
  INACTIVE: ['Hidden', 'bg-slate-100 text-slate-600 ring-slate-200', 'bg-slate-400'],
  VOIDED: ['Voided', 'bg-red-50 text-red-700 ring-red-200', 'bg-red-500'],
  SUCCESS: ['Claimed', 'bg-emerald-50 text-emerald-800 ring-emerald-200', 'bg-emerald-500'],
  INVALID: ['Invalid code', 'bg-red-50 text-red-700 ring-red-200', 'bg-red-500'],
  ALREADY_USED: ['Already used', 'bg-orange-50 text-orange-800 ring-orange-200', 'bg-orange-500'],
  INACTIVE_CODE: ['Inactive batch', 'bg-slate-100 text-slate-700 ring-slate-200', 'bg-slate-400'],
  RATE_LIMITED: ['Blocked', 'bg-red-100 text-red-800 ring-red-300', 'bg-red-600'],
  DAILY_LIMIT: ['Daily limit', 'bg-amber-50 text-amber-800 ring-amber-200', 'bg-amber-500'],
  EARN: ['Earned', 'bg-emerald-50 text-emerald-800 ring-emerald-200', 'bg-emerald-500'],
  REDEEM: ['Redeemed', 'bg-amber-50 text-amber-800 ring-amber-200', 'bg-amber-500'],
  REFUND: ['Refunded', 'bg-sky-50 text-sky-800 ring-sky-200', 'bg-sky-500'],
}

export function Badge({ status, kind }) {
  const key = kind === 'attempt' && status === 'INACTIVE' ? 'INACTIVE_CODE' : status
  const [label, style, dot] = badgeMap[key] || [status, 'bg-slate-100 text-slate-700 ring-slate-200', 'bg-slate-400']
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset whitespace-nowrap ${style}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  )
}

export function Spinner({ label = 'Loading' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-sm text-slate-500" role="status">
      <svg className="w-5 h-5 animate-spin text-ink" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.2" />
        <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
      {label}…
    </div>
  )
}

export function EmptyState({ icon = 'inbox', title, text, action }) {
  return (
    <div className="text-center py-10 px-4">
      <div className="mx-auto w-12 h-12 rounded-full bg-kraft-light text-kraft-dark flex items-center justify-center">
        <Icon name={icon} className="w-6 h-6" />
      </div>
      <p className="mt-3 font-semibold text-ink">{title}</p>
      {text && <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">{text}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

// Table helpers (owner screens)
export function Table({ children }) {
  return (
    <div className="overflow-x-auto -mx-5">
      <table className="w-full text-sm">{children}</table>
    </div>
  )
}
export const th = 'px-5 py-2.5 text-left text-xs font-semibold text-slate-500 bg-slate-50 border-y border-slate-200 whitespace-nowrap'
export const td = 'px-5 py-3 border-b border-slate-100 align-middle'

export function ProgressBar({ value, max }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  return (
    <div className="h-2 rounded-full bg-slate-200 overflow-hidden" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
      <div className="h-full bg-marigold rounded-full" style={{ width: `${pct}%` }} />
    </div>
  )
}
