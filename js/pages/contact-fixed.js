// Fixed FAQ Accordion JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the FAQ accordion
    initFaqAccordion();
    
    // Handle newsletter form
    initNewsletterForm();
});

function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    // Apply initial styles to make sure answers are hidden
    faqItems.forEach(item => {
        const answer = item.querySelector('.faq-answer');
        const paragraphs = answer ? answer.querySelectorAll('p') : null;
        
        if (answer) {
            // Set initial styles for the answer container
            answer.style.display = 'none';
            answer.style.height = '0';
            answer.style.padding = '0';
            answer.style.opacity = '0';
            answer.style.overflow = 'hidden';
            answer.style.transition = 'all 0.3s ease-in-out';
            
            // Make sure the text is properly styled
            if (paragraphs && paragraphs.length > 0) {
                paragraphs.forEach(p => {
                    p.style.color = '#ffffff';
                    p.style.fontSize = '16px';
                    p.style.lineHeight = '1.6';
                    p.style.opacity = '1';
                });
            }
        }
    });
    
    // Add click event listeners to questions
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Toggle this FAQ item
            toggleFaqItem(item);
        });
    });
}

function toggleFaqItem(item) {
    const isActive = item.classList.contains('active');
    const answer = item.querySelector('.faq-answer');
    const icon = item.querySelector('.faq-icon i');
    const allItems = document.querySelectorAll('.faq-item');
    
    // First, close all items
    allItems.forEach(faqItem => {
        const faqAnswer = faqItem.querySelector('.faq-answer');
        const faqIcon = faqItem.querySelector('.faq-icon i');
        
        if (faqItem !== item) {
            faqItem.classList.remove('active');
            if (faqAnswer) {
                faqAnswer.style.display = 'none';
                faqAnswer.style.height = '0';
                faqAnswer.style.padding = '0';
                faqAnswer.style.opacity = '0';
            }
            if (faqIcon) {
                faqIcon.className = 'fas fa-plus';
            }
        }
    });
    
    // Then, if this item wasn't active, open it
    if (!isActive) {
        item.classList.add('active');
        if (answer) {
            answer.style.display = 'block';
            answer.style.height = 'auto';
            answer.style.padding = '20px';
            answer.style.opacity = '1';
            // Make sure the text is visible
            const answerText = answer.querySelector('p');
            if (answerText) {
                answerText.style.display = 'block';
                answerText.style.color = '#ffffff';
                answerText.style.opacity = '1';
            }
        }
        if (icon) {
            icon.className = 'fas fa-minus';
        }
    } else {
        // If it was active, close it
        item.classList.remove('active');
        if (answer) {
            answer.style.display = 'none';
            answer.style.height = '0';
            answer.style.padding = '0';
            answer.style.opacity = '0';
        }
        if (icon) {
            icon.className = 'fas fa-plus';
        }
    }
}

function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = document.getElementById('newsletterEmail');
            const response = document.getElementById('newsletterResponse');
            
            // Simple email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value)) {
                response.textContent = 'Please enter a valid email address.';
                response.className = 'form-response error';
                return;
            }
            
            // Sanitize input (normally would call BigCaneSecurity.sanitizeInput)
            emailInput.value = emailInput.value.trim();
            
            // Simulate successful submission
            response.textContent = 'Thank you for subscribing! You will receive a confirmation email shortly.';
            response.className = 'form-response success';
            
            // Clear the form
            emailInput.value = '';
        });
    }
}
