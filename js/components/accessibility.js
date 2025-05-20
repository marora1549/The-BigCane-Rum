/**
 * The Big Cane - Accessibility Features
 * This file implements various accessibility enhancements for the website.
 */

const BigCaneAccessibility = {
    /**
     * Initialize accessibility features
     */
    init: function() {
        this.addSkipToContentLink();
        this.initKeyboardNavigation();
        this.createTextSizeControls();
        this.initHighContrastMode();
        this.initReducedMotionCheck();
        this.enhanceFocusVisibility();
        this.addAriaAttributes();
        this.createAnnouncementsRegion();
    },
    
    /**
     * Add skip to content link for keyboard users
     */
    addSkipToContentLink: function() {
        // Create the skip link element
        const skipLink = document.createElement('a');
        skipLink.className = 'skip-to-content';
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to content';
        skipLink.setAttribute('aria-label', 'Skip to main content');
        
        // Insert at the beginning of the body
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Add ID to main content area if it doesn't exist
        const mainContent = document.querySelector('main') || document.querySelector('.hero') || document.querySelector('section:first-of-type');
        
        if (mainContent && !mainContent.id) {
            mainContent.id = 'main-content';
        }
        
        // Handle click event to set focus
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.setAttribute('tabindex', '-1');
                mainContent.focus();
                
                // Remove tabindex after focus to avoid issues with keyboard navigation
                setTimeout(function() {
                    mainContent.removeAttribute('tabindex');
                }, 1000);
            }
        });
    },
    
    /**
     * Initialize keyboard navigation detection
     */
    initKeyboardNavigation: function() {
        // Create keyboard navigation indicator
        const indicator = document.createElement('div');
        indicator.className = 'keyboard-nav-indicator';
        indicator.innerHTML = '<i class="fas fa-keyboard"></i> Keyboard Navigation Active';
        document.body.appendChild(indicator);
        
        // Switch to detect keyboard navigation
        let usingKeyboard = false;
        
        // Listen for keyboard events
        document.addEventListener('keydown', function(e) {
            // Tab key is most commonly used for keyboard navigation
            if (e.key === 'Tab') {
                if (!usingKeyboard) {
                    document.body.classList.add('keyboard-navigation');
                    usingKeyboard = true;
                }
            }
        });
        
        // Detect mouse use to turn off keyboard navigation mode
        document.addEventListener('mousedown', function() {
            if (usingKeyboard) {
                document.body.classList.remove('keyboard-navigation');
                usingKeyboard = false;
            }
        });
    },
    
    /**
     * Create text size adjustment controls
     */
    createTextSizeControls: function() {
        // Create container
        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'text-size-controls';
        controlsContainer.setAttribute('aria-label', 'Text size controls');
        
        // Create increase button
        const increaseBtn = document.createElement('button');
        increaseBtn.className = 'text-size-btn';
        increaseBtn.innerHTML = '<i class="fas fa-plus"></i>';
        increaseBtn.setAttribute('aria-label', 'Increase text size');
        
        // Create decrease button
        const decreaseBtn = document.createElement('button');
        decreaseBtn.className = 'text-size-btn';
        decreaseBtn.innerHTML = '<i class="fas fa-minus"></i>';
        decreaseBtn.setAttribute('aria-label', 'Decrease text size');
        
        // Create reset button
        const resetBtn = document.createElement('button');
        resetBtn.className = 'text-size-btn';
        resetBtn.innerHTML = '<i class="fas fa-undo"></i>';
        resetBtn.setAttribute('aria-label', 'Reset text size');
        
        // Add event listeners
        increaseBtn.addEventListener('click', function() {
            if (document.body.classList.contains('text-size-larger')) {
                document.body.classList.remove('text-size-larger');
                document.body.classList.add('text-size-largest');
                this.announce('Text size set to largest');
            } else if (!document.body.classList.contains('text-size-largest')) {
                document.body.classList.add('text-size-larger');
                this.announce('Text size set to larger');
            }
            
            // Save preference
            localStorage.setItem('bigcane_text_size', document.body.className);
        }.bind(this));
        
        decreaseBtn.addEventListener('click', function() {
            if (document.body.classList.contains('text-size-largest')) {
                document.body.classList.remove('text-size-largest');
                document.body.classList.add('text-size-larger');
                this.announce('Text size set to larger');
            } else if (document.body.classList.contains('text-size-larger')) {
                document.body.classList.remove('text-size-larger');
                this.announce('Text size set to normal');
            }
            
            // Save preference
            localStorage.setItem('bigcane_text_size', document.body.className);
        }.bind(this));
        
        resetBtn.addEventListener('click', function() {
            document.body.classList.remove('text-size-larger', 'text-size-largest');
            localStorage.removeItem('bigcane_text_size');
            this.announce('Text size reset to default');
        }.bind(this));
        
        // Add buttons to container
        controlsContainer.appendChild(increaseBtn);
        controlsContainer.appendChild(decreaseBtn);
        controlsContainer.appendChild(resetBtn);
        
        // Add container to body
        document.body.appendChild(controlsContainer);
        
        // Load saved preference
        const savedTextSize = localStorage.getItem('bigcane_text_size');
        if (savedTextSize) {
            document.body.className = savedTextSize;
        }
    },
    
    /**
     * Initialize high contrast mode
     */
    initHighContrastMode: function() {
        // Create the high contrast button
        const highContrastBtn = document.createElement('button');
        highContrastBtn.className = 'text-size-btn';
        highContrastBtn.innerHTML = '<i class="fas fa-adjust"></i>';
        highContrastBtn.setAttribute('aria-label', 'Toggle high contrast mode');
        
        // Add to text size controls
        const controls = document.querySelector('.text-size-controls');
        if (controls) {
            controls.appendChild(highContrastBtn);
        }
        
        // Event listener
        highContrastBtn.addEventListener('click', function() {
            document.body.classList.toggle('high-contrast');
            
            // Announce change to screen readers
            const isHighContrast = document.body.classList.contains('high-contrast');
            this.announce(isHighContrast ? 'High contrast mode enabled' : 'High contrast mode disabled');
            
            // Save preference
            localStorage.setItem('bigcane_high_contrast', isHighContrast ? 'true' : 'false');
        }.bind(this));
        
        // Load saved preference
        const savedPreference = localStorage.getItem('bigcane_high_contrast');
        if (savedPreference === 'true') {
            document.body.classList.add('high-contrast');
        }
    },
    
    /**
     * Check for reduced motion preference
     */
    initReducedMotionCheck: function() {
        // Check if user prefers reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion) {
            // Add class to body
            document.body.classList.add('reduced-motion');
            
            // Disable animations
            const animatedElements = document.querySelectorAll('.animate, .reveal-from-bottom, .reveal-from-left, .reveal-from-right, .fade-in, .parallax');
            
            animatedElements.forEach(element => {
                element.classList.remove('animate', 'reveal-from-bottom', 'reveal-from-left', 'reveal-from-right', 'fade-in', 'parallax');
                element.style.opacity = '1';
                element.style.transform = 'none';
            });
            
            // Disable parallax effects
            const parallaxElements = document.querySelectorAll('.parallax-bg');
            parallaxElements.forEach(element => {
                element.style.backgroundAttachment = 'scroll';
            });
        }
    },
    
    /**
     * Enhance visibility of focus for interactive elements
     */
    enhanceFocusVisibility: function() {
        const interactiveElements = document.querySelectorAll('a, button, [role="button"], [tabindex="0"]');
        
        interactiveElements.forEach(element => {
            element.classList.add('interactive-visible-focus');
        });
    },
    
    /**
     * Add ARIA attributes to improve screen reader experience
     */
    addAriaAttributes: function() {
        // Add ARIA landmarks if missing
        if (!document.querySelector('[role="banner"]')) {
            const header = document.querySelector('header');
            if (header) header.setAttribute('role', 'banner');
        }
        
        if (!document.querySelector('[role="navigation"]')) {
            const nav = document.querySelector('nav');
            if (nav) nav.setAttribute('role', 'navigation');
        }
        
        if (!document.querySelector('[role="main"]')) {
            const main = document.querySelector('main') || document.querySelector('.hero') || document.querySelector('section:first-of-type');
            if (main) main.setAttribute('role', 'main');
        }
        
        if (!document.querySelector('[role="contentinfo"]')) {
            const footer = document.querySelector('footer');
            if (footer) footer.setAttribute('role', 'contentinfo');
        }
        
        // Add ARIA attributes to specific components
        
        // Product cards
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach((card, index) => {
            card.setAttribute('aria-label', 'Product ' + (index + 1));
            
            const title = card.querySelector('.product-card__title');
            if (title) {
                card.setAttribute('aria-labelledby', 'product-title-' + index);
                title.id = 'product-title-' + index;
            }
        });
        
        // Carousel items
        const carouselSlides = document.querySelectorAll('.carousel-slide');
        carouselSlides.forEach((slide, index) => {
            slide.setAttribute('aria-hidden', slide.classList.contains('active') ? 'false' : 'true');
            slide.id = 'slide-' + index;
        });
        
        // Buttons that don't have text
        const iconButtons = document.querySelectorAll('button:not([aria-label])');
        iconButtons.forEach(button => {
            if (!button.textContent.trim()) {
                const iconClass = button.querySelector('i')?.className || '';
                let label = 'Button';
                
                if (iconClass.includes('fa-arrow')) label = 'Navigation arrow';
                else if (iconClass.includes('fa-plus')) label = 'Expand';
                else if (iconClass.includes('fa-minus')) label = 'Collapse';
                else if (iconClass.includes('fa-times')) label = 'Close';
                
                button.setAttribute('aria-label', label);
            }
        });
    },
    
    /**
     * Create an ARIA live region for dynamic announcements
     */
    createAnnouncementsRegion: function() {
        const liveRegion = document.createElement('div');
        liveRegion.className = 'sr-announcements';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        document.body.appendChild(liveRegion);
        
        // Store reference for future announcements
        this.announceRegion = liveRegion;
    },
    
    /**
     * Announce message to screen readers
     * @param {string} message - Message to announce
     */
    announce: function(message) {
        if (this.announceRegion) {
            this.announceRegion.textContent = message;
        }
    }
};

// Initialize accessibility features when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    BigCaneAccessibility.init();
});

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BigCaneAccessibility;
}