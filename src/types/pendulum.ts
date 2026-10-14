export interface PendulumState {
  /** Panjang tali (m) */
  length: number
  /** Sudut awal / amplitudo (derajat) */
  angleDeg: number
  /** Percepatan gravitasi (m/s²) */
  gravity: number
  /** Massa beban (kg) — tidak memengaruhi periode */
  mass: number
}

export interface PendulumResult {
  /** Periode satu ayun lengkap (s) */
  period: number
  /** Frekuensi (Hz) */
  frequency: number
}

export const DEFAULT_PENDULUM_STATE: PendulumState = {
  length: 1,
  angleDeg: 15,
  gravity: 9.81,
  mass: 0.5,
}

export const G_PRESETS = [
  { label: 'Bulan', value: 1.62 },
  { label: 'Bumi', value: 9.81 },
  { label: 'Jupiter', value: 24.79 },
] as const

/** Tantangan: periode target 2,00 s (bandul detik) */
export const PENDULUM_TARGET_PERIOD = 2
export const PENDULUM_TOLERANCE = 0.05

/** Tingkat penyajian rumus: SMP (T = t/n) atau SMA (T = 2π√(L/g)) */
export type FormulaLevel = 'smp' | 'sma'

/** Pilihan bandul untuk mode SMP — dilabeli kualitatif, tanpa angka L */
export const SMP_LENGTH_PRESETS = [
  { label: 'Bandul A · pendek', value: 0.5 },
  { label: 'Bandul B · sedang', value: 1 },
  { label: 'Bandul C · panjang', value: 2 },
] as const

/** Tantangan SMP: capai frekuensi minimal (Hz) */
export const SMP_MIN_FREQUENCY = 0.7
