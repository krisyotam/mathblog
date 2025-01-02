document.addEventListener('DOMContentLoaded', function() {
    // Get the post slug or ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const postSlug = urlParams.get('slug');  // Assuming post slug is passed in the URL

    // Fetch post data using the Ghost API
    const apiUrl = `https://kris-yotam.ghost.io/ghost/api/v3/content/posts/slug/${postSlug}/?key=2ade9a52735b39ce5aa244fad3`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const post = data.posts[0];

            // Set the title dynamically
            document.getElementById('post-title').innerText = post.title;
            document.getElementById('post-title').setAttribute('title', post.title);

            // Set the post metadata
            const postMeta = `Published on: ${new Date(post.published_at).toLocaleDateString()} | Category: ${post.tags.map(tag => tag.name).join(', ')}`;
            document.getElementById('post-meta').innerText = postMeta;

            // Set the post content (HTML + LaTeX supported)
            document.getElementById('post-content').innerHTML = post.html;

            // Re-render MathJax (for LaTeX)
            MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
        })
        .catch(error => {
            console.error('Error fetching the post:', error);
            document.getElementById('post-content').innerHTML = '<p>Error loading post content. Please try again later.</p>';
        });
});
