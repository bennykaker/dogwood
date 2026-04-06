'use client'

import { useState, useRef, useEffect } from 'react'

type Message = {
  role: 'user' | 'assistant'
  content: string
  escalated?: boolean
}

const CHIPS = [
  'Do I need earthquake insurance for my Vancouver condo?',
  'How does ICBC Enhanced Care work?',
  'What does tenant insurance cover in BC?',
  'Strata vs personal condo insurance — what\'s the difference?',
]

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-coral-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
        D
      </div>
      <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
        <span className="typing-dot w-1.5 h-1.5 rounded-full bg-gray-400 inline-block" />
        <span className="typing-dot w-1.5 h-1.5 rounded-full bg-gray-400 inline-block" />
        <span className="typing-dot w-1.5 h-1.5 rounded-full bg-gray-400 inline-block" />
      </div>
    </div>
  )
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
          isUser ? 'bg-coral-500 text-white' : 'bg-coral-500 text-white'
        }`}
      >
        {isUser ? 'You' : 'D'}
      </div>
      <div className={`max-w-[78%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
            isUser
              ? 'bg-coral-500 text-white rounded-tr-sm'
              : 'bg-gray-100 text-gray-800 rounded-tl-sm'
          }`}
        >
          {msg.content}
        </div>
        {msg.escalated && (
          <p className="text-xs text-amber-600 font-medium px-1">
            We&apos;ve flagged this for a real person. Check back soon.
          </p>
        )}
      </div>
    </div>
  )
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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

    // Reset textarea height
    if (textareaRef.current) textareaRef.current.style.height = 'auto'

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
    // Auto-resize
    e.target.style.height = 'auto'
    e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`
  }

  const showChips = messages.length === 0

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Suggested chips */}
      {showChips && (
        <div className="flex flex-wrap gap-2 mb-4 px-1">
          {CHIPS.map(chip => (
            <button
              key={chip}
              onClick={() => sendMessage(chip)}
              className="text-xs text-coral-600 bg-coral-50 border border-coral-200 rounded-full px-3 py-1.5 hover:bg-coral-100 transition-colors text-left leading-snug"
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      {/* Message history */}
      <div className="flex-1 min-h-0 overflow-y-auto chat-scroll flex flex-col gap-4 pb-2">
        {messages.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">
            Ask anything about BC insurance. No judgment.
          </div>
        )}
        {messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} />
        ))}
        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="mt-4 flex gap-2 items-end border border-gray-200 rounded-2xl p-2 bg-white shadow-sm focus-within:border-coral-300 transition-colors">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Ask about BC insurance…"
          rows={1}
          disabled={loading}
          className="flex-1 resize-none bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none py-1.5 px-2 leading-relaxed"
          style={{ maxHeight: '160px' }}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || loading}
          className="w-9 h-9 rounded-xl bg-coral-500 hover:bg-coral-600 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0 transition-colors"
          aria-label="Send"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
      <p className="text-center text-xs text-gray-400 mt-2">Enter to send · Shift+Enter for new line</p>
    </div>
  )
}
