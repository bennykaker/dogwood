'use client'

import { useState } from 'react'
import DogwoodLogo from './DogwoodLogo'

export default function NewHereModal() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full mt-4 border border-forest-200 dark:border-forest-600 text-forest-600 dark:text-forest-300 rounded-xl py-2.5 px-4 text-base font-medium hover:bg-forest-50 dark:hover:bg-forest-700 transition-colors text-left"
      >
        New here? →
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white dark:bg-forest-800 border border-gray-200 dark:border-forest-600 rounded-2xl p-8 w-full max-w-md shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-5">
              <DogwoodLogo size={32} />
              <span className="font-serif text-2xl text-forest-700 dark:text-white">Welcome to Dogwood</span>
            </div>
            <p className="text-base text-gray-700 dark:text-gray-200 leading-relaxed mb-4">
              Dogwood is an AI-powered place to get your BC insurance questions answered. The AI chat is getting smarter every day and can hopefully answer your question right away.
            </p>
            <p className="text-base text-gray-700 dark:text-gray-200 leading-relaxed mb-4">
              If it can't help, your question goes to a human to answer.
            </p>
            <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6">
              <p className="text-base text-amber-800 dark:text-amber-300 leading-relaxed">
                For information and education purposes only. Please consult a licensed insurance brokerage or agency before making any coverage decisions.
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-full bg-forest-600 hover:bg-forest-700 text-white font-semibold rounded-xl py-3 text-base transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  )
}
