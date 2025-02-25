import Link from "next/link"
import { notFound } from "next/navigation"
import { ContentRenderer } from "@/components/ContentRenderer"
import { CommandMenu } from "@/components/command-menu"
import { TableOfContents } from "@/components/TableOfContents"
import { Badge } from "@/components/ui/badge"

const apiKey = process.env.GHOST_CONTENT_API_KEY
const apiUrl = process.env.GHOST_API_URL

async function getTheoremData(slug: string) {
  try {
    const response = await fetch(`${process.env.VERCEL_URL}/api/theorems`)
    if (!response.ok) {
      throw new Error("Failed to fetch theorems data")
    }
    const data = await response.json()
    return data.theorems.find((t: any) => t.notesSlug === slug)
  } catch (error) {
    console.error("Error fetching theorem data:", error)
    return null
  }
}

export default async function TheoremNotePage({ params }: { params: { slug: string } }) {
  const { slug } = params

  if (!slug) {
    console.error("No theorem slug found in URL.")
    notFound()
  }

  if (!apiUrl) {
    console.error("API URL is not defined")
    notFound()
  }

  try {
    // Fetch theorem data for tags
    const theoremData = await getTheoremData(slug)

    // Fetch note content from Ghost
    const url = new URL("/ghost/api/v3/content/posts/", apiUrl)
    url.searchParams.append("key", apiKey || "")
    url.searchParams.append("filter", `slug:${slug}`)
    url.searchParams.append("include", "tags")

    const response = await fetch(url.toString())

    if (!response.ok) {
      throw new Error(`Failed to fetch theorem note data. Status: ${response.status}`)
    }

    const data = await response.json()

    if (!data.posts || data.posts.length === 0) {
      console.error("No theorem note found for slug:", slug)
      return <div>Theorem note not found</div>
    }

    const note = data.posts[0]

    if (!note.title || !note.html) {
      console.error("Incomplete theorem note data:", note)
      return <div>Error: Incomplete theorem note data</div>
    }

    const noteDate = new Date(note.published_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    return (
      <main className="min-h-screen px-4 py-8 bg-background text-foreground">
        <nav className="max-w-2xl mx-auto mb-16">
          <div className="flex items-center space-x-1 text-sm font-mono">
            <Link href="/" className="text-muted-foreground">
              @krisyotam
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link href="/theorems" className="hover:text-muted-foreground">
              Theorems
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-muted-foreground">{note.title}</span>
          </div>
        </nav>

        <article className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">{note.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
            <span>{noteDate}</span>
            {theoremData?.status && (
              <Badge variant={theoremData.status === "active" ? "secondary" : "default"}>
                {theoremData.status === "active" ? "Work in Progress" : "Completed"}
              </Badge>
            )}
          </div>

          {/* Tags from theorems.json */}
          {theoremData?.tags && theoremData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {theoremData.tags.map((tag: string) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Table of Contents */}
          <TableOfContents content={note.html} />

          {/* Main content */}
          <div className="book-content">
            <ContentRenderer content={note.html} />
          </div>
        </article>

        <CommandMenu />
      </main>
    )
  } catch (error) {
    console.error("Error in TheoremNotePage component:", error)
    notFound()
  }
}

export async function generateStaticParams() {
  if (!process.env.GHOST_API_URL) {
    console.error("GHOST_API_URL is not defined")
    return []
  }

  try {
    const url = new URL("/ghost/api/v3/content/posts/", process.env.GHOST_API_URL)
    url.searchParams.append("key", process.env.GHOST_CONTENT_API_KEY || "")
    url.searchParams.append("fields", "slug")
    url.searchParams.append("limit", "all")
    url.searchParams.append("filter", "tag:kris-theorems")

    const response = await fetch(url.toString())

    if (!response.ok) {
      throw new Error(`Failed to fetch theorem notes. Status: ${response.status}`)
    }

    const data = await response.json()

    return data.posts.map((post: { slug: string }) => ({
      slug: post.slug,
    }))
  } catch (error) {
    console.error("Error generating static params:", error)
    return []
  }
}

