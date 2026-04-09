'use client'

import { useState } from 'react'

type LogEntry = {
  id: number
  timestamp: string
  user_question: string
  generated_prompt: string
  prompt_type: 'initial' | 'refinement'
  session_id: string | null
  flagged: boolean
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<number | null>(null)
  const [generatingTemplate, setGeneratingTemplate] = useState(false)
  const [templateMsg, setTemplateMsg] = useState<string | null>(null)

  async function handleLogin() {
    if (password !== 'dogwood') { setError('Wrong password'); return }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/logs?password=${password}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setLogs(data.logs)
      setAuthed(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load logs')
    } finally {
      setLoading(false)
    }
  }

  async function handleFlag(id: number, flagged: boolean) {
    await fetch('/api/admin/flag', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, flagged, password }),
    })
    setLogs(prev => prev.map(l => l.id === id ? { ...l, flagged } : l))
  }

  async function handleGenerateTemplate() {
    if (!confirm('This will run Opus to generate a new master template. It costs ~$0.10–$0.50. Continue?')) return
    setGeneratingTemplate(true)
    setTemplateMsg(null)
    try {
      const res = await fetch('/api/setup-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setTemplateMsg('✓ New template generated and stored.')
    } catch (e) {
      setTemplateMsg(e instanceof Error ? e.message : 'Failed to generate template')
    } finally {
      setGeneratingTemplate(false)
    }
  }

  const s: React.CSSProperties = {
    background: '#1a3a2a', minHeight: '100vh', color: '#f5f0e8',
    fontFamily: '"DM Sans", system-ui, sans-serif',
  }

  const card: React.CSSProperties = {
    background: '#142e20', border: '1px solid #1e4a30', borderRadius: '12px', padding: '24px',
  }

  if (!authed) {
    return (
      <div style={{ ...s, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ ...card, width: '320px', textAlign: 'center' }}>
          <div style={{ fontFamily: '"DM Serif Display", serif', fontSize: '24px', marginBottom: '20px' }}>Dogwood Admin</div>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="Password"
            style={{
              width: '100%', background: '#0f2419', border: '1px solid #1e4a30', borderRadius: '8px',
              padding: '10px 14px', color: '#f5f0e8', fontSize: '15px', outline: 'none', boxSizing: 'border-box', marginBottom: '12px',
            }}
          />
          {error && <p style={{ color: '#f87171', fontSize: '14px', marginBottom: '10px' }}>{error}</p>}
          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              width: '100%', background: '#c1441a', border: 'none', borderRadius: '8px',
              padding: '10px', color: '#f5f0e8', fontSize: '15px', fontWeight: 700, cursor: 'pointer',
            }}
          >
            {loading ? 'Loading…' : 'Enter'}
          </button>
        </div>
      </div>
    )
  }

  const flagged = logs.filter(l => l.flagged)
  const initial = logs.filter(l => l.prompt_type === 'initial')
  const refinements = logs.filter(l => l.prompt_type === 'refinement')

  return (
    <div style={s}>
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
          <h1 style={{ fontFamily: '"DM Serif Display", serif', fontSize: '28px' }}>Dogwood Admin</h1>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {templateMsg && <span style={{ fontSize: '13px', color: '#4ade80' }}>{templateMsg}</span>}
            <button
              onClick={handleGenerateTemplate}
              disabled={generatingTemplate}
              style={{
                background: 'rgba(193,68,26,0.15)', border: '1px solid rgba(193,68,26,0.4)',
                borderRadius: '8px', padding: '8px 14px', color: '#f87171',
                fontSize: '13px', fontWeight: 600, cursor: 'pointer',
              }}
            >
              {generatingTemplate ? 'Running Opus…' : 'Regenerate master template'}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '28px' }}>
          {[
            { label: 'Total prompts', value: logs.length },
            { label: 'Refinements', value: refinements.length },
            { label: 'Flagged', value: flagged.length },
          ].map(({ label, value }) => (
            <div key={label} style={{ ...card, textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#c1441a' }}>{value}</div>
              <div style={{ fontSize: '13px', color: '#4a7a5a', marginTop: '4px' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Flagged entries */}
        {flagged.length > 0 && (
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#f87171', marginBottom: '12px' }}>
              Flagged for knowledge base ({flagged.length})
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {flagged.map(log => (
                <LogRow key={log.id} log={log} expanded={expanded} setExpanded={setExpanded} onFlag={handleFlag} password={password} />
              ))}
            </div>
          </div>
        )}

        {/* All logs */}
        <div>
          <h2 style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4a7a5a', marginBottom: '12px' }}>
            All prompts — {logs.length} total
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {logs.map(log => (
              <LogRow key={log.id} log={log} expanded={expanded} setExpanded={setExpanded} onFlag={handleFlag} password={password} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function LogRow({ log, expanded, setExpanded, onFlag, password }: {
  log: LogEntry
  expanded: number | null
  setExpanded: (id: number | null) => void
  onFlag: (id: number, flagged: boolean) => void
  password: string
}) {
  const isOpen = expanded === log.id
  const [generatingChunk, setGeneratingChunk] = useState(false)
  const [chunkMsg, setChunkMsg] = useState<string | null>(null)

  async function handleGenerateChunk() {
    setGeneratingChunk(true)
    setChunkMsg(null)
    try {
      const res = await fetch('/api/admin/generate-chunk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logId: log.id, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setChunkMsg(`✓ Added: "${data.topic}"`)
    } catch (e) {
      setChunkMsg(e instanceof Error ? e.message : 'Failed')
    } finally {
      setGeneratingChunk(false)
    }
  }

  return (
    <div style={{ background: '#142e20', border: `1px solid ${log.flagged ? 'rgba(248,113,113,0.3)' : '#1e4a30'}`, borderRadius: '10px', overflow: 'hidden' }}>
      <div
        onClick={() => setExpanded(isOpen ? null : log.id)}
        style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '14px 16px', cursor: 'pointer' }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{
              fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.05em',
              background: log.prompt_type === 'refinement' ? 'rgba(167,139,250,0.15)' : 'rgba(74,222,128,0.1)',
              color: log.prompt_type === 'refinement' ? '#a78bfa' : '#4ade80',
            }}>
              {log.prompt_type}
            </span>
            {log.flagged && <span style={{ fontSize: '10px', color: '#f87171' }}>🚩 flagged</span>}
            <span style={{ fontSize: '12px', color: '#4a7a5a', marginLeft: 'auto' }}>
              {new Date(log.timestamp).toLocaleString('en-CA', { dateStyle: 'short', timeStyle: 'short' })}
            </span>
          </div>
          <p style={{ fontSize: '14px', color: '#c8dfc8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: isOpen ? 'normal' : 'nowrap', lineHeight: 1.5 }}>
            {log.user_question}
          </p>
        </div>
        <span style={{ color: '#4a7a5a', fontSize: '12px', flexShrink: 0, paddingTop: '2px' }}>{isOpen ? '▲' : '▼'}</span>
      </div>

      {isOpen && (
        <div style={{ padding: '0 16px 16px', borderTop: '1px solid #1e4a30' }}>
          <div style={{ paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#4a7a5a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Raw question</div>
              <p style={{ fontSize: '14px', color: '#c8dfc8', lineHeight: 1.6 }}>{log.user_question}</p>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#4a7a5a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Generated prompt</div>
              <pre style={{ fontSize: '13px', color: '#8ab89a', lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word', background: '#0f2419', borderRadius: '8px', padding: '12px', margin: 0 }}>
                {log.generated_prompt}
              </pre>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                onClick={() => onFlag(log.id, !log.flagged)}
                style={{
                  background: log.flagged ? 'rgba(248,113,113,0.1)' : 'rgba(193,68,26,0.1)',
                  border: `1px solid ${log.flagged ? 'rgba(248,113,113,0.3)' : 'rgba(193,68,26,0.3)'}`,
                  borderRadius: '7px', padding: '6px 14px', fontSize: '13px', fontWeight: 600,
                  color: log.flagged ? '#f87171' : '#c1441a', cursor: 'pointer',
                }}
              >
                {log.flagged ? 'Remove flag' : '🚩 Flag for knowledge base'}
              </button>
              <button
                onClick={handleGenerateChunk}
                disabled={generatingChunk}
                style={{
                  background: 'rgba(74,222,128,0.08)',
                  border: '1px solid rgba(74,222,128,0.25)',
                  borderRadius: '7px', padding: '6px 14px', fontSize: '13px', fontWeight: 600,
                  color: generatingChunk ? '#2a5a3a' : '#4ade80', cursor: generatingChunk ? 'not-allowed' : 'pointer',
                }}
              >
                {generatingChunk ? 'Running Opus…' : '+ Generate knowledge chunk'}
              </button>
              {chunkMsg && (
                <span style={{ fontSize: '12px', color: chunkMsg.startsWith('✓') ? '#4ade80' : '#f87171' }}>
                  {chunkMsg}
                </span>
              )}
              {log.session_id && (
                <span style={{ fontSize: '12px', color: '#2a5a3a', marginLeft: 'auto' }}>
                  Session: {log.session_id.slice(0, 8)}…
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
