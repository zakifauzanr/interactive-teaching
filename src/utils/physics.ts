import type { LeverResult, LeverState } from '../types/lever'
import type { PendulumResult } from '../types/pendulum'

export function calculateLever(
  force: number,
  powerArm: number,
  loadArm: number,
): LeverResult | null {
  if (force <= 0 || powerArm <= 0 || loadArm <= 0) {
    return null
  }

  const loadForce = (force * powerArm) / loadArm
  const mechanicalAdvantage = powerArm / loadArm

  return {
    loadForce,
    mechanicalAdvantage,
    torquePower: force * powerArm,
    torqueLoad: loadForce * loadArm,
  }
}

export function calculateFromState(state: LeverState): LeverResult | null {
  return calculateLever(state.force, state.powerArm, state.loadArm)
}

export function formatNumber(value: number, digits = 1): string {
  const rounded = Number(value.toFixed(digits))
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(digits)
}

/** Cek apakah challenge terpenuhi: gaya kuasa ≤ 50 N dan gaya beban ≥ 150 N */
export function isChallengePassed(
  force: number,
  loadForce: number,
  maxForce: number,
  minLoadForce: number,
): boolean {
  return force <= maxForce && loadForce >= minLoadForce
}

/** Periode bandul sederhana (aproksimasi sudut kecil): T = 2π√(L/g) */
export function calculatePendulum(
  length: number,
  gravity: number,
): PendulumResult | null {
  if (length <= 0 || gravity <= 0) return null
  const period = 2 * Math.PI * Math.sqrt(length / gravity)
  return { period, frequency: 1 / period }
}

/** Cek tantangan bandul: |T − target| ≤ toleransi */
export function isPendulumChallengePassed(
  period: number,
  target: number,
  tolerance: number,
): boolean {
  return Math.abs(period - target) <= tolerance
}

/** Tantangan SMP: frekuensi bandul mencapai minimal tertentu */
export function isSmpChallengePassed(frequency: number, minFrequency: number): boolean {
  return frequency >= minFrequency
}
