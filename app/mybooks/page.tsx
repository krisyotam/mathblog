"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { CommandMenu } from "@/components/command-menu"
import { WorkbookCard } from "@/components/WorkbookCard"
import { WorkbookModal } from "@/components/WorkbookModal"
import { Input } from "@/components/ui/input"

interface Book {
  id: string
  cover: string
  name: string
  subtitle: string
  author: string
  datePublished: string
  subject: string
  categories: string[]
  latex_link: string
  pdf_link: string
  description: string
  status: "active" | "que" | "dropped" | "finished"
}

const MyBooksPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([])
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [subjects, setSubjects] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("/api/mybooks")
        if (!response.ok) {
          throw new Error("Failed to fetch books")
        }
        const data = await response.json()

        // Ensure data is an array before setting it
        if (Array.isArray(data)) {
          setBooks(data)
          const uniqueSubjects: string[] = Array.from(new Set(data.map((b) => b.subject)))
          setSubjects(uniqueSubjects)
        } else {
          throw new Error("Invalid data format")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load books")
        setBooks([]) // Reset to empty array on error
      }
    }

    fetchBooks()
  }, [])

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesSubject = !selectedSubject || selectedSubject === "All" || book.subject === selectedSubject

    return matchesSearch && matchesSubject
  })

  return (
    <main className="min-h-screen px-4 py-8 bg-background text-foreground">
      <nav className="max-w-2xl mx-auto mb-16">
        <div className="flex items-center space-x-1 text-sm font-mono">
          <Link href="/" className="text-muted-foreground">
            @krisyotam
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-muted-foreground">My Books</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-normal mb-8">My Books</h1>
        <p className="text-sm text-muted-foreground mb-8">
          This is a list of books I am writing. Each book is marked with a status to indicate my progress. Books marked
          as <strong>active</strong> are currently being read, while those marked as <strong>que</strong> are next in
          line to be read. Books with a <strong>dropped</strong> status are temporarily set aside, and those marked as{" "}
          <strong>finished</strong> have been completed and are available for reference.
        </p>

        {error ? (
          <div className="text-red-500 mb-4">{error}</div>
        ) : (
          <>
            {/* Search Bar */}
            <div className="mb-8">
              <Input
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Subject Filters */}
            <div className="mb-8">
              <div className="grid grid-cols-5 gap-2">
                {/* "All" Category Button */}
                <button
                  onClick={() => setSelectedSubject(selectedSubject === "All" ? null : "All")}
                  className={`p-2 text-sm rounded-md transition-colors ${
                    selectedSubject === "All" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  All
                </button>
                {subjects.map((subject) => (
                  <button
                    key={subject}
                    onClick={() => setSelectedSubject(subject === selectedSubject ? null : subject)}
                    className={`p-2 text-sm rounded-md transition-colors ${
                      subject === selectedSubject ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>

            {/* Book Cards */}
            <div className="grid gap-4 md:grid-cols-2">
              {filteredBooks.map((book) => (
                <WorkbookCard
                  key={book.id}
                  cover={book.cover}
                  name={book.name}
                  subtitle={book.subtitle}
                  author={book.author}
                  status={book.status}
                  onClick={() => setSelectedBook(book)}
                />
              ))}
            </div>

            {/* Modal */}
            <WorkbookModal
              isOpen={!!selectedBook}
              onClose={() => setSelectedBook(null)}
              workbook={selectedBook}
              status={selectedBook?.status || "active"}
            />
          </>
        )}
      </div>
      <CommandMenu />
    </main>
  )
}

export default MyBooksPage
