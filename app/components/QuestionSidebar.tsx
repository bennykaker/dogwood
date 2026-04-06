'use client'

import NewHereModal from './NewHereModal'

const QUESTIONS = [
  'Things I should know about insurance in BC',
  'What does home insurance cover in BC?',
  'Do I need earthquake insurance for my condo?',
  'Strata vs personal condo insurance — what\'s the difference?',
  'What does tenant insurance cover?',
  'How much does tenant insurance cost in BC?',
  'What\'s not covered by standard home insurance?',
  'Do I need boat insurance in BC?',
  'What does small business liability insurance cover?',
  'What should I do after a claim in BC?',
]

export default function QuestionSidebar({ onQuestion }: { onQuestion: (q: string) => void }) {
  return (
    <aside className="w-72 flex-shrink-0 flex flex-col">
      <div className="rounded-2xl p-5 flex flex-col flex-1" style={{ backgroundColor: '#111', border: '1px solid #222' }}>
        <h2 className="text-base font-bold uppercase tracking-wide mb-4" style={{ color: '#555' }}>
          Top Questions
        </h2>
        <ol className="flex flex-col gap-1 flex-1">
          {QUESTIONS.map((q, i) => (
            <li key={q}>
              <button
                onClick={() => onQuestion(q)}
                className="w-full text-left flex items-start gap-3 px-3 py-2.5 rounded-xl transition-colors"
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1a1a1a')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <span className="text-base font-bold w-5 flex-shrink-0 mt-0.5" style={{ color: '#fff' }}>
                  {i + 1}.
                </span>
                <span className="text-base leading-snug" style={{ color: '#ccc' }}>
                  {q}
                </span>
              </button>
            </li>
          ))}
        </ol>
        <NewHereModal />
      </div>
    </aside>
  )
}
