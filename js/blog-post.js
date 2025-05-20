/**
 * Shared Blog Post Functionality
 * This script handles common functionality across all blog post pages
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize reveal animations
    initRevealAnimations();
    
    // Initialize social sharing functionality
    initSocialSharing();
    
    // Initialize comment form
    initCommentForm();
    
    // Handle related posts hover effects
    initRelatedPosts();
});

/**
 * Initialize scroll-triggered reveal animations for content elements
 */
function initRevealAnimations() {
    const revealElements = document.querySelectorAll('.reveal-from-bottom, .reveal-from-right');
    
    // Function to check if an element is in viewport
    const isInViewport = (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85
        );
    };
    
    // Function to reveal elements
    const revealElement = () => {
        revealElements.forEach(element => {
            if (isInViewport(element) && !element.classList.contains('revealed')) {
                // Add delay if specified
                const delay = element.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    element.classList.add('revealed');
                }, delay * 1000);
            }
        });
    };
    
    // Check on load
    revealElement();
    
    // Check on scroll
    window.addEventListener('scroll', revealElement);
}

/**
 * Initialize social sharing functionality
 */
function initSocialSharing() {
    const shareButtons = document.querySelectorAll('.social-icon');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get current page URL and title
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(document.title);
            
            // Determine which platform to share on
            if (button.classList.contains('social-icon--facebook') || button.querySelector('.fa-facebook-f')) {
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, 'facebook-share', 'width=580,height=520');
            } else if (button.classList.contains('social-icon--twitter') || button.querySelector('.fa-twitter')) {
                window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, 'twitter-share', 'width=580,height=520');
            } else if (button.classList.contains('social-icon--pinterest') || button.querySelector('.fa-pinterest')) {
                const image = encodeURIComponent(document.querySelector('.blog-post-image').src);
                window.open(`https://pinterest.com/pin/create/button/?url=${url}&media=${image}&description=${title}`, 'pinterest-share', 'width=580,height=520');
            } else if (button.classList.contains('social-icon--linkedin') || button.querySelector('.fa-linkedin-in')) {
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, 'linkedin-share', 'width=580,height=520');
            }
        });
    });
}

/**
 * Initialize comment form functionality
 */
function initCommentForm() {
    const commentForm = document.querySelector('.blog-post-comment-form form');
    
    if (commentForm) {
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const comment = document.getElementById('comment').value;
            
            // Simple validation
            if (!name || !email || !comment) {
                alert('Please fill in all fields');
                return;
            }
            
            // In a real application, you would send this data to the server
            // For demo purposes, we'll just show a success message
            alert('Thank you for your comment! It will appear after moderation.');
            
            // Reset form
            commentForm.reset();
        });
    }
}

/**
 * Initialize related posts interaction effects
 */
function initRelatedPosts() {
    const relatedPosts = document.querySelectorAll('.related-post');
    
    relatedPosts.forEach(post => {
        post.addEventListener('mouseenter', () => {
            post.querySelector('.related-post__title').style.color = 'var(--electric-blue)';
        });
        
        post.addEventListener('mouseleave', () => {
            post.querySelector('.related-post__title').style.color = 'var(--starlight-pearl)';
        });
    });
}

/**
 * Add reading time estimation to the blog post
 * @param {string} selector - Element to update with reading time
 * @param {number} wordsPerMinute - Reading speed (default: 200)
 */
function calculateReadingTime(selector = '.blog-post-header__stats .fa-clock', wordsPerMinute = 200) {
    // Find the content to analyze
    const content = document.querySelector('.blog-post-text');
    if (!content) return;
    
    // Count the words
    const text = content.textContent || content.innerText;
    const wordCount = text.split(/\s+/).length;
    
    // Calculate reading time
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    
    // Update the reading time display
    const readingTimeElement = document.querySelector(selector);
    if (readingTimeElement) {
        const parent = readingTimeElement.parentElement;
        if (parent) {
            parent.innerHTML = `<i class="fas fa-clock"></i> ${readingTime} min read`;
        }
    }
}

/**
 * Track scroll position to highlight the current section in the table of contents
 * Note: This requires adding a table of contents with links to the article
 */
function initTableOfContentsHighlight() {
    const tableOfContentsLinks = document.querySelectorAll('.table-of-contents a');
    if (tableOfContentsLinks.length === 0) return;
    
    const sections = [];
    
    // Collect all sections that are linked from the table of contents
    tableOfContentsLinks.forEach(link => {
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            sections.push({
                id: targetId,
                element: targetSection,
                link: link
            });
        }
    });
    
    // Function to highlight the current section
    const highlightCurrentSection = () => {
        let currentSectionId = null;
        
        // Find the current section based on scroll position
        sections.forEach(section => {
            const rect = section.element.getBoundingClientRect();
            if (rect.top <= 150 && rect.bottom > 150) {
                currentSectionId = section.id;
            }
        });
        
        // Highlight the current section in the table of contents
        tableOfContentsLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        if (currentSectionId) {
            sections.find(section => section.id === currentSectionId).link.classList.add('active');
        }
    };
    
    // Check on scroll
    window.addEventListener('scroll', highlightCurrentSection);
    
    // Initial check
    highlightCurrentSection();
}

// Export functions to make them available globally
window.blogPostFunctions = {
    calculateReadingTime,
    initTableOfContentsHighlight
};
