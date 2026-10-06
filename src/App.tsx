import { useEffect, useRef, useState } from 'react'
import { Challenge } from './components/Challenge'
import { Explanation } from './components/Explanation'
import { FormulaDisplay } from './components/FormulaDisplay'
import { LeverControls } from './components/LeverControls'
import { LeverIllustration } from './components/LeverIllustration'
import { LeverResult } from './components/LeverResult'
import { TryItYourself } from './components/TryItYourself'
import type { LeverState } from './types/lever'
import { calculateFromState } from './utils/physics'
import {
  loadChallengeCompleted,
  loadLeverState,
  saveChallengeCompleted,
  saveLeverState,
} from './utils/storage'

export default function App() {
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
    <div className="min-h-screen bg-lab-bg">
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <Header />

        <main className="flex flex-col gap-5">
          {/* Ilustrasi utama — fokus halaman, selalu full width */}
          <LeverIllustration state={state} result={result} />

          {/* Controls + Result: berdampingan di desktop */}
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

        <footer className="mt-10 pb-6 text-center text-xs text-slate-400">
          Eksperimen fisika interaktif — tuas / pengungkit. Nilai percobaan tersimpan otomatis di
          browser ini.
        </footer>
      </div>
    </div>
  )
}

function isChallengeSolved(state: LeverState, loadForce: number): boolean {
  return state.force <= 50 && loadForce >= 150
}

function Header() {
  return (
    <header className="mb-6 text-center sm:mb-8">
      <p className="text-xs font-bold tracking-widest text-lab-accent uppercase">
        Simulasi interaktif · Pesawat sederhana
      </p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-lab-ink sm:text-4xl">
        Tuas / Pengungkit
      </h1>
      <p className="mx-auto mt-2 max-w-xl text-sm text-lab-muted sm:text-base">
        Eksperimen bagaimana gaya dan jarak memengaruhi kemampuan mengangkat beban.
      </p>
    </header>
  )
}
