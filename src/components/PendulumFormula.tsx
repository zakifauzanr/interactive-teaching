import { motion } from 'framer-motion'
import type { FormulaLevel, PendulumResult, PendulumState } from '../types/pendulum'
import { formatNumber } from '../utils/physics'

interface PendulumFormulaProps {
  level: FormulaLevel
  state: PendulumState
  result: PendulumResult | null
  count: number
}

export function PendulumFormula({ level, state, result, count }: PendulumFormulaProps) {
  const period = result?.period ?? 0
  const frequency = result?.frequency ?? 0

  return (
    <section
      aria-label="Rumus periode dan frekuensi"
      className="rounded-2xl border border-lab-line bg-lab-surface p-5 shadow-sm sm:p-6"
    >
      <h2 className="mb-4 text-sm font-bold tracking-wide text-lab-muted uppercase">
        Rumus periode & frekuensi
      </h2>

      {level === 'smp' ? (
        <SmpFormula period={period} frequency={frequency} count={count} />
      ) : (
        <SmaFormula state={state} />
      )}
    </section>
  )
}

function DefinitionRow({
  term,
  meaning,
  formula,
}: {
  term: string
  meaning: string
  formula: string
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3.5 py-3">
      <div>
        <p className="text-sm font-bold text-lab-ink">{term}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-lab-muted">{meaning}</p>
      </div>
      <span className="shrink-0 rounded-lg border border-lab-line bg-white px-3 py-1.5 text-base font-bold text-lab-accent tabular-nums">
        {formula}
      </span>
    </div>
  )
}

function SmpFormula({
  period,
  frequency,
  count,
}: {
  period: number
  frequency: number
  count: number
}) {
  const t = count * period

  return (
    <div className="flex flex-col gap-3">
      <DefinitionRow
        term="Periode (T)"
        meaning="Waktu yang diperlukan untuk melakukan satu kali getaran penuh."
        formula="T = t / n"
      />
      <DefinitionRow
        term="Frekuensi (f)"
        meaning="Banyaknya getaran yang terjadi dalam satu detik."
        formula="f = n / t"
      />

      <div className="mt-1 border-t border-lab-line pt-3">
        <p className="mb-3 text-xs font-semibold text-lab-muted uppercase">
          Dari data pengukuranmu
        </p>

        <motion.div
          key={`${count}-${period.toFixed(3)}`}
          initial={{ opacity: 0.55 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="rounded-xl bg-slate-50 p-4"
        >
          <p className="text-center text-sm font-semibold tabular-nums text-lab-ink">
            n = <span className="font-extrabold">{count}</span> getaran · t ={' '}
            <span className="font-extrabold">{formatNumber(t, 2)} s</span>
          </p>

          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="rounded-lg border border-indigo-100 bg-white p-3 text-center">
              <p className="text-[11px] font-semibold text-indigo-600">Periode dari data</p>
              <p className="mt-1 text-sm font-bold tabular-nums text-lab-ink">
                T = t/n = {formatNumber(t, 2)}/{count}
              </p>
              <p className="mt-0.5 text-base font-extrabold tabular-nums text-indigo-600">
                = {formatNumber(period, 2)} s
              </p>
            </div>
            <div className="rounded-lg border border-emerald-100 bg-white p-3 text-center">
              <p className="text-[11px] font-semibold text-emerald-600">Frekuensi dari data</p>
              <p className="mt-1 text-sm font-bold tabular-nums text-lab-ink">
                f = n/t = {count}/{formatNumber(t, 2)}
              </p>
              <p className="mt-0.5 text-base font-extrabold tabular-nums text-emerald-600">
                = {formatNumber(frequency, 2)} Hz
              </p>
            </div>
          </div>
        </motion.div>

        <p className="mt-3 text-center text-xs text-lab-muted">
          Perhatikan: makin banyak getaran dihitung (n naik), makin lama waktunya (t naik) —
          tetapi T dan f tetap. Yang mengubah T dan f bukan n, melainkan mengganti bandulnya.
        </p>
      </div>
    </div>
  )
}

function SmaFormula({ state }: { state: PendulumState }) {
  const { length, gravity } = state
  const inner = Math.sqrt(length / gravity)
  const period = 2 * Math.PI * inner

  return (
    <div className="flex flex-col gap-3">
      <p className="text-center text-lg font-semibold text-lab-ink sm:text-xl">
        T = 2π √(L / g)
      </p>

      <motion.div
        key={`${length}-${gravity}`}
        initial={{ opacity: 0.55 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="rounded-xl bg-slate-50 p-4 text-center"
      >
        <p className="text-sm font-semibold tabular-nums text-lab-ink sm:text-base">
          T = 2π √({formatNumber(length, 1)} / {formatNumber(gravity, 2)})
        </p>
        <p className="mt-1 text-sm font-semibold tabular-nums text-lab-ink">
          T = 2π × {inner.toFixed(3)} s
        </p>
        <p className="mt-1 text-lg font-extrabold tabular-nums text-lab-accent">
          T = {period.toFixed(2)} s
        </p>
      </motion.div>

      <p className="text-center text-xs text-lab-muted">
        Aproksimasi sudut kecil (θ₀ &lt; ±15°) — berlaku sangat baik untuk ayunan kecil. Hubungan
        dengan rumus SMP: f = 1/T sehingga jawabannya selalu sama.
      </p>
    </div>
  )
}
