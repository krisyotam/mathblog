import Link from 'next/link'
import { CommandMenu } from '@/components/command-menu'
import { GhostPost } from '@/utils/ghost'

const apiKey = process.env.GHOST_CONTENT_API_KEY;
const apiUrl = process.env.GHOST_API_URL;

export const revalidate = 3600 // Revalidate every hour

async function getNotesPosts(): Promise<GhostPost[]> {
  const url = new URL('/ghost/api/v3/content/posts/', apiUrl);
  url.searchParams.append('key', apiKey || '');
  url.searchParams.append('filter', 'tag:krismathblog-notes');
  url.searchParams.append('limit', 'all');
  url.searchParams.append('include', 'tags');

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error('Failed to fetch posts');
  }
  const data = await res.json();
  return data.posts;
}

export default async function NotesPage() {
  let posts: GhostPost[] = [];
  let error: string | null = null;
  let categories: { [key: string]: GhostPost[] } = {};

  try {
    console.log('Fetching posts for Notes page...');
    posts = await getNotesPosts();
    console.log('Fetched posts for Notes page:', posts.length);

    // Group posts by category (third tag)
    posts.forEach(post => {
      const categoryTag = post.tags.find(tag => 
        tag.name !== '#krispuremath' && tag.name !== 'krismathblog-notes'
      );
      const category = categoryTag ? categoryTag.name : 'Uncategorized';
      
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(post);
    });

    console.log('Categorized posts:', Object.keys(categories).length);
  } catch (err) {
    console.error('Error in Notes component:', err);
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
          <span className="text-gray-600 dark:text-gray-300">Notes</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-normal mb-8">Notes</h1>
        <div className="space-y-8">
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : Object.keys(categories).length > 0 ? (
            Object.entries(categories).map(([category, categoryPosts]) => (
              <div key={category}>
                <h2 className="text-lg font-medium mb-2 capitalize border-b border-gray-200 dark:border-gray-700 pb-1">{category}</h2>
                <ul className="space-y-2 mt-3">
                  {categoryPosts.map((post) => (
                    <li key={post.slug}>
                      <Link
                        href={`/notes/${post.slug}`}
                        className="text-black dark:text-white hover:text-gray-500 dark:hover:text-gray-400 transition-colors block"
                      >
                        {post.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No notes available at the moment. Check back soon!</p>
          )}
        </div>
      </div>
      <CommandMenu />
    </main>
  )
}

