import { motion } from 'framer-motion'
import type { FormulaLevel, PendulumResult as PendulumCalc } from '../types/pendulum'
import { formatNumber } from '../utils/physics'

interface PendulumResultProps {
  result: PendulumCalc | null
  angleDeg: number
  level: FormulaLevel
}

export function PendulumResult({ result, angleDeg, level }: PendulumResultProps) {
  if (!result) {
    return (
      <section aria-label="Hasil" className="rounded-2xl border border-lab-line bg-lab-surface p-5 shadow-sm sm:p-6">
        <h2 className="mb-4 text-sm font-bold tracking-wide text-lab-muted uppercase">Hasil</h2>
        <p className="text-sm text-lab-muted">Panjang tali dan gravitasi harus lebih besar dari nol.</p>
      </section>
    )
  }

  const { period, frequency } = result

  const tempo =
    period > 4
      ? 'Bandul ini berayun sangat lambat.'
      : period < 1.2
        ? 'Bandul ini berayun sangat cepat.'
        : 'Bandul ini berayun dengan kecepatan sedang.'

  return (
    <section
      aria-label="Hasil"
      className="rounded-2xl border border-lab-line bg-lab-surface p-5 shadow-sm sm:p-6"
    >
      <h2 className="mb-4 text-sm font-bold tracking-wide text-lab-muted uppercase">Hasil</h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        <motion.div
          key={period.toFixed(3)}
          initial={{ scale: 0.97, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="rounded-xl border border-indigo-200 bg-indigo-50 p-4"
        >
          <p className="text-xs font-medium text-indigo-700">Periode (T)</p>
          <p className="mt-1 text-3xl font-extrabold tabular-nums text-indigo-600 sm:text-4xl">
            {formatNumber(period, 2)}
            <span className="ml-1 text-lg font-bold text-indigo-500">s</span>
          </p>
          <p className="mt-1 text-[11px] text-indigo-500/80">
            {level === 'smp' ? 'waktu satu getaran penuh' : 'waktu satu ayunan lengkap'}
          </p>
        </motion.div>

        <motion.div
          key={frequency.toFixed(3)}
          initial={{ scale: 0.97, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="rounded-xl border border-emerald-200 bg-emerald-50 p-4"
        >
          <p className="text-xs font-medium text-emerald-700">Frekuensi (f)</p>
          <p className="mt-1 text-3xl font-extrabold tabular-nums text-emerald-600 sm:text-4xl">
            {formatNumber(frequency, 2)}
            <span className="ml-1 text-lg font-bold text-emerald-500">Hz</span>
          </p>
          <p className="mt-1 text-[11px] text-emerald-600/80">
            {level === 'smp' ? 'banyak getaran per detik' : 'jumlah ayunan per detik'}
          </p>
        </motion.div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-lab-muted">
        {level === 'smp'
          ? `Dengan bandul ini, ${countHint(period, frequency)} — berapa pun banyaknya getaran yang dihitung, T dan f selalu tetap.`
          : `${tempo} Periode hanya ditentukan oleh panjang tali dan gravitasi — bukan oleh massa${
              angleDeg > 30
                ? ', dan karena sudut awalnya besar, periode sebenarnya sedikit lebih lama dari hasil rumus.'
                : '.'
            }`}
      </p>
    </section>
  )
}

function countHint(period: number, frequency: number): string {
  return `satu getaran penuh memerlukan waktu ${formatNumber(period, 2)} s, dan dalam satu detik terjadi ${formatNumber(frequency, 2)} getaran`
}
