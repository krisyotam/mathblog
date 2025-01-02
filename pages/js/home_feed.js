// home_feed.js

// API Information
const apiKey = '2ade9a52735b39ce5aa244fad3';
const apiUrl = 'https://kris-yotam.ghost.io';

// Ensure that we fetch a large number of posts (limit set to 500)
document.addEventListener('DOMContentLoaded', function () {
    fetch(`${apiUrl}/ghost/api/v3/content/posts/?key=${apiKey}&limit=500&include=tags`)
        .then(response => response.json())
        .then(data => {
            // Check if the response is valid and contains posts
            if (!data.posts || data.posts.length === 0) {
                console.error('No posts found in the response.');
                const errorMessage = document.createElement('p');
                errorMessage.textContent = 'No posts available.';
                document.getElementById('posts-container').appendChild(errorMessage);
                return;
            }

            // Filter posts for the tag 'krispuremath'
            const filteredPosts = data.posts.filter(post => {
                return post.tags.some(tag => tag.name === '#krispuremath');  // Check tag name without #
            });

            // If there are any posts matching the tag
            if (filteredPosts.length > 0) {
                const postsContainer = document.getElementById('posts-container');
                
                // Limit to the first 4 posts
                filteredPosts.slice(0, 4).forEach(post => {
                    const postElement = document.createElement('article');
                    postElement.classList.add('post');
                    
                    // Create the post title link
                    const postTitleLink = document.createElement('a');
                    postTitleLink.href = `/pages/html/post.html?slug=${post.slug}`;  // Use the correct slug
                    postTitleLink.classList.add('post-title');
                    postTitleLink.textContent = post.title;

                    // Create the preview text (first 200 characters or custom length)
                    const previewText = document.createElement('p');
                    previewText.classList.add('post-preview');
                    previewText.textContent = post.html
                        ? post.html.replace(/(<([^>]+)>)/gi, '').substring(0, 200) + '...'  // Remove HTML tags and limit length
                        : 'No preview available.';  // Fallback if no content

                    // Create the post date and read time
                    const postMeta = document.createElement('div');
                    postMeta.classList.add('post-meta');
                    const postDate = document.createElement('time');
                    postDate.classList.add('post-date');
                    // Format date to match the previous format (e.g., 07.11.2019)
                    const date = new Date(post.published_at);
                    const formattedDate = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
                    
                    // Estimate read time (approximately 200 words per minute)
                    const wordCount = post.html ? post.html.split(' ').length : 0;
                    const readTime = Math.ceil(wordCount / 200); // 200 words per minute
                    const readTimeText = `• ${readTime} min. read`;

                    // Add date and read time together
                    postDate.textContent = `${formattedDate} ${readTimeText}`;
                    postMeta.appendChild(postDate);

                    // Append elements to the post
                    postElement.appendChild(postTitleLink);
                    postElement.appendChild(previewText);
                    postElement.appendChild(postMeta);

                    // Append the post to the container
                    postsContainer.appendChild(postElement);
                });
            } else {
                // Handle the case when no posts are available
                const noPostsMessage = document.createElement('p');
                noPostsMessage.textContent = 'No posts available for the krispuremath tag.';
                document.getElementById('posts-container').appendChild(noPostsMessage);
            }
        })
        .catch(error => {
            console.error('Error fetching posts:', error);
            const errorMessage = document.createElement('p');
            errorMessage.textContent = 'An error occurred while fetching posts.';
            document.getElementById('posts-container').appendChild(errorMessage);
        });
});
