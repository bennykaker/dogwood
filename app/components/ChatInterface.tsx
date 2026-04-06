'use client'

import { useState, useRef, useEffect } from 'react'

type Message = {
  role: 'user' | 'assistant'
  content: string
  escalated?: boolean
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-full bg-forest-600 flex items-center justify-center text-white text-base font-bold flex-shrink-0">
        D
      </div>
      <div className="bg-forest-50 border border-forest-100 dark:bg-forest-700 dark:border-forest-600 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
        <span className="typing-dot w-2 h-2 rounded-full bg-forest-400 inline-block" />
        <span className="typing-dot w-2 h-2 rounded-full bg-forest-400 inline-block" />
        <span className="typing-dot w-2 h-2 rounded-full bg-forest-400 inline-block" />
      </div>
    </div>
  )
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user'
  const plum = '#7b2d55'
  return (
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center text-base font-bold flex-shrink-0 text-white"
        style={{ backgroundColor: isUser ? plum : '#059669' }}
      >
        {isUser ? 'You' : 'D'}
      </div>
      <div className={`max-w-[80%] flex flex-col gap-1.5 ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-4 py-3 rounded-2xl text-base leading-relaxed whitespace-pre-wrap ${
            isUser
              ? 'text-white rounded-tr-sm'
              : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm dark:bg-forest-700 dark:border-forest-600 dark:text-gray-100'
          }`}
          style={isUser ? { backgroundColor: plum } : {}}
        >
          {msg.content}
        </div>
        {msg.escalated && (
          <p className="text-base text-amber-600 dark:text-amber-400 font-medium px-1">
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

  // Fire pending question from sidebar
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

      {/* Prominent input at top */}
      <div className="mb-5">
        <div className="flex gap-3 items-end bg-white dark:bg-forest-800 border-2 border-forest-300 dark:border-forest-500 rounded-2xl p-3 shadow-md focus-within:border-forest-500 dark:focus-within:border-forest-400 transition-colors">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Ask your BC insurance question here…"
            rows={2}
            disabled={loading}
            autoFocus
            className="flex-1 resize-none bg-transparent text-base text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-forest-400 outline-none py-1 px-2 leading-relaxed"
            style={{ maxHeight: '160px' }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            className="w-11 h-11 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0 transition-colors"
            style={{ backgroundColor: '#7b2d55' }}
            aria-label="Send"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
        <p className="text-base text-gray-400 dark:text-forest-500 mt-2 text-center">
          Enter to send · Shift+Enter for new line
        </p>
      </div>

      {/* Message history */}
      <div className="flex-1 min-h-0 overflow-y-auto chat-scroll flex flex-col gap-4 pb-2">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-16 gap-3">
            <p className="text-base text-gray-400 dark:text-forest-400">
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
