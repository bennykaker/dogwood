'use client'

import { useState, useEffect, useRef } from 'react'
import Nav from './components/Nav'

type Step = 1 | 2 | 3

function getSessionId(): string {
  try {
    let id = localStorage.getItem('dw_session')
    if (!id) { id = crypto.randomUUID(); localStorage.setItem('dw_session', id) }
    return id
  } catch { return crypto.randomUUID() }
}

export default function HomePage() {
  const [step, setStep] = useState<Step>(1)
  const [question, setQuestion] = useState('')
  const [generatedPrompt, setGeneratedPrompt] = useState('')
  const [aiResponse, setAIResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const sessionId = useRef<string>('')

  useEffect(() => { sessionId.current = getSessionId() }, [])

  async function handleGenerate() {
    if (!question.trim() || loading) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: question.trim(), sessionId: sessionId.current }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong')
      setGeneratedPrompt(data.prompt)
      setStep(2)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleRefine() {
    if (!aiResponse.trim() || loading) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalQuestion: question.trim(), aiResponse: aiResponse.trim(), sessionId: sessionId.current }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong')
      setGeneratedPrompt(data.prompt)
      setAIResponse('')
      setStep(2)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(generatedPrompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch { /* silent */ }
  }

  function handleStartOver() {
    setStep(1)
    setQuestion('')
    setGeneratedPrompt('')
    setAIResponse('')
    setError(null)
  }

  const card: React.CSSProperties = {
    background: '#142e20',
    border: '1px solid #1e4a30',
    borderRadius: '16px',
    padding: '32px',
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />

      <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-10 flex flex-col gap-8">

        {/* Step indicator */}
        <div className="flex items-center gap-3">
          {([1, 2, 3] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              {i > 0 && <div style={{ width: '24px', height: '1px', background: step >= s ? '#c1441a' : '#1e4a30' }} />}
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: step === s ? '#c1441a' : step > s ? 'rgba(193,68,26,0.3)' : '#1e4a30',
                color: step >= s ? '#f5f0e8' : '#4a7a5a',
                fontSize: '13px', fontWeight: 700, transition: 'all 0.2s',
              }}>
                {s}
              </div>
              <span style={{ fontSize: '13px', color: step === s ? '#f5f0e8' : '#4a7a5a', fontWeight: step === s ? 600 : 400 }}>
                {s === 1 ? 'Describe' : s === 2 ? 'Your prompt' : 'Refine'}
              </span>
            </div>
          ))}
        </div>

        {/* Step 1 — Describe */}
        {step === 1 && (
          <div style={card}>
            <h1 className="font-serif text-3xl mb-2" style={{ color: '#f5f0e8' }}>
              What&apos;s your insurance question?
            </h1>
            <p style={{ color: '#8ab89a', fontSize: '15px', marginBottom: '24px', lineHeight: 1.6 }}>
              Don&apos;t worry about using the right terms — just describe what&apos;s going on.
              We&apos;ll shape it into a question that gets you a genuinely expert answer.
            </p>
            <textarea
              value={question}
              onChange={e => setQuestion(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) handleGenerate() }}
              placeholder="Tell us about your insurance question or situation. For example: My strata sent me a letter saying I owe $45,000 after a flood in another unit. Is this normal? Do I have to pay it?"
              rows={7}
              style={{
                width: '100%', background: '#0f2419', border: '1px solid #1e4a30', borderRadius: '10px',
                padding: '16px', color: '#f5f0e8', fontSize: '16px', lineHeight: 1.6, outline: 'none',
                resize: 'vertical', boxSizing: 'border-box',
              }}
            />
            {error && (
              <p style={{ color: '#f87171', fontSize: '14px', marginTop: '10px' }}>{error}</p>
            )}
            <button
              onClick={handleGenerate}
              disabled={!question.trim() || loading}
              style={{
                marginTop: '16px', width: '100%', background: question.trim() && !loading ? '#c1441a' : '#1e4a30',
                border: 'none', borderRadius: '10px', padding: '14px', color: '#f5f0e8',
                fontSize: '16px', fontWeight: 700, cursor: question.trim() && !loading ? 'pointer' : 'not-allowed',
                transition: 'background 0.2s',
              }}
            >
              {loading ? 'Building your question…' : 'Generate My Question →'}
            </button>
          </div>
        )}

        {/* Step 2 — Generated prompt */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={card}>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h2 className="font-serif text-2xl" style={{ color: '#f5f0e8' }}>Your expert prompt</h2>
                  <p style={{ color: '#8ab89a', fontSize: '14px', marginTop: '4px' }}>
                    Copy this and paste it into ChatGPT, Claude, Gemini, or any AI you use.
                  </p>
                </div>
                <button
                  onClick={handleStartOver}
                  style={{ background: 'none', border: '1px solid #1e4a30', borderRadius: '8px', padding: '6px 12px', color: '#4a7a5a', fontSize: '13px', cursor: 'pointer', flexShrink: 0 }}
                >
                  Start over
                </button>
              </div>

              <pre style={{
                background: '#0f2419', border: '1px solid #1e4a30', borderRadius: '10px',
                padding: '20px', fontSize: '14px', color: '#c8dfc8', lineHeight: 1.7,
                whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0, fontFamily: 'inherit',
                maxHeight: '400px', overflowY: 'auto',
              }}>
                {generatedPrompt}
              </pre>

              <button
                onClick={handleCopy}
                style={{
                  marginTop: '16px', width: '100%',
                  background: copied ? 'rgba(193,68,26,0.2)' : '#c1441a',
                  border: `1px solid ${copied ? '#c1441a' : 'transparent'}`,
                  borderRadius: '10px', padding: '14px', color: '#f5f0e8',
                  fontSize: '16px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                {copied ? '✓ Copied to clipboard' : 'Copy Prompt'}
              </button>

              <div style={{ marginTop: '16px', textAlign: 'center' }}>
                <p style={{ color: '#8ab89a', fontSize: '14px', marginBottom: '8px' }}>
                  Come back if the answer wasn&apos;t what you needed.
                </p>
                <button
                  onClick={() => setStep(3)}
                  style={{ background: 'none', border: 'none', color: '#c1441a', fontSize: '14px', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Not what I needed? Refine it →
                </button>
              </div>
            </div>

            {/* Quick links to AI tools */}
            <div style={{ ...card, padding: '20px' }}>
              <p style={{ color: '#4a7a5a', fontSize: '13px', marginBottom: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Paste it into
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {[
                  { label: 'ChatGPT', href: 'https://chat.openai.com', note: 'free tier' },
                  { label: 'Claude', href: 'https://claude.ai', note: 'free tier' },
                  { label: 'Gemini', href: 'https://gemini.google.com', note: 'free tier' },
                  { label: 'Copilot', href: 'https://copilot.microsoft.com', note: 'free' },
                  { label: 'Meta AI', href: 'https://meta.ai', note: 'free' },
                ].map(({ label, href, note }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '5px',
                      background: '#0f2419', border: '1px solid #1e4a30', borderRadius: '8px',
                      padding: '6px 12px', fontSize: '13px', color: '#c8dfc8', textDecoration: 'none', fontWeight: 600,
                    }}
                  >
                    {label}
                    <span style={{ fontSize: '10px', color: '#4ade80', fontWeight: 700 }}>{note}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3 — Refine */}
        {step === 3 && (
          <div style={card}>
            <button
              onClick={() => setStep(2)}
              style={{ background: 'none', border: 'none', color: '#4a7a5a', fontSize: '14px', cursor: 'pointer', padding: 0, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              ← Back to your prompt
            </button>
            <h2 className="font-serif text-2xl mb-2" style={{ color: '#f5f0e8' }}>
              Let&apos;s improve it
            </h2>
            <p style={{ color: '#8ab89a', fontSize: '15px', marginBottom: '24px', lineHeight: 1.6 }}>
              Paste the answer you got. We&apos;ll analyse what was missing and generate a better
              follow-up question that targets the gaps.
            </p>
            <textarea
              value={aiResponse}
              onChange={e => setAIResponse(e.target.value)}
              placeholder="Paste the AI's response here…"
              rows={8}
              style={{
                width: '100%', background: '#0f2419', border: '1px solid #1e4a30', borderRadius: '10px',
                padding: '16px', color: '#f5f0e8', fontSize: '15px', lineHeight: 1.6, outline: 'none',
                resize: 'vertical', boxSizing: 'border-box',
              }}
            />
            {error && (
              <p style={{ color: '#f87171', fontSize: '14px', marginTop: '10px' }}>{error}</p>
            )}
            <button
              onClick={handleRefine}
              disabled={!aiResponse.trim() || loading}
              style={{
                marginTop: '16px', width: '100%',
                background: aiResponse.trim() && !loading ? '#c1441a' : '#1e4a30',
                border: 'none', borderRadius: '10px', padding: '14px', color: '#f5f0e8',
                fontSize: '16px', fontWeight: 700, cursor: aiResponse.trim() && !loading ? 'pointer' : 'not-allowed',
                transition: 'background 0.2s',
              }}
            >
              {loading ? 'Refining…' : 'Generate Follow-up Prompt →'}
            </button>
          </div>
        )}

      </main>
    </div>
  )
}
