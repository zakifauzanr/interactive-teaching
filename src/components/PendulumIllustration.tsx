import { useEffect, useRef, useState } from 'react'
import type { PendulumResult, PendulumState } from '../types/pendulum'
import { formatNumber } from '../utils/physics'

interface PendulumIllustrationProps {
  state: PendulumState
  result: PendulumResult | null
}

const VIEW_W = 900
const VIEW_H = 520
const PIVOT_X = VIEW_W / 2
const PIVOT_Y = 78
const MAX_ROD_PX = 400

const C_ROD = '#475569'
const C_BOB = '#f59e0b'
const C_GUIDE = '#cbd5e1'
const C_ARC = '#10b981'

export function PendulumIllustration({ state, result }: PendulumIllustrationProps) {
  const [phase, setPhase] = useState(0)
  const [cycle, setCycle] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [justCompleted, setJustCompleted] = useState(false)
  const phaseRef = useRef(0)

  const period = result?.period ?? 2

  useEffect(() => {
    if (!playing) return
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      const next = phaseRef.current + (dt * 2 * Math.PI) / period
      if (next >= 2 * Math.PI) {
        setCycle((c) => c + 1)
        setJustCompleted(true)
      }
      const wrapped = next % (2 * Math.PI)
      // Label "1 getaran ✓" menyala hanya sampai perempatan berikutnya terlewati.
      if (Math.floor((wrapped / (2 * Math.PI)) * 4) > 0) setJustCompleted(false)
      phaseRef.current = wrapped
      setPhase(wrapped)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing, period])

  const reset = () => {
    phaseRef.current = 0
    setPhase(0)
    setCycle(0)
    setJustCompleted(false)
  }

  const rodPx = Math.min(MAX_ROD_PX, state.length * 150)
  const theta0 = (state.angleDeg * Math.PI) / 180
  // Acuan hitungan getaran: mulai dari titik terendah, mengayun ke kiri lebih dulu.
  // θ(t) = −θ₀·sin(2πt/T) → fase ¼ di titik terluar kiri, 2/4 di titik terendah, dst.
  const theta = -theta0 * Math.sin(phase)

  const quarter = Math.floor((phase / (2 * Math.PI)) * 4)

  const milestoneLabel =
    quarter === 0
      ? justCompleted
        ? '1 getaran ✓'
        : null
      : `${quarter}/4`

  const bobX = PIVOT_X + Math.sin(theta) * rodPx
  const bobY = PIVOT_Y + Math.cos(theta) * rodPx
  const bobR = 12 + state.mass * 11

  const pt = (a: number, r: number) => ({
    x: PIVOT_X + Math.sin(a) * r,
    y: PIVOT_Y + Math.cos(a) * r,
  })

  const ampL = pt(-theta0, rodPx)
  const ampR = pt(theta0, rodPx)
  const arcPt = pt(theta, 62)
  const arcBottom = pt(0, 62)
  const thetaNow = Math.abs((theta * 180) / Math.PI)

  const labelMid = pt(theta / 2, 88)

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-lab-line bg-lab-surface shadow-sm">
      {/* Overlay kontrol animasi + info */}
      <div className="absolute left-4 top-4 flex flex-col gap-2">
        <div className="flex flex-wrap gap-1.5">
          <span className="rounded-full border border-slate-200 bg-white/90 px-2.5 py-1 text-[11px] font-bold text-slate-600 tabular-nums">
            g = {formatNumber(state.gravity, 2)} m/s²
          </span>
          <span className="rounded-full border border-slate-200 bg-white/90 px-2.5 py-1 text-[11px] font-bold text-slate-600 tabular-nums">
            m = {formatNumber(state.mass, 1)} kg
          </span>
          <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-700">
            Getaran ke-{cycle + 1}
          </span>
        </div>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-sm shadow-sm transition-colors hover:bg-slate-50"
            aria-label={playing ? 'Jeda animasi' : 'Lanjutkan animasi'}
          >
            {playing ? '⏸' : '▶'}
          </button>
          <button
            type="button"
            onClick={reset}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-sm shadow-sm transition-colors hover:bg-slate-50"
            aria-label="Ulangi ayunan dari awal"
          >
            ↺
          </button>
        </div>
      </div>
      <div className="absolute right-4 top-4 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 tabular-nums">
        T = {formatNumber(period, 2)} s
      </div>

      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="block h-auto w-full touch-none select-none"
        role="img"
        aria-label="Ilustrasi bandul berayun dengan penanda perempatan getaran; hitungan dimulai dari titik terendah"
      >
        <defs>
          <pattern id="gridP" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#eef2f7" strokeWidth="1" />
          </pattern>
        </defs>

        <rect width={VIEW_W} height={VIEW_H} fill="url(#gridP)" />

        {/* Langit-langit / penggantung */}
        <g>
          <line x1={PIVOT_X - 90} y1={PIVOT_Y - 16} x2={PIVOT_X + 90} y2={PIVOT_Y - 16} stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
          {Array.from({ length: 9 }, (_, i) => {
            const x = PIVOT_X - 80 + i * 20
            return <line key={i} x1={x} y1={PIVOT_Y - 16} x2={x - 10} y2={PIVOT_Y - 30} stroke="#cbd5e1" strokeWidth="2" />
          })}
        </g>

        {/* Garis vertikal (posisi setimbang) + dimensi L */}
        <line
          x1={PIVOT_X}
          y1={PIVOT_Y}
          x2={PIVOT_X}
          y2={PIVOT_Y + rodPx + 42}
          stroke={C_GUIDE}
          strokeWidth="1.5"
          strokeDasharray="5 6"
        />
        <text
          x={PIVOT_X - 16}
          y={PIVOT_Y + rodPx / 2}
          textAnchor="middle"
          fontSize="14"
          fontWeight="700"
          fill="#475569"
          transform={`rotate(-90 ${PIVOT_X - 16} ${PIVOT_Y + rodPx / 2})`}
        >
          L = {formatNumber(state.length, 1)} m
        </text>

        {/* Busur amplitudo (jejak ayunan) */}
        <path
          d={`M ${ampL.x} ${ampL.y} A ${rodPx} ${rodPx} 0 0 0 ${ampR.x} ${ampR.y}`}
          fill="none"
          stroke={C_GUIDE}
          strokeWidth="1.5"
          strokeDasharray="4 7"
        />
        <circle cx={ampL.x} cy={ampL.y} r="4" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
        <circle cx={ampR.x} cy={ampR.y} r="4" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />

        {/* Penanda perempatan getaran pada posisi bandul */}
        {theta0 >= (10 * Math.PI) / 180 && (
          <>
            <circle cx={pt(0, rodPx).x} cy={pt(0, rodPx).y} r="3.5" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
            <text
              x={pt(0, rodPx).x}
              y={pt(0, rodPx).y + 18}
              textAnchor="middle"
              fontSize="11"
              fontWeight="700"
              fill="#94a3b8"
            >
              2/4 · 4/4 (1)
            </text>
          </>
        )}
        {theta0 >= (20 * Math.PI) / 180 && (
          <>
            <text
              x={ampL.x}
              y={ampL.y + 20}
              textAnchor="middle"
              fontSize="11"
              fontWeight="700"
              fill="#94a3b8"
            >
              1/4
            </text>
            <text
              x={ampR.x}
              y={ampR.y + 20}
              textAnchor="middle"
              fontSize="11"
              fontWeight="700"
              fill="#94a3b8"
            >
              3/4
            </text>
          </>
        )}

        {/* Busur sudut sesaat + label */}
        <path
          d={`M ${arcBottom.x} ${arcBottom.y} A 62 62 0 0 ${theta >= 0 ? 0 : 1} ${arcPt.x} ${arcPt.y}`}
          fill="none"
          stroke={C_ARC}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <text
          x={labelMid.x}
          y={labelMid.y}
          textAnchor="middle"
          fontSize="13"
          fontWeight="700"
          fill={C_ARC}
        >
          θ = {thetaNow.toFixed(0)}°
        </text>

        {/* Bayangan posisi ujung (garis rod) */}
        <line x1={PIVOT_X} y1={PIVOT_Y} x2={ampL.x} y2={ampL.y} stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
        <line x1={PIVOT_X} y1={PIVOT_Y} x2={ampR.x} y2={ampR.y} stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />

        {/* Tali + beban + label perempatan yang mengikuti bandul */}
        <line x1={PIVOT_X} y1={PIVOT_Y} x2={bobX} y2={bobY} stroke={C_ROD} strokeWidth="4" strokeLinecap="round" />
        <circle cx={bobX} cy={bobY} r={bobR} fill={C_BOB} stroke="#d97706" strokeWidth="2.5" />
        <circle cx={bobX - bobR * 0.3} cy={bobY - bobR * 0.3} r={bobR * 0.22} fill="#fcd34d" opacity="0.8" />
        {milestoneLabel && (
          <text
            x={bobX}
            y={bobY + bobR + 20}
            textAnchor="middle"
            fontSize="13"
            fontWeight="800"
            fill="#4f46e5"
            stroke="#ffffff"
            strokeWidth="4"
            paintOrder="stroke"
          >
            {milestoneLabel}
          </text>
        )}

        {/* Pivot */}
        <circle cx={PIVOT_X} cy={PIVOT_Y} r="5.5" fill="#fff" stroke="#4f46e5" strokeWidth="3" />
      </svg>
    </div>
  )
}
