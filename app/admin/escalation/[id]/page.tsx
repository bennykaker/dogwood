'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../../../lib/supabase'

type Escalation = {
  id: string
  created_at: string
  question: string
  dogwood_reply: string
  status: string
  answer: string | null
  answered_by_name: string | null
  answered_at: string | null
  reviewer_name: string | null
  reviewed_at: string | null
  published_at: string | null
}

const STATUS_NEXT: Record<string, string> = {
  pending: 'draft',
  draft: 'in_review',
  in_review: 'published',
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  draft: 'Draft',
  in_review: 'In Review',
  published: 'Published',
}

function formatDate(iso: string | null) {
  if (!iso) return ''
  return new Date(iso).toLocaleString('en-CA', {
    timeZone: 'America/Vancouver',
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function EscalationPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()

  const [item, setItem] = useState<Escalation | null>(null)
  const [adminId, setAdminId] = useState('')
  const [adminName, setAdminName] = useState('')
  const [answer, setAnswer] = useState('')
  const [saving, setSaving] = useState(false)
  const [advancing, setAdvancing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.replace('/admin/login'); return }
      setAdminId(session.user.id)
      supabase.from('admin_profiles').select('name').eq('id', session.user.id).single()
        .then(({ data }) => { if (data) setAdminName(data.name) })
    })
  }, [router])

  useEffect(() => {
    if (!id) return
    supabase.from('escalations').select('*').eq('id', id).single()
      .then(({ data }) => {
        if (data) {
          setItem(data)
          setAnswer(data.answer ?? '')
        }
      })
  }, [id])

  async function saveDraft() {
    if (!item || !adminId) return
    setSaving(true)
    setError('')
    const { error: err } = await supabase.from('escalations').update({
      answer: answer.trim(),
      answered_by: adminId,
      answered_by_name: adminName,
      answered_at: new Date().toISOString(),
      status: item.status === 'pending' ? 'draft' : item.status,
    }).eq('id', item.id)

    if (err) {
      setError('Failed to save. Try again.')
    } else {
      setItem(prev => prev ? {
        ...prev,
        answer: answer.trim(),
        answered_by_name: adminName,
        status: prev.status === 'pending' ? 'draft' : prev.status,
      } : prev)
    }
    setSaving(false)
  }

  async function advanceStatus() {
    if (!item) return
    const next = STATUS_NEXT[item.status]
    if (!next) return
    setAdvancing(true)
    setError('')

    const updates: Record<string, string> = { status: next }
    if (next === 'in_review') {
      updates.reviewer_name = adminName
      updates.reviewed_at = new Date().toISOString()
    }
    if (next === 'published') {
      updates.published_at = new Date().toISOString()
    }

    const { error: err } = await supabase.from('escalations').update(updates).eq('id', item.id)

    if (err) {
      setError('Failed to update status. Try again.')
    } else {
      setItem(prev => prev ? { ...prev, ...updates } : prev)
    }
    setAdvancing(false)
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-forest-900 flex items-center justify-center">
        <p className="text-base text-gray-400 dark:text-forest-400">Loading…</p>
      </div>
    )
  }

  const nextStatus = STATUS_NEXT[item.status]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-forest-900">
      {/* Header */}
      <div className="bg-forest-700 px-4 py-4 flex items-center gap-4">
        <Link href="/admin/dashboard" className="text-forest-200 hover:text-white transition-colors text-base">
          ← Dashboard
        </Link>
        <span className="font-serif text-xl text-white">Question</span>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-6">

        {/* Status + date */}
        <div className="flex items-center gap-4">
          <span className={`text-sm font-semibold rounded-full px-3 py-1 ${
            item.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400' :
            item.status === 'draft' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400' :
            item.status === 'in_review' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400' :
            'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400'
          }`}>
            {STATUS_LABELS[item.status]}
          </span>
          <span className="text-base text-gray-400 dark:text-forest-400">{formatDate(item.created_at)}</span>
        </div>

        {/* Question */}
        <div className="bg-white dark:bg-forest-800 border border-gray-200 dark:border-forest-700 rounded-xl p-5">
          <p className="text-base font-semibold text-gray-500 dark:text-forest-400 uppercase tracking-wide mb-3">Question</p>
          <p className="text-base text-gray-900 dark:text-white">{item.question}</p>
        </div>

        {/* Dogwood's response */}
        <div className="bg-white dark:bg-forest-800 border border-gray-200 dark:border-forest-700 rounded-xl p-5">
          <p className="text-base font-semibold text-gray-500 dark:text-forest-400 uppercase tracking-wide mb-3">Dogwood's response</p>
          <p className="text-base text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{item.dogwood_reply}</p>
        </div>

        {/* Answer box */}
        <div className="bg-white dark:bg-forest-800 border border-gray-200 dark:border-forest-700 rounded-xl p-5">
          <p className="text-base font-semibold text-gray-500 dark:text-forest-400 uppercase tracking-wide mb-3">
            Human answer
            {item.answered_by_name && item.status !== 'pending' && (
              <span className="ml-3 normal-case font-normal text-gray-400 dark:text-forest-400">
                by {item.answered_by_name} · {formatDate(item.answered_at)}
              </span>
            )}
          </p>
          {item.status === 'published' ? (
            <p className="text-base text-gray-900 dark:text-white whitespace-pre-wrap leading-relaxed">{item.answer}</p>
          ) : (
            <textarea
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              rows={8}
              placeholder="Write your answer here…"
              className="w-full border border-gray-200 dark:border-forest-600 rounded-xl px-4 py-3 text-base outline-none focus:border-forest-400 bg-white dark:bg-forest-900 text-gray-900 dark:text-white resize-none leading-relaxed"
            />
          )}
        </div>

        {/* Review trail */}
        {(item.reviewer_name || item.published_at) && (
          <div className="bg-white dark:bg-forest-800 border border-gray-200 dark:border-forest-700 rounded-xl p-5 flex flex-col gap-2">
            <p className="text-base font-semibold text-gray-500 dark:text-forest-400 uppercase tracking-wide mb-1">Review trail</p>
            {item.reviewer_name && (
              <p className="text-base text-gray-600 dark:text-gray-300">
                Reviewed by {item.reviewer_name} · {formatDate(item.reviewed_at)}
              </p>
            )}
            {item.published_at && (
              <p className="text-base text-gray-600 dark:text-gray-300">
                Published · {formatDate(item.published_at)}
              </p>
            )}
          </div>
        )}

        {error && <p className="text-base text-red-500">{error}</p>}

        {/* Action buttons */}
        {item.status !== 'published' && (
          <div className="flex items-center gap-3">
            <button
              onClick={saveDraft}
              disabled={saving || !answer.trim()}
              className="px-6 py-3 rounded-xl bg-forest-600 hover:bg-forest-700 disabled:opacity-40 text-white text-base font-semibold transition-colors"
            >
              {saving ? 'Saving…' : 'Save draft'}
            </button>

            {nextStatus && item.answer && (
              <button
                onClick={advanceStatus}
                disabled={advancing}
                className="px-6 py-3 rounded-xl bg-white dark:bg-forest-800 border border-forest-400 dark:border-forest-500 text-forest-700 dark:text-forest-200 hover:bg-forest-50 dark:hover:bg-forest-700 disabled:opacity-40 text-base font-semibold transition-colors"
              >
                {advancing ? 'Updating…' : `Move to ${STATUS_LABELS[nextStatus]}`}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
