import { useCallback, useEffect, useState } from 'react'
import { getRewards, getWallet, redeemReward } from '../../api/mockApi'
import { useAuth } from '../../context/AuthContext'
import { Alert, Button, Card, Spinner } from '../../components/ui'

export default function Rewards() {
  const { customer } = useAuth()
  const [rewards, setRewards] = useState(null)
  const [balance, setBalance] = useState(0)
  const [message, setMessage] = useState({ type: '', text: '' })
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
    if (!window.confirm(`Redeem "${reward.name}" for ${reward.pointsCost} points?`)) return
    setBusyId(reward.id)
    setMessage({ type: '', text: '' })
    try {
      await redeemReward(customer.id, reward.id)
      setMessage({ type: 'success', text: `Request sent! The owner will review your "${reward.name}" request.` })
      await load()
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setBusyId(null)
    }
  }

  if (!rewards) return <Spinner />

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Rewards</h1>
        <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">{balance} points</span>
      </div>
      <Alert type={message.type}>{message.text}</Alert>

      <div className="grid gap-4 sm:grid-cols-2">
        {rewards.map((r) => {
          const outOfStock = r.stock <= 0
          const notEnough = balance < r.pointsCost
          return (
            <Card key={r.id} className="flex flex-col">
              <h3 className="font-semibold">{r.name}</h3>
              <p className="text-sm text-gray-500 mt-1 flex-1">{r.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="font-bold text-indigo-600">{r.pointsCost} pts</span>
                <Button disabled={outOfStock || notEnough || busyId === r.id} onClick={() => handleRedeem(r)}>
                  {outOfStock ? 'Out of stock' : notEnough ? `Need ${r.pointsCost - balance} more` : 'Redeem'}
                </Button>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
