import Nav from './components/Nav'
import ChatInterface from './components/ChatInterface'

export default function HomePage() {
  return (
    <div className="flex flex-col h-screen">
      <Nav />

      {/* Disclaimer bar */}
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="max-w-4xl mx-auto px-4 py-2 text-xs text-amber-800 text-center leading-relaxed">
          General insurance information only — not legal or financial advice. For coverage decisions consult a licensed BC broker.
        </div>
      </div>

      {/* Ad bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            Dogwood is free. We keep the lights on with ads for non-insurance products. That&apos;s the deal.
          </p>
          {/* Placeholder ad slot */}
          <div className="flex-shrink-0 w-48 h-8 bg-gray-100 rounded border border-dashed border-gray-300 flex items-center justify-center">
            <span className="text-xs text-gray-400">Ad slot</span>
          </div>
        </div>
      </div>

      {/* Main */}
      <main className="flex-1 min-h-0 flex flex-col max-w-4xl w-full mx-auto px-4 py-6">
        {/* Hero */}
        <div className="mb-6">
          <h1 className="font-serif text-3xl sm:text-4xl text-gray-900 leading-tight mb-2">
            BC insurance questions,<br className="hidden sm:block" /> answered instantly.
          </h1>
          <p className="text-gray-500 text-sm">
            Ask about ICBC, strata, earthquake, tenant insurance, and more — specific to British Columbia.
          </p>
        </div>

        {/* Chat */}
        <ChatInterface />
      </main>
    </div>
  )
}
