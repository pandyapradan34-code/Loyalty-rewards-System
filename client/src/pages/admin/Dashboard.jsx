import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getDashboard, resetDemoData } from '../../api/mockApi'
import Icon from '../../components/Icon'
import { AdminHeader, Badge, Button, Card, Spinner, Table, td, th } from '../../components/ui'
import { formatDate, formatPoints } from '../../components/format'

function Stat({ icon, label, value, sub, tone = 'bg-slate-100 text-ink' }) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <p className="text-sm text-slate-500">{label}</p>
        <span className={`w-9 h-9 rounded-lg flex items-center justify-center ${tone}`}>
          <Icon name={icon} className="w-5 h-5" />
        </span>
      </div>
      <p className="mt-2 font-display text-3xl font-bold text-ink">{value}</p>
      {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
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

  if (!data) return <Spinner label="Loading overview" />

  const claimRate = data.totalCodes ? Math.round((data.claimedCodes / data.totalCodes) * 100) : 0
  const maxDay = Math.max(1, ...data.claimsByDay.map((d) => d.count))
  const weekTotal = data.claimsByDay.reduce((s, d) => s + d.count, 0)

  return (
    <>
      <AdminHeader
        title="Overview"
        description="How your rewards program is performing"
        actions={
          <Button variant="secondary" size="sm" onClick={handleReset}>
            <Icon name="refresh" className="w-4 h-4" /> Reset demo data
          </Button>
        }
      />

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon="qr" label="Codes claimed" value={`${formatPoints(data.claimedCodes)} / ${formatPoints(data.totalCodes)}`} sub={`${claimRate}% of printed codes`} />
        <Stat icon="users" label="Customers" value={formatPoints(data.customers)} sub="Signed up with Google" />
        <Stat icon="coin" label="Points issued" value={formatPoints(data.pointsIssued)} sub={`${formatPoints(data.pointsRedeemed)} spent on rewards`} tone="bg-marigold-soft text-ink" />
        <Link to="/admin/redemptions" className="block rounded-xl focus-visible:outline-2">
          <Stat
            icon="inbox"
            label="Waiting for approval"
            value={data.pendingRedemptions}
            sub={data.pendingRedemptions ? 'Review requests' : 'All caught up'}
            tone={data.pendingRedemptions ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-ink'}
          />
        </Link>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-bold">Claims this week</h2>
            <span className="text-sm text-slate-500">{weekTotal} total</span>
          </div>
          <div className="mt-6 flex items-end gap-3 h-44">
            {data.claimsByDay.map((d, i) => {
              const isToday = i === data.claimsByDay.length - 1
              return (
                <div key={d.date} className="flex-1 h-full flex flex-col items-center justify-end">
                  <span className="text-xs font-medium text-slate-600 mb-1">{d.count || ''}</span>
                  <div
                    className={`w-full max-w-10 rounded-md ${isToday ? 'bg-marigold' : 'bg-ink'}`}
                    style={{ height: `${(d.count / maxDay) * 100}%`, minHeight: d.count ? 6 : 2, opacity: d.count ? 1 : 0.15 }}
                  />
                  <span className={`text-xs mt-2 ${isToday ? 'font-semibold text-ink' : 'text-slate-500'}`}>{isToday ? 'Today' : d.label}</span>
                </div>
              )
            })}
          </div>
        </Card>

        <Card className={data.alerts.length ? 'border-red-200 bg-red-50/40' : ''}>
          <div className="flex items-center gap-2">
            <Icon name={data.alerts.length ? 'alert' : 'shield'} className={`w-5 h-5 ${data.alerts.length ? 'text-red-600' : 'text-emerald-600'}`} />
            <h2 className="text-lg font-bold">Fraud alerts</h2>
          </div>
          {data.alerts.length === 0 ? (
            <p className="mt-3 text-sm text-slate-600">No suspicious activity in the last 24 hours.</p>
          ) : (
            <>
              <p className="mt-1 text-sm text-slate-600">Accounts with 3 or more failed attempts in 24 hours</p>
              <ul className="mt-3 divide-y divide-red-100">
                {data.alerts.map((a) => (
                  <li key={a.userId} className="py-2.5 flex items-center justify-between gap-3 text-sm">
                    <div className="min-w-0">
                      <p className="font-medium text-ink truncate">{a.name}</p>
                      <p className="text-xs text-slate-500 truncate">{a.email}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-red-100 text-red-700 px-2.5 py-0.5 text-xs font-semibold">
                      {a.failedAttempts} failed
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Card>
      </div>

      <Card className="mt-6">
        <h2 className="text-lg font-bold mb-4">Latest claim attempts</h2>
        <Table>
          <thead>
            <tr>
              <th className={th}>Time</th>
              <th className={th}>Customer</th>
              <th className={th}>Code</th>
              <th className={th}>Result</th>
            </tr>
          </thead>
          <tbody>
            {data.recentAttempts.map((a) => (
              <tr key={a.id} className="hover:bg-slate-50">
                <td className={`${td} whitespace-nowrap text-slate-500`}>{formatDate(a.createdAt)}</td>
                <td className={td}>{a.email}</td>
                <td className={`${td} font-mono text-xs`}>{a.code || '—'}</td>
                <td className={td}><Badge status={a.result} kind="attempt" /></td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </>
  )
}
