import { document, cleanupDOM } from './serverDOM';

export function parseAndModifyHTML(html: string): string {
  try {
    // Set the HTML content
    document.body.innerHTML = html;

    // Perform some DOM manipulation (example: add a class to all paragraphs)
    const paragraphs = document.querySelectorAll('p');
    paragraphs.forEach(p => p.classList.add('modified-paragraph'));

    // Get the modified HTML
    const modifiedHTML = document.body.innerHTML;

    // Clean up the DOM
    cleanupDOM();

    return modifiedHTML;
  } catch (error) {
    console.error('Error parsing HTML:', error);
    return html; // Return original HTML if there's an error
  }
}

