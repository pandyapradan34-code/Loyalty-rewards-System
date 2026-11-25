// Illustration of the inside of a box flap with the printed QR code.
// This is the "proof of purchase": the code is only visible after opening the box.

// Deterministic QR-like pattern (decorative only, not a scannable code)
function makeQrCells(seed, size) {
  let s = seed
  const rand = () => ((s = (s * 9301 + 49297) % 233280) / 233280)
  const inFinder = (x, y) =>
    (x < 8 && y < 8) || (x >= size - 8 && y < 8) || (x < 8 && y >= size - 8)
  const cells = []
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) if (!inFinder(x, y) && rand() > 0.52) cells.push([x, y])
  return cells
}
const QR_SIZE = 21
const QR_CELLS = makeQrCells(7, QR_SIZE)

function FakeQr() {
  const size = QR_SIZE
  const cells = QR_CELLS

  const finder = (x, y) => (
    <g key={`${x}-${y}`}>
      <rect x={x} y={y} width="7" height="7" fill="currentColor" />
      <rect x={x + 1} y={y + 1} width="5" height="5" fill="#fff" />
      <rect x={x + 2} y={y + 2} width="3" height="3" fill="currentColor" />
    </g>
  )

  return (
    <svg viewBox={`-1 -1 ${size + 2} ${size + 2}`} className="w-full h-full" shapeRendering="crispEdges" aria-hidden="true">
      <rect x="-1" y="-1" width={size + 2} height={size + 2} fill="#fff" />
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="currentColor" />
      ))}
      {finder(0, 0)}
      {finder(size - 7, 0)}
      {finder(0, size - 7)}
    </svg>
  )
}

export default function BoxFlap({ code = '7KQM-XR4P-2HVA', product = 'Non-stick Fry Pan 24 cm', points = 120, compact = false }) {
  return (
    <div className={`relative ${compact ? 'max-w-xs' : 'max-w-md'} w-full`}>
      {/* the flap */}
      <div className="kraft-surface relative rounded-md shadow-[0_30px_60px_-25px_rgba(29,43,83,0.55)] -rotate-2 p-6 sm:p-8 text-ink">
        {/* packing tape across the top */}
        <div className="absolute -top-3 left-8 right-16 h-7 bg-[#e9d4b2]/80 rotate-1 border-y border-[#d2b48c]" />

        <p className="font-display font-bold text-base sm:text-lg leading-tight">Thank you for choosing Tavaa</p>
        <p className="text-xs sm:text-sm mt-1 text-ink/80">Scan to add {points} points to your account</p>

        <div className={`mt-5 flex items-center gap-5 ${compact ? 'gap-4' : ''}`}>
          <div className={`${compact ? 'w-20 h-20' : 'w-28 h-28 sm:w-32 sm:h-32'} text-ink bg-white p-1.5 rounded-sm shrink-0`}>
            <FakeQr />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-ink/70">Or enter this code</p>
            <p className={`font-mono font-semibold ${compact ? 'text-sm' : 'text-base sm:text-lg'} tracking-wider`}>{code}</p>
            <p className="text-[11px] text-ink/70 mt-3">Valid once. {product}.</p>
          </div>
        </div>

        {/* fold line */}
        <div className="mt-6 border-t-2 border-dashed border-kraft-dark/50" />
        <p className="mt-2 text-[10px] text-kraft-dark text-right">Fold here</p>
      </div>
    </div>
  )
}
