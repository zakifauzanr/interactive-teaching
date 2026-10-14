import { AnimatePresence, motion } from 'framer-motion'
import { formatNumber } from '../utils/physics'

interface PendulumTryItSmpProps {
  count: number
  period: number | null
  frequency: number | null
  distinctTried: number
}

const NEED = 3

export function PendulumTryItSmp({
  count,
  period,
  frequency,
  distinctTried,
}: PendulumTryItSmpProps) {
  const passed = distinctTried >= NEED

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
          Ubah-ubah banyaknya getaran (n) — apakah T dan f ikut berubah?
        </p>
        <p className="mt-2 text-xs text-lab-muted">
          Coba minimal {NEED} nilai n yang berbeda, lalu bandingkan hasil T dan f-nya di kartu
          rumus.
        </p>
      </div>

      <div className="mt-4 flex items-center gap-1.5">
        {Array.from({ length: NEED }, (_, i) => (
          <span
            key={i}
            aria-hidden="true"
            className={`h-2 flex-1 rounded-full transition-colors ${
              i < distinctTried ? 'bg-emerald-500' : 'bg-slate-200'
            }`}
          />
        ))}
        <span className="ml-2 text-xs font-semibold tabular-nums text-lab-muted">
          {Math.min(distinctTried, NEED)}/{NEED} nilai n dicoba
        </span>
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
              🎉 Berhasil! N {count} getaran pun, T = {period !== null ? formatNumber(period, 2) : '–'} s
              dan f = {frequency !== null ? formatNumber(frequency, 2) : '–'} Hz — tidak
              bergantung pada banyaknya getaran yang dihitung.
            </motion.p>
          ) : (
            <motion.p
              key="no"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm text-lab-muted"
            >
              Baru {distinctTried} nilai n yang dicoba. Sekarang n = {count} dengan
              t ={' '}
              {period !== null ? formatNumber(count * period, 2) : '–'} s. Coba juga nilai n
              yang jauh berbeda, misalnya 5 lalu 20.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
