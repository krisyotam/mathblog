// Function to apply dark mode based on system preference
function applySystemDarkMode() {
    const body = document.body;
    
    // If system prefers dark mode and no manual toggle has been applied
    if (window.matchMedia('(prefers-color-scheme: dark)').matches && !localStorage.getItem('dark-mode')) {
        body.classList.add('dark-mode');
    } else {
        body.classList.remove('dark-mode');
    }
}

// Check system theme preference on initial load
applySystemDarkMode();

// Event listener for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applySystemDarkMode);

// Handle manual toggle
const darkModeToggle = document.querySelector('.dark-mode-toggle');
darkModeToggle.addEventListener('click', () => {
    const body = document.body;
    
    // Toggle dark mode on body and store the choice in localStorage
    body.classList.toggle('dark-mode');
    
    // Save the preference in localStorage so it persists
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('dark-mode', 'enabled');
    } else {
        localStorage.removeItem('dark-mode');
    }
});
