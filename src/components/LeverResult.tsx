import { motion } from 'framer-motion'
import type { LeverResult } from '../types/lever'
import { formatNumber } from '../utils/physics'

interface LeverResultProps {
  result: LeverResult | null
}

export function LeverResult({ result }: LeverResultProps) {
  if (!result) {
    return (
      <section aria-label="Hasil" className="rounded-2xl border border-lab-line bg-lab-surface p-5 shadow-sm sm:p-6">
        <h2 className="mb-4 text-sm font-bold tracking-wide text-lab-muted uppercase">Hasil</h2>
        <p className="text-sm text-lab-muted">Parameter harus lebih besar dari nol.</p>
      </section>
    )
  }

  const { loadForce, mechanicalAdvantage } = result
  const kmText = formatNumber(mechanicalAdvantage, 2)

  const interpretation =
    mechanicalAdvantage > 1.001
      ? `Dengan konfigurasi ini, tuas memberikan keuntungan gaya sebesar ${kmText}× — gaya kuasa lebih kecil dari gaya bebannya.`
      : mechanicalAdvantage < 0.999
        ? 'Dengan konfigurasi ini, tuas tidak memberikan keuntungan gaya — gaya kuasa justru lebih besar dari gaya bebannya.'
        : 'Dengan konfigurasi ini, gaya kuasa sama besar dengan gaya beban.'

  return (
    <section
      aria-label="Hasil"
      className="rounded-2xl border border-lab-line bg-lab-surface p-5 shadow-sm sm:p-6"
    >
      <h2 className="mb-4 text-sm font-bold tracking-wide text-lab-muted uppercase">Hasil</h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        <motion.div
          key={loadForce.toFixed(2)}
          initial={{ scale: 0.97, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="rounded-xl border border-amber-200 bg-amber-50 p-4"
        >
          <p className="text-xs font-medium text-amber-700">Gaya beban yang mampu diangkat</p>
          <p className="mt-1 text-3xl font-extrabold tabular-nums text-amber-600 sm:text-4xl">
            {formatNumber(loadForce)}
            <span className="ml-1 text-lg font-bold text-amber-500">N</span>
          </p>
        </motion.div>

        <motion.div
          key={kmText}
          initial={{ scale: 0.97, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="rounded-xl border border-blue-200 bg-blue-50 p-4"
        >
          <p className="text-xs font-medium text-blue-700">Keuntungan mekanis (KM)</p>
          <p className="mt-1 text-3xl font-extrabold tabular-nums text-blue-600 sm:text-4xl">
            {kmText}
            <span className="ml-1 text-lg font-bold text-blue-500">×</span>
          </p>
        </motion.div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-lab-muted">{interpretation}</p>
    </section>
  )
}
