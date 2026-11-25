import { Link } from 'react-router-dom'
import BoxFlap from '../../components/BoxFlap'
import Icon from '../../components/Icon'
import Logo from '../../components/Logo'
import { Container } from '../../components/ui'
import { brand } from '../../config/brand'

const YEAR = new Date().getFullYear()

const steps = [
  {
    icon: 'box',
    title: 'Open your box',
    text: 'Every product ships with its own code printed on the inside flap. You only see it once the box is open.',
  },
  {
    icon: 'scan',
    title: 'Scan and sign in',
    text: 'Point your phone camera at the QR code. The first time, sign in with Google. It takes a few seconds.',
  },
  {
    icon: 'gift',
    title: 'Spend your points',
    text: 'Pick a voucher or a free product from the catalog. We confirm your request and send it out.',
  },
]

const earn = [
  { name: 'Steel Water Bottle 1L', points: 50 },
  { name: 'Lunch Box Set', points: 80 },
  { name: 'Non-stick Fry Pan 24 cm', points: 120 },
]

const spend = [
  { name: '₹100 discount voucher', text: 'Use on your next purchase', points: 100 },
  { name: 'Branded cap', text: 'Limited edition', points: 150 },
  { name: 'Free lunch box set', text: 'Delivered to your address', points: 300 },
]

const safeguards = [
  {
    icon: 'box',
    title: 'Hidden inside the box',
    text: "Codes are printed on the inside flap, so nobody can scan them off a shop shelf.",
  },
  {
    icon: 'lock',
    title: 'Each code works once',
    text: 'The moment a code is claimed it belongs to that account. Copied or shared codes are rejected.',
  },
  {
    icon: 'shield',
    title: 'Real accounts only',
    text: 'Sign-in uses Google, so every wallet is tied to a verified email address.',
  },
  {
    icon: 'alert',
    title: 'Missing stock is switched off',
    text: 'If a carton goes missing before it is sold, its codes are cancelled in one click.',
  },
]

const faqs = [
  {
    q: 'Where do I find the code?',
    a: 'Open the box and look at the inside of the top flap. You will see a QR code with a 12-character code under it.',
  },
  {
    q: 'Do I need to install an app?',
    a: 'No. Scanning the QR code opens this website in your phone browser. You can also type the code on the Claim page.',
  },
  {
    q: 'The site says my code was already used.',
    a: `Each code can be claimed only once. If you just opened a sealed box, email ${brand.supportEmail} with a photo of the code and your bill, and we will look into it.`,
  },
  {
    q: 'How long does a reward take?',
    a: 'Requests are reviewed by our team, usually within 2 working days. You can follow the status in your wallet.',
  },
]

