// THE BIGCANE EXPERIMENTAL - MAIN JAVASCRIPT FILE
// Author: Claude AI
// Date: May 2025

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all modules
  TheBigCane.init();
});

// Main namespace for all project functionality
const TheBigCane = {
  init: function() {
    this.preloader();
    this.ageVerification();
    this.initializeHeader();
    this.initializeParallax();
    this.initializeScrollReveal();
    this.initializeParticles();
    this.initializeProductSlider();
    this.initializeTiltCards();
    this.initializeNavigation();
    this.initializeSmoothScroll();
    this.initializePageTransitions();
    this.loadComponentScripts();
  },

  // Preloader - Responsive to actual page loading
  preloader: function() {
    const preloader = document.querySelector('.preloader');
    const preloaderBar = document.querySelector('.preloader__bar');
    
    if (!preloader) return;

    // Track actual loading progress
    let progress = 0;
    
    // Function to hide preloader with animation
    function hidePreloader() {
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.style.display = 'none';
        document.body.classList.add('loaded');
      }, 300); // Shorter transition time for better UX
    }
    
    // Track DOM content loaded (basic structure ready)
    document.addEventListener('DOMContentLoaded', function() {
      // Update progress bar to at least 60% when DOM is ready
      progress = Math.max(progress, 60);
      preloaderBar.style.width = progress + '%';
    });
    
    // Track window load (everything loaded including images)
    window.addEventListener('load', function() {
      preloaderBar.style.width = '100%';
      hidePreloader();
    });
    
    // Track resource loading for more granular progress updates
    const resources = [
      ...Array.from(document.images),
      ...Array.from(document.querySelectorAll('link[rel="stylesheet"]')),
      ...Array.from(document.querySelectorAll('script[src]'))
    ];
    
    const totalResources = resources.length;
    
    // If no trackable resources, rely on load/DOMContentLoaded events
    if (totalResources === 0) {
      document.addEventListener('DOMContentLoaded', function() {
        preloaderBar.style.width = '100%';
        hidePreloader();
      });
      return;
    }
    
    let loadedResources = 0;
    
    // Function to update progress based on resources
    function updateProgress() {
      loadedResources++;
      // Calculate progress as percentage, but cap at 80% until full page load
      // This leaves room for JavaScript execution and rendering
      const resourceProgress = (loadedResources / totalResources) * 80;
      progress = Math.max(progress, resourceProgress);
      preloaderBar.style.width = progress + '%';
    }
    
    // Track resource loading
    resources.forEach(resource => {
      // Check if resource is already loaded
      if (resource.complete || resource.loaded) {
        updateProgress();
      } else {
        // Add event listeners to track when resources load
        resource.addEventListener('load', updateProgress);
        resource.addEventListener('error', updateProgress); // Count errors as loaded to avoid hanging
      }
    });
    
    // Safety fallback - only if events fail (shorter time)
    setTimeout(() => {
      if (preloader.style.display !== 'none') {
        console.log('Preloader fallback triggered');
        preloaderBar.style.width = '100%';
        hidePreloader();
      }
    }, 1500); // Shorter fallback time (1.5s)
  },

  // Age Verification
  ageVerification: function() {
    const ageModal = document.querySelector('.age-modal');
    const yesButton = document.querySelector('.age-modal__button--yes');
    const noButton = document.querySelector('.age-modal__button--no');
    
    if (!ageModal) return;
    
    // Check if user has already verified age
    if (localStorage.getItem('ageVerified') === 'true') {
      ageModal.style.display = 'none';
      return;
    }
    
    yesButton.addEventListener('click', () => {
      localStorage.setItem('ageVerified', 'true');
      ageModal.style.opacity = '0';
      setTimeout(() => {
        ageModal.style.display = 'none';
      }, 500);
    });
    
    noButton.addEventListener('click', () => {
      window.location.href = 'https://www.responsibility.org/';
    });
  },

  // Header Effects
  initializeHeader: function() {
    const header = document.querySelector('.site-header');
    const headerHeight = header.offsetHeight;
    
    window.addEventListener('scroll', function() {
      if (window.scrollY > headerHeight) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  },

  // Parallax Effects
  initializeParallax: function() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    if (parallaxElements.length === 0) return;
    
    // Only enable parallax on desktop
    if (window.innerWidth > 768) {
      parallaxElements.forEach(element => {
        const layers = element.querySelectorAll('.parallax__layer');
        
        element.addEventListener('mousemove', e => {
          const rect = element.getBoundingClientRect();
          const centerX = (e.clientX - rect.left) / rect.width - 0.5;
          const centerY = (e.clientY - rect.top) / rect.height - 0.5;
          
          layers.forEach(layer => {
            const depth = parseFloat(layer.getAttribute('data-depth')) || 0.1;
            const translateX = centerX * depth * 100;
            const translateY = centerY * depth * 100;
            
            layer.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
          });
        });
        
        element.addEventListener('mouseleave', () => {
          layers.forEach(layer => {
            layer.style.transform = 'translate3d(0, 0, 0)';
          });
        });
      });
    }
  },

  // Scroll Reveal Animation
  initializeScrollReveal: function() {
    const revealElements = document.querySelectorAll(
      '.reveal-from-bottom, .reveal-from-left, .reveal-from-right, .reveal-scale'
    );
    
    if (revealElements.length === 0) return;
    
    const revealOnScroll = function() {
      for (let i = 0; i < revealElements.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = revealElements[i].getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
          revealElements[i].classList.add('revealed');
        }
      }
    };
    
    window.addEventListener('scroll', revealOnScroll);
    
    // Trigger once on page load
    revealOnScroll();
    
    // Initialize staggered fade-in elements
    const staggerContainers = document.querySelectorAll('.stagger-fade-in');
    
    staggerContainers.forEach(container => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const children = entry.target.children;
            for (let i = 0; i < children.length; i++) {
              children[i].classList.add('revealed');
            }
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });
      
      observer.observe(container);
    });
    
    // Text reveal animations
    const textRevealElements = document.querySelectorAll('.text-reveal');
    
    textRevealElements.forEach(element => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            element.classList.add('revealed');
            observer.unobserve(element);
          }
        });
      }, { threshold: 0.5 });
      
      observer.observe(element);
    });
  },

  // Particle Effects
  initializeParticles: function() {
    const particleContainers = document.querySelectorAll('.particles');
    
    if (particleContainers.length === 0) return;
    
    particleContainers.forEach(container => {
      const count = parseInt(container.getAttribute('data-particles')) || 50;
      
      // Create particles
      for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Randomize particle appearance and animation
        const size = Math.random() * 5 + 2;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const opacity = Math.random() * 0.4 + 0.1;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        
        // Add color classes for some particles
        if (Math.random() > 0.6) {
          const colorClasses = ['particle--pink', 'particle--blue', 'particle--purple', 'particle--gold'];
          const randomColorClass = colorClasses[Math.floor(Math.random() * colorClasses.length)];
          particle.classList.add(randomColorClass);
        }
        
        // Apply styles
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = posX + '%';
        particle.style.top = posY + '%';
        particle.style.opacity = opacity;
        particle.style.setProperty('--duration', duration + 's');
        particle.style.animationDelay = delay + 's';
        
        container.appendChild(particle);
      }
    });
  },

  // Product Slider
  initializeProductSlider: function() {
    const productContainer = document.querySelector('.products__container');
    const productsList = document.querySelector('.products__list');
    const productCards = document.querySelectorAll('.product-card');
    const prevButton = document.querySelector('.products__arrow--prev');
    const nextButton = document.querySelector('.products__arrow--next');
    const dots = document.querySelectorAll('.products__dot');
    
    if (!productContainer || !productsList || productCards.length === 0) return;
    
    let currentIndex = 0;
    const cardWidth = productCards[0].offsetWidth;
    const visibleCards = Math.floor(productsList.offsetWidth / cardWidth);
    const maxIndex = Math.max(0, productCards.length - visibleCards);
    
    // Update dots
    const updateDots = () => {
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    };
    
    // Scroll to position
    const scrollToPosition = (index) => {
      productsList.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth'
      });
      currentIndex = index;
      updateDots();
    };
    
    // Previous button click
    if (prevButton) {
      prevButton.addEventListener('click', () => {
        const newIndex = Math.max(0, currentIndex - 1);
        scrollToPosition(newIndex);
      });
    }
    
    // Next button click
    if (nextButton) {
      nextButton.addEventListener('click', () => {
        const newIndex = Math.min(maxIndex, currentIndex + 1);
        scrollToPosition(newIndex);
      });
    }
    
    // Dot clicks
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        scrollToPosition(index);
      });
    });
    
    // Swipe functionality
    let isDragging = false;
    let startX, scrollLeft;
    
    productsList.addEventListener('mousedown', e => {
      isDragging = true;
      startX = e.pageX - productsList.offsetLeft;
      scrollLeft = productsList.scrollLeft;
    });
    
    productsList.addEventListener('mouseleave', () => {
      isDragging = false;
    });
    
    productsList.addEventListener('mouseup', () => {
      isDragging = false;
      
      // Snap to closest card
      const cardPosition = Math.round(productsList.scrollLeft / cardWidth);
      scrollToPosition(cardPosition);
    });
    
    productsList.addEventListener('mousemove', e => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - productsList.offsetLeft;
      const walk = (x - startX) * 2;
      productsList.scrollLeft = scrollLeft - walk;
    });
    
    // Handle scroll event to update dots
    productsList.addEventListener('scroll', () => {
      const scrollPosition = productsList.scrollLeft;
      const newIndex = Math.round(scrollPosition / cardWidth);
      
      if (newIndex !== currentIndex) {
        currentIndex = newIndex;
        updateDots();
      }
    });
  },

  // 3D Card Tilt Effect
  initializeTiltCards: function() {
    const tiltCards = document.querySelectorAll('.tilt-card');
    
    if (tiltCards.length === 0) return;
    
    // Only enable on desktop
    if (window.innerWidth > 768) {
      tiltCards.forEach(card => {
        const content = card.querySelector('.tilt-card__content');
        const shine = card.querySelector('.tilt-card__shine');
        
        card.addEventListener('mousemove', e => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          const centerX = x / rect.width - 0.5;
          const centerY = y / rect.height - 0.5;
          
          const rotateX = centerY * 10;
          const rotateY = -centerX * 10;
          
          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
          
          if (shine) {
            shine.style.backgroundPosition = `${x / rect.width * 100}% ${y / rect.height * 100}%`;
          }
        });
        
        card.addEventListener('mouseleave', () => {
          card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
      });
    }
  },

  // Mobile Navigation
  initializeNavigation: function() {
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (!navToggle || !mainNav) return;
    
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      mainNav.classList.toggle('active');
      document.body.classList.toggle('nav-open');
    });
    
    // Close nav when clicking on a link
    const navLinks = mainNav.querySelectorAll('a');
    
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        mainNav.classList.remove('active');
        document.body.classList.remove('nav-open');
      });
    });
  },

  // Smooth Scroll
  initializeSmoothScroll: function() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    
    anchorLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 100,
            behavior: 'smooth'
          });
        }
      });
    });
  },

  // Page Transitions
  initializePageTransitions: function() {
    const pageTransition = document.createElement('div');
    pageTransition.classList.add('page-transition');
    document.body.appendChild(pageTransition);
    
    const links = document.querySelectorAll('a[href^="/"]:not([target="_blank"]), a[href^="http"]:not([target="_blank"]):not([href^="#"])');
    
    links.forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Skip for same page links
        if (href === window.location.pathname) return;
        
        e.preventDefault();
        
        pageTransition.classList.add('active');
        
        setTimeout(() => {
          window.location.href = href;
        }, 800);
      });
    });
    
    // On page load transition
    window.addEventListener('pageshow', function(e) {
      if (e.persisted) {
        pageTransition.classList.remove('active');
      }
    });
    
    // Hide transition after the page load
    setTimeout(() => {
      pageTransition.style.transform = 'translateY(-100%)';
    }, 500);
  },
  
  // Load Component Scripts
  loadComponentScripts: function() {
    // Audio player component
    const audioScript = document.createElement('script');
    audioScript.src = '/js/components/audio-player.js';
    document.body.appendChild(audioScript);
    
    // Check for page-specific scripts based on current page
    const currentPath = window.location.pathname;
    
    // Product detail pages
    if (currentPath.includes('/products/')) {
      // Load product-detail.js if not already included
      if (!document.querySelector('script[src*="product-detail.js"]')) {
        const productDetailScript = document.createElement('script');
        productDetailScript.src = '/js/pages/product-detail.js';
        document.body.appendChild(productDetailScript);
      }
    }
    
    // Blog page
    if (currentPath.includes('/blog')) {
      if (!document.querySelector('script[src*="blog.js"]')) {
        const blogScript = document.createElement('script');
        blogScript.src = '/js/pages/blog.js';
        document.body.appendChild(blogScript);
      }
    }
    
    // Cocktail finder page
    if (currentPath.includes('/cocktail-finder')) {
      if (!document.querySelector('script[src*="cocktail-finder.js"]')) {
        const cocktailScript = document.createElement('script');
        cocktailScript.src = '/js/pages/cocktail-finder.js';
        document.body.appendChild(cocktailScript);
      }
    }
    
    // Contact page
    if (currentPath.includes('/contact')) {
      if (!document.querySelector('script[src*="contact.js"]')) {
        const contactScript = document.createElement('script');
        contactScript.src = '/js/pages/contact.js';
        document.body.appendChild(contactScript);
      }
    }
  }
};
