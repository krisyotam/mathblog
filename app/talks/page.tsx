'use client';

import Link from 'next/link'
import { CommandMenu } from '@/components/command-menu'
import { Play } from 'lucide-react'
import { useEffect, useState } from 'react'

// Define the structure of each talk
interface Talk {
  title: string;
  videoId: string;
  duration: string;
  date: string;
  description: string;
}

export default function TalksPage() {
  const [talks, setTalks] = useState<Talk[]>([]); // Specify the type here

  useEffect(() => {
    fetch('/api/talks')
      .then(response => response.json())
      .then((data: Talk[]) => setTalks(data)); // Type the data explicitly
  }, []);

  return (
    <main className="min-h-screen px-4 py-8 bg-background text-foreground">
      <nav className="max-w-2xl mx-auto mb-16">
        <div className="flex items-center space-x-1 text-sm font-mono">
          <Link href="/" className="text-muted-foreground">@krisyotam</Link>
          <span className="text-muted-foreground">/</span>
          <Link href="/" className="hover:text-muted-foreground">Home</Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-muted-foreground">Talks</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-xl font-normal mb-4">Talks</h1>
        <p className="text-sm text-muted-foreground mb-8">
          This page lists some of the talks I gave recently in the context of my master's degree. I made them with the yet to be released mathematical presentation framework.
        </p>

        <div className="space-y-12">
          {talks.map((talk) => (
            <div key={talk.title} className="group">
              <div className="relative aspect-video mb-4 rounded-lg overflow-hidden bg-muted">
                <a
                  href={`https://youtube.com/watch?v=${talk.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full h-full group-hover:opacity-90 transition-opacity"
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Play className="w-12 h-12 text-primary opacity-80 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <img
                    src={`https://img.youtube.com/vi/${talk.videoId}/maxresdefault.jpg`}
                    alt={talk.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 right-2 bg-background bg-opacity-75 text-foreground text-xs px-2 py-1 rounded">
                    {talk.duration}
                  </div>
                </a>
              </div>
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-sm font-medium">{talk.title}</h2>
                  <time className="text-xs text-muted-foreground whitespace-nowrap">
                    {talk.date}
                  </time>
                </div>
                <p className="text-sm text-muted-foreground">
                  {talk.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CommandMenu />
    </main>
  )
}
