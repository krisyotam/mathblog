const fs = require('fs');
const path = require('path');

const markdownDir = 'pages/posts/markdown'; // Directory containing Markdown files
const postsFile = path.join(__dirname, 'posts.js'); // Path to posts.js

// Function to extract post data from Markdown file
function extractPostData(markdownContent) {
    const lines = markdownContent.split('\n');
    const post = {};
    let currentField = '';

    // Loop through each line to find h3 headers
    for (let line of lines) {
        line = line.trim();
        if (line.startsWith('### ')) { // Check if line is an h3 header
            currentField = line.replace('### ', ''); // Remove the h3 marker
        } else if (currentField && line.length > 0) {
            post[currentField] = line; // Assign the value to the current field
            currentField = ''; // Reset currentField after assigning
        }
    }

    return post;
}

// Function to read all markdown files and update posts.js
function updatePosts() {
    const posts = [];
    const files = fs.readdirSync(markdownDir).filter(file => file.endsWith('.md'));

    files.forEach(file => {
        const filePath = path.join(markdownDir, file);
        const markdownContent = fs.readFileSync(filePath, 'utf-8');
        const postData = extractPostData(markdownContent);

        if (postData.title && postData.date) { // Ensure title and date exist
            postData.link = `/posts/html/${file.replace('.md', '.html')}`; // Construct link
            posts.push(postData);
        }
    });

    // Update posts.js with the new data
    fs.writeFileSync(postsFile, `const posts = ${JSON.stringify(posts, null, 2)};\nexport default posts;`);
}

// Run the update
updatePosts();




