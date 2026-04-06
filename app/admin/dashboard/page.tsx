'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../../lib/supabase'

type Escalation = {
  id: string
  created_at: string
  question: string
  dogwood_reply: string
  status: 'pending' | 'draft' | 'in_review' | 'published'
  answered_by_name: string | null
  answer: string | null
}

const STATUS_TABS = ['pending', 'draft', 'in_review', 'published'] as const
type Status = typeof STATUS_TABS[number]

const STATUS_LABELS: Record<Status, string> = {
  pending: 'Pending',
  draft: 'Draft',
  in_review: 'In Review',
  published: 'Published',
}

const STATUS_COLORS: Record<Status, string> = {
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
  draft: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
  in_review: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400',
  published: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-CA', {
    timeZone: 'America/Vancouver',
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function DashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Status>('pending')
  const [items, setItems] = useState<Escalation[]>([])
  const [counts, setCounts] = useState<Record<Status, number>>({ pending: 0, draft: 0, in_review: 0, published: 0 })
  const [loading, setLoading] = useState(true)
  const [adminName, setAdminName] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/admin/login')
        return
      }
      // Fetch admin profile name
      supabase.from('admin_profiles').select('name').eq('id', session.user.id).single()
        .then(({ data }) => { if (data) setAdminName(data.name) })
    })
  }, [router])

  useEffect(() => {
    loadTab(activeTab)
    loadCounts()
  }, [activeTab])

  async function loadTab(status: Status) {
    setLoading(true)
    const { data } = await supabase
      .from('escalations')
      .select('id, created_at, question, dogwood_reply, status, answered_by_name, answer')
      .eq('status', status)
      .order('created_at', { ascending: false })
    setItems(data ?? [])
    setLoading(false)
  }

  async function loadCounts() {
    const { data } = await supabase
      .from('escalations')
      .select('status')
    if (!data) return
    const c = { pending: 0, draft: 0, in_review: 0, published: 0 }
    for (const row of data) {
      if (row.status in c) c[row.status as Status]++
    }
    setCounts(c)
  }

  async function signOut() {
    await supabase.auth.signOut()
    router.replace('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-forest-900">
      {/* Header */}
      <div className="bg-forest-700 px-4 py-4 flex items-center justify-between">
        <span className="font-serif text-xl text-white">Dogwood Admin</span>
        <div className="flex items-center gap-4">
          {adminName && <span className="text-base text-forest-200">{adminName}</span>}
          <button onClick={signOut} className="text-base text-forest-300 hover:text-white transition-colors">
            Sign out
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-forest-800 border-b border-gray-200 dark:border-forest-700">
        <div className="max-w-4xl mx-auto px-4 flex gap-1 pt-3">
          {STATUS_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-t-lg text-base font-medium transition-colors flex items-center gap-2 ${
                activeTab === tab
                  ? 'bg-forest-600 text-white'
                  : 'text-gray-500 dark:text-forest-400 hover:text-gray-800 dark:hover:text-white'
              }`}
            >
              {STATUS_LABELS[tab]}
              {counts[tab] > 0 && (
                <span className={`text-xs font-bold rounded-full px-2 py-0.5 ${
                  activeTab === tab ? 'bg-forest-500 text-white' : 'bg-gray-100 dark:bg-forest-700 text-gray-600 dark:text-forest-300'
                }`}>
                  {counts[tab]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {loading ? (
          <p className="text-base text-gray-400 dark:text-forest-400 text-center py-16">Loading…</p>
        ) : items.length === 0 ? (
          <p className="text-base text-gray-400 dark:text-forest-400 text-center py-16">
            No {STATUS_LABELS[activeTab].toLowerCase()} questions.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {items.map(item => (
              <Link
                key={item.id}
                href={`/admin/escalation/${item.id}`}
                className="block bg-white dark:bg-forest-800 border border-gray-200 dark:border-forest-700 rounded-xl p-5 hover:border-forest-400 dark:hover:border-forest-500 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <span className={`text-sm font-semibold rounded-full px-3 py-1 ${STATUS_COLORS[item.status]}`}>
                    {STATUS_LABELS[item.status]}
                  </span>
                  <span className="text-base text-gray-400 dark:text-forest-400 flex-shrink-0">{formatDate(item.created_at)}</span>
                </div>
                <p className="text-base font-medium text-gray-900 dark:text-white mb-1 line-clamp-2">{item.question}</p>
                {item.answered_by_name && (
                  <p className="text-base text-gray-400 dark:text-forest-400">Answered by {item.answered_by_name}</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
