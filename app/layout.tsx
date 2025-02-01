// app/layout.tsx
import './globals.css' // Ensure this file exists in the correct location
import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/theme-provider'
import { CommandMenu } from '@/components/command-menu'

export const metadata: Metadata = {
  title: 'Kris Math Blog',
  description: 'Math history, pedagogy, notes, and research',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children} {/* This is where your page content will be rendered */}
          <CommandMenu /> {/* This will be displayed on all pages if you want */}
        </ThemeProvider>
      </body>
    </html>
  )
}
