import { AnimatePresence, motion } from 'framer-motion'
import type { FormulaLevel } from '../types/pendulum'
import { SMP_LENGTH_PRESETS, SMP_MIN_FREQUENCY } from '../types/pendulum'
import { formatNumber, isSmpChallengePassed } from '../utils/physics'

interface PendulumChallengeSmpProps {
  level: FormulaLevel
  frequency: number | null
  completed: boolean
  currentLength: number
}

export function PendulumChallengeSmp({
  level,
  frequency,
  completed,
  currentLength,
}: PendulumChallengeSmpProps) {
  if (level !== 'smp') return null

  const passed =
    frequency !== null && isSmpChallengePassed(frequency, SMP_MIN_FREQUENCY)
  const achieved = passed || completed
  const currentPreset = SMP_LENGTH_PRESETS.find((p) => p.value === currentLength)

  return (
    <section
      aria-label="Tantangan bandul"
      className={`rounded-2xl border p-5 shadow-sm transition-colors sm:p-6 ${
        achieved ? 'border-emerald-300 bg-emerald-50/40' : 'border-lab-line bg-lab-surface'
      }`}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-bold tracking-wide text-lab-muted uppercase">
          🎯 Tantangan
        </h2>
        {completed && (
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
            ✓ pernah selesai
          </span>
        )}
      </div>

      <p className="mb-3 text-sm text-lab-ink">
        Bandul yang bergetar paling lambat (Bandul C) hanya{' '}
        <span className="font-bold">0,35 getaran per detik</span>. Ganti bandulnya hingga
        frekuensinya mencapai minimal{' '}
        <span className="font-bold">{formatNumber(SMP_MIN_FREQUENCY, 2)} Hz</span>!
      </p>

      <div
        className={`flex flex-wrap items-center justify-center gap-x-2 rounded-xl px-4 py-3 text-center ${
          passed ? 'bg-emerald-100' : 'bg-slate-50'
        }`}
      >
        <span className="text-sm text-lab-muted">Frekuensi sekarang:&nbsp;</span>
        <span
          className={`text-xl font-extrabold tabular-nums ${
            passed ? 'text-emerald-700' : 'text-lab-ink'
          }`}
        >
          {frequency !== null ? formatNumber(frequency, 2) : '–'} Hz
        </span>
        {currentPreset && (
          <span className="text-xs text-lab-muted">({currentPreset.label})</span>
        )}
      </div>

      <div className="mt-3 min-h-[86px]">
        <AnimatePresence mode="wait">
          {passed ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl border border-emerald-200 bg-white p-4"
            >
              <p className="text-sm font-bold text-emerald-700">🎉 Berhasil!</p>
              <p className="mt-1 text-sm leading-relaxed text-emerald-700/90">
                Bandul A bergetar 2× lebih cepat daripada Bandul C — padahal talinya hanya
                seperempatnya. Bandul pendek = getaran rapat = frekuensi besar.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="try-again"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4"
            >
              <p className="text-sm font-bold text-slate-600">
                {completed ? 'Tantangan selesai sebelumnya.' : 'Belum cukup cepat.'}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-lab-muted">
                Bandul yang lebih pendek bergetar lebih rapat. Coba perhatikan frekuensinya di
                kartu Hasil setiap kali kamu mengganti bandul.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
