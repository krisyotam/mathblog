import Link from "next/link"
import { CommandMenu } from "@/components/command-menu"
import type { GhostPost } from "@/utils/ghost"
import * as Collapsible from "@radix-ui/react-collapsible"
import { ChevronDown, ChevronRight } from "lucide-react"

const apiKey = process.env.GHOST_CONTENT_API_KEY
const apiUrl = process.env.GHOST_API_URL

export const revalidate = 3600 // Revalidate every hour

async function getNotesPosts(): Promise<GhostPost[]> {
  const url = new URL("/ghost/api/v3/content/posts/", apiUrl)
  url.searchParams.append("key", apiKey || "")
  url.searchParams.append("filter", "tag:krismathblog-notes")
  url.searchParams.append("limit", "all")
  url.searchParams.append("include", "tags")

  const res = await fetch(url.toString())
  if (!res.ok) {
    throw new Error("Failed to fetch posts")
  }
  const data = await res.json()
  return data.posts
}

export default async function NotesPage() {
  let posts: GhostPost[] = []
  let error: string | null = null
  const categories: { [key: string]: GhostPost[] } = {}

  try {
    console.log("Fetching posts for Notes page...")
    posts = await getNotesPosts()
    console.log("Fetched posts for Notes page:", posts.length)

    // Group posts by category (third tag)
    posts.forEach((post) => {
      const categoryTag = post.tags.find((tag) => tag.name !== "#krispuremath" && tag.name !== "krismathblog-notes")
      const category = categoryTag ? categoryTag.name : "Uncategorized"

      if (!categories[category]) {
        categories[category] = []
      }
      categories[category].push(post)
    })

    console.log("Categorized posts:", Object.keys(categories).length)
  } catch (err) {
    console.error("Error in Notes component:", err)
    error = err instanceof Error ? err.message : "An error occurred while fetching posts."
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
        <div className="space-y-4">
          {error ? (
            <p className="text-destructive">{error}</p>
          ) : Object.keys(categories).length > 0 ? (
            Object.entries(categories).map(([category, categoryPosts]) => (
              <Collapsible.Root key={category} className="border border-border rounded-lg">
                <Collapsible.Trigger className="flex items-center justify-between w-full p-4 text-left">
                  <h2 className="text-lg font-medium capitalize">{category}</h2>
                  <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform duration-200" />
                </Collapsible.Trigger>
                <Collapsible.Content>
                  <ul className="p-4 pt-0 space-y-2">
                    {categoryPosts.map((post) => (
                      <li key={post.slug} className="flex items-center">
                        <ChevronRight className="h-4 w-4 text-muted-foreground mr-2" />
                        <Link
                          href={`/notes/${post.slug}`}
                          className="text-foreground hover:text-muted-foreground transition-colors"
                        >
                          {post.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Collapsible.Content>
              </Collapsible.Root>
            ))
          ) : (
            <p className="text-muted-foreground">No notes available at the moment. Check back soon!</p>
          )}
        </div>
      </div>
      <CommandMenu />
    </main>
  )
}

