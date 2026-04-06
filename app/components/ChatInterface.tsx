'use client'

import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'

type Message = {
  role: 'user' | 'assistant'
  content: string
  escalated?: boolean
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-full flex items-center justify-center text-base font-bold flex-shrink-0" style={{ backgroundColor: '#fff', color: '#000' }}>
        D
      </div>
      <div className="rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5" style={{ backgroundColor: '#1a1a1a', border: '1px solid #2e2e2e' }}>
        <span className="typing-dot w-2 h-2 rounded-full inline-block" style={{ backgroundColor: '#555' }} />
        <span className="typing-dot w-2 h-2 rounded-full inline-block" style={{ backgroundColor: '#555' }} />
        <span className="typing-dot w-2 h-2 rounded-full inline-block" style={{ backgroundColor: '#555' }} />
      </div>
    </div>
  )
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center text-base font-bold flex-shrink-0"
        style={isUser ? { backgroundColor: '#fff', color: '#000' } : { backgroundColor: '#fff', color: '#000' }}
      >
        {isUser ? 'Y' : 'D'}
      </div>
      <div className={`max-w-[80%] flex flex-col gap-1.5 ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className="px-4 py-3 text-base leading-relaxed"
          style={isUser
            ? { backgroundColor: '#fff', color: '#000', borderRadius: '1rem', borderTopRightRadius: '0.25rem' }
            : { backgroundColor: '#1a1a1a', border: '1px solid #2e2e2e', color: '#f5f5f5', borderRadius: '1rem', borderTopLeftRadius: '0.25rem' }
          }
        >
          {isUser ? msg.content : (
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                ul: ({ children }) => <ul className="list-disc pl-5 mb-2 flex flex-col gap-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-5 mb-2 flex flex-col gap-1">{children}</ol>,
                li: ({ children }) => <li>{children}</li>,
              }}
            >
              {msg.content}
            </ReactMarkdown>
          )}
        </div>
        {msg.escalated && (
          <p className="text-base font-medium px-1" style={{ color: '#888' }}>
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
          className="flex gap-3 items-end rounded-2xl p-3"
          style={{ backgroundColor: '#1a1a1a', border: '2px solid #333' }}
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
            style={{ color: '#f5f5f5', maxHeight: '160px' }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            className="w-11 h-11 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#fff' }}
            aria-label="Send"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
        <p className="text-base mt-2 text-center" style={{ color: '#555' }}>
          Enter to send · Shift+Enter for new line
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto chat-scroll flex flex-col gap-4 pb-2">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-16">
            <p className="text-base" style={{ color: '#555' }}>
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
