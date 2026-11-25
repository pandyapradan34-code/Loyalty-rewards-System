import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { claimCode, normalizeCode } from '../../api/mockApi'
import { useAuth } from '../../context/AuthContext'
import { Alert, Button, Card, Input } from '../../components/ui'

// Opened when the customer scans the QR code: /claim?code=XXXX-XXXX-XXXX
// The code is pre-filled from the URL; customers can also type it manually.
export default function Claim() {
  const { customer } = useAuth()
  const [searchParams] = useSearchParams()
  const [code, setCode] = useState(searchParams.get('code') || '')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleClaim(e) {
    e.preventDefault()
    if (!code.trim()) return setError('Please enter a code.')
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await claimCode(customer.id, code)
      setResult(res)
      setCode('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (result) {
    return (
      <div className="max-w-md mx-auto">
        <Card className="text-center">
          <div className="text-5xl">🎉</div>
          <h1 className="mt-3 text-2xl font-bold">+{result.points} points!</h1>
          <p className="mt-1 text-gray-600">For your purchase of {result.productName}</p>
          <p className="mt-4 text-sm">New balance: <span className="font-bold">{result.balance} points</span></p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/rewards" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Browse rewards</Link>
            <Button variant="secondary" onClick={() => setResult(null)}>Claim another</Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <h1 className="text-xl font-bold">Claim your points</h1>
        <p className="text-sm text-gray-500 mt-1">Enter the code printed inside your product box.</p>
        <form onSubmit={handleClaim} className="mt-5 space-y-3">
          <Input
            label="Product code"
            placeholder="XXXX-XXXX-XXXX"
            value={code}
            onChange={(e) => setCode(normalizeCode(e.target.value))}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500"
            maxLength={14}
          />
          <Alert>{error}</Alert>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Checking…' : 'Claim points'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
