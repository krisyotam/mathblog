import Link from 'next/link'
import { CommandMenu } from '@/components/command-menu'
import { getPosts, GhostPost } from '@/utils/ghost'

export const revalidate = 3600 // Revalidate every hour

export default async function BlogPage() {
  let posts: GhostPost[] = [];
  let error: string | null = null;
  let categoriesCount: { [key: string]: number } = {};

  try {
    posts = await getPosts();
    
    // Count categories, excluding '#krispuremath', 'krismathblog-notes', and 'krismathblog-now'
    posts.forEach(post => {
      post.tags.forEach(tag => {
        if (tag.name !== '#krispuremath' && tag.name !== 'krismathblog-notes' && tag.name !== 'krismathblog-now') {
          categoriesCount[tag.name] = (categoriesCount[tag.name] || 0) + 1;
        }
      });
    });
  } catch (err) {
    console.error('Error in Blog component:', err);
    error = err instanceof Error ? err.message : 'An error occurred while fetching posts.';
  }

  return (
    <main className="min-h-screen px-4 py-8 bg-white text-black dark:bg-black dark:text-white">
      <nav className="max-w-2xl mx-auto mb-16">
        <div className="flex items-center space-x-1 text-sm font-mono">
          <Link href="/" className="text-gray-500 dark:text-gray-400">@krisyotam</Link>
          <span className="text-gray-500 dark:text-gray-400">/</span>
          <span className="text-gray-600 dark:text-gray-300">Blog</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto mb-12">
        <h1 className="text-xl font-normal mb-8">Blog Posts</h1>
        <div className="space-y-3 font-mono text-sm">
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
              {posts.map((post) => (
                <div key={post.id} className="flex justify-between">
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {post.title}
                  </Link>
                  <span className="text-gray-500 dark:text-gray-400">
                    {new Date(post.published_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
      <CommandMenu />
    </main>
  )
}

