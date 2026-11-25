import { useEffect, useState } from 'react'
import { getProducts, saveProduct } from '../../api/mockApi'
import Icon from '../../components/Icon'
import { AdminHeader, Alert, Badge, Button, Card, Input, Spinner, Table, td, th } from '../../components/ui'

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

  if (!products) return <Spinner label="Loading products" />

  return (
    <>
      <AdminHeader title="Products" description="Set how many points each product's code is worth" />

      <Card>
        <h2 className="text-lg font-bold mb-4">{form.id ? `Edit ${form.name}` : 'Add a product'}</h2>
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-[2fr_1fr_1fr_auto] items-end">
          <Input label="Product name" placeholder="e.g. Pressure Cooker 3L" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="SKU" placeholder="PC-3000" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
          <Input label="Points per box" type="number" min="1" value={form.points} onChange={(e) => setForm({ ...form, points: e.target.value })} />
          <div className="flex gap-2">
            <Button type="submit">{form.id ? 'Save changes' : <><Icon name="plus" className="w-4 h-4" /> Add product</>}</Button>
            {form.id && <Button type="button" variant="ghost" onClick={() => setForm(empty)}>Cancel</Button>}
          </div>
        </form>
        {error && <div className="mt-4"><Alert>{error}</Alert></div>}
      </Card>

      <Card className="mt-6">
        <Table>
          <thead>
            <tr>
              <th className={th}>Product</th>
              <th className={th}>SKU</th>
              <th className={th}>Points</th>
              <th className={th}>Status</th>
              <th className={th}><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className={`${td} font-medium text-ink`}>{p.name}</td>
                <td className={`${td} font-mono text-xs`}>{p.sku}</td>
                <td className={`${td} font-display font-bold text-ink`}>{p.points}</td>
                <td className={td}><Badge status={p.active ? 'ACTIVE' : 'INACTIVE'} /></td>
                <td className={`${td} text-right whitespace-nowrap space-x-1`}>
                  <Button variant="ghost" size="sm" onClick={() => setForm(p)}>Edit</Button>
                  <Button variant="ghost" size="sm" onClick={() => toggleActive(p)}>{p.active ? 'Hide' : 'Show'}</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </>
  )
}
