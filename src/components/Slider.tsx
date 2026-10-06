interface SliderProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  unit: string
  accentClass: string
  onChange: (value: number) => void
}

export function Slider({ label, value, min, max, step, unit, accentClass, onChange }: SliderProps) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between">
        <span className="text-sm font-medium text-lab-ink">{label}</span>
        <span className={`rounded-md px-2 py-0.5 text-sm font-bold tabular-nums ${accentClass}`}>
          {value.toLocaleString('id-ID')} {unit}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-lab-accent"
      />
    </label>
  )
}
