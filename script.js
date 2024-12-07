document.addEventListener('DOMContentLoaded', async function () {
    const contentWrapper = document.querySelector('.blog-feed'); // Correct target for the posts container
    const tagCloud = document.querySelector('.tag-cloud');
    const recentPostsSection = document.querySelector('.recent-posts ul');
    const posts = [];
    let currentPostCount = 3; // Initial number of posts to display
    let recentPostsCount = 0; // To track how many recent posts have been loaded

    // Function to load posts data from Markdown files
    async function loadPosts() {
        const markdownFiles = await getMarkdownFiles();
        for (const file of markdownFiles) {
            const post = await fetchPost(file);
            if (post) {
                posts.push(post);
            }
        }
        updateTagCloud(posts);
        displayPosts();
    }

    // Function to get all Markdown files by checking their existence
    async function getMarkdownFiles() {
        const files = [];
        let index = 1;
        let fileExists = true;

        while (fileExists) {
            const fileName = `post${index}.md`;
            const response = await fetch(`/posts/markdown/${fileName}`);
            if (response.ok) {
                files.push(fileName);
            } else {
                fileExists = false;
            }
            index++;
        }

        return files;
    }

    // Function to fetch a single post and parse its content
    async function fetchPost(file) {
        const response = await fetch(`/posts/markdown/${file}`);
        if (!response.ok) {
            console.error(`Failed to fetch ${file}: ${response.status} ${response.statusText}`);
            return null;
        }
        const content = await response.text();
        const post = parseMarkdown(content);

        // Construct link to the HTML file
        post.link = `/posts/html/${file.replace('.md', '.html')}`;
        return post;
    }

    // Function to parse Markdown content and extract front matter and content
    function parseMarkdown(content) {
        const lines = content.split('\n');
        const frontMatter = {};
        let contentStartIndex = -1;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.startsWith('### content:')) {
                contentStartIndex = i + 1;
                break;
            }

            const match = line.match(/^### (\w+): (.+)$/);
            if (match) {
                const key = match[1];
                const value = match[2];
                frontMatter[key] = value.split(',').map(item => item.trim());
            }
        }

        if (contentStartIndex === -1) {
            console.error('Invalid front matter');
            return null;
        }

        const contentLines = lines.slice(contentStartIndex);
        const contentText = contentLines.join('\n').trim();

        return {
            title: frontMatter.title || 'Untitled Post',
            date: frontMatter.date || 'Unknown Date',
            tags: frontMatter.tags || [],
            summary: frontMatter.summary || contentText.split('\n')[0],
            content: contentText
        };
    }

    // Function to update tag cloud
    function updateTagCloud(postsData) {
        const tagSet = new Set();
        postsData.forEach(post => post.tags.forEach(tag => tagSet.add(tag)));
        tagCloud.innerHTML = '';

        tagSet.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = 'tag';
            const tagLink = tag.toLowerCase().replace(/\s+/g, '');
            tagElement.innerHTML = `<a href="/tags/${tagLink}.html">${tag}</a>`;
            tagElement.style.fontSize = `14px`;
            tagCloud.appendChild(tagElement);
        });
    }

    // Function to display posts based on currentPostCount
    function displayPosts() {
        contentWrapper.innerHTML = ''; // Clear previous posts
        posts.slice(0, currentPostCount).forEach(post => {
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

            if (recentPostsCount < 3) {
                const listItem = document.createElement('li');
                listItem.innerHTML = `<a href="#">${post.title}</a>`;
                recentPostsSection.appendChild(listItem);
                recentPostsCount++;
            }
        });

        // Process the content with MathJax
        if (typeof MathJax !== 'undefined') {
            MathJax.typeset();
        }
    }

    // Event listener for infinite scroll
    window.addEventListener('scroll', function () {
        const scrollPosition = window.scrollY + window.innerHeight;
        const pageHeight = document.documentElement.scrollHeight;

        if (scrollPosition >= pageHeight - 100) { // Trigger when 100px from the bottom
            loadMorePosts();
        }
    });

    // Function to load more posts
    function loadMorePosts() {
        if (currentPostCount < posts.length) {
            currentPostCount += 3;
            displayPosts();
        }
    }

    // Initial load of posts
    loadPosts();
});














































