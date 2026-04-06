'use client'

import { useState } from 'react'
import DogwoodLogo from './DogwoodLogo'

export default function NewHereModal() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full mt-4 rounded-xl py-2.5 px-4 text-base font-medium transition-colors text-left"
        style={{ border: '1px solid #333', color: '#666' }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1a1a1a')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        New here? →
      </button>

      {open && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
          onClick={() => setOpen(false)}
        >
          <div
            className="rounded-2xl p-8 w-full max-w-md shadow-xl"
            style={{ backgroundColor: '#111', border: '1px solid #2e2e2e' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-5">
              <DogwoodLogo size={32} white />
              <span className="font-serif text-2xl text-white">Welcome to Dogwood</span>
            </div>
            <p className="text-base leading-relaxed mb-4" style={{ color: '#ccc' }}>
              Dogwood is an AI-powered place to get your BC insurance questions answered. The AI chat is getting smarter every day and can hopefully answer your question right away.
            </p>
            <p className="text-base leading-relaxed mb-4" style={{ color: '#ccc' }}>
              If it can't help, your question goes to a human to answer.
            </p>
            <div className="rounded-xl p-4 mb-6" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}>
              <p className="text-base leading-relaxed" style={{ color: '#888' }}>
                For information and education purposes only. Please consult a licensed insurance brokerage or agency before making any coverage decisions.
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-full font-semibold rounded-xl py-3 text-base transition-colors"
              style={{ backgroundColor: '#fff', color: '#000' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#e0e0e0')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#fff')}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  )
}
