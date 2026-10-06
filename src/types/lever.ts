export interface LeverState {
  /** Gaya kuasa (N) */
  force: number
  /** Lengan kuasa (m) */
  powerArm: number
  /** Lengan beban (m) */
  loadArm: number
}

export interface LeverResult {
  /** Gaya beban yang mampu ditahan oleh gaya kuasa (N) */
  loadForce: number
  /** Keuntungan mekanis (KM) */
  mechanicalAdvantage: number
  /** Torsi sisi kuasa (Nm) */
  torquePower: number
  /** Torsi sisi beban (Nm) */
  torqueLoad: number
}

export interface ChallengeGoal {
  maxForce: number
  minLoadForce: number
}

export const DEFAULT_LEVER_STATE: LeverState = {
  force: 100,
  powerArm: 6,
  loadArm: 3,
}

export const CHALLENGE_GOAL: ChallengeGoal = {
  maxForce: 50,
  minLoadForce: 150,
}
