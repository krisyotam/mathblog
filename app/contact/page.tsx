import Link from 'next/link'
import { CommandMenu } from '@/components/command-menu'

export default function ContactPage() {
  return (
    <main className="min-h-screen px-4 py-8 bg-background text-foreground">
      <nav className="max-w-2xl mx-auto mb-16">
        <div className="flex items-center space-x-1 text-sm font-mono">
          <Link href="/" className="text-muted-foreground">@krisyotam</Link>
          <span className="text-muted-foreground">/</span>
          <Link href="/work" className="hover:text-muted-foreground">Work</Link>
          <span className="text-muted-foreground">/</span>
          <Link href="/about" className="hover:text-muted-foreground">About</Link>
          <span className="text-muted-foreground">/</span>
          <Link href="/now" className="hover:text-muted-foreground">Now</Link>
          <span className="text-muted-foreground">/</span>
          <Link href="/contact" className="text-muted-foreground">Contact</Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-normal mb-8">Contact</h1>
        <div className="space-y-6">
          <p>
            I'm always open to interesting conversations and collaborations. Feel free to reach out through any of the following channels:
          </p>
          <ul className="space-y-4">
            <li>
              <strong className="font-medium">Email:</strong>{' '}
              <a href="mailto:krisyotam@protonmail.com" className="text-foreground hover:text-muted-foreground transition-colors">
                krisyotam@protonmail.com
              </a>
            </li>
            <li>
              <strong className="font-medium">Twitter:</strong>{' '}
              <a href="https://twitter.com/krisyotam" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-muted-foreground transition-colors">
                @krisyotam
              </a>
            </li>
            <li>
              <strong className="font-medium">GitHub:</strong>{' '}
              <a href="https://github.com/krisyotam" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-muted-foreground transition-colors">
                krisyotam
              </a>
            </li>
          </ul>
          <p>
            For professional inquiries, you can also find me on{' '}
            <a href="https://www.linkedin.com/in/krisyotam" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-muted-foreground transition-colors">
              LinkedIn
            </a>.
          </p>
          <p>
            I typically respond within 48 hours, but please allow for longer response times during busy periods.
          </p>
        </div>
      </div>
      <CommandMenu />
    </main>
  )
}

