import { useEffect, useState } from 'react'
import { getMyRedemptions, getWallet } from '../../api/mockApi'
import { useAuth } from '../../context/AuthContext'
import { Badge, Card, Spinner } from '../../components/ui'
import { formatDate } from '../../components/format'

export default function Wallet() {
  const { customer } = useAuth()
  const [wallet, setWallet] = useState(null)
  const [redemptions, setRedemptions] = useState([])

  useEffect(() => {
    getWallet(customer.id).then(setWallet)
    getMyRedemptions(customer.id).then(setRedemptions)
  }, [customer.id])

  if (!wallet) return <Spinner />

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0">
        <p className="text-sm opacity-80">Hi {customer.name}, your balance</p>
        <p className="text-4xl font-bold mt-1">{wallet.balance} <span className="text-lg font-normal">points</span></p>
      </Card>

      <Card>
        <h2 className="font-semibold mb-3">Points history</h2>
        {wallet.transactions.length === 0 ? (
          <p className="text-sm text-gray-500">No transactions yet. Scan a product code to earn points!</p>
        ) : (
          <ul className="divide-y">
            {wallet.transactions.map((t) => (
              <li key={t.id} className="py-3 flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium">{t.note}</p>
                  <p className="text-gray-500 text-xs">{formatDate(t.createdAt)} · <Badge status={t.type} /></p>
                </div>
                <span className={`font-bold ${t.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {t.points > 0 ? '+' : ''}{t.points}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card>
        <h2 className="font-semibold mb-3">My reward requests</h2>
        {redemptions.length === 0 ? (
          <p className="text-sm text-gray-500">You haven't redeemed any rewards yet.</p>
        ) : (
          <ul className="divide-y">
            {redemptions.map((r) => (
              <li key={r.id} className="py-3 flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium">{r.rewardName}</p>
                  <p className="text-gray-500 text-xs">{formatDate(r.createdAt)} · {r.pointsCost} points</p>
                </div>
                <Badge status={r.status} />
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}
