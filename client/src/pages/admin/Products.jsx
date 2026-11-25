import { useEffect, useState } from 'react'
import { getProducts, saveProduct } from '../../api/mockApi'
import { Alert, Badge, Button, Card, Input, Spinner } from '../../components/ui'

const empty = { name: '', sku: '', points: '' }

export default function Products() {
  const [products, setProducts] = useState(null)
  const [form, setForm] = useState(empty)
  const [error, setError] = useState('')

  const load = () => getProducts().then(setProducts)
  useEffect(() => {
    load()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      await saveProduct({ ...form, points: Number(form.points) })
      setForm(empty)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  async function toggleActive(p) {
    await saveProduct({ ...p, active: !p.active })
    load()
  }

  if (!products) return <Spinner />

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Products</h1>

      <Card>
        <h2 className="font-semibold mb-3">{form.id ? 'Edit product' : 'Add product'}</h2>
        <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-4 items-end">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
          <Input label="Points per box" type="number" min="1" value={form.points} onChange={(e) => setForm({ ...form, points: e.target.value })} />
          <div className="flex gap-2">
            <Button type="submit">{form.id ? 'Save' : 'Add'}</Button>
            {form.id && <Button type="button" variant="secondary" onClick={() => setForm(empty)}>Cancel</Button>}
          </div>
        </form>
        <div className="mt-3"><Alert>{error}</Alert></div>
      </Card>

      <Card>
        <table className="w-full text-sm">
          <thead className="text-left text-gray-500 border-b">
            <tr><th className="py-2">Name</th><th>SKU</th><th>Points</th><th>Status</th><th></th></tr>
          </thead>
          <tbody className="divide-y">
            {products.map((p) => (
              <tr key={p.id}>
                <td className="py-2">{p.name}</td>
                <td className="font-mono">{p.sku}</td>
                <td>{p.points}</td>
                <td><Badge status={p.active ? 'ACTIVE' : 'INACTIVE'} /></td>
                <td className="text-right space-x-2 whitespace-nowrap">
                  <button className="text-indigo-600 hover:underline" onClick={() => setForm(p)}>Edit</button>
                  <button className="text-gray-600 hover:underline" onClick={() => toggleActive(p)}>
                    {p.active ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
