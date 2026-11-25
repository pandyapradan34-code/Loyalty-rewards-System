import { useCallback, useEffect, useState } from 'react'
import { getRewards, getWallet, redeemReward } from '../../api/mockApi'
import { useAuth } from '../../context/AuthContext'
import Icon from '../../components/Icon'
import { Alert, Button, EmptyState, Page, ProgressBar, Spinner } from '../../components/ui'
import { formatPoints } from '../../components/format'

export default function Rewards() {
  const { customer } = useAuth()
  const [rewards, setRewards] = useState(null)
  const [balance, setBalance] = useState(0)
  const [message, setMessage] = useState(null)
  const [busyId, setBusyId] = useState(null)

  const load = useCallback(async () => {
    const [r, w] = await Promise.all([getRewards(), getWallet(customer.id)])
    setRewards(r)
    setBalance(w.balance)
  }, [customer.id])

  useEffect(() => {
    load()
  }, [load])

  async function handleRedeem(reward) {
    if (!window.confirm(`Use ${reward.pointsCost} points for "${reward.name}"?`)) return
    setBusyId(reward.id)
    setMessage(null)
    try {
      await redeemReward(customer.id, reward.id)
      setMessage({ type: 'success', title: 'Request sent', text: `We'll review your ${reward.name} request and update its status in your wallet.` })
      window.dispatchEvent(new Event('points-changed'))
      await load()
    } catch (err) {
      setMessage({ type: 'error', title: 'Could not redeem', text: err.message })
    } finally {
      setBusyId(null)
    }
  }

  if (!rewards) return <Spinner label="Loading rewards" />

  return (
    <Page
      title="Rewards"
      description="Spend your points on vouchers and free products"
      actions={
        <span className="inline-flex items-center gap-2 rounded-full bg-marigold-soft px-4 py-2 font-semibold text-ink">
          <Icon name="coin" className="w-5 h-5" /> {formatPoints(balance)} points available
        </span>
      }
    >
      {message && <div className="mb-6"><Alert type={message.type} title={message.title}>{message.text}</Alert></div>}

      {rewards.length === 0 ? (
        <EmptyState icon="gift" title="No rewards right now" text="New rewards are added regularly. Keep collecting points." />
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {rewards.map((r) => {
            const outOfStock = r.stock <= 0
            const short = r.pointsCost - balance
            return (
              <li key={r.id} className={`flex rounded-xl overflow-hidden border border-slate-200 bg-white ${outOfStock ? 'opacity-60' : ''}`}>
                <div className="perforated-right bg-ink text-white w-28 sm:w-32 shrink-0 flex flex-col items-center justify-center py-6">
                  <span className="font-display text-3xl font-extrabold leading-none">{formatPoints(r.pointsCost)}</span>
                  <span className="text-xs text-white/70 mt-1">points</span>
                </div>
                <div className="flex-1 p-5 flex flex-col">
                  <h3 className="text-lg font-bold leading-snug">{r.name}</h3>
                  <p className="text-sm text-slate-500 mt-1 flex-1">{r.description}</p>
                  <div className="mt-4">
                    {outOfStock ? (
                      <p className="text-sm font-medium text-slate-500">Out of stock</p>
                    ) : short > 0 ? (
                      <>
                        <p className="text-sm text-slate-600 mb-2">{formatPoints(short)} more points needed</p>
                        <ProgressBar value={balance} max={r.pointsCost} />
                      </>
                    ) : (
                      <Button onClick={() => handleRedeem(r)} disabled={busyId === r.id}>
                        {busyId === r.id ? 'Sending request…' : 'Redeem'}
                      </Button>
                    )}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </Page>
  )
}
