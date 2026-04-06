'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'
import DogwoodLogo from '../../components/DogwoodLogo'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError('Invalid email or password.')
      setLoading(false)
    } else {
      router.push('/admin/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-forest-900 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-forest-800 border border-gray-200 dark:border-forest-700 rounded-2xl p-8 w-full max-w-sm shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <DogwoodLogo size={30} />
          <span className="font-serif text-xl text-gray-900 dark:text-white">Dogwood Admin</span>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-base font-medium text-gray-700 dark:text-gray-300 block mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
              className="w-full border border-gray-200 dark:border-forest-600 rounded-xl px-4 py-3 text-base outline-none focus:border-forest-400 bg-white dark:bg-forest-900 text-gray-900 dark:text-white"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-base font-medium text-gray-700 dark:text-gray-300 block mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError('') }}
              required
              className={`w-full border rounded-xl px-4 py-3 text-base outline-none transition-colors bg-white dark:bg-forest-900 text-gray-900 dark:text-white ${
                error
                  ? 'border-red-400'
                  : 'border-gray-200 dark:border-forest-600 focus:border-forest-400'
              }`}
              placeholder="Password"
            />
            {error && <p className="text-base text-red-500 mt-2">{error}</p>}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-forest-600 hover:bg-forest-700 disabled:opacity-50 text-white font-semibold rounded-xl py-3 text-base transition-colors"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
