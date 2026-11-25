import { Link } from 'react-router-dom'
import { LogoMark } from '../components/Logo'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
      <LogoMark className="w-12 h-12" />
      <h1 className="text-3xl font-bold">This page isn't in the box</h1>
      <p className="text-slate-500">The link may be wrong or the page has moved.</p>
      <Link to="/" className="bg-ink text-white rounded-lg px-5 py-2.5 text-sm font-semibold hover:bg-ink-soft">
        Go to home page
      </Link>
    </div>
  )
}
