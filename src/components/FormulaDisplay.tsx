import { motion } from 'framer-motion'
import type { LeverState } from '../types/lever'
import { formatNumber } from '../utils/physics'

interface FormulaDisplayProps {
  state: LeverState
}

export function FormulaDisplay({ state }: FormulaDisplayProps) {
  const { force, powerArm, loadArm } = state
  const left = force * powerArm
  const right = loadArm > 0 ? left : 0

  return (
    <section
      aria-label="Rumus keseimbangan tuas"
      className="rounded-2xl border border-lab-line bg-lab-surface p-5 shadow-sm sm:p-6"
    >
      <h2 className="mb-4 text-sm font-bold tracking-wide text-lab-muted uppercase">
        Rumus keseimbangan
      </h2>

      <p className="text-center text-lg font-semibold text-lab-ink sm:text-xl">
        Fₖ × Lₖ = Fᵦ × Lᵦ
      </p>

      <motion.div
        key={`${force}-${powerArm}-${loadArm}`}
        initial={{ opacity: 0.55 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="mt-3 rounded-xl bg-slate-50 p-4 text-center"
      >
        <p className="text-base font-bold tabular-nums text-lab-ink sm:text-lg">
          {formatNumber(force)} N × {formatNumber(powerArm)} m ={' '}
          {formatNumber(right === 0 ? 0 : left / loadArm)} N × {formatNumber(loadArm)} m
        </p>
        <p className="mt-1 text-sm font-semibold tabular-nums text-lab-accent">
          {left.toFixed(0)} N·m = {right.toFixed(0)} N·m
        </p>
      </motion.div>

      <p className="mt-3 text-center text-xs text-lab-muted">
        Torsi kiri selalu sama dengan torsi kanan — tuas dalam keseimbangan.
      </p>
    </section>
  )
}
