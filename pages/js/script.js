const darkModeToggle = document.querySelector('.dark-mode-toggle');

// Check if localStorage is available
if (typeof(Storage) !== "undefined") {
    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.documentElement.classList.add('dark-mode');
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark-mode');
    }
    
    darkModeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark-mode');
        
        // Save preference
        if (document.documentElement.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
        } else {
            localStorage.removeItem('darkMode');
        }
    });
} else {
    console.warn('LocalStorage is not supported or is disabled in this environment.');
}
