// Blog Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Blog filter functionality
    const filterButtons = document.querySelectorAll('.blog-filter__button');
    const blogCards = document.querySelectorAll('.blog-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Get filter value
            const filter = button.getAttribute('data-filter');
            
            // Filter blog cards
            blogCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // Blog search functionality
    const searchInput = document.querySelector('.blog-search__input');
    const searchButton = document.querySelector('.blog-search__button');
    
    const searchPosts = () => {
        const searchTerm = searchInput.value.toLowerCase();
        
        blogCards.forEach(card => {
            const title = card.querySelector('.blog-card__title').textContent.toLowerCase();
            const excerpt = card.querySelector('.blog-card__excerpt').textContent.toLowerCase();
            const category = card.querySelector('.blog-card__category').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || excerpt.includes(searchTerm) || category.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    };
    
    searchButton.addEventListener('click', searchPosts);
    searchInput.addEventListener('keyup', e => {
        if (e.key === 'Enter') {
            searchPosts();
        }
    });
    
    // Pagination (simple demo - not functional)
    const paginationNumbers = document.querySelectorAll('.pagination__number');
    const prevButton = document.querySelector('.pagination__button--prev');
    const nextButton = document.querySelector('.pagination__button--next');
    
    paginationNumbers.forEach(button => {
        button.addEventListener('click', () => {
            paginationNumbers.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Enable/disable prev/next buttons based on active page
            const activePage = parseInt(button.textContent);
            prevButton.classList.toggle('disabled', activePage === 1);
            nextButton.classList.toggle('disabled', activePage === paginationNumbers.length);
        });
    });
    
    prevButton.addEventListener('click', function() {
        const activePage = document.querySelector('.pagination__number.active');
        const pageNumber = parseInt(activePage.textContent);
        
        if (pageNumber > 1) {
            document.querySelector(`.pagination__number:nth-child(${pageNumber - 1})`).click();
        }
    });
    
    nextButton.addEventListener('click', function() {
        const activePage = document.querySelector('.pagination__number.active');
        const pageNumber = parseInt(activePage.textContent);
        
        if (pageNumber < paginationNumbers.length) {
            document.querySelector(`.pagination__number:nth-child(${pageNumber + 1})`).click();
        }
    });
});