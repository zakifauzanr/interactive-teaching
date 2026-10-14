import { useEffect, useRef, useState } from 'react'
import { FormulaDisplay } from '../components/FormulaDisplay'
import { Explanation } from '../components/Explanation'
import { Challenge } from '../components/Challenge'
import { LeverControls } from '../components/LeverControls'
import { LeverIllustration } from '../components/LeverIllustration'
import { LeverResult } from '../components/LeverResult'
import { TryItYourself } from '../components/TryItYourself'
import type { LeverState } from '../types/lever'
import { calculateFromState } from '../utils/physics'
import {
  loadChallengeCompleted,
  loadLeverState,
  saveChallengeCompleted,
  saveLeverState,
} from '../utils/storage'

export function LeverPage() {
  const [state, setState] = useState<LeverState>(() => loadLeverState())
  const [challengeCompleted, setChallengeCompleted] = useState(() => loadChallengeCompleted())
  const challengeCompletedRef = useRef(challengeCompleted)

  const result = calculateFromState(state)

  // Simpan state simulasi setiap berubah (localStorage).
  useEffect(() => {
    saveLeverState(state)
  }, [state])

  // Tandai challenge selesai di localStorage saat pertama kali tercapai.
  useEffect(() => {
    if (
      !challengeCompletedRef.current &&
      result &&
      isChallengeSolved(state, result.loadForce)
    ) {
      challengeCompletedRef.current = true
      setChallengeCompleted(true)
      saveChallengeCompleted(true)
    }
  }, [challengeCompletedRef, state, result])

  const patchState = (patch: Partial<LeverState>) => {
    setState((prev) => ({ ...prev, ...patch }))
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-6 text-center sm:mb-8">
        <p className="text-xs font-bold tracking-widest text-lab-accent uppercase">
          Simulasi interaktif · Mesin sederhana
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-lab-ink sm:text-4xl">
          Tuas / Pengungkit
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-lab-muted sm:text-base">
          Eksperimen bagaimana gaya dan jarak memengaruhi kemampuan mengangkat beban.
        </p>
      </header>

      <main className="flex flex-col gap-5">
        <LeverIllustration state={state} result={result} />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <LeverControls state={state} onChange={patchState} />
          <div className="flex flex-col gap-5">
            <LeverResult result={result} />
            <FormulaDisplay state={state} />
          </div>
        </div>

        <Explanation state={state} />
        <TryItYourself
          state={state}
          onChange={patchState}
          loadForce={result?.loadForce ?? null}
        />
        <Challenge state={state} completed={challengeCompleted} />
      </main>
    </div>
  )
}

function isChallengeSolved(state: LeverState, loadForce: number): boolean {
  return state.force <= 50 && loadForce >= 150
}
