import { AnimatePresence, motion } from 'framer-motion'
import { Slider } from './Slider'
import type { LeverState } from '../types/lever'
import { formatNumber } from '../utils/physics'

interface TryItProps {
  state: LeverState
  onChange: (patch: Partial<LeverState>) => void
  loadForce: number | null
}

export function TryItYourself({ state, onChange, loadForce }: TryItProps) {
  const twoTimes = loadForce !== null && state.force > 0 && loadForce / state.force >= 2
  const ratio = loadForce !== null && state.force > 0 ? loadForce / state.force : 0

  return (
    <section
      aria-label="Coba sendiri"
      className="rounded-2xl border border-lab-line bg-lab-surface p-5 shadow-sm sm:p-6"
    >
      <h2 className="mb-4 text-sm font-bold tracking-wide text-lab-muted uppercase">
        🔬 Coba sendiri
      </h2>

      <div className="rounded-xl border border-sky-100 bg-sky-50 p-4">
        <p className="text-sm font-semibold text-lab-ink">
          Bisakah kamu membuat gaya beban menjadi setidaknya 2× lebih besar dari gaya kuasa?
        </p>
        <p className="mt-2 text-xs text-lab-muted">
          Petunjuk: coba ubah panjang lengan kuasa.
        </p>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Slider
          label="Lengan kuasa (Lₖ)"
          value={state.powerArm}
          min={1}
          max={10}
          step={0.5}
          unit="m"
          accentClass="bg-blue-100 text-blue-700"
          onChange={(powerArm) => onChange({ powerArm })}
        />
        <p className="text-sm tabular-nums text-lab-muted sm:whitespace-nowrap">
          Rasio sekarang: {formatNumber(ratio, 2)}×
        </p>
      </div>

      <div className="mt-3 min-h-[64px]">
        <AnimatePresence mode="wait">
          {twoTimes ? (
            <motion.p
              key="yes"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-sm font-semibold text-emerald-700"
            >
              ✓ Berhasil! Lengan kuasa = {formatNumber(state.powerArm / (state.loadArm || 1), 2)}×
              lengan beban — itulah rasio gaya bebannya.
            </motion.p>
          ) : (
            <motion.p
              key="no"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm text-lab-muted"
            >
              Belum. Perpanjang lengan kuasa hingga lebih panjang dari lengan beban
              {state.loadArm > 1 ? ` (saat ini ${formatNumber(state.loadArm)} m)` : ''}.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
