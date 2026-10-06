import { DEFAULT_LEVER_STATE } from '../types/lever'
import type { LeverState } from '../types/lever'

export const SIMULATION_KEY = 'lever-simulation-state'
export const CHALLENGE_KEY = 'lever-challenge-completed'

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
