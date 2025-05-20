/**
 * The Big Cane - Performance Optimizer
 * 
 * This script implements various performance optimizations for the website:
 * - Lazy loading of images
 * - Preloading critical resources
 * - Font loading optimization
 * - Resource hints (preconnect, dns-prefetch)
 */

const PerformanceOptimizer = {
    /**
     * Initialize lazy loading for images
     */
    initLazyLoading: function() {
        // Check if IntersectionObserver is supported
        if ('IntersectionObserver' in window) {
            const lazyImages = document.querySelectorAll('img[data-src], source[data-srcset]');
            
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const lazyImage = entry.target;
                        
                        if (lazyImage.dataset.src) {
                            lazyImage.src = lazyImage.dataset.src;
                            lazyImage.removeAttribute('data-src');
                        }
                        
                        if (lazyImage.dataset.srcset) {
                            lazyImage.srcset = lazyImage.dataset.srcset;
                            lazyImage.removeAttribute('data-srcset');
                        }
                        
                        lazyImage.classList.remove('lazy');
                        observer.unobserve(lazyImage);
                    }
                });
            });
            
            lazyImages.forEach(lazyImage => {
                imageObserver.observe(lazyImage);
            });
        } else {
            // Fallback for browsers without IntersectionObserver support
            let active = false;
            
            const lazyLoad = function() {
                if (active === false) {
                    active = true;
                    
                    setTimeout(function() {
                        const lazyImages = document.querySelectorAll('img[data-src], source[data-srcset]');
                        
                        lazyImages.forEach(function(lazyImage) {
                            const rect = lazyImage.getBoundingClientRect();
                            
                            if (
                                rect.top <= window.innerHeight &&
                                rect.bottom >= 0
                            ) {
                                if (lazyImage.dataset.src) {
                                    lazyImage.src = lazyImage.dataset.src;
                                    lazyImage.removeAttribute('data-src');
                                }
                                
                                if (lazyImage.dataset.srcset) {
                                    lazyImage.srcset = lazyImage.dataset.srcset;
                                    lazyImage.removeAttribute('data-srcset');
                                }
                                
                                lazyImage.classList.remove('lazy');
                            }
                        });
                        
                        if (lazyImages.length === 0) {
                            document.removeEventListener('scroll', lazyLoad);
                            window.removeEventListener('resize', lazyLoad);
                            window.removeEventListener('orientationchange', lazyLoad);
                        }
                        
                        active = false;
                    }, 200);
                }
            };
            
            document.addEventListener('scroll', lazyLoad);
            window.addEventListener('resize', lazyLoad);
            window.addEventListener('orientationchange', lazyLoad);
            
            // Trigger initial load
            lazyLoad();
        }
    },
    
    /**
     * Update image tags to use lazy loading
     */
    prepareLazyLoadImages: function() {
        // Don't lazy load images above the fold
        const aboveFoldImages = document.querySelectorAll('.hero img, .logo img, .preloader img');
        aboveFoldImages.forEach(image => {
            image.classList.add('no-lazy');
        });
        
        // Add lazy loading to all other images
        const images = document.querySelectorAll('img:not(.no-lazy)');
        images.forEach(image => {
            if (!image.loading) {
                image.loading = 'lazy';
            }
            
            // For browsers that don't support native lazy loading
            if (!image.dataset.src && image.src) {
                image.dataset.src = image.src;
                image.classList.add('lazy');
                
                // Use a low-quality placeholder
                const smallPlaceholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200"%3E%3Crect width="300" height="200" fill="%23CCCCCC"/%3E%3C/svg%3E';
                image.src = smallPlaceholder;
            }
        });
    },
    
    /**
     * Add resource hints to preconnect to critical domains
     */
    addResourceHints: function() {
        const domains = [
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com',
            'https://cdnjs.cloudflare.com'
        ];
        
        domains.forEach(domain => {
            // Add preconnect
            const preconnect = document.createElement('link');
            preconnect.rel = 'preconnect';
            preconnect.href = domain;
            preconnect.crossOrigin = 'anonymous';
            document.head.appendChild(preconnect);
            
            // Add dns-prefetch as fallback
            const dnsPrefetch = document.createElement('link');
            dnsPrefetch.rel = 'dns-prefetch';
            dnsPrefetch.href = domain;
            document.head.appendChild(dnsPrefetch);
        });
    },
    
    /**
     * Preload critical assets
     */
    preloadCriticalAssets: function() {
        const criticalAssets = [
            { type: 'image', href: 'assets/images/big-cane-logo.png' },
            { type: 'image', href: 'assets/images/landing-page.png' },
            { type: 'font', href: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&display=swap' }
        ];
        
        criticalAssets.forEach(asset => {
            const preload = document.createElement('link');
            preload.rel = 'preload';
            preload.href = asset.href;
            
            if (asset.type === 'image') {
                preload.as = 'image';
            } else if (asset.type === 'font') {
                preload.as = 'style';
            }
            
            document.head.appendChild(preload);
        });
    },
    
    /**
     * Defer non-critical CSS
     */
    deferNonCriticalCSS: function() {
        const nonCriticalCSS = [
            'css/animations.css',
            'css/components/recipe-modal.css',
            'css/components/social-showcase.css'
        ];
        
        nonCriticalCSS.forEach(cssFile => {
            // Find the existing link tag
            const existingLink = document.querySelector(`link[href="${cssFile}"]`);
            
            if (existingLink) {
                // Change to preload with onload handler
                existingLink.rel = 'preload';
                existingLink.as = 'style';
                existingLink.onload = function() {
                    this.rel = 'stylesheet';
                };
            }
        });
    },
    
    /**
     * Initialize all performance optimizations
     */
    init: function() {
        // Add resource hints early
        this.addResourceHints();
        
        // Prepare images for lazy loading
        this.prepareLazyLoadImages();
        
        // Preload critical assets
        this.preloadCriticalAssets();
        
        // Defer non-critical CSS
        this.deferNonCriticalCSS();
        
        // Initialize lazy loading when DOM is ready
        document.addEventListener('DOMContentLoaded', () => {
            this.initLazyLoading();
        });
    }
};

// Initialize performance optimizations
PerformanceOptimizer.init();

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceOptimizer;
}
