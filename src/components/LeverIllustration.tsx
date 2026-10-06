import { motion } from 'framer-motion'
import type { LeverResult, LeverState } from '../types/lever'
import { formatNumber } from '../utils/physics'

interface LeverIllustrationProps {
  state: LeverState
  result: LeverResult | null
}

const VIEW_W = 900
const VIEW_H = 444
const PIVOT_X = VIEW_W / 2
const GROUND_Y = 388
const BEAM_Y = 300 // y atas batang
const BEAM_H = 12
const DIM_Y = 210 // garis indikator jarak (satu ketinggian untuk kedua lengan)

const C_FORCE = '#10b981'
const C_FORCE_DARK = '#047857'
const C_LOAD = '#f59e0b'
const C_LOAD_DARK = '#92400e'
const C_PIVOT = '#6366f1'
const C_PIVOT_DARK = '#4f46e5'
const C_DIM = '#94a3b8'

const spring = { type: 'spring' as const, stiffness: 170, damping: 22 }

export function LeverIllustration({ state, result }: LeverIllustrationProps) {
  const armMax = Math.max(state.powerArm, state.loadArm)
  const scale = ((PIVOT_X - 92) / armMax) * 0.96

  const loadX = PIVOT_X - state.loadArm * scale
  const powerX = PIVOT_X + state.powerArm * scale
  const beamLeft = Math.min(loadX, powerX) - 44
  const beamW = Math.max(loadX, powerX) - Math.min(loadX, powerX) + 88

  const tailY = BEAM_Y + BEAM_H + 10 + 20 + ((state.force - 10) / 190) * 48

  const loadForce = result?.loadForce ?? 0
  const km = result?.mechanicalAdvantage ?? 0

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-lab-line bg-lab-surface shadow-sm">
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="block h-auto w-full touch-none select-none"
        role="img"
        aria-label="Ilustrasi tuas: titik tumpu di tengah, beban di kiri, gaya kuasa di kanan, dengan indikator lengan kuasa dan lengan beban"
      >
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#eef2f7" strokeWidth="1" />
          </pattern>
          <marker
            id="arrowForce"
            markerUnits="userSpaceOnUse"
            markerWidth="14"
            markerHeight="12"
            refX="12.5"
            refY="6"
            orient="auto"
          >
            <path d="M1,1.5 L13,6 L1,10.5 Z" fill={C_FORCE} />
          </marker>
          <marker
            id="arrowDim"
            markerUnits="userSpaceOnUse"
            markerWidth="9"
            markerHeight="8"
            refX="7"
            refY="4"
            orient="auto-start-reverse"
          >
            <path d="M1,1.2 L7.5,4 L1,6.8 Z" fill={C_DIM} />
          </marker>
        </defs>

        <rect width={VIEW_W} height={VIEW_H} fill="url(#grid)" />

        {/* === Indikator lengan beban (kiri) === */}
        <g>
          <motion.line
            x1={loadX}
            y1={DIM_Y}
            x2={PIVOT_X}
            y2={DIM_Y}
            stroke={C_DIM}
            strokeWidth="1.5"
            markerStart="url(#arrowDim)"
            markerEnd="url(#arrowDim)"
            animate={{ x1: loadX }}
            transition={spring}
          />
          <motion.line
            y1={DIM_Y - 6}
            y2={DIM_Y + 6}
            stroke="#cbd5e1"
            strokeWidth="1"
            animate={{ x1: loadX, x2: loadX }}
            transition={spring}
          />
          <motion.text
            y={DIM_Y - 14}
            textAnchor="middle"
            fontSize="15"
            fontWeight="700"
            fill="#475569"
            animate={{ x: (loadX + PIVOT_X) / 2 }}
            transition={spring}
          >
            Lᵦ = {formatNumber(state.loadArm)} m
          </motion.text>
        </g>

        {/* === Indikator lengan kuasa (kanan) === */}
        <g>
          <motion.line
            x1={PIVOT_X}
            y1={DIM_Y}
            x2={powerX}
            y2={DIM_Y}
            stroke={C_DIM}
            strokeWidth="1.5"
            markerStart="url(#arrowDim)"
            markerEnd="url(#arrowDim)"
            animate={{ x2: powerX }}
            transition={spring}
          />
          <motion.line
            y1={DIM_Y - 6}
            y2={DIM_Y + 6}
            stroke="#cbd5e1"
            strokeWidth="1"
            animate={{ x1: powerX, x2: powerX }}
            transition={spring}
          />
          <motion.text
            y={DIM_Y - 14}
            textAnchor="middle"
            fontSize="15"
            fontWeight="700"
            fill="#475569"
            animate={{ x: (PIVOT_X + powerX) / 2 }}
            transition={spring}
          >
            Lₖ = {formatNumber(state.powerArm)} m
          </motion.text>
        </g>

        {/* === Label gaya beban di atas kotak === */}
        <motion.text
          y={BEAM_Y - 50}
          textAnchor="middle"
          fontSize="12"
          fontWeight="600"
          fill={C_LOAD}
          animate={{ x: loadX }}
          transition={spring}
        >
          Gaya beban (Fᵦ)
        </motion.text>

        {/* === Beam === */}
        <motion.g animate={{ x: beamLeft }} transition={spring}>
          <motion.rect
            x={0}
            y={BEAM_Y}
            height={BEAM_H}
            rx={6}
            fill="#2563eb"
            animate={{ width: beamW }}
            transition={spring}
          />
          <motion.rect
            x={0}
            y={BEAM_Y + 2}
            height={3}
            rx={1.5}
            fill="#93c5fd"
            animate={{ width: beamW - 8 }}
            transition={spring}
          />
        </motion.g>

        {/* === Beban (duduk di atas beam, sisi kiri) === */}
        <motion.g animate={{ x: loadX }} transition={spring}>
          <rect x={-28} y={BEAM_Y - 42} width={56} height={42} rx={5} fill={C_LOAD} stroke="#d97706" strokeWidth="2" />
          <rect x={-28} y={BEAM_Y - 20} width={56} height={3} fill="#d97706" opacity="0.4" />
          <text x={0} y={BEAM_Y - 34} textAnchor="middle" fontSize="11" fontWeight="700" fill="#7c2d12">
            BEBAN
          </text>
          <text x={0} y={BEAM_Y - 9} textAnchor="middle" fontSize="13" fontWeight="800" fill="#7c2d12">
            {formatNumber(loadForce)} N
          </text>
        </motion.g>

        {/* === Panah gaya kuasa (menekan naik dari bawah, sisi kanan) === */}
        <motion.g animate={{ x: powerX }} transition={spring}>
          <motion.line
            x1={0}
            x2={0}
            y2={BEAM_Y + BEAM_H + 8}
            stroke={C_FORCE}
            strokeWidth="5"
            strokeLinecap="round"
            markerEnd="url(#arrowForce)"
            animate={{ y1: tailY }}
            transition={spring}
          />
          <text x={0} y={tailY + 20} textAnchor="middle" fontSize="14" fontWeight="800" fill={C_FORCE_DARK}>
            {formatNumber(state.force)} N
          </text>
          <text x={0} y={tailY + 38} textAnchor="middle" fontSize="11.5" fontWeight="600" fill="#059669">
            Gaya kuasa (Fₖ)
          </text>
        </motion.g>

        {/* === Titik tumpu === */}
        <g>
          <path
            d={`M ${PIVOT_X} ${BEAM_Y + BEAM_H + 2} L ${PIVOT_X - 30} ${GROUND_Y} L ${PIVOT_X + 30} ${GROUND_Y} Z`}
            fill={C_PIVOT}
          />
          <path
            d={`M ${PIVOT_X} ${BEAM_Y + BEAM_H + 2} L ${PIVOT_X - 30} ${GROUND_Y} L ${PIVOT_X - 12} ${GROUND_Y} Z`}
            fill="#818cf8"
          />
          <circle cx={PIVOT_X} cy={BEAM_Y + BEAM_H + 2} r="4.5" fill="#fff" stroke={C_PIVOT_DARK} strokeWidth="3" />
          <text x={PIVOT_X - 42} y={GROUND_Y - 6} textAnchor="end" fontSize="12.5" fontWeight="700" fill={C_PIVOT_DARK}>
            Titik tumpu
          </text>
        </g>

        {/* === Garis tanah === */}
        <line x1="56" y1={GROUND_Y} x2={VIEW_W - 56} y2={GROUND_Y} stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />
        <line x1="72" y1={GROUND_Y + 12} x2={VIEW_W - 72} y2={GROUND_Y + 12} stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />

        {/* === Badge status === */}
        <g>
          <circle cx={VIEW_W - 66} cy={46} r={15} fill="#dcfce7" />
          <path
            d={`M ${VIEW_W - 72} 46 l 4.5 4.5 l 8.5 -9.5`}
            stroke="#16a34a"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text x={VIEW_W - 90} y={51} textAnchor="end" fontSize="14" fontWeight="700" fill="#15803d">
            Seimbang
          </text>
          <text x={VIEW_W - 90} y={72} textAnchor="end" fontSize="11" fontWeight="600" fill="#16a34a">
            KM = {formatNumber(km, 2)}×
          </text>
        </g>
      </svg>
    </div>
  )
}
