import { useEffect, useState } from 'react'
import { getAllRewards, saveReward } from '../../api/mockApi'
import { Alert, Badge, Button, Card, Input, Spinner } from '../../components/ui'

const empty = { name: '', description: '', pointsCost: '', stock: '' }

export default function AdminRewards() {
  const [rewards, setRewards] = useState(null)
  const [form, setForm] = useState(empty)
  const [error, setError] = useState('')

  const load = () => getAllRewards().then(setRewards)
  useEffect(() => {
    load()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      await saveReward({ ...form, pointsCost: Number(form.pointsCost), stock: Number(form.stock) })
      setForm(empty)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  async function toggleActive(r) {
    await saveReward({ ...r, active: !r.active })
    load()
  }

  if (!rewards) return <Spinner />

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Rewards Catalog</h1>

      <Card>
        <h2 className="font-semibold mb-3">{form.id ? 'Edit reward' : 'Add reward'}</h2>
        <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-5 items-end">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Input label="Points cost" type="number" min="1" value={form.pointsCost} onChange={(e) => setForm({ ...form, pointsCost: e.target.value })} />
          <Input label="Stock" type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
          <div className="flex gap-2">
            <Button type="submit">{form.id ? 'Save' : 'Add'}</Button>
            {form.id && <Button type="button" variant="secondary" onClick={() => setForm(empty)}>Cancel</Button>}
          </div>
        </form>
        <div className="mt-3"><Alert>{error}</Alert></div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-gray-500 border-b">
              <tr><th className="py-2">Name</th><th>Points</th><th>Stock</th><th>Status</th><th></th></tr>
            </thead>
            <tbody className="divide-y">
              {rewards.map((r) => (
                <tr key={r.id}>
                  <td className="py-2">
                    <p className="font-medium">{r.name}</p>
                    <p className="text-xs text-gray-500">{r.description}</p>
                  </td>
                  <td>{r.pointsCost}</td>
                  <td className={r.stock === 0 ? 'text-red-600 font-semibold' : ''}>{r.stock}</td>
                  <td><Badge status={r.active ? 'ACTIVE' : 'INACTIVE'} /></td>
                  <td className="text-right space-x-2 whitespace-nowrap">
                    <button className="text-indigo-600 hover:underline" onClick={() => setForm(r)}>Edit</button>
                    <button className="text-gray-600 hover:underline" onClick={() => toggleActive(r)}>
                      {r.active ? 'Hide' : 'Show'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
