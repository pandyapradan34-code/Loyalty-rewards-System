export function formatDate(iso) {
  return new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
}

export function formatPoints(n) {
  return new Intl.NumberFormat('en-IN').format(n)
}
