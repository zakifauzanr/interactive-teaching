import { AnimatePresence, motion } from 'framer-motion'
import type { PendulumState } from '../types/pendulum'
import { PENDULUM_TARGET_PERIOD, PENDULUM_TOLERANCE } from '../types/pendulum'
import { formatNumber, isPendulumChallengePassed } from '../utils/physics'

interface PendulumChallengeProps {
  state: PendulumState
  period: number | null
  completed: boolean
}

export function PendulumChallenge({ state, period, completed }: PendulumChallengeProps) {
  const passed =
    period !== null &&
    isPendulumChallengePassed(period, PENDULUM_TARGET_PERIOD, PENDULUM_TOLERANCE)
  const achieved = passed || completed
  const diff = period !== null ? period - PENDULUM_TARGET_PERIOD : 0

  const idealLength = state.gravity * Math.pow(PENDULUM_TARGET_PERIOD / (2 * Math.PI), 2)

  return (
    <section
      aria-label="Tantangan bandul"
      className={`rounded-2xl border p-5 shadow-sm transition-colors sm:p-6 ${
        achieved ? 'border-emerald-300 bg-emerald-50/40' : 'border-lab-line bg-lab-surface'
      }`}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-bold tracking-wide text-lab-muted uppercase">🎯 Tantangan</h2>
        {completed && (
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
            ✓ pernah selesai
          </span>
        )}
      </div>

      <p className="mb-3 text-sm text-lab-ink">
        Buat bandul dengan periode tepat{' '}
        <span className="font-bold">2,00 detik</span> (toleransi ±0,05 s) — &ldquo;bandul
        detik&rdquo; yang dulu dipakai untuk mengukur waktu.
      </p>

      <div
        className={`flex items-center justify-center rounded-xl px-4 py-3 text-center ${
          passed ? 'bg-emerald-100' : 'bg-slate-50'
        }`}
      >
        <span className="text-sm text-lab-muted">Periode sekarang:&nbsp;</span>
        <span
          className={`text-xl font-extrabold tabular-nums ${
            passed ? 'text-emerald-700' : 'text-lab-ink'
          }`}
        >
          {period !== null ? formatNumber(period, 2) : '–'} s
        </span>
        <span className="ml-0.5 text-xs text-lab-muted tabular-nums">
          ({diff >= 0 ? '+' : ''}
          {diff.toFixed(2)} s dari target)
        </span>
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
                Kamu menemukan &ldquo;bandul detik&rdquo;: di Bumi, panjang talinya sekitar 1 m —
                itulah mengapa bandul 1 meter dipakai sebagai alat pengukur waktu klasik.
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
                {completed ? 'Tantangan selesai sebelumnya.' : 'Belum pas.'}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-lab-muted">
                {period !== null && period > PENDULUM_TARGET_PERIOD
                  ? 'Periode terlalu panjang — pendekkan talinya atau perbesar gravitasi.'
                  : 'Periode terlalu pendek — panjangkan talinya atau perkecil gravitasi.'}{' '}
                Sebagai petunjuk: dengan g sekarang, panjang idealnya sekitar{' '}
                <span className="font-semibold tabular-nums">
                  {formatNumber(idealLength, 2)} m
                </span>
                .
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
