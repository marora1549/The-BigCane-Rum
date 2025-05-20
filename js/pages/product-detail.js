/**
 * Product Detail Page JavaScript
 * 
 * This module handles all interactive elements on the product detail pages,
 * including tab switching, product image interactions,
 * rating system, and similar products slider functionality.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive components
    initProductImageInteraction();
    initTabSwitching();
    initRatingSystem();
    initProductSlider();
    initFormSubmission();
    initProcessStepAnimation();
    
    // Remove preloader once everything is initialized
    setTimeout(() => {
        document.querySelector('.preloader').classList.add('fadeOut');
    }, 800);
});

/**
 * Initialize product image hover effects and interactions
 */
function initProductImageInteraction() {
    const productBottle = document.querySelector('.product-bottle');
    
    if (productBottle) {
        // 3D hover effect
        productBottle.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const offsetX = (x / rect.width - 0.5) * 20;
            const offsetY = (y / rect.height - 0.5) * 20;
            
            this.style.transform = `translateY(-10px) translateX(${offsetX}px) translateY(${offsetY}px) rotate(${offsetX * 0.2}deg)`;
        });
        
        // Reset on mouse leave
        productBottle.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) translateX(0) translateY(0) rotate(0)';
        });
    }
}

/**
 * Initialize tab switching functionality
 */
function initTabSwitching() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    if (tabButtons.length > 0 && tabPanes.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active state for buttons
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Show selected tab content
                const targetTab = button.getAttribute('data-tab');
                tabPanes.forEach(pane => {
                    pane.classList.remove('active');
                    if (pane.id === targetTab) {
                        pane.classList.add('active');
                        
                        // Trigger special animations for specific tabs
                        if (targetTab === 'making') {
                            initProcessStepAnimation();
                        }
                    }
                });
            });
        });
    }
}

/**
 * Initialize star rating functionality
 */
function initRatingSystem() {
    const starRatings = document.querySelectorAll('.star-rating');
    let currentRating = 0;
    const starContainer = document.querySelector('.review-form__stars');
    
    if (starRatings.length > 0) {
        starRatings.forEach(star => {
            // Hover effect
            star.addEventListener('mouseenter', () => {
                const rating = parseInt(star.getAttribute('data-rating'));
                
                starRatings.forEach(s => {
                    const sRating = parseInt(s.getAttribute('data-rating'));
                    if (sRating <= rating) {
                        s.querySelector('i').className = 'fas fa-star';
                    } else {
                        s.querySelector('i').className = 'far fa-star';
                    }
                });
            });
            
            // Click to set rating
            star.addEventListener('click', () => {
                currentRating = parseInt(star.getAttribute('data-rating'));
                
                starRatings.forEach(s => {
                    const sRating = parseInt(s.getAttribute('data-rating'));
                    s.classList.toggle('active', sRating <= currentRating);
                });
            });
        });
        
        // Restore current rating when mouse leaves container
        if (starContainer) {
            starContainer.addEventListener('mouseleave', () => {
                starRatings.forEach(s => {
                    const sRating = parseInt(s.getAttribute('data-rating'));
                    if (sRating <= currentRating) {
                        s.querySelector('i').className = 'fas fa-star';
                    } else {
                        s.querySelector('i').className = 'far fa-star';
                    }
                });
            });
        }
    }
}

/**
 * Initialize similar products slider with drag functionality
 */
function initProductSlider() {
    const productSlider = document.querySelector('.product-slider');
    let isDown = false;
    let startX;
    let scrollLeft;
    
    if (productSlider) {
        // Mouse events for drag scrolling
        productSlider.addEventListener('mousedown', (e) => {
            isDown = true;
            productSlider.classList.add('grabbing');
            startX = e.pageX - productSlider.offsetLeft;
            scrollLeft = productSlider.scrollLeft;
        });
        
        productSlider.addEventListener('mouseleave', () => {
            isDown = false;
            productSlider.classList.remove('grabbing');
        });
        
        productSlider.addEventListener('mouseup', () => {
            isDown = false;
            productSlider.classList.remove('grabbing');
        });
        
        productSlider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - productSlider.offsetLeft;
            const walk = (x - startX) * 2;
            productSlider.scrollLeft = scrollLeft - walk;
        });
        
        // Touch events for mobile
        productSlider.addEventListener('touchstart', (e) => {
            isDown = true;
            startX = e.touches[0].pageX - productSlider.offsetLeft;
            scrollLeft = productSlider.scrollLeft;
        }, { passive: true });
        
        productSlider.addEventListener('touchend', () => {
            isDown = false;
        }, { passive: true });
        
        productSlider.addEventListener('touchmove', (e) => {
            if (!isDown) return;
            const x = e.touches[0].pageX - productSlider.offsetLeft;
            const walk = (x - startX) * 2;
            productSlider.scrollLeft = scrollLeft - walk;
        }, { passive: true });
    }
}

/**
 * Initialize form submission (simulated)
 */
function initFormSubmission() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validate form
            let isValid = true;
            
            const requiredFields = form.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
            
            if (!isValid) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }
            
            // Simulate form submission
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            submitButton.disabled = true;
            
            // Simulate API call with delay
            setTimeout(() => {
                submitButton.innerHTML = '<i class="fas fa-check"></i> Success!';
                
                // Show success notification
                showNotification('Your submission was successful!', 'success');
                
                // Reset form after a delay
                setTimeout(() => {
                    form.reset();
                    submitButton.innerHTML = originalText;
                    submitButton.disabled = false;
                    
                    // Reset rating stars if present
                    if (form.querySelector('.review-form__stars')) {
                        const stars = form.querySelectorAll('.star-rating');
                        stars.forEach(s => {
                            s.classList.remove('active');
                            s.querySelector('i').className = 'far fa-star';
                        });
                    }
                }, 2000);
            }, 1500);
        });
    });
}

/**
 * Show notification message
 * @param {string} message - The message to display
 * @param {string} type - The type of notification (success, error, etc.)
 */
function showNotification(message, type = 'info') {
    // Check if notification container exists, create if not
    let notifContainer = document.querySelector('.notification-container');
    
    if (!notifContainer) {
        notifContainer = document.createElement('div');
        notifContainer.className = 'notification-container';
        document.body.appendChild(notifContainer);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    
    // Add icon based on type
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    if (type === 'warning') icon = 'exclamation-triangle';
    
    notification.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
    `;
    
    // Add to container
    notifContainer.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('active');
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
        notification.classList.remove('active');
        
        // Remove element after animation
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

/**
 * Initialize animations for making process steps
 */
function initProcessStepAnimation() {
    const processSteps = document.querySelectorAll('.process-step');
    
    if (processSteps.length > 0) {
        processSteps.forEach((step, index) => {
            // Reset animation state
            step.classList.remove('revealed');
            
            // Trigger animation with staggered delay
            setTimeout(() => {
                step.classList.add('revealed');
            }, 150 * index);
        });
    }
}
