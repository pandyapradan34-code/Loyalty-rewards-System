import { useEffect, useState } from 'react'
import { getAllRewards, saveReward } from '../../api/mockApi'
import Icon from '../../components/Icon'
import { AdminHeader, Alert, Badge, Button, Card, Input, Spinner, Table, td, th } from '../../components/ui'

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

  if (!rewards) return <Spinner label="Loading rewards" />

  return (
    <>
      <AdminHeader title="Rewards catalog" description="What customers can spend their points on" />

      <Card>
        <h2 className="text-lg font-bold mb-4">{form.id ? `Edit ${form.name}` : 'Add a reward'}</h2>
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2 lg:grid-cols-[1.4fr_1.6fr_1fr_1fr] items-end">
          <Input label="Reward name" placeholder="e.g. ₹250 voucher" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Short description" placeholder="Shown to customers" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Input label="Points cost" type="number" min="1" value={form.pointsCost} onChange={(e) => setForm({ ...form, pointsCost: e.target.value })} />
          <Input label="Stock" type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
          <div className="flex gap-2 md:col-span-2 lg:col-span-4">
            <Button type="submit">{form.id ? 'Save changes' : <><Icon name="plus" className="w-4 h-4" /> Add reward</>}</Button>
            {form.id && <Button type="button" variant="ghost" onClick={() => setForm(empty)}>Cancel</Button>}
          </div>
        </form>
        {error && <div className="mt-4"><Alert>{error}</Alert></div>}
      </Card>

      <Card className="mt-6">
        <Table>
          <thead>
            <tr>
              <th className={th}>Reward</th>
              <th className={th}>Points</th>
              <th className={th}>Stock</th>
              <th className={th}>Visible to customers</th>
              <th className={th}><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {rewards.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50">
                <td className={td}>
                  <p className="font-medium text-ink">{r.name}</p>
                  <p className="text-xs text-slate-500">{r.description}</p>
                </td>
                <td className={`${td} font-display font-bold text-ink`}>{r.pointsCost}</td>
                <td className={td}>
                  {r.stock === 0 ? <span className="text-red-600 font-semibold">Out of stock</span> : r.stock}
                </td>
                <td className={td}><Badge status={r.active ? 'ACTIVE' : 'INACTIVE'} /></td>
                <td className={`${td} text-right whitespace-nowrap space-x-1`}>
                  <Button variant="ghost" size="sm" onClick={() => setForm(r)}>Edit</Button>
                  <Button variant="ghost" size="sm" onClick={() => toggleActive(r)}>{r.active ? 'Hide' : 'Show'}</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </>
  )
}
