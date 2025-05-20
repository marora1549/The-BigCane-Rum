/**
 * The Big Cane - Security Utilities
 * 
 * This file contains security-related functions and utilities to help
 * protect the website against common vulnerabilities including XSS,
 * CSRF, and input validation issues.
 */

const BigCaneSecurity = {
    /**
     * Sanitize user input to prevent XSS attacks
     * @param {string} input - User input to sanitize
     * @returns {string} - Sanitized input
     */
    sanitizeInput: function(input) {
        if (!input) return '';
        
        // Create a temporary div element
        const tempElement = document.createElement('div');
        
        // Set the div's content to the input, which will be text (not HTML)
        tempElement.textContent = input;
        
        // Return the escaped HTML
        return tempElement.innerHTML;
    },
    
    /**
     * Generate a CSRF token for form protection
     * @returns {string} - CSRF token
     */
    generateCSRFToken: function() {
        // Generate a random string for the token
        const randomPool = new Uint8Array(32);
        crypto.getRandomValues(randomPool);
        
        return Array.from(randomPool)
            .map(x => x.toString(16).padStart(2, '0'))
            .join('');
    },
    
    /**
     * Add CSRF token to a form
     * @param {HTMLFormElement} form - Form to protect
     */
    protectFormWithCSRF: function(form) {
        if (!form) return;
        
        // Generate a token
        const token = this.generateCSRFToken();
        
        // Store the token in localStorage (in a real app, this should be in a secure HttpOnly cookie)
        localStorage.setItem('bigcane_csrf_token', token);
        
        // Create a hidden field for the token
        const hiddenField = document.createElement('input');
        hiddenField.type = 'hidden';
        hiddenField.name = 'csrf_token';
        hiddenField.value = token;
        
        // Add the field to the form
        form.appendChild(hiddenField);
    },
    
    /**
     * Validate an email address format
     * @param {string} email - Email to validate
     * @returns {boolean} - Whether the email is valid
     */
    validateEmail: function(email) {
        const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        return regex.test(email);
    },
    
    /**
     * Initialize security measures on the page
     */
    init: function() {
        // Add CSP header via meta tag (fallback, should be set server-side)
        const cspMeta = document.createElement('meta');
        cspMeta.httpEquiv = 'Content-Security-Policy';
        cspMeta.content = "default-src 'self'; script-src 'self' https://cdnjs.cloudflare.com 'unsafe-inline'; style-src 'self' https://cdnjs.cloudflare.com https://fonts.googleapis.com 'unsafe-inline'; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; img-src 'self' data:; connect-src 'self'; form-action 'self'; base-uri 'self';";
        document.head.appendChild(cspMeta);
        
        // Add referrer policy
        const referrerMeta = document.createElement('meta');
        referrerMeta.name = 'referrer';
        referrerMeta.content = 'strict-origin-when-cross-origin';
        document.head.appendChild(referrerMeta);
        
        // Apply CSRF protection to all forms
        document.querySelectorAll('form').forEach(form => {
            this.protectFormWithCSRF(form);
        });
        
        // Add input validation to any text fields
        document.querySelectorAll('input[type="text"], input[type="email"], textarea').forEach(input => {
            input.addEventListener('blur', function() {
                // Sanitize the input when it loses focus
                this.value = BigCaneSecurity.sanitizeInput(this.value);
                
                // For email inputs, validate format
                if (this.type === 'email' && this.value) {
                    if (!BigCaneSecurity.validateEmail(this.value)) {
                        this.classList.add('error');
                        
                        // Show error message if one doesn't exist
                        if (!this.nextElementSibling || !this.nextElementSibling.classList.contains('error-message')) {
                            const errorMessage = document.createElement('div');
                            errorMessage.classList.add('error-message');
                            errorMessage.textContent = 'Please enter a valid email address';
                            this.parentNode.insertBefore(errorMessage, this.nextSibling);
                        }
                    } else {
                        this.classList.remove('error');
                        
                        // Remove error message if it exists
                        if (this.nextElementSibling && this.nextElementSibling.classList.contains('error-message')) {
                            this.nextElementSibling.remove();
                        }
                    }
                }
            });
        });
    }
};

// Initialize security features when the page loads
document.addEventListener('DOMContentLoaded', function() {
    BigCaneSecurity.init();
});

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BigCaneSecurity;
}
