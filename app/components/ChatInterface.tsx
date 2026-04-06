'use client'

import { useState, useRef, useEffect } from 'react'

type Message = {
  role: 'user' | 'assistant'
  content: string
  escalated?: boolean
}

const PLUM = '#7b2d55'
const PLUM_DARK = '#251519'
const BUBBLE_BG = '#2e1620'
const BUBBLE_BORDER = '#4a2535'
const TEXT = '#f0e4eb'
const TEXT_MUTED = '#9a6070'

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-full flex items-center justify-center text-base font-bold flex-shrink-0 text-white" style={{ backgroundColor: PLUM }}>
        D
      </div>
      <div className="rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5" style={{ backgroundColor: BUBBLE_BG, border: `1px solid ${BUBBLE_BORDER}` }}>
        <span className="typing-dot w-2 h-2 rounded-full inline-block" style={{ backgroundColor: PLUM }} />
        <span className="typing-dot w-2 h-2 rounded-full inline-block" style={{ backgroundColor: PLUM }} />
        <span className="typing-dot w-2 h-2 rounded-full inline-block" style={{ backgroundColor: PLUM }} />
      </div>
    </div>
  )
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center text-base font-bold flex-shrink-0 text-white"
        style={{ backgroundColor: PLUM }}
      >
        {isUser ? 'You' : 'D'}
      </div>
      <div className={`max-w-[80%] flex flex-col gap-1.5 ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className="px-4 py-3 rounded-2xl text-base leading-relaxed whitespace-pre-wrap"
          style={isUser
            ? { backgroundColor: PLUM, color: TEXT, borderRadius: '1rem', borderTopRightRadius: '0.25rem' }
            : { backgroundColor: BUBBLE_BG, border: `1px solid ${BUBBLE_BORDER}`, color: TEXT, borderRadius: '1rem', borderTopLeftRadius: '0.25rem' }
          }
        >
          {msg.content}
        </div>
        {msg.escalated && (
          <p className="text-base font-medium px-1" style={{ color: '#c9884a' }}>
            We&apos;ve flagged this for a real person. Check back soon.
          </p>
        )}
      </div>
    </div>
  )
}

export default function ChatInterface({ pendingQuestion, onQuestionSent }: {
  pendingQuestion: string | null
  onQuestionSent: () => void
}) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (pendingQuestion) {
      sendMessage(pendingQuestion)
      onQuestionSent()
    }
  }, [pendingQuestion]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function sendMessage(text: string) {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    const userMsg: Message = { role: 'user', content: trimmed }
    const next = [...messages, userMsg]
    setMessages(next)
    setInput('')
    setLoading(true)

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next.map(m => ({ role: m.role, content: m.content })),
        }),
      })
      const data = await res.json()
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: data.reply, escalated: data.escalated },
      ])
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">

      {/* Input */}
      <div className="mb-5">
        <div
          className="flex gap-3 items-end rounded-2xl p-3 shadow-md transition-colors"
          style={{ backgroundColor: PLUM_DARK, border: `2px solid ${BUBBLE_BORDER}` }}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Ask your BC insurance question here…"
            rows={2}
            disabled={loading}
            autoFocus
            className="flex-1 resize-none bg-transparent text-base outline-none py-1 px-2 leading-relaxed"
            style={{ color: TEXT, maxHeight: '160px' }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            className="w-11 h-11 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0 transition-opacity"
            style={{ backgroundColor: PLUM }}
            aria-label="Send"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
        <p className="text-base mt-2 text-center" style={{ color: TEXT_MUTED }}>
          Enter to send · Shift+Enter for new line
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto chat-scroll flex flex-col gap-4 pb-2">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-16">
            <p className="text-base" style={{ color: TEXT_MUTED }}>
              Ask a question above or pick one from the list on the left.
            </p>
          </div>
        )}
        {messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} />
        ))}
        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
