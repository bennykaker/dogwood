'use client'

import { useState } from 'react'
import Nav from './components/Nav'
import ChatInterface from './components/ChatInterface'
import QuestionSidebar from './components/QuestionSidebar'

export default function HomePage() {
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null)

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-navy-900">
      <Nav />

      {/* Disclaimer */}
      <div className="bg-amber-50 border-b border-amber-200 dark:bg-amber-950 dark:border-amber-800 flex-shrink-0">
        <div className="max-w-6xl mx-auto px-4 py-2.5 text-base text-amber-800 dark:text-amber-300 text-center leading-relaxed">
          General insurance information only — not legal or financial advice. For coverage decisions consult a licensed BC broker.
        </div>
      </div>

      {/* Coverage scope */}
      <div className="bg-navy-700 flex-shrink-0">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="text-base font-semibold text-white">Covers:</span>
            {['🏠 Home', '🏢 Strata & Condo', '🏠 Tenant', '⛵ Boat', '💼 Small Business'].map(item => (
              <span key={item} className="text-base text-navy-100">{item}</span>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="text-base text-navy-300 italic">Not life insurance</span>
            <span className="text-base text-navy-300">·</span>
            <span className="text-base text-navy-300 italic">Auto: ICBC basics only</span>
          </div>
        </div>
      </div>

      {/* Ad bar */}
      <div className="bg-white border-b border-gray-100 dark:bg-navy-800 dark:border-navy-700 flex-shrink-0">
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-end">
          <div className="w-48 h-8 bg-gray-100 dark:bg-navy-700 rounded border border-dashed border-gray-300 dark:border-navy-500 flex items-center justify-center">
            <span className="text-base text-gray-400 dark:text-navy-400">Ad slot</span>
          </div>
        </div>
      </div>

      {/* Main two-column layout */}
      <main className="flex-1 min-h-0 max-w-6xl w-full mx-auto px-4 py-6 flex gap-6 items-start">

        {/* Left sidebar */}
        <div className="hidden md:flex flex-col w-72 flex-shrink-0 self-stretch">
          <QuestionSidebar onQuestion={q => setPendingQuestion(q)} />
        </div>

        {/* Chat panel */}
        <div className="flex-1 min-w-0 flex flex-col h-full bg-white dark:bg-navy-800 border border-gray-200 dark:border-navy-700 rounded-2xl p-6 shadow-sm">
          <h1 className="font-serif text-2xl text-navy-700 dark:text-white mb-5 leading-tight">
            BC insurance questions, answered instantly.
          </h1>
          <ChatInterface
            pendingQuestion={pendingQuestion}
            onQuestionSent={() => setPendingQuestion(null)}
          />
        </div>

      </main>
    </div>
  )
}
