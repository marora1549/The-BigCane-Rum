/**
 * Scroll-to-Top Button Component
 */

// Add CSS for the scroll-to-top button
const scrollToTopStyles = `
.scroll-to-top {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: linear-gradient(45deg, #FF2A6D, #D264B6);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transform: translateY(20px);
    transition: all 0.3s ease;
    box-shadow: 0 5px 15px rgba(255, 42, 109, 0.4);
    z-index: 9000;
}

.scroll-to-top:hover {
    transform: translateY(0) scale(1.1);
    box-shadow: 0 8px 20px rgba(255, 42, 109, 0.6);
}

.scroll-to-top.visible {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}

.scroll-to-top .icon {
    font-size: 20px;
}

@media (max-width: 768px) {
    .scroll-to-top {
        bottom: 20px;
        right: 20px;
        width: 40px;
        height: 40px;
    }
    
    .scroll-to-top .icon {
        font-size: 16px;
    }
}
`;

// Inject the styles into the document
const styleElement = document.createElement('style');
styleElement.textContent = scrollToTopStyles;
document.head.appendChild(styleElement);

// Create the button element
const scrollToTopButton = document.createElement('div');
scrollToTopButton.className = 'scroll-to-top';
scrollToTopButton.setAttribute('aria-label', 'Scroll to top');
scrollToTopButton.setAttribute('role', 'button');
scrollToTopButton.setAttribute('tabindex', '0');
scrollToTopButton.innerHTML = '<i class="fas fa-chevron-up icon"></i>';

// Append the button to the body
document.body.appendChild(scrollToTopButton);

// Function to handle the scroll event
function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 600) {
        scrollToTopButton.classList.add('visible');
    } else {
        scrollToTopButton.classList.remove('visible');
    }
}

// Function to scroll to top
function scrollToTop() {
    // Use smooth scrolling if supported
    if ('scrollBehavior' in document.documentElement.style) {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    } else {
        // Fallback for browsers that don't support smooth scrolling
        const scrollToTop = function() {
            const currentPosition = window.pageYOffset || document.documentElement.scrollTop;
            
            if (currentPosition > 0) {
                window.requestAnimationFrame(scrollToTop);
                window.scrollTo(0, currentPosition - currentPosition / 8);
            }
        };
        
        scrollToTop();
    }
}

// Add event listeners
window.addEventListener('scroll', handleScroll);

scrollToTopButton.addEventListener('click', scrollToTop);

// Make it keyboard accessible
scrollToTopButton.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        scrollToTop();
        e.preventDefault();
    }
});

// Initial state check
handleScroll();
