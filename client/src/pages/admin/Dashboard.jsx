import { useEffect, useState } from 'react'
import { getDashboard, resetDemoData } from '../../api/mockApi'
import { Badge, Button, Card, Spinner } from '../../components/ui'
import { formatDate } from '../../components/format'

function Stat({ label, value, sub }) {
  return (
    <Card>
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </Card>
  )
}

export default function Dashboard() {
  const [data, setData] = useState(null)

  useEffect(() => {
    getDashboard().then(setData)
  }, [])

  async function handleReset() {
    if (!window.confirm('Reset all demo data to the starting state?')) return
    await resetDemoData()
    setData(await getDashboard())
  }

  if (!data) return <Spinner />

  const claimRate = data.totalCodes ? Math.round((data.claimedCodes / data.totalCodes) * 100) : 0
  const maxDay = Math.max(1, ...data.claimsByDay.map((d) => d.count))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button variant="secondary" onClick={handleReset}>Reset demo data</Button>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Stat label="Codes claimed" value={`${data.claimedCodes} / ${data.totalCodes}`} sub={`${claimRate}% claim rate`} />
        <Stat label="Customers" value={data.customers} />
        <Stat label="Points issued" value={data.pointsIssued} sub={`${data.pointsRedeemed} redeemed`} />
        <Stat label="Pending requests" value={data.pendingRedemptions} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="font-semibold mb-4">Claims – last 7 days</h2>
          <div className="flex items-end gap-2 h-40">
            {data.claimsByDay.map((d) => (
              <div key={d.date} className="flex-1 flex flex-col items-center justify-end h-full">
                <span className="text-xs text-gray-500 mb-1">{d.count}</span>
                <div className="w-full bg-indigo-500 rounded-t" style={{ height: `${(d.count / maxDay) * 100}%`, minHeight: d.count ? 4 : 0 }} />
                <span className="text-xs text-gray-500 mt-1">{d.label}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="font-semibold mb-3">⚠️ Fraud alerts</h2>
          {data.alerts.length === 0 ? (
            <p className="text-sm text-gray-500">No suspicious activity in the last 24 hours.</p>
          ) : (
            <ul className="divide-y text-sm">
              {data.alerts.map((a) => (
                <li key={a.userId} className="py-2 flex justify-between">
                  <span>{a.name} <span className="text-gray-400">({a.email})</span></span>
                  <span className="text-red-600 font-semibold">{a.failedAttempts} failed attempts</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card>
        <h2 className="font-semibold mb-3">Recent claim attempts</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-gray-500 border-b">
              <tr><th className="py-2">Time</th><th>Customer</th><th>Code</th><th>Result</th></tr>
            </thead>
            <tbody className="divide-y">
              {data.recentAttempts.map((a) => (
                <tr key={a.id}>
                  <td className="py-2 whitespace-nowrap">{formatDate(a.createdAt)}</td>
                  <td>{a.email}</td>
                  <td className="font-mono">{a.code}</td>
                  <td><Badge status={a.result} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
