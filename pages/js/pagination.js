// Pagination functionality
const postsPerPage = 2; // Number of posts per page
let currentPage = 1; // Start on page 1
const totalPosts = 4; // Total number of posts (for demo purposes)
const totalPages = Math.ceil(totalPosts / postsPerPage); // Calculate total pages

// Fetch posts container and pagination buttons
const postsContainer = document.getElementById('posts-container');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const paginationNumbers = document.getElementById('pagination-numbers');

// Post data (just as an example, this would usually come from a server)
const posts = [
    { title: 'Introduction to "Defence against the Dark Arts"', date: '07.11.2019' },
    { title: 'Fantastic Beasts and Where to Find Them', date: '01.11.2019' },
    { title: 'The Magical World of Wizards', date: '15.11.2019' },
    { title: 'A Beginner’s Guide to Potion Brewing', date: '22.11.2019' }
];

// Function to display posts based on current page
function displayPosts() {
    // Clear existing posts
    postsContainer.innerHTML = '';

    // Calculate the range of posts for the current page
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;

    // Slice the posts array to show only the posts for the current page
    const postsToShow = posts.slice(startIndex, endIndex);

    // Append posts to the container
    postsToShow.forEach(post => {
        const postElement = document.createElement('article');
        postElement.classList.add('post');

        postElement.innerHTML = `
            <a href="#" class="post-title">${post.title}</a>
            <time class="post-date">${post.date}</time>
        `;

        postsContainer.appendChild(postElement);
    });

    // Update page number display
    updatePagination();
}

// Function to update pagination numbers
function updatePagination() {
    // Clear previous page numbers
    paginationNumbers.innerHTML = '';

    // Loop through the total number of pages and create pagination numbers
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.classList.add('pagination-number');
        pageButton.textContent = i;
        
        // Set active class to the current page
        if (i === currentPage) {
            pageButton.classList.add('active');
        }

        pageButton.addEventListener('click', () => {
            currentPage = i;
            displayPosts();
        });

        paginationNumbers.appendChild(pageButton);
    }

    // Disable/enable prev and next buttons based on page
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
}

// Handle previous button click
prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayPosts();
    }
});

// Handle next button click
nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        displayPosts();
    }
});

// Initial display
displayPosts();
