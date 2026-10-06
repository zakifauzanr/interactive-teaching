import { Slider } from './Slider'
import type { LeverState } from '../types/lever'

interface LeverControlsProps {
  state: LeverState
  onChange: (patch: Partial<LeverState>) => void
}

export function LeverControls({ state, onChange }: LeverControlsProps) {
  return (
    <section
      aria-label="Atur percobaan"
      className="rounded-2xl border border-lab-line bg-lab-surface p-5 shadow-sm sm:p-6"
    >
      <h2 className="mb-1 text-sm font-bold tracking-wide text-lab-muted uppercase">
        Atur percobaan
      </h2>
      <p className="mb-5 text-xs text-lab-muted">Geser slider untuk mengubah simulasi.</p>

      <div className="flex flex-col gap-5">
        <Slider
          label="Gaya kuasa (Fₖ)"
          value={state.force}
          min={10}
          max={200}
          step={10}
          unit="N"
          accentClass="bg-emerald-100 text-emerald-700"
          onChange={(force) => onChange({ force })}
        />
        <Slider
          label="Lengan kuasa (Lₖ)"
          value={state.powerArm}
          min={1}
          max={10}
          step={0.5}
          unit="m"
          accentClass="bg-blue-100 text-blue-700"
          onChange={(powerArm) => onChange({ powerArm })}
        />
        <Slider
          label="Lengan beban (Lᵦ)"
          value={state.loadArm}
          min={1}
          max={10}
          step={0.5}
          unit="m"
          accentClass="bg-amber-100 text-amber-700"
          onChange={(loadArm) => onChange({ loadArm })}
        />
      </div>

      <p className="mt-5 border-t border-lab-line pt-3 text-[11px] text-slate-400">
        Rentang lengan: 1 – 10 meter (langkah 0,5 m) · Gaya kuasa: 10 – 200 N (langkah 10 N)
      </p>
    </section>
  )
}
