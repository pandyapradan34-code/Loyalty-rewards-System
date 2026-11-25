import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMyRedemptions, getRewards, getWallet } from '../../api/mockApi'
import { useAuth } from '../../context/AuthContext'
import Icon from '../../components/Icon'
import { Badge, Card, EmptyState, Page, ProgressBar, Spinner } from '../../components/ui'
import { formatDate, formatPoints } from '../../components/format'
import { brand } from '../../config/brand'

const txIcon = {
  EARN: ['box', 'bg-emerald-50 text-emerald-700'],
  REDEEM: ['gift', 'bg-amber-50 text-amber-700'],
  REFUND: ['undo', 'bg-sky-50 text-sky-700'],
}

export default function Wallet() {
  const { customer } = useAuth()
  const [data, setData] = useState(null)

  useEffect(() => {
    Promise.all([getWallet(customer.id), getMyRedemptions(customer.id), getRewards()]).then(
      ([wallet, redemptions, rewards]) => setData({ wallet, redemptions, rewards })
    )
  }, [customer.id])

  if (!data) return <Spinner label="Loading your wallet" />
  const { wallet, redemptions, rewards } = data

  // Cheapest in-stock reward the customer can't afford yet = next goal
  const next = rewards
    .filter((r) => r.stock > 0 && r.pointsCost > wallet.balance)
    .sort((a, b) => a.pointsCost - b.pointsCost)[0]

  return (
    <Page title={`Hi ${customer.name.split(' ')[0]}`} description="Your points and reward requests">
      <div className="grid lg:grid-cols-[1fr_1.2fr] gap-6 items-start">
        {/* Loyalty card */}
        <div className="space-y-6">
          <div className="perforated-right relative overflow-hidden rounded-2xl bg-ink text-white p-6 sm:p-7">
            <div aria-hidden="true" className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/5" />
            <div className="flex items-center justify-between">
              <span className="font-display font-bold">{brand.program}</span>
              <span className="w-9 h-9 rounded-full bg-marigold text-ink flex items-center justify-center">
                <Icon name="coin" className="w-5 h-5" strokeWidth={2} />
              </span>
            </div>
            <p className="mt-8 text-sm text-white/70">Points balance</p>
            <p className="font-display text-5xl font-extrabold leading-none mt-1">{formatPoints(wallet.balance)}</p>
            <p className="mt-6 text-sm text-white/70 truncate">{customer.email}</p>
          </div>

          <Card>
            {next ? (
              <>
                <p className="text-sm text-slate-600">
                  <span className="font-semibold text-ink">{formatPoints(next.pointsCost - wallet.balance)} more points</span> until {next.name}
                </p>
                <div className="mt-3"><ProgressBar value={wallet.balance} max={next.pointsCost} /></div>
              </>
            ) : (
              <p className="text-sm text-slate-600">You have enough points for any reward in stock.</p>
            )}
            <div className="mt-4 flex gap-3">
              <Link to="/claim" className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-ink text-white px-4 py-2.5 text-sm font-semibold hover:bg-ink-soft">
                <Icon name="scan" className="w-4 h-4" /> Claim a code
              </Link>
              <Link to="/rewards" className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-ink hover:border-ink">
                <Icon name="gift" className="w-4 h-4" /> Rewards
              </Link>
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-bold">Reward requests</h2>
            {redemptions.length === 0 ? (
              <p className="mt-2 text-sm text-slate-500">Requests you make from the rewards page appear here.</p>
            ) : (
              <ul className="mt-3 divide-y divide-slate-100">
                {redemptions.map((r) => (
                  <li key={r.id} className="py-3 flex items-center justify-between gap-3 text-sm">
                    <div className="min-w-0">
                      <p className="font-medium text-ink truncate">{r.rewardName}</p>
                      <p className="text-slate-500 text-xs">{formatDate(r.createdAt)} · {r.pointsCost} pts</p>
                    </div>
                    <Badge status={r.status} />
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        {/* History */}
        <Card>
          <h2 className="text-lg font-bold">Points history</h2>
          {wallet.transactions.length === 0 ? (
            <EmptyState
              icon="box"
              title="No points yet"
              text="Open a box, scan the code on the inside flap and your first points will show up here."
              action={<Link to="/claim" className="text-ink font-semibold underline underline-offset-4">Claim your first code</Link>}
            />
          ) : (
            <ul className="mt-3 divide-y divide-slate-100">
              {wallet.transactions.map((t) => {
                const [icon, tone] = txIcon[t.type] || txIcon.EARN
                return (
                  <li key={t.id} className="py-3.5 flex items-center gap-3">
                    <span className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${tone}`}>
                      <Icon name={icon} className="w-5 h-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-ink truncate">{t.note}</p>
                      <p className="text-xs text-slate-500">{formatDate(t.createdAt)}</p>
                    </div>
                    <span className={`font-display font-bold ${t.points > 0 ? 'text-emerald-700' : 'text-slate-700'}`}>
                      {t.points > 0 ? '+' : '−'}{formatPoints(Math.abs(t.points))}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </Card>
      </div>
    </Page>
  )
}
