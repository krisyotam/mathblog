"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CommandMenu } from "@/components/command-menu"
import { Input } from "@/components/ui/input"
import { LectureNoteCard } from "@/components/lecture-note-card"

interface LectureNote {
  id: string
  code: string
  title: string
  description: string
  image: string
  credits: number
  syllabusLink: string
  latexLink: string
  fullNotesLink: string
  category: string
  tags: string[]
}

export default function LectureNotesPage() {
  const [notes, setNotes] = useState<LectureNote[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [categories, setCategories] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/lecture-notes")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setNotes(data)

        // Extract unique categories
        const cats = new Set(data.map((note: LectureNote) => note.category)) as Set<string>
        setCategories(cats)
      } catch (err) {
        console.error("Error fetching lecture notes:", err)
        setError(err instanceof Error ? err.message : "An error occurred while fetching lecture notes.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchNotes()
  }, [])

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.code.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = !selectedCategory || note.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  if (isLoading) {
    return (
      <main className="min-h-screen px-4 py-8 bg-background text-foreground">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-muted-foreground">Loading lecture notes...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen px-4 py-8 bg-background text-foreground">
      <nav className="max-w-2xl mx-auto mb-16">
        <div className="flex items-center space-x-1 text-sm font-mono">
          <Link href="/" className="text-muted-foreground">
            @krisyotam
          </Link>
          <span className="text-muted-foreground">/</span>
          <Link href="/" className="hover:text-muted-foreground">
            Home
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-muted-foreground">Lecture Notes</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-normal mb-4">Lecture Notes</h1>
          <p className="text-sm text-muted-foreground mb-8">
            A collection of mathematics lecture notes with downloadable materials in both LaTeX and PDF formats.
          </p>

          {/* Search and Filters */}
          <div className="space-y-4">
            <Input
              placeholder="Search lecture notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />

            {/* Categories Filters */}
            <div className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={() => setSelectedCategory(null)} 
                className={`p-2 text-sm rounded-md transition-colors ${selectedCategory === null ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
              >
                All Categories
              </button>
              {Array.from(categories).map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`p-2 text-sm rounded-md transition-colors ${selectedCategory === category ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error ? (
          <p className="text-center text-destructive mt-8">{error}</p>
        ) : filteredNotes.length === 0 ? (
          <p className="text-center text-muted-foreground mt-8">No lecture notes found matching your criteria.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredNotes.map((note) => (
              <LectureNoteCard
                key={note.id}
                code={note.code}
                title={note.title}
                description={note.description}
                image={note.image}
                credits={note.credits}
                syllabusLink={note.syllabusLink}
                latexLink={note.latexLink}
                fullNotesLink={note.fullNotesLink}
                tags={note.tags} // Tags are still part of the notes but not displayed
              />
            ))}
          </div>
        )}
      </div>
      <CommandMenu />
    </main>
  )
}
