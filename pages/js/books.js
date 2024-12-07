// loadBooks.js

// Function to dynamically load books
async function loadBooks() {
    try {
        const response = await fetch('/pages/json/books.json');
        const data = await response.json();
        const bookSection = document.getElementById('book-section');

        data.categories.forEach(category => {
            // Create category card
            const categoryCard = document.createElement('div');
            categoryCard.classList.add('category-card');
            const categoryTitle = document.createElement('h2');
            categoryTitle.textContent = category.name;
            categoryCard.appendChild(categoryTitle);

            const bookList = document.createElement('div');
            bookList.classList.add('book-list');
            category.books.forEach(book => {
                // Create individual book
                const bookDiv = document.createElement('div');
                bookDiv.classList.add('book');

                const bookImg = document.createElement('img');
                bookImg.src = book.imgSrc;
                bookImg.alt = book.imgAlt;

                const bookTitle = document.createElement('h4');
                bookTitle.textContent = book.name;

                const bookDescription = document.createElement('p');
                bookDescription.textContent = book.description;

                bookDiv.appendChild(bookImg);
                bookDiv.appendChild(bookTitle);
                bookDiv.appendChild(bookDescription);
                bookList.appendChild(bookDiv);
            });

            categoryCard.appendChild(bookList);
            bookSection.appendChild(categoryCard);
        });
    } catch (error) {
        console.error('Error loading books:', error);
    }
}

loadBooks();
