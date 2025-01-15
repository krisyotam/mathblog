import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ContentRenderer } from '@/components/ContentRenderer'
import { CommandMenu } from '@/components/command-menu'

const apiKey = process.env.GHOST_CONTENT_API_KEY;
const apiUrl = process.env.GHOST_API_URL;

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const { slug } = params;

  if (!slug) {
    console.error('No post slug found in URL.');
    notFound();
  }

  if (!apiUrl) {
    console.error('API URL is not defined');
    notFound();
  }

  const url = new URL('/ghost/api/v3/content/posts/', apiUrl);
  url.searchParams.append('key', apiKey || '');
  url.searchParams.append('filter', `slug:${slug}`);
  url.searchParams.append('include', 'tags');

  try {
    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Failed to fetch post data. Status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.posts || data.posts.length === 0) {
      throw new Error('No post found in the API response.');
    }

    const post = data.posts[0];

    const postDate = new Date(post.published_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const categories = post.tags
      .filter((tag: { name: string }) => tag.name !== '#krispuremath')
      .map((tag: { name: string }) => tag.name)
      .join(', ');

    return (
      <main className="min-h-screen px-4 py-8 bg-background text-foreground">
        <nav className="max-w-2xl mx-auto mb-16">
          <div className="flex items-center space-x-1 text-sm font-mono">
            <Link href="/" className="text-muted-foreground">@krisyotam</Link>
            <span className="text-muted-foreground">/</span>
            <Link href="/blog" className="hover:text-muted-foreground">Blog</Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-muted-foreground">{post.title}</span>
          </div>
        </nav>

        <article className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center text-sm text-muted-foreground mb-8">
            <span>{categories}</span>
            <span className="mx-2">•</span>
            <span>{postDate}</span>
          </div>
          <ContentRenderer content={post.html} />
        </article>

        <CommandMenu />
      </main>
    )
  } catch (error) {
    console.error('Error in BlogPost component:', error);
    notFound();
  }
}

export async function generateStaticParams() {
  if (!process.env.GHOST_API_URL) {
    console.error('GHOST_API_URL is not defined');
    return [];
  }

  try {
    const url = new URL('/ghost/api/v3/content/posts/', process.env.GHOST_API_URL);
    url.searchParams.append('key', process.env.GHOST_CONTENT_API_KEY || '');
    url.searchParams.append('fields', 'slug');
    url.searchParams.append('limit', 'all');
    url.searchParams.append('filter', 'tag:#krispuremath');

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Failed to fetch posts. Status: ${response.status}`);
    }

    const data = await response.json();

    return data.posts.map((post: { slug: string }) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

