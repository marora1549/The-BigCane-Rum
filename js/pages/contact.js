/**
 * Contact Page JavaScript
 * 
 * This module handles all interactive elements on the contact page,
 * primarily the FAQ accordion functionality.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize FAQ Accordion
    initFaqAccordion();
});

/**
 * Initialize FAQ accordion functionality
 */
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems.length === 0) return;
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('.faq-icon i');
        
        // Set initial state for all FAQs
        answer.style.display = 'none';
        
        question.addEventListener('click', () => {
            // Toggle current item
            const isActive = item.classList.contains('active');
            
            // Toggle active state
            item.classList.toggle('active');
            
            // Toggle icon
            if (icon) {
                icon.classList.toggle('fa-plus');
                icon.classList.toggle('fa-minus');
            }
            
            // Toggle answer visibility with animation
            if (isActive) {
                answer.style.maxHeight = '0';
                setTimeout(() => {
                    answer.style.display = 'none';
                }, 300);
            } else {
                answer.style.display = 'block';
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
    
    // Activate the first FAQ item by default
    if (faqItems.length > 0) {
        const firstItem = faqItems[0];
        const firstAnswer = firstItem.querySelector('.faq-answer');
        const firstIcon = firstItem.querySelector('.faq-icon i');
        
        firstItem.classList.add('active');
        if (firstIcon) {
            firstIcon.classList.remove('fa-plus');
            firstIcon.classList.add('fa-minus');
        }
        
        firstAnswer.style.display = 'block';
        firstAnswer.style.maxHeight = firstAnswer.scrollHeight + 'px';
    }
}
