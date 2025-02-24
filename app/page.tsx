import Link from 'next/link'
import { getPosts, GhostPost } from '@/utils/ghost'

export const revalidate = 0 // Revalidate every hour
export const dynamic = 'force-dynamic'; // Force dynamic rendering

export default async function Home() {
  let posts: GhostPost[] = [];
  let error: string | null = null;

  try {
    posts = await getPosts();
  } catch (err) {
    console.error('Error in Home component:', err);
    error = err instanceof Error ? err.message : 'An error occurred while fetching posts.';
  }

  return (
    <main className="min-h-screen px-4 py-8 bg-background text-foreground">
      <nav className="max-w-2xl mx-auto mb-16">
        <div className="flex items-center space-x-1 text-sm font-mono">
          <span className="text-muted-foreground">@krisyotam</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto mb-12">
        <div className="mb-12">
          <h1 className="text-xl font-normal mb-2">Kris Yotam</h1>
          <div className="flex items-center text-sm">
            <span className="text-muted-foreground mr-2">|</span>
            <p className="text-xs text-muted-foreground">
            "An equation means nothing to me unless it expresses a thought of God" – Srinivasa Ramanujan
            </p>
          </div>
        </div>
        <div className="space-y-3 font-mono text-sm">
          {error ? (
            <p className="text-destructive">{error}</p>
          ) : posts.length > 0 ? (
            posts.slice(0, 50).map((post) => (
              <div key={post.id} className="flex">
                <span className="w-16 flex-shrink-0 text-muted-foreground">
                  {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit' }).format(new Date(post.published_at)).replace('/', '·')}
                </span>
                <Link 
                  href={`/blog/${post.slug}`}  // Corrected string interpolation here
                  className="text-sm hover:text-muted-foreground transition-colors"
                >
                  {post.title}
                </Link>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No posts available for the #krispuremath tag.</p>
          )}
        </div>
      </div>
    </main>
  )
}
