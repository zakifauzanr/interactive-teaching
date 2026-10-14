import { AnimatePresence, motion } from 'framer-motion'
import type { PendulumState } from '../types/pendulum'
import { formatNumber } from '../utils/physics'

interface PendulumTryItProps {
  state: PendulumState
}

const BASE_G = 9.81

export function PendulumTryIt({ state }: PendulumTryItProps) {
  const speedup = Math.sqrt(state.gravity / BASE_G)
  const passed = speedup >= 1.5

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
          Bisakah kamu membuat bandul berayun minimal 1,5× lebih cepat daripada di Bumi — tanpa
          mengubah panjang talinya?
        </p>
        <p className="mt-2 text-xs text-lab-muted">
          Petunjuk: bandul tidak bisa digerakkan lebih cepat hanya dengan mendorongnya — coba
          ubah &ldquo;medannya&rdquo;.
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-lab-muted">
          Kecepatan relativ terhadap Bumi:{' '}
          <span className="font-bold tabular-nums text-lab-ink">
            {formatNumber(speedup, 2)}×
          </span>
        </span>
        <span className="text-xs text-lab-muted">target ≥ 1,50×</span>
      </div>

      <div className="mt-3 min-h-[64px]">
        <AnimatePresence mode="wait">
          {passed ? (
            <motion.p
              key="yes"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-sm font-semibold text-emerald-700"
            >
              🎉 Berhasil! Gravitasi {formatNumber(state.gravity, 2)} m/s² membuat bandul berayun{' '}
              {formatNumber(speedup, 2)}× lebih cepat.
            </motion.p>
          ) : (
            <motion.p
              key="no"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm text-lab-muted"
            >
              Belum. Coba naikkan gravitasi (g) — bandul di planet dengan gravitasi lebih kuat
              selalu berayun lebih cepat.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
