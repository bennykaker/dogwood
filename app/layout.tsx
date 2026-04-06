import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Dogwood — BC insurance questions, answered instantly',
  description: 'Ask anything about BC insurance — ICBC, strata, home, tenant, and more. Free, instant, BC-specific.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-gray-50 text-gray-900 antialiased font-sans min-h-screen">
        {children}
      </body>
    </html>
  )
}
