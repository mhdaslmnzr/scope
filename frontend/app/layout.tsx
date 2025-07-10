import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SCOPE - Supply Chain Security Platform',
  description: 'Comprehensive supply chain security and risk management platform for healthcare, pharmaceutical, and biotechnology companies.',
  keywords: 'supply chain security, vendor risk management, cybersecurity, healthcare security, pharmaceutical security',
  authors: [{ name: 'SCOPE Security Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="font-poppins">
      <body className="font-poppins antialiased bg-gray-50 dark:bg-slate-950 text-render-optimized">
        {children}
      </body>
    </html>
  )
} 