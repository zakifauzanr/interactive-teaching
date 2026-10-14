import { useMemo } from 'react'
import type { FormulaLevel, PendulumResult, PendulumState } from '../types/pendulum'
import { formatNumber } from '../utils/physics'

interface PendulumExplanationProps {
  level: FormulaLevel
  state: PendulumState
  result: PendulumResult | null
}

interface Note {
  title: string
  body: string
}

export function PendulumExplanation({ level, state, result }: PendulumExplanationProps) {
  const notes = useMemo(
    () => (level === 'smp' ? smpNotes(result) : smaNotes(state)),
    [level, state, result],
  )

  return (
    <section
      aria-label="Penjelasan dinamis"
      className="rounded-2xl border border-lab-line bg-lab-surface p-5 shadow-sm sm:p-6"
    >
      <h2 className="mb-4 text-sm font-bold tracking-wide text-lab-muted uppercase">
        Mengapa hasilnya seperti ini?
      </h2>

      <ul className="flex flex-col gap-3">
        {notes.map((note) => (
          <li
            key={note.title}
            className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3.5"
          >
            <span aria-hidden="true" className="text-base leading-none">
              💡
            </span>
            <div>
              <p className="text-sm font-semibold text-lab-ink">{note.title}</p>
              <p className="mt-0.5 text-sm leading-relaxed text-lab-muted">{note.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

function smpNotes(result: PendulumResult | null): Note[] {
  const notes: Note[] = [
    {
      title: 'Apa itu satu getaran penuh?',
      body: 'Berangkat dari titik terendah → menyentuh titik terluar kiri → kembali ke titik terendah → menyentuh titik terluar kanan → dan kembali lagi ke titik terendah. Itulah 4 perempat: 1 getaran penuh — hitungan dimulai dan selesai di titik terendah.',
    },
  ]

  if (result) {
    notes.push({
      title: 'Menghitung periode dengan T = t/n',
      body: `Contoh dari percobaan ini: bandul menyelesaikan 10 getaran penuh dalam ${formatNumber(10 * result.period, 2)} s, maka T = ${formatNumber(10 * result.period, 2)}/10 = ${formatNumber(result.period, 2)} s. Bagi total waktu dengan banyaknya getaran.`,
    })
    notes.push({
      title: 'Menghitung frekuensi dengan f = n/t',
      body: `Dengan data yang sama, f = 10/${formatNumber(10 * result.period, 2)} = ${formatNumber(result.frequency, 2)} Hz. Frekuensi dibaca sebagai "${formatNumber(result.frequency, 2)} getaran setiap detik".`,
    })
    notes.push({
      title: 'Ganti bandul → T dan f berubah sekaligus',
      body: 'Bandul yang lebih panjang butuh waktu lebih lama untuk satu getaran penuh: T membesar dan f mengecil. Bandul yang lebih pendek sebaliknya — keduanya selalu berlawanan karena f = 1/T.',
    })
    notes.push({
      title: 'Periode dan frekuensi saling berkebalikan',
      body: `Coba kalikan: ${formatNumber(result.period, 2)} × ${formatNumber(result.frequency, 2)} = 1. Selalu begitu — f = 1/T — karena keduanya memandang getaran yang sama dari sisi yang berlawanan.`,
    })
  }

  return notes
}

function smaNotes(state: PendulumState): Note[] {
  const { length, gravity, mass, angleDeg } = state
  const notes: Note[] = []

  if (length >= 1.5) {
    notes.push({
      title: 'Tali panjang → berayun lebih lambat',
      body: 'Periode tumbuh dengan akar panjang tali: jika panjangnya 4× lebih panjang, periodenya menjadi 2×.',
    })
  } else if (length <= 0.7) {
    notes.push({
      title: 'Tali pendek → berayun lebih cepat',
      body: 'Semakin pendek talinya, semakin kecil periodenya sehingga ayunan terasa makin cepat.',
    })
  }

  if (gravity < 5) {
    notes.push({
      title: 'Gravitasi lemah → periode panjang',
      body: 'Di Bulan (g = 1,62 m/s²) bandul yang sama berayun jauh lebih lambat daripada di Bumi.',
    })
  } else if (gravity > 15) {
    notes.push({
      title: 'Gravitasi kuat → berayun lebih cepat',
      body: 'Gravitasi yang besar menarik beban kembali lebih cepat sehingga periode memendek.',
    })
  }

  notes.push({
    title: 'Massa tidak memengaruhi periode',
    body: mass >= 1
      ? `Beban seberat ${mass.toFixed(1)} kg pun periodenya tetap sama — berat lebih besar justru diimbangi oleh inersia yang lebih besar.`
      : 'Coba geser slider massa: periode tidak berubah. Berat yang lebih besar diimbangi oleh inersia yang juga lebih besar.',
  })

  if (angleDeg > 30) {
    notes.push({
      title: 'Sudut awal besar',
      body: 'Untuk θ₀ > 30°, periode sebenarnya sedikit lebih lama daripada hasil rumus aproksimasi sudut kecil.',
    })
  } else {
    notes.push({
      title: 'Sudut awal hampir tidak memengaruhi periode',
      body: 'Selama ayunannya kecil, mengubah sudut awal hampir tidak mengubah periode — hanya jarak ayunannya yang berubah.',
    })
  }

  return notes
}
