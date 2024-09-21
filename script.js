document.addEventListener('DOMContentLoaded', function() {
    const contentWrapper = document.querySelector('.content-wrapper');
    const tagCloud = document.querySelector('.tag-cloud');
    const recentPostsSection = document.querySelector('.recent-posts ul');
    const loadMoreButton = document.getElementById('load-more');
    const posts = [];
    let currentPostCount = 3; // Initial number of posts to display
    let recentPostsCount = 0; // To track how many recent posts have been loaded

    // Function to fetch posts data
    async function loadPosts() {
        try {
            const response = await fetch('/posts/json/posts.json');
            if (!response.ok) {
                throw new Error(`Error fetching posts data: ${response.status} ${response.statusText}`);
            }
            const postsData = await response.json();
            postsData.forEach(post => {
                fetchPost(post);
            });
            updateTagCloud(postsData); // Update the tag cloud after loading posts
            displayPosts(); // Display initial set of posts
        } catch (error) {
            console.error(error);
        }
    }

    async function fetchPost(post) {
        const { title, date, tags, summary, content, link } = post;

        // Add post preview to the content wrapper
        const newPost = document.createElement('section');
        newPost.className = 'blog-post-wrapper';
        newPost.innerHTML = `
            <div class="blog-container">
                <aside class="sidebar-left">
                    <section class="post-meta">
                        <p><strong>Posted on</strong><br>${date}</p>
                        <p><strong>Tagged</strong><br>${tags.map(tag => `<a href="#">${tag}</a>`).join('<br>')}</p>
                    </section>
                </aside>
                <main class="blog-post">
                    <h2>${title}</h2>
                    <p>${summary}</p>
                    <a href="${link}" class="continue-reading">Continue reading →</a>
                </main>
            </div>
        `;
        contentWrapper.appendChild(newPost);
        posts.push(newPost); // Store the post for later use

        // Trigger MathJax to reprocess the newly added content
        MathJax.typeset();

        // Load recent posts
        if (recentPostsCount < 3) {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<a href="#">${title}</a>`;
            recentPostsSection.appendChild(listItem);
            recentPostsCount++;
        }
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
        posts.forEach((post, index) => {
            post.style.display = index < currentPostCount ? 'block' : 'none';
        });

        loadMoreButton.style.display = currentPostCount >= posts.length ? 'none' : 'block';
    }

    loadMoreButton.addEventListener('click', function() {
        currentPostCount += 3;
        displayPosts();
    });

    loadPosts();
});





















