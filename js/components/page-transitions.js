/**
 * The Big Cane - Page Transitions
 * 
 * This script handles the smooth transitions between pages
 * to create a seamless, app-like experience for users.
 */

const PageTransitions = {
    /**
     * Initialize page transitions
     */
    init: function() {
        // Create transition overlay if it doesn't exist
        this.createTransitionOverlay();
        
        // Cache DOM elements
        this.overlay = document.querySelector('.page-transition-overlay');
        
        if (!this.overlay) {
            console.warn('Page transition overlay not found');
            return;
        }
        
        // Handle all link clicks
        this.setupLinkHandlers();
        
        // Handle browser back/forward navigation
        this.setupPopStateHandler();
        
        // Perform initial entrance animation
        this.performEntranceTransition();
    },
    
    /**
     * Create the transition overlay element
     */
    createTransitionOverlay: function() {
        // Check if overlay already exists
        if (document.querySelector('.page-transition-overlay')) {
            return;
        }
        
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'page-transition-overlay';
        
        // Create overlay inner content (optional decorative elements)
        overlay.innerHTML = `
            <div class="page-transition-content">
                <div class="page-transition-logo">
                    <img src="/assets/images/big-cane-logo.png" alt="" aria-hidden="true">
                </div>
                <div class="page-transition-loader">
                    <span></span><span></span><span></span>
                </div>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .page-transition-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(10, 10, 30, 0.98);
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.4s ease, visibility 0.4s ease;
            }
            
            .page-transition-overlay.active {
                opacity: 1;
                visibility: visible;
            }
            
            .page-transition-content {
                text-align: center;
            }
            
            .page-transition-logo {
                margin-bottom: 20px;
            }
            
            .page-transition-logo img {
                width: 150px;
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.3s ease 0.2s, transform 0.3s ease 0.2s;
            }
            
            .page-transition-overlay.active .page-transition-logo img {
                opacity: 1;
                transform: translateY(0);
            }
            
            .page-transition-loader {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }
            
            .page-transition-loader span {
                display: inline-block;
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background: #FF2A6D;
                opacity: 0;
                transform: scale(0);
            }
            
            .page-transition-overlay.active .page-transition-loader span {
                animation: loaderAnimation 1.5s infinite ease-in-out;
            }
            
            .page-transition-overlay.active .page-transition-loader span:nth-child(1) {
                animation-delay: 0s;
            }
            
            .page-transition-overlay.active .page-transition-loader span:nth-child(2) {
                animation-delay: 0.2s;
            }
            
            .page-transition-overlay.active .page-transition-loader span:nth-child(3) {
                animation-delay: 0.4s;
            }
            
            @keyframes loaderAnimation {
                0%, 100% {
                    opacity: 0.3;
                    transform: scale(0.8);
                }
                50% {
                    opacity: 1;
                    transform: scale(1);
                }
            }
        `;
        
        // Add to document
        document.head.appendChild(style);
        document.body.appendChild(overlay);
    },
    
    /**
     * Set up handlers for link clicks
     */
    setupLinkHandlers: function() {
        // Get all internal links
        const links = document.querySelectorAll('a[href^="/"]:not([target]), a[href^="./"]:not([target]), a[href^="../"]:not([target]), a[href^="http://' + window.location.host + '"]:not([target]), a[href^="https://' + window.location.host + '"]:not([target]), a[href^="' + window.location.origin + '"]:not([target])');
        
        // Add event listeners
        links.forEach(link => {
            // Skip links with data-no-transition attribute
            if (link.hasAttribute('data-no-transition')) {
                return;
            }
            
            // Skip links to non-HTML files (like PDFs, images, etc.)
            const href = link.getAttribute('href');
            const fileExtension = href.split('.').pop().toLowerCase();
            
            if (['pdf', 'jpg', 'jpeg', 'png', 'gif', 'doc', 'docx', 'xls', 'xlsx', 'zip', 'rar'].includes(fileExtension)) {
                return;
            }
            
            // Skip links with specific classes
            if (link.classList.contains('no-transition') || 
                link.parentElement.classList.contains('no-transition')) {
                return;
            }
            
            // Add click handler
            link.addEventListener('click', this.handleLinkClick.bind(this));
        });
    },
    
    /**
     * Handle link click
     * @param {Event} e - Click event
     */
    handleLinkClick: function(e) {
        // Skip if modifier key is pressed
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
            return;
        }
        
        // Get the URL
        const href = e.currentTarget.getAttribute('href');
        
        // Skip if it's the current page
        if (href === window.location.pathname) {
            return;
        }
        
        // Prevent default navigation
        e.preventDefault();
        
        // Perform exit transition
        this.performExitTransition(href);
    },
    
    /**
     * Setup handler for browser back/forward buttons
     */
    setupPopStateHandler: function() {
        window.addEventListener('popstate', e => {
            // Perform exit transition on back/forward navigation
            this.performExitTransition(window.location.pathname, true);
        });
    },
    
    /**
     * Perform exit transition
     * @param {string} url - The URL to navigate to
     * @param {boolean} isPopState - Whether this is triggered by popstate
     */
    performExitTransition: function(url, isPopState = false) {
        // Activate overlay
        this.overlay.classList.add('active');
        
        // Announce page transition to screen readers
        this.announcePageTransition();
        
        // After animation, navigate to the new page
        setTimeout(() => {
            if (isPopState) {
                // Reload the page if it's a back/forward navigation
                window.location.reload();
            } else {
                // Navigate to the new URL
                window.location.href = url;
            }
        }, 600);
    },
    
    /**
     * Perform entrance transition (when page loads)
     */
    performEntranceTransition: function() {
        // Set initial active state to show overlay
        this.overlay.classList.add('active');
        
        // After a short delay, hide the overlay
        setTimeout(() => {
            this.overlay.classList.remove('active');
            
            // Remove overlay completely after transition ends
            setTimeout(() => {
                this.overlay.style.display = 'none';
            }, 400);
        }, 800);
    },
    
    /**
     * Announce page transition to screen readers
     */
    announcePageTransition: function() {
        const announcer = document.querySelector('.sr-announcements');
        
        if (announcer) {
            announcer.textContent = 'Navigating to new page';
        }
    }
};

// Initialize page transitions when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    PageTransitions.init();
});

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PageTransitions;
}