// ---------------------------------------------------------------------------
// MOCK API (temporary)
// ---------------------------------------------------------------------------
// This file pretends to be the backend so the frontend can be built and
// demoed before the Node.js + MySQL server exists. Every function returns a
// Promise, just like a real fetch() call would. When the backend is ready we
// replace the body of each function with a real API request; the pages that
// call these functions do not need to change.
//
// Data is kept in the browser's localStorage so it survives a page refresh.
// Use resetDemoData() (button on the admin dashboard) to start fresh.
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'loyalty_mock_db_v1'

// Fraud rules (the real backend will enforce the same rules)
const MAX_FAILED_ATTEMPTS = 5 // failed claim attempts allowed...
const FAILED_WINDOW_MINUTES = 10 // ...within this many minutes
const MAX_CLAIMS_PER_DAY = 10 // successful claims per customer per day

// Characters used in codes. 0/O and 1/I/L are left out so customers
// can't confuse them when typing a code by hand.
const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms))
const now = () => new Date().toISOString()
const newId = () => Math.random().toString(36).slice(2, 10)

class ApiError extends Error {
  constructor(code, message) {
    super(message)
    this.code = code
  }
}

// ---------- storage ---------------------------------------------------------

function seedData() {
  const t = now()
  return {
    products: [
      { id: 'p1', name: 'Steel Water Bottle 1L', sku: 'SWB-1000', points: 50, active: true },
      { id: 'p2', name: 'Non-stick Fry Pan 24cm', sku: 'NFP-2400', points: 120, active: true },
      { id: 'p3', name: 'Lunch Box Set', sku: 'LBS-0300', points: 80, active: true },
    ],
    batches: [
      { id: 'b1', productId: 'p1', quantity: 4, status: 'ACTIVE', createdAt: t },
      { id: 'b2', productId: 'p2', quantity: 1, status: 'GENERATED', createdAt: t },
    ],
    codes: [
      { code: 'DEMO-CODE-AAA2', batchId: 'b1', status: 'UNUSED', claimedBy: null, claimedAt: null },
      { code: 'DEMO-CODE-BBB3', batchId: 'b1', status: 'UNUSED', claimedBy: null, claimedAt: null },
      { code: 'DEMO-CODE-CCC4', batchId: 'b1', status: 'UNUSED', claimedBy: null, claimedAt: null },
      { code: 'DEMO-USED-XXX5', batchId: 'b1', status: 'CLAIMED', claimedBy: 'u0', claimedAt: t },
      { code: 'DEMO-INAC-TVE6', batchId: 'b2', status: 'UNUSED', claimedBy: null, claimedAt: null },
    ],
    users: [{ id: 'u0', name: 'Ravi Patel', email: 'ravi@example.com', createdAt: t }],
    transactions: [
      { id: 't0', userId: 'u0', type: 'EARN', points: 50, note: 'Steel Water Bottle 1L', createdAt: t },
    ],
    rewards: [
      { id: 'r1', name: '₹100 Discount Voucher', description: 'Use on your next purchase', pointsCost: 100, stock: 50, active: true },
      { id: 'r2', name: 'Free Lunch Box Set', description: 'Shipped to your address', pointsCost: 300, stock: 10, active: true },
      { id: 'r3', name: 'Branded Cap', description: 'Limited edition merchandise', pointsCost: 150, stock: 0, active: true },
    ],
    redemptions: [],
    claimAttempts: [
      { id: 'a0', userId: 'u0', code: 'DEMO-USED-XXX5', result: 'SUCCESS', createdAt: t },
    ],
  }
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* corrupted or unavailable storage: fall through to fresh seed */
  }
  const db = seedData()
  save(db)
  return db
}

function save(db) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
  } catch {
    /* storage unavailable: data lives only until refresh */
  }
}

export async function resetDemoData() {
  await delay()
  save(seedData())
}

// ---------- helpers ---------------------------------------------------------

export function normalizeCode(input) {
  const clean = (input || '').toUpperCase().replace(/[^A-Z0-9]/g, '')
  return clean.match(/.{1,4}/g)?.join('-') ?? ''
}

