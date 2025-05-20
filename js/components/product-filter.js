/**
 * The Big Cane - Product Filtering
 * 
 * This script adds interactive filtering functionality to product displays.
 * It allows users to filter products by type, price range, and other attributes.
 */

const ProductFilter = {
    /**
     * Initialize product filtering
     */
    init: function() {
        // Check if we're on a page with product filtering
        const filterContainer = document.querySelector('.product-filter');
        if (!filterContainer) return;
        
        // Cache DOM elements
        this.filterContainer = filterContainer;
        this.productContainer = document.querySelector('.products__list') || document.querySelector('.product-grid');
        this.products = this.productContainer ? this.productContainer.querySelectorAll('.product-card') : [];
        
        // If no products found, exit
        if (!this.productContainer || this.products.length === 0) {
            console.warn('Product container or products not found');
            return;
        }
        
        // Create filter options based on products
        this.createFilterOptions();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Initialize any active filters (from URL parameters)
        this.initFromUrlParams();
    },
    
    /**
     * Create filter options dynamically based on products
     */
    createFilterOptions: function() {
        // Extract all unique product types
        const productTypes = new Set();
        this.products.forEach(product => {
            const type = product.dataset.type || 'all';
            productTypes.add(type);
        });
        
        // Create the filter HTML
        const filterHTML = `
            <div class="filter-section">
                <h3 class="filter-title">Filter Products</h3>
                <div class="filter-group">
                    <label class="filter-label">By Type</label>
                    <div class="filter-options">
                        <button class="filter-option active" data-filter="type" data-value="all">All</button>
                        ${Array.from(productTypes).map(type => 
                            `<button class="filter-option" data-filter="type" data-value="${type}">${this.formatFilterName(type)}</button>`
                        ).join('')}
                    </div>
                </div>
                <div class="filter-group">
                    <label class="filter-label">By Price</label>
                    <div class="filter-options">
                        <button class="filter-option active" data-filter="price" data-value="all">All</button>
                        <button class="filter-option" data-filter="price" data-value="under-40">Under $40</button>
                        <button class="filter-option" data-filter="price" data-value="40-45">$40 - $45</button>
                        <button class="filter-option" data-filter="price" data-value="over-45">Over $45</button>
                    </div>
                </div>
                <div class="filter-group">
                    <label class="filter-label">By Tag</label>
                    <div class="filter-options">
                        <button class="filter-option active" data-filter="tag" data-value="all">All</button>
                        <button class="filter-option" data-filter="tag" data-value="bestseller">Bestseller</button>
                        <button class="filter-option" data-filter="tag" data-value="new">New</button>
                        <button class="filter-option" data-filter="tag" data-value="limited">Limited Edition</button>
                    </div>
                </div>
                <button class="filter-reset">Reset Filters</button>
            </div>
        `;
        
        // Add filter HTML to the filter container
        this.filterContainer.innerHTML = filterHTML;
        
        // Add necessary CSS if it doesn't exist
        this.addFilterStyles();
    },
    
    /**
     * Format filter name for display
     * @param {string} name - Raw filter value
     * @returns {string} - Formatted name
     */
    formatFilterName: function(name) {
        // Convert from kebab-case or snake_case to Title Case
        return name
            .replace(/-/g, ' ')
            .replace(/_/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
    },
    
    /**
     * Add CSS styles for filtering
     */
    addFilterStyles: function() {
        // Check if styles already exist
        if (document.getElementById('product-filter-styles')) return;
        
        // Create style element
        const style = document.createElement('style');
        style.id = 'product-filter-styles';
        
        // Add filter styles
        style.textContent = `
            .product-filter {
                margin-bottom: 3rem;
            }
            
            .filter-section {
                padding: 2rem;
                background: rgba(10, 10, 30, 0.5);
                border-radius: 8px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .filter-title {
                font-size: 2rem;
                margin-bottom: 1.5rem;
                color: #05D9E8;
            }
            
            .filter-group {
                margin-bottom: 2rem;
            }
            
            .filter-label {
                display: block;
                font-size: 1.6rem;
                margin-bottom: 1rem;
                color: #fff;
                font-weight: 600;
            }
            
            .filter-options {
                display: flex;
                flex-wrap: wrap;
                gap: 1rem;
            }
            
            .filter-option {
                padding: 0.8rem 1.5rem;
                background: transparent;
                border: 1px solid rgba(255, 255, 255, 0.2);
                color: rgba(255, 255, 255, 0.8);
                border-radius: 4px;
                font-size: 1.4rem;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .filter-option:hover {
                border-color: rgba(255, 42, 109, 0.8);
                color: #FF2A6D;
            }
            
            .filter-option.active {
                background: rgba(255, 42, 109, 0.2);
                border-color: #FF2A6D;
                color: #FF2A6D;
            }
            
            .filter-reset {
                padding: 1rem 2rem;
                background: transparent;
                border: 1px solid rgba(5, 217, 232, 0.5);
                color: #05D9E8;
                border-radius: 4px;
                font-size: 1.4rem;
                cursor: pointer;
                transition: all 0.3s ease;
                margin-top: 1rem;
            }
            
            .filter-reset:hover {
                background: rgba(5, 217, 232, 0.2);
            }
            
            .product-card {
                transition: opacity 0.3s ease, transform 0.3s ease;
            }
            
            .product-card.filtered-out {
                opacity: 0.2;
                transform: scale(0.95);
                pointer-events: none;
            }
            
            @media (max-width: 767px) {
                .filter-options {
                    flex-direction: column;
                    gap: 0.5rem;
                }
                
                .filter-option {
                    width: 100%;
                    text-align: left;
                }
            }
        `;
        
        // Add style to document head
        document.head.appendChild(style);
    },
    
    /**
     * Set up event listeners for filter interactions
     */
    setupEventListeners: function() {
        // Get all filter options
        const filterOptions = this.filterContainer.querySelectorAll('.filter-option');
        
        // Add click event to each filter option
        filterOptions.forEach(option => {
            option.addEventListener('click', this.handleFilterClick.bind(this));
        });
        
        // Reset button
        const resetButton = this.filterContainer.querySelector('.filter-reset');
        if (resetButton) {
            resetButton.addEventListener('click', this.resetFilters.bind(this));
        }
        
        // Announce to screen readers when filters change
        this.setupAccessibilityAnnouncements();
    },
    
    /**
     * Handle filter option click
     * @param {Event} e - Click event
     */
    handleFilterClick: function(e) {
        const option = e.currentTarget;
        const filterType = option.dataset.filter;
        const filterValue = option.dataset.value;
        
        // Update active state for this filter group
        const filterGroup = option.closest('.filter-group');
        filterGroup.querySelectorAll('.filter-option').forEach(opt => {
            opt.classList.remove('active');
        });
        option.classList.add('active');
        
        // Apply filters
        this.applyFilters();
        
        // Update URL parameters
        this.updateUrlParams();
        
        // Announce filter change to screen readers
        this.announceFilterChange(filterType, filterValue);
    },
    
    /**
     * Apply all active filters to products
     */
    applyFilters: function() {
        // Get current filter values
        const activeFilters = {
            type: this.getActiveFilterValue('type'),
            price: this.getActiveFilterValue('price'),
            tag: this.getActiveFilterValue('tag')
        };
        
        // Filter products
        this.products.forEach(product => {
            const productType = product.dataset.type || 'all';
            const productPrice = this.extractPrice(product);
            const productTags = this.extractTags(product);
            
            // Check if product matches all active filters
            const matchesType = activeFilters.type === 'all' || productType === activeFilters.type;
            const matchesPrice = activeFilters.price === 'all' || this.matchesPriceRange(productPrice, activeFilters.price);
            const matchesTag = activeFilters.tag === 'all' || productTags.includes(activeFilters.tag);
            
            // Show/hide product based on filter matches
            if (matchesType && matchesPrice && matchesTag) {
                product.classList.remove('filtered-out');
            } else {
                product.classList.add('filtered-out');
            }
        });
        
        // Check if any products are visible
        const visibleProducts = this.productContainer.querySelectorAll('.product-card:not(.filtered-out)');
        
        // Show "no results" message if needed
        this.handleNoResults(visibleProducts.length === 0);
    },
    
    /**
     * Get the active filter value for a specific filter type
     * @param {string} filterType - Type of filter (type, price, tag)
     * @returns {string} - Active filter value
     */
    getActiveFilterValue: function(filterType) {
        const activeOption = this.filterContainer.querySelector(`.filter-option[data-filter="${filterType}"].active`);
        return activeOption ? activeOption.dataset.value : 'all';
    },
    
    /**
     * Extract price from product card
     * @param {HTMLElement} product - Product card element
     * @returns {number} - Price as a number
     */
    extractPrice: function(product) {
        const priceElement = product.querySelector('.product-card__price');
        
        if (!priceElement) return 0;
        
        // Extract price from text (e.g., "$39.99" -> 39.99)
        const priceText = priceElement.textContent.trim();
        const priceMatch = priceText.match(/\$?(\d+(\.\d+)?)/);
        
        return priceMatch ? parseFloat(priceMatch[1]) : 0;
    },
    
    /**
     * Extract tags from product card
     * @param {HTMLElement} product - Product card element
     * @returns {string[]} - Array of tags
     */
    extractTags: function(product) {
        const tags = [];
        
        // Check for label elements
        const labelElements = product.querySelectorAll('.product-label');
        labelElements.forEach(label => {
            const className = Array.from(label.classList)
                .find(cls => cls.startsWith('product-label--'));
            
            if (className) {
                const tag = className.replace('product-label--', '');
                tags.push(tag);
            }
        });
        
        return tags;
    },
    
    /**
     * Check if a price matches a price range filter
     * @param {number} price - Product price
     * @param {string} rangeFilter - Price range filter value
     * @returns {boolean} - Whether price matches range
     */
    matchesPriceRange: function(price, rangeFilter) {
        switch (rangeFilter) {
            case 'under-40':
                return price < 40;
            case '40-45':
                return price >= 40 && price <= 45;
            case 'over-45':
                return price > 45;
            default:
                return true;
        }
    },
    
    /**
     * Handle "no results" state
     * @param {boolean} noResults - Whether there are no results
     */
    handleNoResults: function(noResults) {
        // Remove existing message if it exists
        const existingMessage = this.productContainer.querySelector('.no-results-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // If no results, show message
        if (noResults) {
            const message = document.createElement('div');
            message.className = 'no-results-message';
            message.innerHTML = `
                <div style="text-align: center; padding: 4rem 2rem;">
                    <i class="fas fa-search" style="font-size: 3rem; color: #05D9E8; margin-bottom: 1.5rem;"></i>
                    <h3 style="font-size: 2rem; margin-bottom: 1rem;">No Products Found</h3>
                    <p style="font-size: 1.6rem; color: rgba(255, 255, 255, 0.8);">No products match your selected filters. Try adjusting your filters or <button class="filter-reset" style="background: none; border: none; color: #FF2A6D; text-decoration: underline; cursor: pointer; font-size: 1.6rem; padding: 0;">reset all filters</button>.</p>
                </div>
            `;
            
            // Add click event to reset button
            message.querySelector('.filter-reset').addEventListener('click', this.resetFilters.bind(this));
            
            // Add message to container
            this.productContainer.appendChild(message);
        }
    },
    
    /**
     * Reset all filters
     */
    resetFilters: function() {
        // Reset all filter options to "All"
        this.filterContainer.querySelectorAll('.filter-option').forEach(option => {
            option.classList.remove('active');
            
            if (option.dataset.value === 'all') {
                option.classList.add('active');
            }
        });
        
        // Show all products
        this.products.forEach(product => {
            product.classList.remove('filtered-out');
        });
        
        // Remove any "no results" message
        this.handleNoResults(false);
        
        // Update URL parameters
        this.updateUrlParams();
        
        // Announce to screen readers
        this.announceFilterChange('all', 'reset');
    },
    
    /**
     * Update URL parameters based on active filters
     */
    updateUrlParams: function() {
        // Create URL parameters object
        const params = new URLSearchParams();
        
        // Add active filters to parameters
        const activeFilters = {
            type: this.getActiveFilterValue('type'),
            price: this.getActiveFilterValue('price'),
            tag: this.getActiveFilterValue('tag')
        };
        
        // Only add non-default filters to URL
        Object.entries(activeFilters).forEach(([key, value]) => {
            if (value !== 'all') {
                params.set(key, value);
            }
        });
        
        // Update URL without refreshing page
        const newUrl = window.location.pathname + (params.toString() ? `?${params.toString()}` : '');
        window.history.replaceState({}, '', newUrl);
    },
    
    /**
     * Initialize filters from URL parameters
     */
    initFromUrlParams: function() {
        // Get URL parameters
        const params = new URLSearchParams(window.location.search);
        
        // Process each parameter
        params.forEach((value, key) => {
            // Find corresponding filter option
            const option = this.filterContainer.querySelector(`.filter-option[data-filter="${key}"][data-value="${value}"]`);
            
            if (option) {
                // Update active state
                const filterGroup = option.closest('.filter-group');
                filterGroup.querySelectorAll('.filter-option').forEach(opt => {
                    opt.classList.remove('active');
                });
                option.classList.add('active');
            }
        });
        
        // Apply filters
        this.applyFilters();
    },
    
    /**
     * Set up accessibility announcements for filter changes
     */
    setupAccessibilityAnnouncements: function() {
        // Create a live region if it doesn't exist
        if (!document.querySelector('.filter-announcer')) {
            const announcer = document.createElement('div');
            announcer.className = 'filter-announcer sr-only';
            announcer.setAttribute('aria-live', 'polite');
            document.body.appendChild(announcer);
        }
    },
    
    /**
     * Announce filter change to screen readers
     * @param {string} filterType - Type of filter
     * @param {string} filterValue - Value of filter
     */
    announceFilterChange: function(filterType, filterValue) {
        const announcer = document.querySelector('.filter-announcer');
        
        if (!announcer) return;
        
        // Create appropriate message
        let message = '';
        
        if (filterType === 'all' && filterValue === 'reset') {
            message = 'All filters have been reset. Showing all products.';
        } else {
            const formattedValue = this.formatFilterName(filterValue);
            const formattedType = this.formatFilterName(filterType);
            
            message = `Filtered by ${formattedType}: ${formattedValue}`;
            
            // Count visible products
            const visibleCount = this.productContainer.querySelectorAll('.product-card:not(.filtered-out)').length;
            message += `. Showing ${visibleCount} product${visibleCount !== 1 ? 's' : ''}.`;
        }
        
        // Update announcer text
        announcer.textContent = message;
    }
};

// Initialize product filtering when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    ProductFilter.init();
});

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductFilter;
}