import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Dogwood — We help you ask better insurance questions',
  description: 'Dogwood generates expertly structured prompts for BC insurance questions. Take them to any AI and get genuinely expert answers.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased font-sans" style={{ backgroundColor: '#1a3a2a', color: '#f5f0e8' }}>
        {children}

        {/* Disclaimer — always visible */}
        <div style={{ background: '#78350f', borderTop: '1px solid #92400e' }}>
          <div className="max-w-3xl mx-auto px-6 py-3 text-center" style={{ color: '#fef3c7', fontSize: '13px' }}>
            Dogwood generates questions, not advice. We&apos;re not insurance advisors.{' '}
            Always verify with a licensed BC broker for coverage decisions.
          </div>
        </div>

        {/* Ad bar */}
        <div style={{ background: '#0f2419', borderTop: '1px solid #1e4a30' }}>
          <div className="max-w-3xl mx-auto px-6 py-2 flex items-center justify-between gap-4">
            <p style={{ color: '#4a7a5a', fontSize: '12px' }}>
              Dogwood is free. We keep the lights on with ads for non-insurance products.
            </p>
            <div
              className="flex-shrink-0 rounded border border-dashed flex items-center justify-center"
              style={{ width: '200px', height: '36px', borderColor: '#2a5a3a' }}
            >
              <span style={{ color: '#2a5a3a', fontSize: '11px' }}>Ad slot</span>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