function randomCode() {
  const bytes = new Uint8Array(12)
  crypto.getRandomValues(bytes)
  const chars = Array.from(bytes, (b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join('')
  return chars.match(/.{4}/g).join('-')
}

function balanceOf(db, userId) {
  return db.transactions.filter((t) => t.userId === userId).reduce((sum, t) => sum + t.points, 0)
}

const minutesAgo = (iso) => (Date.now() - new Date(iso).getTime()) / 60000

// ---------- customer auth ---------------------------------------------------

// Mock of "Sign in with Google". The real version receives a Google ID token
// and the backend verifies it with Google before creating the account.
export async function customerGoogleLogin({ name, email }) {
  await delay()
  const db = load()
  const cleanEmail = email.trim().toLowerCase()
  let user = db.users.find((u) => u.email === cleanEmail)
  if (!user) {
    user = { id: newId(), name: name.trim() || cleanEmail, email: cleanEmail, createdAt: now() }
    db.users.push(user)
    save(db)
  }
  return user
}

// ---------- customer: claim -------------------------------------------------

export async function claimCode(userId, rawCode) {
  await delay(500)
  const db = load()
  const code = normalizeCode(rawCode)
  const attempts = db.claimAttempts.filter((a) => a.userId === userId)

  const record = (result) => {
    db.claimAttempts.push({ id: newId(), userId, code, result, createdAt: now() })
    save(db)
  }

  // Rule 1: too many failed attempts recently -> temporarily blocked
  const recentFails = attempts.filter(
    (a) => a.result !== 'SUCCESS' && minutesAgo(a.createdAt) < FAILED_WINDOW_MINUTES
  )
  if (recentFails.length >= MAX_FAILED_ATTEMPTS) {
    record('RATE_LIMITED')
    throw new ApiError('RATE_LIMITED', `Too many invalid attempts. Please try again in ${FAILED_WINDOW_MINUTES} minutes.`)
  }

  // Rule 2: daily claim limit
  const todayClaims = attempts.filter((a) => a.result === 'SUCCESS' && minutesAgo(a.createdAt) < 24 * 60)
  if (todayClaims.length >= MAX_CLAIMS_PER_DAY) {
    record('DAILY_LIMIT')
    throw new ApiError('DAILY_LIMIT', 'Daily claim limit reached. Please try again tomorrow.')
  }

  const found = db.codes.find((c) => c.code === code)
  if (!found) {
    record('INVALID')
    throw new ApiError('INVALID', 'This code is not valid. Please check and try again.')
  }

  const batch = db.batches.find((b) => b.id === found.batchId)
  if (batch.status !== 'ACTIVE' || found.status === 'VOID') {
    record('INACTIVE')
    throw new ApiError('INACTIVE', 'This code is not active. Please contact support.')
  }

  // Real backend: this check-and-update is ONE atomic SQL statement
  // (UPDATE codes SET status='CLAIMED' WHERE code_hash=? AND status='UNUSED')
  // so two people can never claim the same code at the same time.
  if (found.status === 'CLAIMED') {
    record('ALREADY_USED')
    throw new ApiError('ALREADY_USED', 'This code has already been used.')
  }

  const product = db.products.find((p) => p.id === batch.productId)
  found.status = 'CLAIMED'
  found.claimedBy = userId
  found.claimedAt = now()
  db.transactions.push({
    id: newId(),
    userId,
    type: 'EARN',
    points: product.points,
    note: product.name,
    createdAt: now(),
  })
  record('SUCCESS')
  return { points: product.points, productName: product.name, balance: balanceOf(db, userId) }
}

// ---------- customer: wallet & rewards --------------------------------------

export async function getWallet(userId) {
  await delay()
  const db = load()
  const transactions = db.transactions
    .filter((t) => t.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  return { balance: balanceOf(db, userId), transactions }
}

export async function getRewards() {
  await delay()
  return load().rewards.filter((r) => r.active)
}

export async function redeemReward(userId, rewardId) {
  await delay()
  const db = load()
  const reward = db.rewards.find((r) => r.id === rewardId && r.active)
  if (!reward) throw new ApiError('NOT_FOUND', 'Reward not found.')
  if (reward.stock <= 0) throw new ApiError('OUT_OF_STOCK', 'This reward is out of stock.')
  if (balanceOf(db, userId) < reward.pointsCost) throw new ApiError('INSUFFICIENT', 'Not enough points.')

  // Points are deducted immediately (held). If the owner rejects, they are refunded.
  reward.stock -= 1
  const redemption = {
    id: newId(),
    userId,
    rewardId,
    pointsCost: reward.pointsCost,
    status: 'PENDING',
    createdAt: now(),
  }
  db.redemptions.push(redemption)
  db.transactions.push({
    id: newId(),
    userId,
    type: 'REDEEM',
    points: -reward.pointsCost,
    note: reward.name,
    createdAt: now(),
  })
  save(db)
  return redemption
}

export async function getMyRedemptions(userId) {
  await delay()
  const db = load()
  return db.redemptions
    .filter((r) => r.userId === userId)
    .map((r) => ({ ...r, rewardName: db.rewards.find((w) => w.id === r.rewardId)?.name }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

// ---------- admin auth ------------------------------------------------------

export async function adminLogin(email, password) {
  await delay()
  // Mock credentials only. The real backend checks a bcrypt hash in MySQL.
  if (email.trim().toLowerCase() === 'admin@factory.com' && password === 'admin123') {
    return { email: 'admin@factory.com', name: 'Factory Owner' }
  }
  throw new ApiError('BAD_LOGIN', 'Invalid email or password.')
}

// ---------- admin: dashboard ------------------------------------------------

export async function getDashboard() {
  await delay()
  const db = load()
  const claimed = db.codes.filter((c) => c.status === 'CLAIMED').length
  const pointsIssued = db.transactions.filter((t) => t.type === 'EARN').reduce((s, t) => s + t.points, 0)
  const pointsRedeemed = -db.transactions
    .filter((t) => t.type === 'REDEEM' || t.type === 'REFUND')
    .reduce((s, t) => s + t.points, 0) || 0

  // Claims per day for the last 7 days
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    days.push({
      date: key,
      label: d.toLocaleDateString('en-IN', { weekday: 'short' }),
      count: db.claimAttempts.filter((a) => a.result === 'SUCCESS' && a.createdAt.slice(0, 10) === key).length,
    })
  }

  // Fraud alerts: customers with 3+ failed attempts in the last 24 hours
  const failsByUser = {}
  db.claimAttempts
    .filter((a) => a.result !== 'SUCCESS' && minutesAgo(a.createdAt) < 24 * 60)
    .forEach((a) => {
      failsByUser[a.userId] = (failsByUser[a.userId] || 0) + 1
    })
  const alerts = Object.entries(failsByUser)
    .filter(([, count]) => count >= 3)
    .map(([userId, count]) => {
      const u = db.users.find((x) => x.id === userId)
      return { userId, name: u?.name, email: u?.email, failedAttempts: count }
    })

  const recentAttempts = [...db.claimAttempts]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 10)
    .map((a) => ({ ...a, email: db.users.find((u) => u.id === a.userId)?.email }))

  return {
    totalCodes: db.codes.length,
    claimedCodes: claimed,
    customers: db.users.length,
    pointsIssued,
    pointsRedeemed,
    pendingRedemptions: db.redemptions.filter((r) => r.status === 'PENDING').length,
    claimsByDay: days,
    alerts,
    recentAttempts,
  }
}

// ---------- admin: products -------------------------------------------------

export async function getProducts() {
  await delay()
  return load().products
}

export async function saveProduct(product) {
  await delay()
  const db = load()
  if (!product.name?.trim() || !product.sku?.trim()) throw new ApiError('VALIDATION', 'Name and SKU are required.')
  if (!(product.points > 0)) throw new ApiError('VALIDATION', 'Points must be greater than 0.')
  const dup = db.products.find((p) => p.sku === product.sku.trim() && p.id !== product.id)
  if (dup) throw new ApiError('VALIDATION', 'A product with this SKU already exists.')

  if (product.id) {
    const p = db.products.find((x) => x.id === product.id)
    Object.assign(p, { name: product.name.trim(), sku: product.sku.trim(), points: Number(product.points), active: product.active })
  } else {
    db.products.push({ id: newId(), name: product.name.trim(), sku: product.sku.trim(), points: Number(product.points), active: true })
  }
  save(db)
}

// ---------- admin: batches --------------------------------------------------

export async function getBatches() {
  await delay()
  const db = load()
  return db.batches
    .map((b) => {
      const codes = db.codes.filter((c) => c.batchId === b.id)
      return {
        ...b,
        productName: db.products.find((p) => p.id === b.productId)?.name,
        claimed: codes.filter((c) => c.status === 'CLAIMED').length,
      }
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function createBatch(productId, quantity) {
  await delay(600)
  const db = load()
  const qty = Number(quantity)
  if (!db.products.find((p) => p.id === productId)) throw new ApiError('VALIDATION', 'Select a product.')
  if (!(qty >= 1 && qty <= 10000)) throw new ApiError('VALIDATION', 'Quantity must be between 1 and 10,000.')

  const batch = { id: newId(), productId, quantity: qty, status: 'GENERATED', createdAt: now() }
  const existing = new Set(db.codes.map((c) => c.code))
  for (let i = 0; i < qty; i++) {
    let code
    do code = randomCode()
    while (existing.has(code))
    existing.add(code)
    db.codes.push({ code, batchId: batch.id, status: 'UNUSED', claimedBy: null, claimedAt: null })
  }
  db.batches.push(batch)
  save(db)
  return batch
}

export async function setBatchStatus(batchId, status) {
  await delay()
  const db = load()
  const batch = db.batches.find((b) => b.id === batchId)
  if (!batch) throw new ApiError('NOT_FOUND', 'Batch not found.')
  batch.status = status
  if (status === 'VOIDED') {
    db.codes.filter((c) => c.batchId === batchId && c.status === 'UNUSED').forEach((c) => (c.status = 'VOID'))
  }
  save(db)
}

export async function getBatchCodes(batchId) {
  await delay()
  return load().codes.filter((c) => c.batchId === batchId)
}

// ---------- admin: rewards --------------------------------------------------

export async function getAllRewards() {
  await delay()
  return load().rewards
}

export async function saveReward(reward) {
  await delay()
  const db = load()
  if (!reward.name?.trim()) throw new ApiError('VALIDATION', 'Name is required.')
  if (!(reward.pointsCost > 0)) throw new ApiError('VALIDATION', 'Points cost must be greater than 0.')
  if (!(reward.stock >= 0)) throw new ApiError('VALIDATION', 'Stock cannot be negative.')
  const data = {
    name: reward.name.trim(),
    description: reward.description?.trim() || '',
    pointsCost: Number(reward.pointsCost),
    stock: Number(reward.stock),
    active: reward.active ?? true,
  }
  if (reward.id) Object.assign(db.rewards.find((r) => r.id === reward.id), data)
  else db.rewards.push({ id: newId(), ...data })
  save(db)
}

// ---------- admin: redemptions ----------------------------------------------

export async function getAllRedemptions() {
  await delay()
  const db = load()
  return db.redemptions
    .map((r) => ({
      ...r,
      rewardName: db.rewards.find((w) => w.id === r.rewardId)?.name,
      customer: db.users.find((u) => u.id === r.userId),
    }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function decideRedemption(redemptionId, decision) {
  await delay()
  const db = load()
  const r = db.redemptions.find((x) => x.id === redemptionId)
  if (!r) throw new ApiError('NOT_FOUND', 'Redemption not found.')
  if (r.status !== 'PENDING') throw new ApiError('ALREADY_DECIDED', 'This request was already processed.')
  r.status = decision
  r.decidedAt = now()
  if (decision === 'REJECTED') {
    // give the points and the stock back
    const reward = db.rewards.find((w) => w.id === r.rewardId)
    if (reward) reward.stock += 1
    db.transactions.push({
      id: newId(),
      userId: r.userId,
      type: 'REFUND',
      points: r.pointsCost,
      note: `Refund: ${reward?.name ?? 'reward'}`,
      createdAt: now(),
    })
  }
  save(db)
}
