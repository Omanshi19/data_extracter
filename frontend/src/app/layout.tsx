import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'StructurAId — Turn Chaos into Structure',
  description: 'AI-powered document data extraction. Feed it invoices, contracts, receipts. Get clean JSON back.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
