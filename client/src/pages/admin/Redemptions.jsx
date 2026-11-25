import { useEffect, useState } from 'react'
import { decideRedemption, getAllRedemptions } from '../../api/mockApi'
import { AdminHeader, Alert, Badge, Button, Card, EmptyState, Spinner, Table, td, th } from '../../components/ui'
import { formatDate } from '../../components/format'

const FILTERS = [
  ['PENDING', 'Waiting'],
  ['APPROVED', 'Approved'],
  ['REJECTED', 'Rejected'],
  ['ALL', 'All'],
]

export default function Redemptions() {
  const [items, setItems] = useState(null)
  const [filter, setFilter] = useState('PENDING')
  const [error, setError] = useState('')

  const load = () => getAllRedemptions().then(setItems)
  useEffect(() => {
    load()
  }, [])

  async function decide(r, decision) {
    const msg =
      decision === 'APPROVED'
        ? `Approve ${r.rewardName} for ${r.customer?.name}?`
        : `Reject this request? ${r.pointsCost} points go back to ${r.customer?.name}.`
    if (!window.confirm(msg)) return
    setError('')
    try {
      await decideRedemption(r.id, decision)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  if (!items) return <Spinner label="Loading requests" />
  const count = (f) => (f === 'ALL' ? items.length : items.filter((r) => r.status === f).length)
  const shown = filter === 'ALL' ? items : items.filter((r) => r.status === filter)

  return (
    <>
      <AdminHeader title="Redemption requests" description="Approve rewards before they are sent. Rejected requests are refunded automatically." />

      <div className="flex flex-wrap gap-2 mb-4" role="tablist">
        {FILTERS.map(([key, label]) => (
          <button
            key={key}
            role="tab"
            aria-selected={filter === key}
            onClick={() => setFilter(key)}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
              filter === key ? 'bg-ink text-white border-ink' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
            }`}
          >
            {label} <span className={filter === key ? 'text-white/70' : 'text-slate-400'}>{count(key)}</span>
          </button>
        ))}
      </div>
      {error && <div className="mb-4"><Alert>{error}</Alert></div>}

      <Card>
        {shown.length === 0 ? (
          <EmptyState
            icon="inbox"
            title={filter === 'PENDING' ? 'Nothing waiting for approval' : 'No requests here'}
            text={filter === 'PENDING' ? 'New reward requests from customers will show up here.' : undefined}
          />
        ) : (
          <Table>
            <thead>
              <tr>
                <th className={th}>Requested</th>
                <th className={th}>Customer</th>
                <th className={th}>Reward</th>
                <th className={th}>Points</th>
                <th className={th}>Status</th>
                <th className={th}><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {shown.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className={`${td} whitespace-nowrap text-slate-500`}>{formatDate(r.createdAt)}</td>
                  <td className={td}>
                    <p className="font-medium text-ink">{r.customer?.name}</p>
                    <p className="text-xs text-slate-500">{r.customer?.email}</p>
                  </td>
                  <td className={td}>{r.rewardName}</td>
                  <td className={`${td} font-display font-bold text-ink`}>{r.pointsCost}</td>
                  <td className={td}><Badge status={r.status} /></td>
                  <td className={`${td} text-right whitespace-nowrap space-x-1`}>
                    {r.status === 'PENDING' && (
                      <>
                        <Button variant="success" size="sm" onClick={() => decide(r, 'APPROVED')}>Approve</Button>
                        <Button variant="ghost" size="sm" className="!text-red-600" onClick={() => decide(r, 'REJECTED')}>Reject</Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </>
  )
}
