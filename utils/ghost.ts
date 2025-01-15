import frontMatter from 'front-matter'

// API Information
const apiKey = process.env.GHOST_CONTENT_API_KEY;
const apiUrl = process.env.GHOST_API_URL;

export type GhostPost = {
  id: string
  slug: string
  title: string
  published_at: string
  tags: Array<{ name: string; slug: string }>
  html: string;
}

export async function getPosts(): Promise<GhostPost[]> {
  try {
    if (!apiUrl) {
      throw new Error('API URL is not defined');
    }

    const url = new URL('/ghost/api/v3/content/posts/', apiUrl);
    url.searchParams.append('key', apiKey || '');
    url.searchParams.append('limit', '500');
    url.searchParams.append('include', 'tags');

    const response = await fetch(url.toString());
    const data = await response.json();

    if (!data.posts || data.posts.length === 0) {
      console.error('No posts found in the response.');
      return [];
    }

    // Filter posts for the tag '#krispuremath' and exclude 'krismathblog-notes' and 'krismathblog-now'
    const filteredPosts = data.posts.filter(post => {
      const hasKrisPureMath = post.tags.some(tag => tag.name === '#krispuremath');
      const hasExcludedTags = post.tags.some(tag => 
        tag.name === 'krismathblog-notes' || tag.name === 'krismathblog-now'
      );
      return hasKrisPureMath && !hasExcludedTags;
    });

    // Parse front matter
    return filteredPosts.map(post => {
      const { attributes, body } = frontMatter(post.html);
      return {
        ...post,
        frontMatter: attributes,
        content: body
      };
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

