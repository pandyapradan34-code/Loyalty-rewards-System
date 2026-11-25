import { useEffect, useState } from 'react'
import { createBatch, getBatchCodes, getBatches, getProducts, setBatchStatus } from '../../api/mockApi'
import { Alert, Badge, Button, Card, Input, Spinner } from '../../components/ui'
import { formatDate } from '../../components/format'

// Code lifecycle:
//   GENERATED -> codes exist but can't be claimed yet (still at the printer / warehouse)
//   ACTIVE    -> boxes have shipped, codes can be claimed
//   VOIDED    -> batch leaked or damaged, all unused codes are cancelled
export default function Batches() {
  const [batches, setBatches] = useState(null)
  const [products, setProducts] = useState([])
  const [productId, setProductId] = useState('')
  const [quantity, setQuantity] = useState(100)
  const [error, setError] = useState('')
  const [creating, setCreating] = useState(false)

  const load = () => getBatches().then(setBatches)
  useEffect(() => {
    load()
    getProducts().then((p) => setProducts(p.filter((x) => x.active)))
  }, [])

  async function handleCreate(e) {
    e.preventDefault()
    setError('')
    setCreating(true)
    try {
      await createBatch(productId, quantity)
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setCreating(false)
    }
  }

  async function changeStatus(batch, status) {
    const msg =
      status === 'VOIDED'
        ? 'Void this batch? All UNUSED codes in it will stop working. This cannot be undone.'
        : 'Activate this batch? Customers will be able to claim these codes.'
    if (!window.confirm(msg)) return
    await setBatchStatus(batch.id, status)
    load()
  }

  // Downloads a CSV the packaging printer can use to print one QR per box.
  async function exportCsv(batch) {
    const codes = await getBatchCodes(batch.id)
    const origin = window.location.origin
    const rows = [['code', 'claim_url', 'status'], ...codes.map((c) => [c.code, `${origin}/claim?code=${c.code}`, c.status])]
    const csv = rows.map((r) => r.join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `batch-${batch.id}-${batch.productName?.replace(/\s+/g, '_')}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!batches) return <Spinner />

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Code Batches</h1>

      <Card>
        <h2 className="font-semibold mb-3">Generate new batch</h2>
        <form onSubmit={handleCreate} className="grid gap-3 md:grid-cols-3 items-end">
          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1">Product</span>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">Select product…</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name} ({p.points} pts)</option>
              ))}
            </select>
          </label>
          <Input label="Number of codes" type="number" min="1" max="10000" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          <Button type="submit" disabled={creating}>{creating ? 'Generating…' : 'Generate codes'}</Button>
        </form>
        <div className="mt-3"><Alert>{error}</Alert></div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-gray-500 border-b">
              <tr><th className="py-2">Created</th><th>Product</th><th>Codes</th><th>Claimed</th><th>Status</th><th></th></tr>
            </thead>
            <tbody className="divide-y">
              {batches.map((b) => (
                <tr key={b.id}>
                  <td className="py-2 whitespace-nowrap">{formatDate(b.createdAt)}</td>
                  <td>{b.productName}</td>
                  <td>{b.quantity}</td>
                  <td>{b.claimed}</td>
                  <td><Badge status={b.status} /></td>
                  <td className="text-right space-x-3 whitespace-nowrap">
                    <button className="text-indigo-600 hover:underline" onClick={() => exportCsv(b)}>Export CSV</button>
                    {b.status === 'GENERATED' && (
                      <button className="text-green-600 hover:underline" onClick={() => changeStatus(b, 'ACTIVE')}>Activate</button>
                    )}
                    {b.status !== 'VOIDED' && (
                      <button className="text-red-600 hover:underline" onClick={() => changeStatus(b, 'VOIDED')}>Void</button>
                    )}
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