export default function Home() {
  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200/80">
        <div aria-hidden="true" className="hidden md:block absolute inset-y-0 right-0 w-[42%] bg-kraft-light" />
        <Container className="relative grid md:grid-cols-[1.05fr_1fr] gap-12 items-center py-14 md:py-24">
          <div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.6rem] font-extrabold leading-[1.04]">
              The code inside your {brand.name} box is worth points.
            </h1>
            <p className="mt-5 text-lg text-slate-600 max-w-lg leading-relaxed">
              Open the box, scan the code printed on the inside flap and sign in with Google. Points land in your wallet
              straight away, ready to spend on vouchers and free products.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/claim" className="inline-flex items-center gap-2 bg-ink text-white rounded-lg px-6 py-3 font-semibold hover:bg-ink-soft">
                <Icon name="scan" /> Claim a code
              </Link>
              <a href="#rewards" className="inline-flex items-center bg-white text-ink border border-slate-300 rounded-lg px-6 py-3 font-semibold hover:border-ink">
                See what points get you
              </a>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
              {['Free to join', 'No app to install', 'Works with any phone camera'].map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <Icon name="check" className="w-4 h-4 text-emerald-600" strokeWidth={2.5} /> {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative flex justify-center md:justify-end py-6">
            <BoxFlap />
            {/* what happens after scanning */}
            <div className="absolute -bottom-2 left-2 sm:left-10 md:-left-6 bg-white rounded-xl border border-slate-200 shadow-lg px-4 py-3 flex items-center gap-3 rotate-2">
              <span className="w-10 h-10 rounded-full bg-marigold flex items-center justify-center text-ink">
                <Icon name="coin" className="w-6 h-6" strokeWidth={2} />
              </span>
              <div>
                <p className="font-display font-bold text-ink leading-none">+120 points</p>
                <p className="text-xs text-slate-500 mt-1">Added to Priya's wallet</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ---------- How it works ---------- */}
      <section id="how" className="py-16 md:py-24 scroll-mt-16">
        <Container>
          <h2 className="text-3xl md:text-4xl font-bold max-w-xl">From sealed box to reward in three steps</h2>
          <ol className="mt-12 grid md:grid-cols-3 gap-10 md:gap-8 relative">
            <div aria-hidden="true" className="hidden md:block absolute top-6 left-12 right-[calc(33.33%+2rem)] border-t-2 border-dashed border-kraft" />
            {steps.map((s, i) => (
              <li key={s.title} className="relative">
                <div className="flex items-center gap-3">
                  <span className="relative w-12 h-12 rounded-full bg-ink text-white flex items-center justify-center font-display font-bold text-lg ring-8 ring-paper">
                    {i + 1}
                  </span>
                  <Icon name={s.icon} className="w-6 h-6 text-kraft-dark" />
                </div>
                <h3 className="mt-5 text-xl font-bold">{s.title}</h3>
                <p className="mt-2 text-slate-600 leading-relaxed max-w-xs">{s.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* ---------- Earn & spend ---------- */}
      <section id="rewards" className="py-16 md:py-24 bg-white border-y border-slate-200/80 scroll-mt-16">
        <Container>
          <h2 className="text-3xl md:text-4xl font-bold max-w-xl">What a box is worth</h2>
          <p className="mt-3 text-slate-600 max-w-xl">
            Bigger products earn more. Buy a fry pan and a lunch box, and you already have enough for a ₹100 voucher.
          </p>

          <div className="mt-10 grid lg:grid-cols-[0.9fr_1.1fr] gap-10">
            <div>
              <h3 className="text-lg font-bold">You earn</h3>
              <ul className="mt-4 divide-y divide-slate-200 border-y border-slate-200">
                {earn.map((p) => (
                  <li key={p.name} className="flex items-center justify-between py-4">
                    <span className="flex items-center gap-3 text-ink font-medium">
                      <Icon name="box" className="w-5 h-5 text-kraft-dark" /> {p.name}
                    </span>
                    <span className="font-display font-bold text-ink">+{p.points} pts</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold">You get</h3>
              <ul className="mt-4 space-y-3">
                {spend.map((r) => (
                  <li key={r.name} className="flex rounded-xl overflow-hidden border border-slate-200 bg-paper">
                    <div className="perforated-right bg-ink text-white w-28 shrink-0 flex flex-col items-center justify-center py-4">
                      <span className="font-display text-2xl font-extrabold leading-none">{r.points}</span>
                      <span className="text-xs text-white/70 mt-1">points</span>
                    </div>
                    <div className="px-5 py-4">
                      <p className="font-semibold text-ink">{r.name}</p>
                      <p className="text-sm text-slate-500">{r.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* ---------- Why codes can't be faked ---------- */}
      <section id="genuine" className="py-16 md:py-24 bg-ink text-white">
        <Container className="grid lg:grid-cols-[0.8fr_1.2fr] gap-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Points only for real purchases</h2>
            <p className="mt-4 text-white/75 leading-relaxed max-w-md">
              Rewards are only fair if every point comes from a box someone actually bought. These checks run on every
              scan.
            </p>
          </div>
          <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-10">
            {safeguards.map((s) => (
              <li key={s.title}>
                <span className="w-11 h-11 rounded-lg bg-white/10 text-marigold flex items-center justify-center">
                  <Icon name={s.icon} className="w-6 h-6" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-white">{s.title}</h3>
                <p className="mt-1.5 text-white/70 leading-relaxed">{s.text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ---------- FAQ ---------- */}
      <section id="faq" className="py-16 md:py-24">
        <Container className="max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold">Questions</h2>
          <div className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
            {faqs.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-ink text-lg">
                  {f.q}
                  <Icon name="chevron" className="w-5 h-5 shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-slate-600 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------- Final call to action ---------- */}
      <section className="kraft-surface">
        <Container className="py-14 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <h2 className="text-2xl md:text-3xl font-bold max-w-lg">Got a {brand.name} box at home? Your points are already inside.</h2>
          <Link to="/claim" className="self-start md:self-auto inline-flex items-center gap-2 bg-ink text-white rounded-lg px-6 py-3 font-semibold hover:bg-ink-soft">
            <Icon name="scan" /> Claim a code
          </Link>
        </Container>
      </section>

      <footer className="bg-white">
        <Container className="py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm text-slate-500">
          <Logo />
          <nav className="flex flex-wrap gap-5" aria-label="Footer">
            <a href="#how" className="hover:text-ink">How it works</a>
            <a href="#rewards" className="hover:text-ink">Rewards</a>
            <a href="#faq" className="hover:text-ink">Questions</a>
            <Link to="/admin/login" className="hover:text-ink">Owner login</Link>
          </nav>
          <p>© {YEAR} {brand.name} (demo brand)</p>
        </Container>
      </footer>
    </>
  )
}
