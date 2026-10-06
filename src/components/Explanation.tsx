import { useMemo } from 'react'
import type { LeverState } from '../types/lever'
import { calculateFromState } from '../utils/physics'

interface ExplanationProps {
  state: LeverState
}

export function Explanation({ state }: ExplanationProps) {
  const notes = useMemo(() => collectNotes(state), [state])

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

interface Note {
  title: string
  body: string
}

function collectNotes(state: LeverState): Note[] {
  const notes: Note[] = []
  const result = calculateFromState(state)

  if (state.powerArm > state.loadArm) {
    notes.push({
      title: 'Lengan kuasa lebih panjang',
      body: 'Dengan gaya yang sama, torsi yang dihasilkan menjadi lebih besar sehingga beban lebih mudah diangkat.',
    })
  } else if (state.powerArm < state.loadArm) {
    notes.push({
      title: 'Lengan beban lebih panjang?',
      body: 'Gaya yang dibutuhkan menjadi lebih besar. Kekurangan jarak harus diganti dengan tambahan gaya.',
    })
  }

  if (result) {
    if (result.mechanicalAdvantage > 1.001) {
      notes.push({
        title: 'KM > 1 — tuas memberi keuntungan gaya',
        body: 'Gaya yang diperlukan lebih kecil dibandingkan gaya bebannya.',
      })
    } else if (result.mechanicalAdvantage < 0.999) {
      notes.push({
        title: 'KM < 1 — tuas tidak memberi keuntungan gaya',
        body: 'Gaya yang diperlukan lebih besar, tetapi pergerakan sisi kuasa dapat menjadi lebih besar.',
      })
    } else {
      notes.push({
        title: 'KM = 1 — seimbang',
        body: 'Lengan kuasa sama dengan lengan beban, sehingga gaya kuasa sama besar dengan gaya beban.',
      })
    }
  }

  return notes
}
