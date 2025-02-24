import { JSDOM } from 'jsdom';

// Initialize a virtual DOM
const dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`);

// Export the window and document objects
export const window = dom.window;
export const document = dom.window.document;

// Helper function to clean up the DOM after use
export const cleanupDOM = () => {
  dom.window.close();
};

