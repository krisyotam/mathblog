import Link from 'next/link'
import { CommandMenu } from '@/components/command-menu'

export default function AboutPage() {
  return (
    <main className="min-h-screen px-4 py-8 bg-background text-foreground">
      <nav className="max-w-2xl mx-auto mb-16">
        <div className="flex items-center space-x-1 text-sm font-mono">
          <Link href="/" className="text-gray-500 dark:text-gray-400">@krisyotam</Link>
          <span className="text-gray-500 dark:text-gray-400">/</span>
          <Link href="/" className="hover:text-gray-600 dark:hover:text-gray-300">Home</Link>
          <span className="text-gray-500 dark:text-gray-400">/</span>
          <span className="text-gray-600 dark:text-gray-300">About</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-normal mb-8">About</h1>
        <div className="space-y-6">
          <p>
            I'm Kris Yotam—a researcher, writer, and software engineer. I'm currently studying math, but I've always had a thing for making complex ideas easier to understand. I build things. Sometimes with code, sometimes with words.
          </p>
          <p>
            I'm not a big fan of fluff, but I'm always learning, always sharing, and maybe one day I'll contribute to open-source in more than just spirit.
          </p>
          <p>
            Connect with me on <a href="https://writing.exchange/@krisyotam" className="text-blue-600 hover:underline">Writing Exchange</a> or <a href="https://mathstodon.xyz/@krisyotam" className="text-blue-600 hover:underline">Mathstodon</a>.
          </p>
          <p>
            When I'm not coding or pondering mathematical structures, you can find me:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Writing about the philosophy of mathematics on my blog</li>
            <li>Exploring the latest developments in AI & Automation</li>
            <li>Practicing mindfulness and meditation</li>
          </ul>
          <p>
            I'm always eager to connect with like-minded individuals and explore new ideas. Feel free to reach out if you'd like to collaborate or just have an interesting conversation.
          </p>
        </div>
      </div>
      <CommandMenu />
    </main>
  )
}

