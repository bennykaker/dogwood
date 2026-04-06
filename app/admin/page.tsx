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
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs text-amber-600 font-semibold bg-amber-50 border border-amber-200 rounded-full px-3 py-0.5">
          Escalated
        </span>
        <span className="text-xs text-gray-400">{formatDate(item.timestamp)}</span>
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Question</p>
        <p className="text-sm text-gray-900">{item.question}</p>
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Dogwood response</p>
        <p className="text-sm text-gray-600 whitespace-pre-wrap">{item.reply}</p>
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 w-full max-w-sm shadow-sm">
          <div className="flex items-center gap-2.5 mb-6">
            <DogwoodLogo size={28} />
            <span className="font-serif text-xl text-gray-900">Dogwood Admin</span>
          </div>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(false) }}
                autoFocus
                className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-colors ${
                  error ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-coral-400'
                }`}
                placeholder="Enter password"
              />
              {error && <p className="text-xs text-red-500 mt-1.5">Incorrect password.</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-coral-500 hover:bg-coral-600 text-white font-semibold rounded-xl py-2.5 text-sm transition-colors"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-2.5">
        <DogwoodLogo size={26} />
        <span className="font-serif text-xl text-gray-900">Admin — Escalations</span>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {loading ? (
          <p className="text-gray-400 text-sm text-center py-16">Loading…</p>
        ) : escalations.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm">No escalations yet.</p>
            <p className="text-gray-300 text-xs mt-1">Questions flagged with "This one needs a human" will appear here.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-gray-500 mb-2">
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
