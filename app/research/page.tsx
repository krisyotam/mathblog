"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { CommandMenu } from "@/components/command-menu"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ResearchCard } from "@/components/research-card";

interface Research {
  title: string
  abstract: string
  importance: string
  authors: string[]
  subject: string
  keywords: string[]
  postedBy: string
  postedOn: string
  bibliography: string[]
  img: string
  pdfLink: string
  sourceLink: string
  category: string
  tags: string[]
}

export default function ResearchPage() {
  const [research, setResearch] = useState<Research[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [categories, setCategories] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchResearch = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/research")
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        if (!Array.isArray(data)) {
          throw new Error("Invalid data format received")
        }
        setResearch(data)
        const cats = new Set(data.map((item: Research) => item.category))
        setCategories(cats)
      } catch (err) {
        console.error("Error fetching research:", err)
        setError(err instanceof Error ? err.message : "An error occurred while fetching research.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchResearch()
  }, [])

  const filteredResearch = research.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.keywords.some((keyword) => keyword.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = !selectedCategory || item.category === selectedCategory

    return matchesSearch && matchesCategory
  })

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
          <span className="text-muted-foreground">Research</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-normal mb-4">Research</h1>
          <p className="text-sm text-muted-foreground mb-8">
            A collection of my active research and publications. Click on any project to view more details. 
            I am currently an Undergraduate at Indiana University for those wondering.
          </p>

          {/* Search and Filters */}
          <div className="space-y-4">
            <Input
              placeholder="Search research..."
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
        ) : filteredResearch.length === 0 ? (
          <p className="text-center text-muted-foreground mt-8">No research found matching your criteria.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredResearch.map((item) => (
              <ResearchCard dateStarted={""} status={""} id={""} key={item.title} {...item} />
            ))}
          </div>
        )}
      </div>

      <CommandMenu />
    </main>
  )
}
