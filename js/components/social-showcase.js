// Social Showcase Carousel
document.addEventListener('DOMContentLoaded', function() {
  const carouselSlides = document.querySelectorAll('.carousel-slide');
  const carouselDots = document.querySelectorAll('.carousel-dot');
  const prevButton = document.querySelector('.carousel-arrow--prev');
  const nextButton = document.querySelector('.carousel-arrow--next');
  let currentIndex = 0;
  let interval;

  // Initialize carousel
  function initCarousel() {
    updateCarousel();
    startAutoSlide();

    // Add event listeners
    prevButton.addEventListener('click', prevSlide);
    nextButton.addEventListener('click', nextSlide);
    
    carouselDots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        currentIndex = index;
        updateCarousel();
        resetAutoSlide();
      });
    });

    // Pause auto-slide on hover
    const carouselContainer = document.querySelector('.carousel-container');
    carouselContainer.addEventListener('mouseenter', stopAutoSlide);
    carouselContainer.addEventListener('mouseleave', startAutoSlide);
  }

  // Update carousel display
  function updateCarousel() {
    carouselSlides.forEach((slide, index) => {
      slide.classList.remove('active', 'prev', 'next');
      
      if (index === currentIndex) {
        slide.classList.add('active');
      } else if (index === getPrevIndex()) {
        slide.classList.add('prev');
      } else if (index === getNextIndex()) {
        slide.classList.add('next');
      }
    });

    carouselDots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }

  // Get previous slide index
  function getPrevIndex() {
    return (currentIndex === 0) ? carouselSlides.length - 1 : currentIndex - 1;
  }

  // Get next slide index
  function getNextIndex() {
    return (currentIndex === carouselSlides.length - 1) ? 0 : currentIndex + 1;
  }

  // Go to previous slide
  function prevSlide() {
    currentIndex = getPrevIndex();
    updateCarousel();
    resetAutoSlide();
  }

  // Go to next slide
  function nextSlide() {
    currentIndex = getNextIndex();
    updateCarousel();
    resetAutoSlide();
  }

  // Start auto-slide
  function startAutoSlide() {
    interval = setInterval(nextSlide, 5000);
  }

  // Stop auto-slide
  function stopAutoSlide() {
    clearInterval(interval);
  }

  // Reset auto-slide timer
  function resetAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
  }

  // Initialize on load
  if (carouselSlides.length > 0) {
    initCarousel();
  }
});
