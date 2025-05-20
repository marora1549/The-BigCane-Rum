/**
 * Mobile Navigation Enhancement
 * 
 * This script improves the mobile navigation experience by adding an overlay
 * and smooth transitions when the mobile menu is opened/closed.
 * It also handles navigation accessibility and proper event management.
 * 
 * @version 1.1.0
 * @updated 2025-05-18
 */

(function() {
    // Execute when DOM is fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        initMobileNavigation();
    });

    /**
     * Initialize mobile navigation functionality
     */
    function initMobileNavigation() {
        // Create and append navigation overlay if it doesn't exist
        ensureNavOverlayExists();
        
        // Get required DOM elements
        const navToggle = document.querySelector('.nav-toggle');
        const mainNav = document.querySelector('.main-nav');
        const navOverlay = document.querySelector('.nav-overlay');
        
        // Exit if required elements don't exist
        if (!navToggle || !mainNav || !navOverlay) {
            console.warn('Mobile navigation: Required elements not found');
            return;
        }
        
        // Add event listeners
        setupEventListeners(navToggle, mainNav, navOverlay);
        
        // Add accessibility features
        enhanceAccessibility(navToggle, mainNav);
        
        // Fix iOS specific issues
        fixIOSTouchIssues(mainNav);
    }
    
    /**
     * Create navigation overlay if it doesn't exist
     */
    function ensureNavOverlayExists() {
        if (!document.querySelector('.nav-overlay')) {
            const navOverlay = document.createElement('div');
            navOverlay.className = 'nav-overlay';
            navOverlay.setAttribute('aria-hidden', 'true');
            document.body.appendChild(navOverlay);
        }
    }
    
    /**
     * Set up all event listeners for mobile navigation
     * @param {HTMLElement} navToggle - The navigation toggle button
     * @param {HTMLElement} mainNav - The main navigation element
     * @param {HTMLElement} navOverlay - The navigation overlay element
     */
    function setupEventListeners(navToggle, mainNav, navOverlay) {
        // Toggle navigation when clicking the toggle button
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            toggleNavigation(navToggle, mainNav, navOverlay);
        });
        
        // Close navigation when clicking the overlay
        navOverlay.addEventListener('click', function() {
            closeNavigation(navToggle, mainNav, navOverlay);
        });
        
        // Close navigation when pressing Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mainNav.classList.contains('active')) {
                closeNavigation(navToggle, mainNav, navOverlay);
            }
        });
        
        // Close navigation when clicking a link
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                // Small delay to allow the click to register before closing
                setTimeout(function() {
                    closeNavigation(navToggle, mainNav, navOverlay);
                }, 100);
            });
        });
        
        // Handle window resize to fix navigation on desktop
        window.addEventListener('resize', function() {
            if (window.innerWidth > 991 && mainNav.classList.contains('active')) {
                closeNavigation(navToggle, mainNav, navOverlay);
            }
        });
    }
    
    /**
     * Toggle the navigation state
     * @param {HTMLElement} navToggle - The navigation toggle button
     * @param {HTMLElement} mainNav - The main navigation element
     * @param {HTMLElement} navOverlay - The navigation overlay element
     */
    function toggleNavigation(navToggle, mainNav, navOverlay) {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        
        if (isExpanded) {
            closeNavigation(navToggle, mainNav, navOverlay);
        } else {
            openNavigation(navToggle, mainNav, navOverlay);
        }
    }
    
    /**
     * Open the navigation
     * @param {HTMLElement} navToggle - The navigation toggle button
     * @param {HTMLElement} mainNav - The main navigation element
     * @param {HTMLElement} navOverlay - The navigation overlay element
     */
    function openNavigation(navToggle, mainNav, navOverlay) {
        navToggle.classList.add('active');
        mainNav.classList.add('active');
        navOverlay.classList.add('active');
        
        navToggle.setAttribute('aria-expanded', 'true');
        mainNav.setAttribute('aria-hidden', 'false');
        navOverlay.setAttribute('aria-hidden', 'false');
        
        // Prevent background scrolling
        document.body.classList.add('menu-open');
        document.body.style.overflow = 'hidden';
        
        // Focus on the first menu item for keyboard accessibility
        setTimeout(function() {
            const firstLink = mainNav.querySelector('a');
            if (firstLink) firstLink.focus();
        }, 200);
    }
    
    /**
     * Close the navigation
     * @param {HTMLElement} navToggle - The navigation toggle button
     * @param {HTMLElement} mainNav - The main navigation element
     * @param {HTMLElement} navOverlay - The navigation overlay element
     */
    function closeNavigation(navToggle, mainNav, navOverlay) {
        navToggle.classList.remove('active');
        mainNav.classList.remove('active');
        navOverlay.classList.remove('active');
        
        navToggle.setAttribute('aria-expanded', 'false');
        mainNav.setAttribute('aria-hidden', 'true');
        navOverlay.setAttribute('aria-hidden', 'true');
        
        // Restore background scrolling
        document.body.classList.remove('menu-open');
        document.body.style.overflow = '';
        
        // Return focus to the toggle button for accessibility
        navToggle.focus();
    }
    
    /**
     * Enhance accessibility features for navigation
     * @param {HTMLElement} navToggle - The navigation toggle button
     * @param {HTMLElement} mainNav - The main navigation element
     */
    function enhanceAccessibility(navToggle, mainNav) {
        // Add ARIA attributes
        mainNav.setAttribute('aria-label', 'Main navigation');
        mainNav.setAttribute('aria-hidden', 'true');
        mainNav.setAttribute('role', 'navigation');
        
        navToggle.setAttribute('aria-label', 'Toggle navigation menu');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-controls', 'mobile-nav');
        navToggle.setAttribute('role', 'button');
        
        // Add ID to the navigation for aria-controls reference
        mainNav.id = 'mobile-nav';
        
        // Add tabindex to make nav links focusable
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.setAttribute('tabindex', '0');
        });
    }
    
    /**
     * Fix iOS specific touch issues with mobile navigation
     * @param {HTMLElement} mainNav - The main navigation element
     */
    function fixIOSTouchIssues(mainNav) {
        // Detect iOS
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        
        if (isIOS) {
            // Add touch event listeners to fix scrolling issues on iOS
            mainNav.addEventListener('touchstart', function(e) {
                if (e.target.tagName !== 'A') {
                    e.preventDefault();
                }
            }, { passive: false });
            
            // Enable momentum scrolling for the nav menu on iOS
            const navList = mainNav.querySelector('ul');
            if (navList) {
                navList.style.webkitOverflowScrolling = 'touch';
            }
        }
    }
})();
