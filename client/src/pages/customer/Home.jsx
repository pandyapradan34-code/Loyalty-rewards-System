import { Link } from 'react-router-dom'
import { Card } from '../../components/ui'

const steps = [
  { icon: '📦', title: 'Buy a product', text: 'Every box has a unique QR code printed inside the packaging.' },
  { icon: '📱', title: 'Scan the code', text: 'Scan it with your phone camera and sign in with Google.' },
  { icon: '🎁', title: 'Get rewards', text: 'Collect points and redeem them for vouchers and gifts.' },
]

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="text-center py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Get rewarded for every purchase</h1>
        <p className="mt-3 text-gray-600">Scan the QR code inside your box, collect points, and redeem exciting rewards.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/claim" className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-700">
            Claim a code
          </Link>
          <Link to="/rewards" className="bg-white border border-gray-300 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-50">
            See rewards
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {steps.map((s, i) => (
          <Card key={s.title} className="text-center">
            <div className="text-4xl">{s.icon}</div>
            <h3 className="mt-2 font-semibold">{i + 1}. {s.title}</h3>
            <p className="mt-1 text-sm text-gray-600">{s.text}</p>
          </Card>
        ))}
      </section>
    </div>
  )
}
