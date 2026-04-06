'use client'

import { useState } from 'react'
import Nav from './components/Nav'
import ChatInterface from './components/ChatInterface'
import QuestionSidebar from './components/QuestionSidebar'

export default function HomePage() {
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null)

  return (
    <div className="flex flex-col h-screen bg-forest-50 dark:bg-forest-900">
      <Nav />

      {/* Ad bar */}
      <div className="bg-white border-b border-gray-100 dark:bg-forest-800 dark:border-forest-700 flex-shrink-0">
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-end">
          <div className="w-48 h-8 bg-gray-100 dark:bg-forest-700 rounded border border-dashed border-gray-300 dark:border-forest-600 flex items-center justify-center">
            <span className="text-base text-gray-400 dark:text-forest-400">Ad slot</span>
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
        <div className="flex-1 min-w-0 flex flex-col h-full bg-forest-50 dark:bg-forest-800 border border-forest-200 dark:border-forest-700 rounded-2xl p-6 shadow-sm">
          <h1 className="font-serif text-2xl text-forest-700 dark:text-white mb-5 leading-tight">
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
