'use client'

import { useState, useEffect } from 'react'
import DogwoodLogo from '../components/DogwoodLogo'

type Escalation = {
  id: string
  timestamp: string
  question: string
  reply: string
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-CA', {
    timeZone: 'America/Vancouver',
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function EscalationCard({ item }: { item: Escalation }) {
  return (
    <div className="bg-white dark:bg-forest-800 border border-gray-200 dark:border-forest-700 rounded-xl p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <span className="text-base font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-full px-3 py-1">
          Escalated
        </span>
        <span className="text-base text-gray-400 dark:text-forest-400">{formatDate(item.timestamp)}</span>
      </div>
      <div>
        <p className="text-base font-semibold text-gray-500 dark:text-forest-400 uppercase tracking-wide mb-2">Question</p>
        <p className="text-base text-gray-900 dark:text-gray-100">{item.question}</p>
      </div>
      <div>
        <p className="text-base font-semibold text-gray-500 dark:text-forest-400 uppercase tracking-wide mb-2">Dogwood response</p>
        <p className="text-base text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{item.reply}</p>
      </div>
    </div>
  )
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [error, setError] = useState(false)
  const [escalations, setEscalations] = useState<Escalation[]>([])
  const [loading, setLoading] = useState(false)

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (password === 'dogwood') {
      setAuthed(true)
      setError(false)
    } else {
      setError(true)
    }
  }

  useEffect(() => {
    if (!authed) return
    setLoading(true)
    fetch('/api/escalations')
      .then(r => r.json())
      .then(data => setEscalations(data))
      .finally(() => setLoading(false))
  }, [authed])

  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-forest-900 flex items-center justify-center px-4">
        <div className="bg-white dark:bg-forest-800 border border-gray-200 dark:border-forest-700 rounded-2xl p-8 w-full max-w-sm shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <DogwoodLogo size={30} />
            <span className="font-serif text-xl text-gray-900 dark:text-white">Dogwood Admin</span>
          </div>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="text-base font-medium text-gray-700 dark:text-gray-300 block mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(false) }}
                autoFocus
                className={`w-full border rounded-xl px-4 py-3 text-base outline-none transition-colors bg-white dark:bg-forest-900 text-gray-900 dark:text-white ${
                  error
                    ? 'border-red-400 bg-red-50 dark:bg-red-950'
                    : 'border-gray-200 dark:border-forest-600 focus:border-forest-400'
                }`}
                placeholder="Enter password"
              />
              {error && <p className="text-base text-red-500 mt-2">Incorrect password.</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-forest-600 hover:bg-forest-700 text-white font-semibold rounded-xl py-3 text-base transition-colors"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-forest-900">
      <div className="bg-forest-600 px-4 py-4 flex items-center gap-3">
        <DogwoodLogo size={28} white />
        <span className="font-serif text-xl text-white">Admin — Escalations</span>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {loading ? (
          <p className="text-base text-gray-400 dark:text-forest-400 text-center py-16">Loading…</p>
        ) : escalations.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-base text-gray-400 dark:text-forest-400">No escalations yet.</p>
            <p className="text-base text-gray-300 dark:text-forest-500 mt-2">Questions flagged with "This one needs a human" will appear here.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-base text-gray-500 dark:text-forest-400 mb-2">
              {escalations.length} escalation{escalations.length !== 1 ? 's' : ''} · most recent first
            </p>
            {escalations.map(item => (
              <EscalationCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
