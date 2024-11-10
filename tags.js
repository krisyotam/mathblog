import fs from 'fs';
import path from 'path';
import frontMatter from 'front-matter';
import { marked } from 'marked';

// Define __dirname for ES module
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Path to the posts and tag pages
const postsDirectory = path.join(__dirname, 'posts', 'markdown');
const tagsDirectory = path.join(__dirname, 'tags', 'html');
const tagTemplatePath = path.join(__dirname, 'tagtemplate.html');

// Function to generate tag pages
async function generateTagPages() {
    const posts = await loadPosts();
    const tags = {};

    // Organize posts by tags
    posts.forEach(post => {
        post.tags.forEach(tag => {
            if (!tags[tag]) {
                tags[tag] = [];
            }
            tags[tag].push(post);
        });
    });

    // Create or update tag pages based on the template
    for (const tag in tags) {
        const tagContent = await generateTagPageContent(tag, tags[tag]);
        await saveTagPage(tag, tagContent);
    }

    console.log('Tag pages generated or updated successfully.');
}

// Function to load posts data from Markdown files
async function loadPosts() {
    const markdownFiles = await getMarkdownFiles();
    const posts = [];

    for (const file of markdownFiles) {
        const post = await fetchPost(file);
        if (post) {
            posts.push(post);
        }
    }

    return posts;
}

// Function to fetch a single post and parse its content
async function fetchPost(file) {
    const content = fs.readFileSync(path.join(postsDirectory, file), 'utf-8');
    const { attributes, body } = frontMatter(content);

    return {
        title: attributes.title || 'Untitled Post',
        date: attributes.date || 'Unknown Date',
        tags: attributes.tags || [],
        summary: body.split('\n')[0], // Fallback to the first line as summary
        content: body // Store full content if needed
    };
}

// Function to get all Markdown files by checking their existence
async function getMarkdownFiles() {
    const files = fs.readdirSync(postsDirectory); // Get all files in the posts directory
    return files.filter(file => file.endsWith('.md')); // Filter for Markdown files
}

// Function to generate the content for a tag page based on the template
async function generateTagPageContent(tag, posts) {
    const template = fs.readFileSync(tagTemplatePath, 'utf-8'); // Load the tag template
    const postList = posts.map(post => `<li><a href="/posts/html/${post.title.replace(/\s+/g, '-').toLowerCase()}.html">${post.title}</a></li>`).join('');
    
    // Replace the placeholder in the template with actual content
    return template.replace('{{tag}}', tag).replace('{{posts}}', postList);
}

// Function to save the tag page content to a file
async function saveTagPage(tag, content) {
    const filePath = path.join(tagsDirectory, `${tag}.html`);
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, content, 'utf-8', (err) => {
            if (err) {
                console.error(`Error saving tag page for ${tag}:`, err);
                return reject(err);
            }
            resolve();
        });
    });
}

// Run the tag generation process
generateTagPages().catch(err => {
    console.error('Error generating tag pages:', err);
});

        





























