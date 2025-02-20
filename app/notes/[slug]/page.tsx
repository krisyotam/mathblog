import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ContentRenderer } from '@/components/ContentRenderer';
import { CommandMenu } from '@/components/command-menu';

const apiKey = process.env.GHOST_CONTENT_API_KEY;
const apiUrl = process.env.GHOST_API_URL;

export const dynamic = 'force-dynamic';
export const revalidate = 0; // Revalidate on page load

export default async function NotePage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  if (!slug) {
    console.error('No note slug found in URL.');
    notFound();
  }

  const url = new URL('/ghost/api/v3/content/posts/', apiUrl);
  url.searchParams.append('key', apiKey || '');
  url.searchParams.append('filter', `slug:${slug}`);
  url.searchParams.append('include', 'tags');

  try {
    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Failed to fetch note data. Status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.posts || data.posts.length === 0) {
      console.error('No note found for slug:', slug);
      return <div>Note not found</div>;
    }

    const note = data.posts[0];

    if (!note.title || !note.html) {
      console.error('Incomplete note data:', note);
      return <div>Error: Incomplete note data</div>;
    }

    const noteDate = new Date(note.published_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const categories = note.tags
      .filter((tag: { name: string }) => tag.name !== '#krispuremath' && tag.name !== 'krismathblog-notes')
      .map((tag: { name: string }) => tag.name)
      .join(', ');

    return (
      <main className="min-h-screen px-4 py-8 bg-background text-foreground notes-page">
        <nav className="max-w-2xl mx-auto mb-16">
          <div className="flex items-center space-x-1 text-sm font-mono">
            <Link href="/" className="text-gray-500 dark:text-gray-400">@krisyotam</Link>
            <span className="text-gray-500 dark:text-gray-400">/</span>
            <Link href="/notes" className="hover:text-gray-600 dark:hover:text-gray-300">Notes</Link>
            <span className="text-gray-500 dark:text-gray-400">/</span>
            <span className="text-gray-600 dark:text-gray-300">{note.title}</span>
          </div>
        </nav>

        <article className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">{note.title}</h1>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-8">
            <span>{categories}</span>
            <span className="mx-2">•</span>
            <span>{noteDate}</span>
          </div>
          <ContentRenderer content={note.html} />
        </article>

        <CommandMenu />
      </main>
    );
  } catch (error) {
    console.error('Error in NotePage component:', error);
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
    url.searchParams.append('filter', 'tag:krismathblog-notes');

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Failed to fetch notes. Status: ${response.status}`);
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
