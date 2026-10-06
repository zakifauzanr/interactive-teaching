import { AnimatePresence, motion } from 'framer-motion'
import type { ChallengeGoal, LeverState } from '../types/lever'
import { CHALLENGE_GOAL } from '../types/lever'
import { calculateFromState, formatNumber } from '../utils/physics'

interface ChallengeProps {
  state: LeverState
  completed: boolean
}

interface CheckItemProps {
  ok: boolean
  text: string
}

function CheckItem({ ok, text }: CheckItemProps) {
  return (
    <div
      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
        ok ? 'bg-emerald-50 font-semibold text-emerald-700' : 'bg-slate-50 text-lab-muted'
      }`}
    >
      <span
        aria-hidden="true"
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs ${
          ok ? 'bg-emerald-500 text-white' : 'border border-slate-300 bg-white text-slate-300'
        }`}
      >
        {ok ? '✓' : ''}
      </span>
      <span className="tabular-nums">{text}</span>
    </div>
  )
}

export function Challenge({ state, completed }: ChallengeProps) {
  const goal: ChallengeGoal = CHALLENGE_GOAL
  const result = calculateFromState(state)
  const loadForce = result?.loadForce ?? 0
  const km = result?.mechanicalAdvantage ?? 0

  const forceOK = state.force <= goal.maxForce
  const loadOK = loadForce >= goal.minLoadForce
  const passed = forceOK && loadOK
  const achieved = passed || completed

  return (
    <section
      aria-label="Tantangan"
      className={`rounded-2xl border p-5 shadow-sm transition-colors sm:p-6 ${
        achieved ? 'border-emerald-300 bg-emerald-50/40' : 'border-lab-line bg-lab-surface'
      }`}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-bold tracking-wide text-lab-muted uppercase">🎯 Tantangan</h2>
        <AnimatePresence>
          {completed && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700"
            >
              ✓ pernah selesai
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <p className="mb-3 text-sm text-lab-ink">
        Buat konfigurasi tuas dengan syarat berikut, hanya dengan mengatur slider di atas:
      </p>

      <div className="flex flex-col gap-2 sm:flex-row">
        <CheckItem
          ok={forceOK}
          text={`Gaya kuasa ≤ ${goal.maxForce} N (sekarang ${formatNumber(state.force)} N)`}
        />
        <CheckItem
          ok={loadOK}
          text={`Gaya beban ≥ ${goal.minLoadForce} N (sekarang ${formatNumber(loadForce)} N)`}
        />
      </div>

      <div className="mt-3 text-xs text-lab-muted">
        Keuntungan mekanis saat ini: KM = {formatNumber(km, 2)}×
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
                Kamu menemukan konfigurasi dengan keuntungan gaya minimal{' '}
                {formatNumber(goal.minLoadForce / goal.maxForce, 0)}× — gaya kecil, beban besar:
                itulah kekuatan tuas!
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
                {completed ? 'Tantangan selesai sebelumnya.' : 'Belum berhasil.'}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-lab-muted">
                {!forceOK
                  ? `Turunkan gaya kuasa menjadi ≤ ${goal.maxForce} N…`
                  : 'Syarat gaya kuasa sudah terpenuhi.'}{' '}
                {!loadOK
                  ? `…lalu naikkan gaya beban menjadi ≥ ${goal.minLoadForce} N dengan memperpanjang lengan kuasa atau memendekkan lengan beban.`
                  : 'Syarat gaya beban sudah terpenuhi.'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
