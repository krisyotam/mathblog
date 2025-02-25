"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CommandMenu } from "@/components/command-menu"
import type { GhostPost } from "@/utils/ghost"

export default function NotesPage() {
  const [posts, setPosts] = useState<GhostPost[]>([])
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<{ [key: string]: GhostPost[] }>({})
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/notes")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const fetchedPosts = await response.json()

        // Group posts by category (third tag)
        const groupedPosts: { [key: string]: GhostPost[] } = {}
        fetchedPosts.forEach((post: GhostPost) => {
          const categoryTag = post.tags.find((tag) => tag.name !== "#krispuremath" && tag.name !== "krismathblog-notes")
          const category = categoryTag ? categoryTag.name : "Uncategorized"

          if (!groupedPosts[category]) {
            groupedPosts[category] = []
          }
          groupedPosts[category].push(post)
        })

        setPosts(fetchedPosts)
        setCategories(groupedPosts)
      } catch (err) {
        console.error("Error in Notes component:", err)
        setError(err instanceof Error ? err.message : "An error occurred while fetching posts.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [])

  // Calculate grid layout for categories
  const categoryNames = Object.keys(categories)
  const topRowCount = Math.ceil(categoryNames.length / 2)

  if (isLoading) {
    return (
      <main className="min-h-screen px-4 py-8 bg-background text-foreground">
        <div className="max-w-2xl mx-auto">
          <p className="text-center text-muted-foreground">Loading notes...</p>
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
          <span className="text-muted-foreground">Notes</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-normal mb-8">Notes</h1>

        {error ? (
          <p className="text-destructive">{error}</p>
        ) : categoryNames.length > 0 ? (
          <>
            {/* Category filters */}
            <div className="mb-8">
              <div className="grid grid-cols-2 gap-2">
                <div className="grid grid-cols-2 gap-2">
                  {categoryNames.slice(0, topRowCount).map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
                      className={`p-2 text-sm rounded-md transition-colors ${
                        category === selectedCategory
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {categoryNames.slice(topRowCount).map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
                      className={`p-2 text-sm rounded-md transition-colors ${
                        category === selectedCategory
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Notes list */}
            <div className="space-y-8">
              {(selectedCategory ? [selectedCategory] : categoryNames).map((category) => (
                <div key={category}>
                  <div className="grid gap-4">
                    {categories[category].map((post) => (
                      <Link
                        key={post.slug}
                        href={`/notes/${post.slug}`}
                        className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                      >
                        <h3 className="font-medium mb-2">{post.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(post.published_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-muted-foreground">No notes available at the moment. Check back soon!</p>
        )}
      </div>
      <CommandMenu />
    </main>
  )
}

