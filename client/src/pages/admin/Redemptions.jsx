import { useEffect, useState } from 'react'
import { decideRedemption, getAllRedemptions } from '../../api/mockApi'
import { Alert, Badge, Card, Spinner } from '../../components/ui'
import { formatDate } from '../../components/format'

const FILTERS = ['PENDING', 'APPROVED', 'REJECTED', 'ALL']

export default function Redemptions() {
  const [items, setItems] = useState(null)
  const [filter, setFilter] = useState('PENDING')
  const [error, setError] = useState('')

  const load = () => getAllRedemptions().then(setItems)
  useEffect(() => {
    load()
  }, [])

  async function decide(r, decision) {
    const msg = decision === 'APPROVED' ? 'Approve this request?' : 'Reject this request? Points will be refunded to the customer.'
    if (!window.confirm(msg)) return
    setError('')
    try {
      await decideRedemption(r.id, decision)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  if (!items) return <Spinner />
  const shown = filter === 'ALL' ? items : items.filter((r) => r.status === filter)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Redemption Requests</h1>

      <div className="flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-full text-sm ${filter === f ? 'bg-indigo-600 text-white' : 'bg-white border'}`}
          >
            {f}
          </button>
        ))}
      </div>
      <Alert>{error}</Alert>

      <Card>
        {shown.length === 0 ? (
          <p className="text-sm text-gray-500">No requests here.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-gray-500 border-b">
                <tr><th className="py-2">Date</th><th>Customer</th><th>Reward</th><th>Points</th><th>Status</th><th></th></tr>
              </thead>
              <tbody className="divide-y">
                {shown.map((r) => (
                  <tr key={r.id}>
                    <td className="py-2 whitespace-nowrap">{formatDate(r.createdAt)}</td>
                    <td>{r.customer?.name}<br /><span className="text-xs text-gray-500">{r.customer?.email}</span></td>
                    <td>{r.rewardName}</td>
                    <td>{r.pointsCost}</td>
                    <td><Badge status={r.status} /></td>
                    <td className="text-right space-x-3 whitespace-nowrap">
                      {r.status === 'PENDING' && (
                        <>
                          <button className="text-green-600 hover:underline" onClick={() => decide(r, 'APPROVED')}>Approve</button>
                          <button className="text-red-600 hover:underline" onClick={() => decide(r, 'REJECTED')}>Reject</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
