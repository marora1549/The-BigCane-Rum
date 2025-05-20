// Hero Island Vibe Animations
document.addEventListener('DOMContentLoaded', function() {
  // Add floating bottle animation with improved 3D effect
  const productsImage = document.querySelector('.hero__products-image');
  if (productsImage) {
    // Create a keyframe animation for floating with subtle 3D rotation
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes product-float-3d {
        0% {
          transform: translateY(0) rotateY(0deg);
          filter: drop-shadow(0 30px 40px rgba(0, 0, 0, 0.4));
        }
        25% {
          transform: translateY(-3px) rotateY(0.5deg);
          filter: drop-shadow(0 32px 42px rgba(0, 0, 0, 0.42));
        }
        50% {
          transform: translateY(-5px) rotateY(0deg);
          filter: drop-shadow(0 35px 45px rgba(0, 0, 0, 0.45));
        }
        75% {
          transform: translateY(-3px) rotateY(-0.5deg);
          filter: drop-shadow(0 32px 42px rgba(0, 0, 0, 0.42));
        }
        100% {
          transform: translateY(0) rotateY(0deg);
          filter: drop-shadow(0 30px 40px rgba(0, 0, 0, 0.4));
        }
      }
    `;
    document.head.appendChild(style);
    
    // Apply animation
    productsImage.style.animation = 'product-float-3d 8s ease-in-out infinite';
  }
  
  // Add glassmorphism effect to the button
  const ctaButton = document.querySelector('.find-cocktail-btn');
  if (ctaButton) {
    // Add hover effect with additional depth
    ctaButton.addEventListener('mouseenter', () => {
      ctaButton.style.background = 'rgba(5, 217, 232, 0.3)';
      ctaButton.style.boxShadow = '0 8px 32px rgba(5, 217, 232, 0.4), 0 0 15px rgba(5, 217, 232, 0.4)';
      ctaButton.style.transform = 'translateY(-3px)';
    });
    
    ctaButton.addEventListener('mouseleave', () => {
      ctaButton.style.background = 'rgba(5, 217, 232, 0.2)';
      ctaButton.style.boxShadow = '0 8px 32px rgba(5, 217, 232, 0.2)';
      ctaButton.style.transform = 'translateY(0)';
    });
  }
  
  // Add enhanced neon effect to social icons
  const socialIcons = document.querySelectorAll('.social-icon--neon');
  socialIcons.forEach(icon => {
    icon.addEventListener('mouseenter', () => {
      icon.style.transform = 'translateY(-5px)';
      icon.style.boxShadow = '0 5px 15px rgba(5, 217, 232, 0.7)';
      icon.style.background = 'rgba(5, 217, 232, 0.3)';
    });
    
    icon.addEventListener('mouseleave', () => {
      icon.style.transform = 'translateY(0)';
      icon.style.boxShadow = 'none';
      icon.style.background = 'rgba(255, 255, 255, 0.1)';
    });
  });
  
  // Create a subtle glow effect to highlight the bottles
  const heroImageContent = document.querySelector('.hero__image-content');
  if (heroImageContent) {
    // Create a glow element
    const glow = document.createElement('div');
    glow.classList.add('hero-bottle-glow');
    glow.style.position = 'absolute';
    glow.style.width = '100%';
    glow.style.height = '30%';
    glow.style.bottom = '0';
    glow.style.left = '0';
    glow.style.background = 'radial-gradient(ellipse at center, rgba(5, 217, 232, 0.2) 0%, transparent 70%)';
    glow.style.filter = 'blur(15px)';
    glow.style.zIndex = '1';
    glow.style.opacity = '0.7';
    glow.style.animation = 'glow-pulse 4s ease-in-out infinite alternate';
    
    // Add keyframes for the glow
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes glow-pulse {
        0% {
          opacity: 0.5;
          transform: scale(0.9);
        }
        100% {
          opacity: 0.8;
          transform: scale(1.1);
        }
      }
    `;
    document.head.appendChild(style);
    
    // Add the glow effect
    heroImageContent.appendChild(glow);
  }
});

