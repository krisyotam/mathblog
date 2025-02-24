import Link from "next/link"
import { CommandMenu } from "@/components/command-menu"
import { getPosts, type GhostPost } from "@/utils/ghost"

export const revalidate = 3600 // Revalidate every hour

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const categoryName = decodeURIComponent(params.category)
  let posts: GhostPost[] = []
  let error: string | null = null

  try {
    const allPosts = await getPosts()
    posts = allPosts.filter((post) =>
      post.tags.some((tag) => tag.name === categoryName && tag.name !== "#krispuremath"),
    )
  } catch (err) {
    console.error("Error in Category component:", err)
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
          <Link href="/blog/categories" className="hover:text-muted-foreground">
            Categories
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-muted-foreground">{categoryName}</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto mb-12">
        <h1 className="text-xl font-normal mb-8">{categoryName}</h1>
        {error ? (
          <p className="text-destructive">{error}</p>
        ) : posts.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2">Post Title</th>
                <th className="text-right py-2">Published Date</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-border">
                  <td className="py-2">
                    <Link href={`/blog/${post.slug}`} className="hover:text-muted-foreground">
                      {post.title}
                    </Link>
                  </td>
                  <td className="text-right py-2">
                    {new Intl.DateTimeFormat("en-US", { day: "2-digit", month: "2-digit", year: "numeric" }).format(
                      new Date(post.published_at),
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-muted-foreground">No posts available in this category.</p>
        )}
      </div>
      <CommandMenu />
    </main>
  )
}

