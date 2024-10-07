const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

// Set options for marked to preserve custom syntax (like $$ for MathJax)
marked.setOptions({
    gfm: true,
    breaks: true,
});

// Directory paths
const markdownDirectory = path.join(__dirname, 'posts', 'markdown');
const htmlDirectory = path.join(__dirname, 'posts', 'html');
const templatePath = path.join(__dirname, 'template.html'); // Updated to point to the root directory

// Ensure the HTML directory exists
if (!fs.existsSync(htmlDirectory)) {
    fs.mkdirSync(htmlDirectory, { recursive: true });
}

// Read the HTML template from the specified file
let template;
try {
    template = fs.readFileSync(templatePath, 'utf8');
} catch (err) {
    console.error('Error reading the template file:', err);
    return; // Exit if the template cannot be read
}

// Function to convert markdown files to HTML
function convertMarkdownToHTML() {
    fs.readdir(markdownDirectory, (err, files) => {
        if (err) {
            console.error(err);
            return;
        }

        // Collect all markdown files
        const markdownFiles = files.filter(file => file.endsWith('.md'));
        const htmlFilesToDelete = new Set(); // Track HTML files that need to be deleted

        // Generate HTML for each markdown file
        markdownFiles.forEach(file => {
            const htmlFilePath = path.join(htmlDirectory, file.replace('.md', '.html'));

            fs.readFile(path.join(markdownDirectory, file), 'utf8', (err, data) => {
                if (err) {
                    console.error(err);
                    return;
                }

                // Split the file into lines for easier parsing
                const lines = data.split('\n');
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
                        frontMatter[key] = value.split(',').map(item => item.trim());
                    }
                }

                if (contentStartIndex === -1) {
                    console.error(`Invalid front matter in file: ${file}`);
                    return; // Skip invalid markdown files
                }

                // Get the content part, joining lines into a single string
                const contentLines = lines.slice(contentStartIndex);
                const content = contentLines.join('\n').trim();

                // Escape $$ for proper rendering and add an extra $ for single $
                const escapedContent = content.replace(/\$\$/g, '\\$\\$')
                                              .replace(/\$(?!\$)/g, '$$$$');

                const htmlContent = marked(escapedContent);

                // Replace placeholders in the template with the converted HTML content
                const htmlPage = template.replace(/{{ post_title }}/g, frontMatter.title || 'Untitled Post')
                                          .replace(/{{ post_date }}/g, frontMatter.date || 'Unknown Date')
                                          .replace(/{{ post_tags }}/g, frontMatter.tags ? frontMatter.tags.join(', ') : 'No Tags')
                                          .replace(/{{ post_content }}/g, htmlContent);

                // Write the HTML to the HTML directory
                fs.writeFile(htmlFilePath, htmlPage, (err) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    console.log(`HTML file created: ${file.replace('.md', '.html')}`);
                });
            });

            // Track the corresponding HTML file for potential deletion
            htmlFilesToDelete.add(htmlFilePath);
        });

        // Remove HTML files for deleted markdown files
        fs.readdir(htmlDirectory, (err, htmlFiles) => {
            if (err) {
                console.error(err);
                return;
            }

            htmlFiles.forEach(htmlFile => {
                const htmlFilePath = path.join(htmlDirectory, htmlFile);
                // Delete HTML file if it's not in the set of HTML files to keep
                if (!htmlFilesToDelete.has(htmlFilePath)) {
                    fs.unlink(htmlFilePath, (err) => {
                        if (err) {
                            console.error(`Error deleting HTML file: ${htmlFilePath}`, err);
                            return;
                        }
                        console.log(`Deleted HTML file: ${htmlFilePath}`);
                    });
                }
            });
        });
    });
}

// Initial conversion on script run
convertMarkdownToHTML();

// Watch for new markdown files in the markdown directory
fs.watch(markdownDirectory, (eventType, filename) => {
    if (eventType === 'rename') {
        // If a file was added or removed, trigger conversion
        console.log(`Markdown file ${eventType === 'rename' ? 'changed' : 'deleted'}: ${filename}. Regenerating HTML...`);
        convertMarkdownToHTML();
    }
});









