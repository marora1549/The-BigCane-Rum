// Simple, robust FAQ implementation
document.addEventListener('DOMContentLoaded', function() {
    // Get all FAQ items
    var faqItems = document.querySelectorAll('.faq-item');
    
    // Set up click handlers for each FAQ item
    faqItems.forEach(function(item) {
        var question = item.querySelector('.faq-question');
        var answer = item.querySelector('.faq-answer');
        var icon = item.querySelector('.faq-icon i');
        
        // Hide answers initially
        if (answer) {
            answer.style.display = 'none';
        }
        
        // Add click event
        if (question) {
            question.addEventListener('click', function() {
                // Check if this item is already active
                var isActive = item.classList.contains('active');
                
                // Close all items
                faqItems.forEach(function(otherItem) {
                    otherItem.classList.remove('active');
                    var otherAnswer = otherItem.querySelector('.faq-answer');
                    var otherIcon = otherItem.querySelector('.faq-icon i');
                    
                    if (otherAnswer) {
                        otherAnswer.style.display = 'none';
                    }
                    
                    if (otherIcon) {
                        otherIcon.className = 'fas fa-plus';
                    }
                });
                
                // Toggle the clicked item
                if (!isActive) {
                    item.classList.add('active');
                    
                    if (answer) {
                        answer.style.display = 'block';
                    }
                    
                    if (icon) {
                        icon.className = 'fas fa-minus';
                    }
                }
            });
        }
    });
    
    // Handle newsletter form (simple implementation)
    var newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var email = document.getElementById('newsletterEmail');
            var response = document.getElementById('newsletterResponse');
            
            if (response) {
                response.textContent = 'Thank you for subscribing!';
                response.className = 'form-response success';
            }
            
            if (email) {
                email.value = '';
            }
        });
    }
});
