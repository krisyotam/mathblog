document.addEventListener('DOMContentLoaded', async function () {
    const contentWrapper = document.querySelector('.content-wrapper');
    const tagCloud = document.querySelector('.tag-cloud');
    const recentPostsSection = document.querySelector('.recent-posts ul');
    const loadMoreButton = document.getElementById('load-more');
    const posts = [];
    let currentPostCount = 3; // Initial number of posts to display
    let recentPostsCount = 0; // To track how many recent posts have been loaded

    // Function to load posts data from Markdown files
    async function loadPosts() {
        const markdownFiles = await getMarkdownFiles(); // Fetch the list of markdown files
        for (const file of markdownFiles) {
            const post = await fetchPost(file);
            if (post) {
                posts.push(post);
            }
        }
        updateTagCloud(posts); // Update the tag cloud after loading posts
        displayPosts(); // Display initial set of posts
    }

    // Function to get all Markdown files by checking their existence
    async function getMarkdownFiles() {
        const files = [];
        let index = 1; // Start from post1.md
        let fileExists = true;

        while (fileExists) {
            const fileName = `post${index}.md`; // Construct the file name
            const response = await fetch(`/posts/markdown/${fileName}`);

            // Check if the file exists
            if (response.ok) {
                files.push(fileName); // Add the file name to the list
            } else {
                fileExists = false; // Stop if a file doesn't exist
            }
            index++;
        }

        return files; // Return the list of existing markdown files
    }

    // Function to fetch a single post and parse its content
    async function fetchPost(file) {
        const response = await fetch(`/posts/markdown/${file}`);
        if (!response.ok) {
            console.error(`Failed to fetch ${file}: ${response.status} ${response.statusText}`);
            return null;
        }
        const content = await response.text();
        const post = parseMarkdown(content); // Parse the markdown content to extract data

        // Construct link to the HTML file
        post.link = `/posts/html/${file.replace('.md', '.html')}`;
        return post;
    }

    // Function to parse Markdown content and extract front matter and content
    function parseMarkdown(content) {
        const lines = content.split('\n');
        const frontMatter = {};
        let contentStartIndex = -1;

        // Parse front matter
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.startsWith('### content:')) {
                contentStartIndex = i + 1; // The actual content starts on the next line
                break;
            }

            // Check if it's part of the front matter
            const match = line.match(/^### (\w+): (.+)$/);
            if (match) {
                const key = match[1];
                const value = match[2];
                frontMatter[key] = value.split(',').map(item => item.trim()); // Handle tags
            }
        }

        if (contentStartIndex === -1) {
            console.error('Invalid front matter');
            return null;
        }

        // Get the content part, joining lines into a single string
        const contentLines = lines.slice(contentStartIndex);
        const contentText = contentLines.join('\n').trim();

        return {
            title: frontMatter.title || 'Untitled Post',
            date: frontMatter.date || 'Unknown Date',
            tags: frontMatter.tags || [],
            summary: frontMatter.summary || contentText.split('\n')[0], // Use the specified summary field or the first line as fallback
            content: contentText // Store full content if needed
        };
    }

    // Function to update tag cloud
    function updateTagCloud(postsData) {
        const tagSet = new Set();
        postsData.forEach(post => {
            post.tags.forEach(tag => tagSet.add(tag));
        });

        // Clear existing tag cloud
        tagCloud.innerHTML = '';

        // Create new tags with random sizes
        tagSet.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = 'tag';
            tagElement.innerText = tag;

            // Generate a random size between 14px and 26px
            const randomSize = Math.floor(Math.random() * (26 - 14 + 1)) + 14;
            tagElement.style.fontSize = `${randomSize}px`;

            tagCloud.appendChild(tagElement);
        });
    }

    // Function to display posts based on currentPostCount
    function displayPosts() {
        contentWrapper.innerHTML = ''; // Clear previous posts
        posts.forEach((post, index) => {
            if (index < currentPostCount) {
                const newPost = document.createElement('section');
                newPost.className = 'blog-post-wrapper';
                newPost.innerHTML = `
                    <div class="blog-container">
                        <aside class="sidebar-left">
                            <section class="post-meta">
                                <p><strong>Posted on</strong><br>${post.date}</p>
                                <p><strong>Tagged</strong><br>${post.tags.map(tag => `<a href="#">${tag}</a>`).join('<br>')}</p>
                            </section>
                        </aside>
                        <main class="blog-post">
                            <h2>${post.title}</h2>
                            <p>${post.summary}</p>
                            <a href="${post.link}" class="continue-reading">Continue reading →</a>
                        </main>
                    </div>
                `;
                contentWrapper.appendChild(newPost);

                // Load recent posts
                if (recentPostsCount < 3) {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `<a href="#">${post.title}</a>`;
                    recentPostsSection.appendChild(listItem);
                    recentPostsCount++;
                }
            }
        });

        // Display "Load More" button if there are more posts to load
        loadMoreButton.style.display = currentPostCount >= posts.length ? 'none' : 'block';

        // Re-process the content with MathJax
        MathJax.typeset();
    }

    // Load more posts when the button is clicked
    loadMoreButton.addEventListener('click', function() {
        currentPostCount += 3;
        displayPosts();
    });

    // Initial load of posts
    loadPosts();
});





























