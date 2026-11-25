import { Link } from 'react-router-dom'
import { brand } from '../config/brand'

// Brand mark: a closed box seen from above, with a points coin on the flap.
export function LogoMark({ className = 'w-8 h-8' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect x="2" y="2" width="28" height="28" rx="7" fill="#1d2b53" />
      <path d="M8 11h16v12a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V11Z" fill="#c8a27a" />
      <path d="M7 9h18v3H7z" fill="#e3c9a8" />
      <path d="M16 9v15" stroke="#8a6a47" strokeWidth="1.2" />
      <circle cx="21" cy="19" r="3.4" fill="#f2b705" stroke="#1d2b53" strokeWidth="1" />
    </svg>
  )
}

export default function Logo({ to = '/', light = false, suffix }) {
  return (
    <Link to={to} className="flex items-center gap-2.5 shrink-0">
      <LogoMark />
      <span className={`font-display text-lg font-bold tracking-tight ${light ? 'text-white' : 'text-ink'}`}>
        {brand.name}
        <span className={`font-medium ${light ? 'text-white/70' : 'text-kraft-dark'}`}> {suffix ?? 'Rewards'}</span>
      </span>
    </Link>
  )
}
