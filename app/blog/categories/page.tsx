import Link from "next/link"
import { CommandMenu } from "@/components/command-menu"
import { getPosts, type GhostPost } from "@/utils/ghost"

export const revalidate = 3600 // Revalidate every hour

export default async function CategoriesPage() {
  let posts: GhostPost[] = []
  let error: string | null = null
  const categoriesCount: { [key: string]: number } = {}

  try {
    posts = await getPosts()

    // Count categories, excluding '#krispuremath', 'krismathblog-notes', and 'krismathblog-now'
    posts.forEach((post) => {
      post.tags.forEach((tag) => {
        if (tag.name !== "#krispuremath" && tag.name !== "krismathblog-notes" && tag.name !== "krismathblog-now") {
          categoriesCount[tag.name] = (categoriesCount[tag.name] || 0) + 1
        }
      })
    })
  } catch (err) {
    console.error("Error in Categories component:", err)
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
          <Link href="/blog" className="hover:text-muted-foreground">
            Blog
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-muted-foreground">Categories</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto mb-12">
        <h1 className="text-xl font-normal mb-8">Categories</h1>
        {error ? (
          <p className="text-destructive">{error}</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2">Category</th>
                <th className="text-right py-2">Posts</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(categoriesCount).map(([category, count]) => (
                <tr key={category} className="border-b border-border">
                  <td className="py-2">
                    <Link
                      href={`/blog/category/${encodeURIComponent(category)}`}
                      className="hover:text-muted-foreground"
                    >
                      {category}
                    </Link>
                  </td>
                  <td className="text-right py-2">{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <CommandMenu />
    </main>
  )
}

