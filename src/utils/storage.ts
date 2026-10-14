import { DEFAULT_LEVER_STATE } from '../types/lever'
import type { LeverState } from '../types/lever'
import { DEFAULT_PENDULUM_STATE } from '../types/pendulum'
import type { FormulaLevel, PendulumState } from '../types/pendulum'

export const SIMULATION_KEY = 'lever-simulation-state'
export const CHALLENGE_KEY = 'lever-challenge-completed'
export const PENDULUM_SIMULATION_KEY = 'pendulum-simulation-state'
export const PENDULUM_CHALLENGE_KEY = 'pendulum-challenge-completed'
export const FORMULA_LEVEL_KEY = 'pendulum-formula-level'
export const SMP_LENGTH_KEY = 'pendulum-smp-length'
export const SMP_CHALLENGE_KEY = 'pendulum-smp-challenge-completed'

export function loadLeverState(): LeverState {
  try {
    const raw = localStorage.getItem(SIMULATION_KEY)
    if (!raw) return { ...DEFAULT_LEVER_STATE }
    const parsed = JSON.parse(raw) as Partial<LeverState>
    const merged = { ...DEFAULT_LEVER_STATE, ...parsed }
    const state: LeverState = {
      force: clamp(merged.force, 10, 200, 10),
      powerArm: clamp(merged.powerArm, 1, 10, 0.5),
      loadArm: clamp(merged.loadArm, 1, 10, 0.5),
    }
    return state
  } catch {
    return { ...DEFAULT_LEVER_STATE }
  }
}

export function saveLeverState(state: LeverState): void {
  try {
    localStorage.setItem(
      SIMULATION_KEY,
      JSON.stringify({
        force: state.force,
        powerArm: state.powerArm,
        loadArm: state.loadArm,
      }),
    )
  } catch {
    // localStorage mungkin tidak tersedia (private mode) — abaikan.
  }
}

export function loadChallengeCompleted(): boolean {
  try {
    return localStorage.getItem(CHALLENGE_KEY) === 'true'
  } catch {
    return false
  }
}

export function saveChallengeCompleted(value: boolean): void {
  try {
    localStorage.setItem(CHALLENGE_KEY, value ? 'true' : 'false')
  } catch {
    // Abaikan kegagalan penyimpanan.
  }
}

function clamp(value: number, min: number, max: number, step: number): number {
  if (!Number.isFinite(value)) return min
  const snapped = Math.round((value - min) / step) * step + min
  const rounded = Number(snapped.toFixed(2))
  return Math.min(max, Math.max(min, rounded))
}

export function loadPendulumState(): PendulumState {
  try {
    const raw = localStorage.getItem(PENDULUM_SIMULATION_KEY)
    if (!raw) return { ...DEFAULT_PENDULUM_STATE }
    const parsed = JSON.parse(raw) as Partial<PendulumState>
    const merged = { ...DEFAULT_PENDULUM_STATE, ...parsed }
    return {
      length: clamp(merged.length, 0.5, 10, 0.01),
      angleDeg: clamp(merged.angleDeg, 5, 60, 5),
      gravity: clamp(merged.gravity, 1.6, 24.8, 0.01),
      mass: clamp(merged.mass, 0.1, 2, 0.1),
    }
  } catch {
    return { ...DEFAULT_PENDULUM_STATE }
  }
}

export function savePendulumState(state: PendulumState): void {
  try {
    localStorage.setItem(
      PENDULUM_SIMULATION_KEY,
      JSON.stringify({
        length: state.length,
        angleDeg: state.angleDeg,
        gravity: state.gravity,
        mass: state.mass,
      }),
    )
  } catch {
    // Abaikan kegagalan penyimpanan.
  }
}

export function loadPendulumChallengeCompleted(): boolean {
  try {
    return localStorage.getItem(PENDULUM_CHALLENGE_KEY) === 'true'
  } catch {
    return false
  }
}

export function savePendulumChallengeCompleted(value: boolean): void {
  try {
    localStorage.setItem(PENDULUM_CHALLENGE_KEY, value ? 'true' : 'false')
  } catch {
    // Abaikan kegagalan penyimpanan.
  }
}

export function loadFormulaLevel(): FormulaLevel {
  try {
    return localStorage.getItem(FORMULA_LEVEL_KEY) === 'sma' ? 'sma' : 'smp'
  } catch {
    return 'smp'
  }
}

export function saveFormulaLevel(level: FormulaLevel): void {
  try {
    localStorage.setItem(FORMULA_LEVEL_KEY, level)
  } catch {
    // Abaikan kegagalan penyimpanan.
  }
}

/** Pulihkan panjang bandul SMP (bisa berupa nilai penyetelan manual, bukan hanya preset). */
export function loadSmpLength(): number {
  try {
    const raw = localStorage.getItem(SMP_LENGTH_KEY)
    if (!raw) return 1
    const value = Math.min(10, Math.max(0.5, Number(raw)))
    return Number.isFinite(value) ? value : 1
  } catch {
    return 1
  }
}

export function saveSmpLength(length: number): void {
  try {
    localStorage.setItem(SMP_LENGTH_KEY, String(length))
  } catch {
    // Abaikan kegagalan penyimpanan.
  }
}

export function loadSmpChallengeCompleted(): boolean {
  try {
    return localStorage.getItem(SMP_CHALLENGE_KEY) === 'true'
  } catch {
    return false
  }
}

export function saveSmpChallengeCompleted(value: boolean): void {
  try {
    localStorage.setItem(SMP_CHALLENGE_KEY, value ? 'true' : 'false')
  } catch {
    // Abaikan kegagalan penyimpanan.
  }
}
