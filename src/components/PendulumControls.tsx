import { motion } from 'framer-motion'
import { Slider } from './Slider'
import { G_PRESETS, SMP_LENGTH_PRESETS } from '../types/pendulum'
import type { FormulaLevel, PendulumState } from '../types/pendulum'
import { formatNumber } from '../utils/physics'

interface PendulumControlsProps {
  level: FormulaLevel
  state: PendulumState
  onChange: (patch: Partial<PendulumState>) => void
  smpLength: number
  onSmpLength: (length: number) => void
  count: number
  onCount: (n: number) => void
  period: number
}

const MAX_LENGTH = 10

/** Balikkan rumusnya: minta periode T → dapatkan panjang tali yang pas. */
const solvedLength = (period: number, gravity: number): { length: number } => {
  const raw = gravity * Math.pow(period / (2 * Math.PI), 2)
  return { length: Number(Math.min(MAX_LENGTH, Math.max(0.5, raw)).toFixed(2)) }
}

export function PendulumControls({
  level,
  state,
  onChange,
  smpLength,
  onSmpLength,
  count,
  onCount,
  period,
}: PendulumControlsProps) {
  if (level === 'smp') {
    const t = count * period
    return (
      <motion.section
        key="smp-controls"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        aria-label="Lakukan pengukuran"
        className="rounded-2xl border border-lab-line bg-lab-surface p-5 shadow-sm sm:p-6"
      >
        <h2 className="mb-1 text-sm font-bold tracking-wide text-lab-muted uppercase">
          Lakukan pengukuran
        </h2>
        <p className="mb-5 text-xs text-lab-muted">
          Pilih bandulnya, tentukan banyaknya getaran yang dihitung, lalu catat waktunya.
        </p>

        <div className="mb-5">
          <p className="mb-1.5 text-sm font-medium text-lab-ink">Ganti bandul</p>
          <div className="flex flex-wrap gap-1.5">
            {SMP_LENGTH_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => onSmpLength(preset.value)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  smpLength === preset.value
                    ? 'border-blue-300 bg-blue-50 text-blue-700'
                    : 'border-slate-200 bg-white text-lab-muted hover:bg-slate-50'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
          <p className="mt-1.5 text-[11px] text-slate-400">
            Amati: bandul manakah yang bergetar paling rapat?
          </p>
        </div>

        <div className="mb-5">
          <Slider
            label="Setel waktu periode yang diinginkan (T)"
            value={period}
            min={0.5}
            max={7}
            step={0.05}
            unit="s"
            accentClass="bg-indigo-100 text-indigo-700"
            onChange={(t) => onSmpLength(solvedLength(t, state.gravity).length)}
          />
          <p className="mt-1.5 text-[11px] leading-relaxed text-slate-400">
            Bandulnya menyesuaikan panjangnya sendiri agar waktunya pas. Bisa diubah-ubah
            kapan saja.
          </p>
        </div>

        <Slider
          label="Banyak getaran yang dihitung (n)"
          value={count}
          min={1}
          max={20}
          step={1}
          unit="getaran"
          accentClass="bg-violet-100 text-violet-700"
          onChange={onCount}
        />

        <motion.div
          key={t.toFixed(3)}
          initial={{ scale: 0.97, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="mt-5 flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-900 p-4"
        >
          <span aria-hidden="true" className="text-2xl">
            ⏱️
          </span>
          <div>
            <p className="text-xs font-medium text-slate-400">
              Waktu stopwatch untuk {count} getaran penuh
            </p>
            <p className="mt-0.5 text-3xl font-extrabold tabular-nums text-white">
              t = {formatNumber(t, 2)}
              <span className="ml-1 text-lg font-bold text-slate-400">s</span>
            </p>
          </div>
        </motion.div>

        <p className="mt-4 text-xs leading-relaxed text-lab-muted">
          Isi tabel datamu dengan angka ini: n = {count} getaran, t = {formatNumber(t, 2)} s —
          lalu hitung T = t/n dan f = n/t di kartu rumus.
        </p>
      </motion.section>
    )
  }

  const activePreset = G_PRESETS.find((p) => Math.abs(p.value - state.gravity) < 0.005)

  return (
    <motion.section
      key="sma-controls"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      aria-label="Atur percobaan bandul"
      className="rounded-2xl border border-lab-line bg-lab-surface p-5 shadow-sm sm:p-6"
    >
      <h2 className="mb-1 text-sm font-bold tracking-wide text-lab-muted uppercase">
        Atur percobaan
      </h2>
      <p className="mb-5 text-xs text-lab-muted">Geser slider untuk mengubah simulasi.</p>

      <div className="flex flex-col gap-5">
        <Slider
          label="Panjang tali (L)"
          value={state.length}
          min={0.5}
          max={10}
          step={0.1}
          unit="m"
          accentClass="bg-blue-100 text-blue-700"
          onChange={(length) => onChange({ length })}
        />

        <div>
          <Slider
            label="Setel waktu periode yang diinginkan (T)"
            value={period}
            min={0.5}
            max={7}
            step={0.05}
            unit="s"
            accentClass="bg-indigo-100 text-indigo-700"
            onChange={(t) => onChange(solvedLength(t, state.gravity))}
          />
          <p className="mt-1.5 text-[11px] leading-relaxed text-slate-400">
            Slider ini otomatis menyetel panjang talinya: L = g·(T/2π)². Bisa diubah-ubah kapan
            saja. Jika nilai tak tercapai, geser juga gravitasinya.
          </p>
        </div>

        <div>
          <Slider
            label="Gravitasi (g)"
            value={state.gravity}
            min={1.6}
            max={24.8}
            step={0.01}
            unit="m/s²"
            accentClass="bg-emerald-100 text-emerald-700"
            onChange={(gravity) => onChange({ gravity })}
          />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {G_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => onChange({ gravity: preset.value })}
                className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                  activePreset?.label === preset.label
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                    : 'border-slate-200 bg-white text-lab-muted hover:bg-slate-50'
                }`}
              >
                {preset.label} · {formatNumber(preset.value, 2)}
              </button>
            ))}
          </div>
        </div>

        <Slider
          label="Sudut awal (θ₀)"
          value={state.angleDeg}
          min={5}
          max={60}
          step={5}
          unit="°"
          accentClass="bg-amber-100 text-amber-700"
          onChange={(angleDeg) => onChange({ angleDeg })}
        />

        <Slider
          label="Massa beban (m)"
          value={state.mass}
          min={0.1}
          max={2}
          step={0.1}
          unit="kg"
          accentClass="bg-violet-100 text-violet-700"
          onChange={(mass) => onChange({ mass })}
        />
      </div>

      <p className="mt-5 border-t border-lab-line pt-3 text-[11px] text-slate-400">
        L: 0,5 – 10 m · Penyetel periode: 0,5 – 7 s (langkah 0,05) · θ₀: 5–60° (langkah 5°) · g:
        1,6 – 24,8 m/s² · m: 0,1 – 2 kg
      </p>
    </motion.section>
  )
}
