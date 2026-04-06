'use client'

import { useState } from 'react'
import Nav from './components/Nav'
import ChatInterface from './components/ChatInterface'
import QuestionSidebar from './components/QuestionSidebar'

export default function HomePage() {
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null)

  return (
    <div className="flex flex-col h-screen" style={{ backgroundColor: '#1c1117' }}>
      <Nav />

      {/* Ad bar */}
      <div className="flex-shrink-0" style={{ backgroundColor: '#251519', borderBottom: '1px solid #4a2535' }}>
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-end">
          <div className="w-48 h-8 rounded border border-dashed flex items-center justify-center" style={{ borderColor: '#4a2535' }}>
            <span className="text-base" style={{ color: '#9a6070' }}>Ad slot</span>
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
        <div className="flex-1 min-w-0 flex flex-col h-full rounded-2xl p-6 shadow-sm" style={{ backgroundColor: '#251519', border: '1px solid #4a2535' }}>
          <h1 className="font-serif text-2xl mb-5 leading-tight" style={{ color: '#f0e4eb' }}>
            Ask your question here.
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
