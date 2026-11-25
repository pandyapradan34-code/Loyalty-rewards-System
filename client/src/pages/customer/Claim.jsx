import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { claimCode, normalizeCode } from '../../api/mockApi'
import { useAuth } from '../../context/AuthContext'
import BoxFlap from '../../components/BoxFlap'
import Icon from '../../components/Icon'
import { Alert, Button, Card, Container } from '../../components/ui'
import { formatPoints } from '../../components/format'
import { brand } from '../../config/brand'

// What to tell the customer for each kind of failure: what happened + what to do.
const errorHelp = {
  INVALID: ['We could not find this code', 'Check each character and try again. Codes never contain 0, O, 1 or I.'],
  ALREADY_USED: [
    'This code has already been claimed',
    `Each code works once. If you just opened a sealed box, email ${brand.supportEmail} with a photo of the code and your bill.`,
  ],
  INACTIVE: ['This code is not active', 'This batch has not been released for rewards yet. Contact support if you bought it from a shop.'],
  RATE_LIMITED: ['Too many wrong codes', 'For your security, claiming is paused for 10 minutes. Please try again later.'],
  DAILY_LIMIT: ['Daily limit reached', 'You can claim up to 10 codes a day. Please come back tomorrow.'],
}

// Opened when the customer scans the QR code: /claim?code=XXXX-XXXX-XXXX
export default function Claim() {
  const { customer } = useAuth()
  const [searchParams] = useSearchParams()
  const [code, setCode] = useState(normalizeCode(searchParams.get('code') || ''))
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleClaim(e) {
    e.preventDefault()
    if (code.replace(/-/g, '').length !== 12) {
      return setError(['Enter the full code', 'The code has 12 characters, like 7KQM-XR4P-2HVA.'])
    }
    setLoading(true)
    setError(null)
    try {
      const res = await claimCode(customer.id, code)
      setResult(res)
      setCode('')
      window.dispatchEvent(new Event('points-changed'))
    } catch (err) {
      setError(errorHelp[err.code] || ['Something went wrong', err.message])
    } finally {
      setLoading(false)
    }
  }

  if (result) {
    return (
      <Container className="py-12 md:py-16">
        <Card className="max-w-md mx-auto text-center p-8 sm:p-10">
          <div className="animate-coin-pop mx-auto w-20 h-20 rounded-full bg-marigold flex items-center justify-center text-ink ring-8 ring-marigold-soft">
            <Icon name="coin" className="w-11 h-11" strokeWidth={1.8} />
          </div>
          <h1 className="mt-6 text-4xl font-extrabold">+{result.points} points</h1>
          <p className="mt-2 text-slate-600">Added for your {result.productName}</p>
          <div className="mt-6 rounded-lg bg-paper border border-slate-200 py-3 text-sm">
            Wallet balance <span className="font-display font-bold text-ink text-base ml-1">{formatPoints(result.balance)} pts</span>
          </div>
          <div className="mt-6 grid sm:grid-cols-2 gap-3">
            <Link to="/rewards" className="inline-flex items-center justify-center gap-2 bg-ink text-white rounded-lg px-4 py-2.5 text-sm font-semibold hover:bg-ink-soft">
              <Icon name="gift" className="w-4 h-4" /> Browse rewards
            </Link>
            <Button variant="secondary" onClick={() => setResult(null)}>Claim another code</Button>
          </div>
        </Card>
      </Container>
    )
  }

  return (
    <Container className="py-10 md:py-14">
      <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-center">
        <div className="order-2 md:order-1">
          <h2 className="text-xl font-bold">Where to find your code</h2>
          <p className="mt-2 text-slate-600 max-w-sm">
            Open the box and look at the inside of the top flap. Scan the QR code, or type the 12 characters printed next to it.
          </p>
          <div className="mt-8 flex justify-center md:justify-start">
            <BoxFlap compact />
          </div>
        </div>

        <Card className="order-1 md:order-2 p-6 sm:p-8 shadow-sm">
          <h1 className="text-2xl md:text-3xl font-bold">Claim your points</h1>
          <p className="mt-1 text-slate-500">Signed in as {customer.email}</p>

          <form onSubmit={handleClaim} className="mt-6 space-y-4">
            <label className="block">
              <span className="block text-sm font-medium text-ink mb-1.5">Product code</span>
              <input
                value={code}
                onChange={(e) => setCode(normalizeCode(e.target.value))}
                placeholder="XXXX-XXXX-XXXX"
                maxLength={14}
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                className="w-full rounded-lg border-2 border-slate-300 bg-white px-4 py-4 text-center font-mono text-xl sm:text-2xl font-semibold tracking-[0.2em] text-ink placeholder:text-slate-300 focus:outline-none focus:border-ink"
              />
            </label>
            {error && <Alert title={error[0]}>{error[1]}</Alert>}
            <Button type="submit" size="lg" disabled={loading} className="w-full">
              {loading ? 'Checking code…' : 'Claim points'}
            </Button>
          </form>
        </Card>
      </div>
    </Container>
  )
}
