import { useEffect, useRef, useState } from 'react'
import { PendulumChallenge } from '../components/PendulumChallenge'
import { PendulumChallengeSmp } from '../components/PendulumChallengeSmp'
import { PendulumControls } from '../components/PendulumControls'
import { PendulumExplanation } from '../components/PendulumExplanation'
import { PendulumFormula } from '../components/PendulumFormula'
import { PendulumIllustration } from '../components/PendulumIllustration'
import { PendulumResult } from '../components/PendulumResult'
import { PendulumTryIt } from '../components/PendulumTryIt'
import { PendulumTryItSmp } from '../components/PendulumTryItSmp'
import type { FormulaLevel, PendulumState } from '../types/pendulum'
import {
  DEFAULT_PENDULUM_STATE,
  PENDULUM_TARGET_PERIOD,
  PENDULUM_TOLERANCE,
  SMP_MIN_FREQUENCY,
} from '../types/pendulum'
import {
  calculatePendulum,
  isPendulumChallengePassed,
  isSmpChallengePassed,
} from '../utils/physics'
import {
  loadFormulaLevel,
  loadPendulumChallengeCompleted,
  loadPendulumState,
  loadSmpChallengeCompleted,
  loadSmpLength,
  saveFormulaLevel,
  savePendulumChallengeCompleted,
  savePendulumState,
  saveSmpChallengeCompleted,
  saveSmpLength,
} from '../utils/storage'

export function PendulumPage() {
  const [level, setLevel] = useState<FormulaLevel>(() => loadFormulaLevel())
  const [state, setState] = useState<PendulumState>(() => loadPendulumState())
  const [smpLength, setSmpLength] = useState(() => loadSmpLength())
  const [challengeCompleted, setChallengeCompleted] = useState(() =>
    loadPendulumChallengeCompleted(),
  )
  const challengeCompletedRef = useRef(challengeCompleted)
  const [smpChallengeCompleted, setSmpChallengeCompleted] = useState(() =>
    loadSmpChallengeCompleted(),
  )
  const smpChallengeRef = useRef(smpChallengeCompleted)

  const [count, setCount] = useState(10)
  const triedRef = useRef(new Set<number>())
  const [distinctTried, setDistinctTried] = useState(0)

  const isSmp = level === 'smp'
  // Mode SMP memakai bandul standar yang hanya panjangnya bisa diganti (preset);
  // state eksperimen SMA terpisah dan tidak tertimpa.
  const effective: PendulumState = isSmp
    ? { ...DEFAULT_PENDULUM_STATE, length: smpLength }
    : state
  const result = calculatePendulum(effective.length, effective.gravity)

  // Simpan pilihan tingkat + state masing-masing mode (localStorage).
  useEffect(() => {
    saveFormulaLevel(level)
  }, [level])

  useEffect(() => {
    if (isSmp) {
      saveSmpLength(smpLength)
    } else {
      savePendulumState(state)
    }
  }, [isSmp, smpLength, state])

  // Tandai challenge masing-masing mode saat pertama kali tercapai.
  useEffect(() => {
    if (
      !isSmp &&
      !challengeCompletedRef.current &&
      result &&
      isPendulumChallengePassed(result.period, PENDULUM_TARGET_PERIOD, PENDULUM_TOLERANCE)
    ) {
      challengeCompletedRef.current = true
      setChallengeCompleted(true)
      savePendulumChallengeCompleted(true)
    }
  }, [isSmp, challengeCompletedRef, state, result])

  useEffect(() => {
    if (
      isSmp &&
      !smpChallengeRef.current &&
      result &&
      isSmpChallengePassed(result.frequency, SMP_MIN_FREQUENCY)
    ) {
      smpChallengeRef.current = true
      setSmpChallengeCompleted(true)
      saveSmpChallengeCompleted(true)
    }
  }, [isSmp, smpChallengeRef, smpLength, result])

  const patchState = (patch: Partial<PendulumState>) => {
    setState((prev) => ({ ...prev, ...patch }))
  }

  const changeCount = (value: number) => {
    if (!triedRef.current.has(value)) {
      triedRef.current.add(value)
      setDistinctTried(triedRef.current.size)
    }
    setCount(value)
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-6 text-center sm:mb-8">
        <p className="text-xs font-bold tracking-widest text-lab-accent uppercase">
          Simulasi interaktif · Getaran & gelombang
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-lab-ink sm:text-4xl">
          Bandul Sederhana
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-lab-muted sm:text-base">
          Eksperimen bagaimana panjang tali dan gravitasi menentukan waktu satu ayunan.
        </p>

        <div
          className="mx-auto mt-4 flex w-fit rounded-full bg-slate-100 p-1"
          role="tablist"
          aria-label="Tingkat pembelajaran"
        >
          <LevelTab
            active={isSmp}
            onClick={() => setLevel('smp')}
            label="SMP"
            hint="Fokus menghitung dari data getaran"
          />
          <LevelTab
            active={!isSmp}
            onClick={() => setLevel('sma')}
            label="SMA"
            hint="Rumus memakai panjang tali & gravitasi"
          />
        </div>
        <p className="mt-2 text-xs text-slate-400">
          {isSmp
            ? 'Mode SMP: ganti bandul, hitung getarannya, dapatkan T = t/n dan f = n/t.'
            : 'Mode SMA: bandul dapat diubah-ubah — panjang tali, gravitasi, sudut, dan massa.'}
        </p>
      </header>

      <main className="flex flex-col gap-5">
        <PendulumIllustration state={effective} result={result} />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <PendulumControls
            level={level}
            state={effective}
            onChange={patchState}
            smpLength={smpLength}
            onSmpLength={setSmpLength}
            count={count}
            onCount={changeCount}
            period={result?.period ?? 0}
          />
          <div className="flex flex-col gap-5">
            <PendulumResult
              result={result}
              angleDeg={effective.angleDeg}
              level={level}
            />
            <PendulumFormula
              level={level}
              state={effective}
              result={result}
              count={count}
            />
          </div>
        </div>

        <PendulumExplanation level={level} state={effective} result={result} />
        {isSmp ? (
          <>
            <PendulumTryItSmp
              count={count}
              period={result?.period ?? null}
              frequency={result?.frequency ?? null}
              distinctTried={distinctTried}
            />
            <PendulumChallengeSmp
              level={level}
              frequency={result?.frequency ?? null}
              completed={smpChallengeCompleted}
              currentLength={smpLength}
            />
          </>
        ) : (
          <>
            <PendulumTryIt state={effective} />
            <PendulumChallenge
              state={effective}
              period={result?.period ?? null}
              completed={challengeCompleted}
            />
          </>
        )}
      </main>
    </div>
  )
}

function LevelTab({
  active,
  onClick,
  label,
  hint,
}: {
  active: boolean
  onClick: () => void
  label: string
  hint: string
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      title={hint}
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 text-sm font-bold transition-colors ${
        active ? 'bg-lab-accent text-white shadow-sm' : 'text-lab-muted hover:text-lab-ink'
      }`}
    >
      {label}
    </button>
  )
}
