import Link from 'next/link';
import { CommandMenu } from '@/components/command-menu';
import { ImageGallery } from '@/components/ImageGallery';
import { GhostPost } from '@/utils/ghost';

const apiKey = process.env.GHOST_CONTENT_API_KEY;
const apiUrl = process.env.GHOST_API_URL;

export const dynamic = 'force-dynamic'; // Force dynamic rendering
export const revalidate = 0; // Revalidate every hour

async function getNowPosts(): Promise<GhostPost[]> {
  const url = new URL('/ghost/api/v3/content/posts/', apiUrl);
  url.searchParams.append('key', apiKey || '');
  url.searchParams.append('filter', 'tag:krismathblog-now');
  url.searchParams.append('limit', 'all');
  url.searchParams.append('include', 'tags');

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error('Failed to fetch posts');
  }
  const data = await res.json();
  return data.posts;
}

function extractImagesFromContent(content: string): string[] {
  const imgRegex = /<img[^>]+src="?([^"\s]+)"?\s*\/>/g;
  const images: string[] = [];
  let match;
  while ((match = imgRegex.exec(content)) !== null) {
    images.push(match[1]);
  }
  return images;
}

function removeImagesFromContent(content: string): string {
  return content.replace(/<img[^>]+>/g, '');
}

// Function to truncate content to a certain length and ensure no tags are cut off
function truncateContent(content: string, maxLength: number): string {
  if (!content || content.trim() === "") {
    return "No content available"; // Or any fallback message
  }

  if (content.length <= maxLength) return content; // No truncation needed if content is short enough

  let truncated = content.substring(0, maxLength);

  // Ensure tags are properly closed by checking if truncation ends mid-tag
  const lastTagEnd = truncated.lastIndexOf('>');
  const lastTagStart = truncated.lastIndexOf('<', lastTagEnd);

  if (lastTagStart > -1) {
    truncated = truncated.substring(0, lastTagEnd + 1); // Remove the broken tag
  }

  return truncated + '...'; // Add ellipsis to indicate truncation
}

export default async function NowPage() {
  let posts: GhostPost[] = [];
  let error: string | null = null;

  try {
    console.log('Fetching posts for Now page...');
    posts = await getNowPosts();
    console.log('Fetched posts for Now page:', posts.length);
  } catch (err) {
    console.error('Error in Now component:', err);
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
          <span className="text-gray-600 dark:text-gray-300">Now</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-normal mb-4">Now</h1>
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-8">
          <p>This "now" page was last updated on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}.</p>
          <p>Inspired by <a href="https://nownownow.com/about" className="underline hover:text-gray-600 dark:hover:text-gray-300">Derek Sivers' /now movement</a>.</p>
        </div>
        <div className="space-y-8">
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : posts.length > 0 ? (
            posts.map((post) => {
              const images = extractImagesFromContent(post.html || '');
              const contentWithoutImages = removeImagesFromContent(post.html || '');
              const previewText = post.excerpt || truncateContent(contentWithoutImages, 300); // Use excerpt or truncate as fallback

              return (
                <div key={post.id} className="border-b border-gray-200 dark:border-gray-800 pb-8">
                  <Link href={`/blog/${post.slug}`} className="block">
                    <h2 className="text-lg font-semibold mb-2 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                      {post.title}
                    </h2>
                  </Link>
                  <div className="prose dark:prose-invert max-w-none mb-4" dangerouslySetInnerHTML={{ __html: previewText }} />
                  {images.length > 0 && (
                    <ImageGallery images={images} />
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No updates available at the moment. Check back soon!</p>
          )}
        </div>
      </div>
      <CommandMenu />
    </main>
  );
}
