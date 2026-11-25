import { useEffect, useState } from 'react'
import { createBatch, getBatchCodes, getBatches, getProducts, setBatchStatus } from '../../api/mockApi'
import Icon from '../../components/Icon'
import { AdminHeader, Alert, Badge, Button, Card, EmptyState, Input, Select, Spinner, Table, td, th } from '../../components/ui'
import { formatDate } from '../../components/format'

// Code lifecycle:
//   GENERATED -> printed on packaging, but can't be claimed yet (stock still in the factory)
//   ACTIVE    -> boxes have shipped, codes can be claimed
//   VOIDED    -> batch lost, stolen or leaked; all unused codes stop working
const lifecycle = [
  ['GENERATED', 'Codes are printed but cannot be claimed yet'],
  ['ACTIVE', 'Boxes have shipped and codes can be claimed'],
  ['VOIDED', 'Unused codes are cancelled (lost or leaked stock)'],
]

export default function Batches() {
  const [batches, setBatches] = useState(null)
  const [products, setProducts] = useState([])
  const [productId, setProductId] = useState('')
  const [quantity, setQuantity] = useState(100)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [creating, setCreating] = useState(false)

  const load = () => getBatches().then(setBatches)
  useEffect(() => {
    load()
    getProducts().then((p) => setProducts(p.filter((x) => x.active)))
  }, [])

  async function handleCreate(e) {
    e.preventDefault()
    setError('')
    setNotice('')
    setCreating(true)
    try {
      await createBatch(productId, quantity)
      setNotice(`Generated ${quantity} codes. Export the CSV for the printer, then activate the batch once the boxes ship.`)
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
        ? `Void this batch of ${batch.productName}? All unused codes in it stop working. This cannot be undone.`
        : `Activate this batch of ${batch.productName}? Customers will be able to claim these codes.`
    if (!window.confirm(msg)) return
    await setBatchStatus(batch.id, status)
    load()
  }

  // Downloads a CSV the packaging printer uses to print one QR code per box.
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

  if (!batches) return <Spinner label="Loading batches" />

  return (
    <>
      <AdminHeader title="Code batches" description="Create unique codes for each production run and control when they work" />

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card>
          <h2 className="text-lg font-bold mb-4">Generate a batch</h2>
          <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-[1.6fr_1fr] items-end">
            <Select label="Product" value={productId} onChange={(e) => setProductId(e.target.value)}>
              <option value="">Choose a product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name} ({p.points} pts)</option>
              ))}
            </Select>
            <Input label="Number of boxes" type="number" min="1" max="10000" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            <Button type="submit" disabled={creating} className="sm:col-span-2 justify-self-start">
              <Icon name="plus" className="w-4 h-4" /> {creating ? 'Generating codes…' : 'Generate codes'}
            </Button>
          </form>
          <div className="mt-4 space-y-3">
            <Alert>{error}</Alert>
            <Alert type="success">{notice}</Alert>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-bold">How batches work</h2>
          <ol className="mt-4 space-y-3">
            {lifecycle.map(([status, text]) => (
              <li key={status} className="flex items-start gap-3 text-sm">
                <Badge status={status} />
                <span className="text-slate-600">{text}</span>
              </li>
            ))}
          </ol>
        </Card>
      </div>

      <Card className="mt-6">
        {batches.length === 0 ? (
          <EmptyState icon="layers" title="No batches yet" text="Generate your first batch of codes above." />
        ) : (
          <Table>
            <thead>
              <tr>
                <th className={th}>Created</th>
                <th className={th}>Product</th>
                <th className={th}>Codes</th>
                <th className={th}>Claimed</th>
                <th className={th}>Status</th>
                <th className={th}><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {batches.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50">
                  <td className={`${td} whitespace-nowrap text-slate-500`}>{formatDate(b.createdAt)}</td>
                  <td className={`${td} font-medium text-ink`}>{b.productName}</td>
                  <td className={td}>{b.quantity}</td>
                  <td className={td}>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                        <div className="h-full bg-ink" style={{ width: `${(b.claimed / b.quantity) * 100}%` }} />
                      </div>
                      <span className="text-slate-600">{b.claimed}</span>
                    </div>
                  </td>
                  <td className={td}><Badge status={b.status} /></td>
                  <td className={`${td} text-right whitespace-nowrap space-x-1`}>
                    <Button variant="ghost" size="sm" onClick={() => exportCsv(b)} title="Download codes for printing">
                      <Icon name="download" className="w-4 h-4" /> CSV
                    </Button>
                    {b.status === 'GENERATED' && (
                      <Button variant="success" size="sm" onClick={() => changeStatus(b, 'ACTIVE')}>Activate</Button>
                    )}
                    {b.status !== 'VOIDED' && (
                      <Button variant="ghost" size="sm" className="!text-red-600" onClick={() => changeStatus(b, 'VOIDED')}>Void</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </>
  )
}
