import Link from 'next/link'
import { CommandMenu } from '@/components/command-menu'
import { getPosts, GhostPost } from '@/utils/ghost'
import { CategoryTable } from './components/CategoryTable'

export const revalidate = 3600 // Revalidate every hour

export default async function BlogIndexPage() {
  let posts: GhostPost[] = [];
  let error: string | null = null;
  let categoriesCount: { [key: string]: number } = {};

  try {
    posts = await getPosts();
    
    // Count categories, excluding '#krispuremath', 'krismathblog-notes', and 'krismathblog-now'
    posts.forEach(post => {
      if (!post.tags.some(tag => tag.name === 'krismathblog-notes' || tag.name === 'krismathblog-now')) {
        post.tags.forEach(tag => {
          if (tag.name !== '#krispuremath') {
            categoriesCount[tag.name] = (categoriesCount[tag.name] || 0) + 1;
          }
        });
      }
    });
  } catch (err) {
    console.error('Error in Blog Index component:', err);
    error = err instanceof Error ? err.message : 'An error occurred while fetching posts.';
  }

  return (
    <main className="min-h-screen px-4 py-8 bg-background text-foreground">
      <nav className="max-w-2xl mx-auto mb-16">
        <div className="flex items-center space-x-1 text-sm font-mono">
          <Link href="/" className="text-gray-500 dark:text-gray-400">@krisyotam</Link>
          <span className="text-gray-500 dark:text-gray-400">/</span>
          <Link href="/" className="hover:text-gray-600 dark:hover:text-gray-300">Home</Link>
          <span className="text-gray-500 dark:text-gray-400">/</span>
          <span className="text-gray-600 dark:text-gray-300">Blog</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto">
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <CategoryTable categories={categoriesCount} />
        )}
      </div>
      <CommandMenu />
    </main>
  )
}

