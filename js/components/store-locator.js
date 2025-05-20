/**
 * Store Locator Component
 * 
 * This module provides functionality for finding stores 
 * that carry The BigCane products near a user's location.
 * 
 * @version 1.0.0
 * @updated 2025-05-18
 */

(function() {
    // Execute when DOM is fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        initStoreLocator();
    });

    /**
     * Initialize the store locator functionality
     */
    function initStoreLocator() {
        // Find all store locator buttons
        const storeButtons = document.querySelectorAll('.store-locator-button, [data-action="find-store"]');
        
        // Exit if no store buttons found
        if (!storeButtons.length) return;
        
        // Attach event listeners to each button
        storeButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Get product info if available
                const productName = button.getAttribute('data-product') || 'The BigCane Rum';
                
                // Show store finder modal
                showStoreFinderModal(productName);
            });
        });
    }
    
    /**
     * Show the store finder modal
     * @param {string} productName - Name of the product to find
     */
    function showStoreFinderModal(productName) {
        // Create modal container if it doesn't exist
        if (!document.querySelector('.store-finder-modal')) {
            createStoreFinderModal();
        }
        
        // Get modal elements
        const modal = document.querySelector('.store-finder-modal');
        const productElement = modal.querySelector('.store-finder__product');
        const searchInput = modal.querySelector('.store-finder__input');
        const resultsList = modal.querySelector('.store-finder__results-list');
        
        // Update product name
        if (productElement) {
            productElement.textContent = productName;
        }
        
        // Clear previous results
        if (resultsList) {
            resultsList.innerHTML = '';
        }
        
        // Show modal
        modal.classList.add('active');
        
        // Focus on input field
        if (searchInput) {
            setTimeout(() => {
                searchInput.focus();
            }, 300);
        }
        
        // Try to get user location automatically
        tryGetUserLocation();
    }
    
    /**
     * Create the store finder modal elements
     */
    function createStoreFinderModal() {
        // Create modal elements
        const modal = document.createElement('div');
        modal.className = 'store-finder-modal';
        modal.setAttribute('aria-labelledby', 'store-finder-title');
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        
        // Add modal HTML structure
        modal.innerHTML = `
            <div class="store-finder__overlay"></div>
            <div class="store-finder__container">
                <div class="store-finder__header">
                    <h2 id="store-finder-title" class="store-finder__title">Find a Store</h2>
                    <button class="store-finder__close" aria-label="Close store finder">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="store-finder__content">
                    <p class="store-finder__intro">
                        Find stores near you that carry <span class="store-finder__product">The BigCane Rum</span>.
                    </p>
                    
                    <div class="store-finder__search">
                        <div class="store-finder__search-field">
                            <i class="fas fa-search"></i>
                            <input type="text" class="store-finder__input" placeholder="Enter city, zip code, or address" aria-label="Search location">
                            <button class="store-finder__geolocate" aria-label="Use current location" title="Use my current location">
                                <i class="fas fa-location-arrow"></i>
                            </button>
                        </div>
                        <button class="button store-finder__search-button">Search</button>
                    </div>
                    
                    <div class="store-finder__results">
                        <div class="store-finder__loader">
                            <div class="store-finder__spinner"></div>
                            <p>Searching for stores near you...</p>
                        </div>
                        
                        <div class="store-finder__error">
                            <i class="fas fa-exclamation-circle"></i>
                            <p class="store-finder__error-message"></p>
                        </div>
                        
                        <div class="store-finder__results-container">
                            <h3 class="store-finder__results-title">Stores Near You</h3>
                            <div class="store-finder__results-count">
                                <span class="store-finder__count">0</span> stores found
                            </div>
                            <ul class="store-finder__results-list"></ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal to the document
        document.body.appendChild(modal);
        
        // Add modal styles
        addStorefinderStyles();
        
        // Add event listeners
        const closeButton = modal.querySelector('.store-finder__close');
        const overlay = modal.querySelector('.store-finder__overlay');
        const searchButton = modal.querySelector('.store-finder__search-button');
        const searchInput = modal.querySelector('.store-finder__input');
        const geolocateButton = modal.querySelector('.store-finder__geolocate');
        
        // Close modal
        closeButton.addEventListener('click', () => {
            modal.classList.remove('active');
        });
        
        overlay.addEventListener('click', () => {
            modal.classList.remove('active');
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                modal.classList.remove('active');
            }
        });
        
        // Search functionality
        searchButton.addEventListener('click', () => {
            const query = searchInput.value.trim();
            
            if (query) {
                searchStores(query);
            }
        });
        
        // Search on enter key
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                
                if (query) {
                    searchStores(query);
                }
            }
        });
        
        // Geolocation button
        geolocateButton.addEventListener('click', () => {
            getUserLocation();
        });
    }
    
    /**
     * Try to get user's location automatically when modal opens
     */
    function tryGetUserLocation() {
        // Check if we have a saved location
        const savedLocation = localStorage.getItem('userLocation');
        
        if (savedLocation) {
            const location = JSON.parse(savedLocation);
            searchStoresByCoordinates(location.lat, location.lng);
        } else {
            // Show location suggestion
            const modal = document.querySelector('.store-finder-modal');
            
            if (modal) {
                const geoButton = modal.querySelector('.store-finder__geolocate');
                
                if (geoButton) {
                    // Highlight the geolocate button
                    geoButton.classList.add('pulse-animation');
                    
                    // Remove animation after a few seconds
                    setTimeout(() => {
                        geoButton.classList.remove('pulse-animation');
                    }, 3000);
                }
            }
        }
    }
    
    /**
     * Get user's current location using Geolocation API
     */
    function getUserLocation() {
        const modal = document.querySelector('.store-finder-modal');
        const loader = modal.querySelector('.store-finder__loader');
        const errorElement = modal.querySelector('.store-finder__error');
        const errorMessage = modal.querySelector('.store-finder__error-message');
        
        // Show loader
        loader.style.display = 'flex';
        errorElement.style.display = 'none';
        
        // Check if geolocation is supported
        if (!navigator.geolocation) {
            loader.style.display = 'none';
            errorElement.style.display = 'flex';
            errorMessage.textContent = 'Geolocation is not supported by your browser';
            return;
        }
        
        // Get current position
        navigator.geolocation.getCurrentPosition(
            // Success callback
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                
                // Save location for later use
                localStorage.setItem('userLocation', JSON.stringify({ lat, lng }));
                
                // Search for stores near coordinates
                searchStoresByCoordinates(lat, lng);
            },
            // Error callback
            (error) => {
                loader.style.display = 'none';
                errorElement.style.display = 'flex';
                
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage.textContent = 'Location permission denied. Please enter your location manually.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage.textContent = 'Location information is unavailable. Please try again later.';
                        break;
                    case error.TIMEOUT:
                        errorMessage.textContent = 'Location request timed out. Please try again.';
                        break;
                    default:
                        errorMessage.textContent = 'An unknown error occurred. Please enter your location manually.';
                }
            },
            // Options
            {
                enableHighAccuracy: false,
                timeout: 10000,
                maximumAge: 60 * 60 * 1000 // 1 hour
            }
        );
    }
    
    /**
     * Search for stores based on text query
     * @param {string} query - Location search query
     */
    function searchStores(query) {
        const modal = document.querySelector('.store-finder-modal');
        const loader = modal.querySelector('.store-finder__loader');
        const errorElement = modal.querySelector('.store-finder__error');
        const resultsContainer = modal.querySelector('.store-finder__results-container');
        
        // Show loader, hide other elements
        loader.style.display = 'flex';
        errorElement.style.display = 'none';
        resultsContainer.style.display = 'none';
        
        // Simulate geocoding query to coordinates
        // In a real application, this would use a geocoding service like Google Maps
        simulateGeocode(query)
            .then(coords => {
                if (coords) {
                    searchStoresByCoordinates(coords.lat, coords.lng);
                } else {
                    throw new Error('Location not found. Please try another search term.');
                }
            })
            .catch(error => {
                loader.style.display = 'none';
                errorElement.style.display = 'flex';
                errorElement.querySelector('.store-finder__error-message').textContent = error.message;
            });
    }
    
    /**
     * Search for stores near coordinates
     * @param {number} lat - Latitude
     * @param {number} lng - Longitude
     */
    function searchStoresByCoordinates(lat, lng) {
        const modal = document.querySelector('.store-finder-modal');
        const loader = modal.querySelector('.store-finder__loader');
        const errorElement = modal.querySelector('.store-finder__error');
        const resultsContainer = modal.querySelector('.store-finder__results-container');
        const resultsList = modal.querySelector('.store-finder__results-list');
        const countElement = modal.querySelector('.store-finder__count');
        
        // Show loader, hide other elements
        loader.style.display = 'flex';
        errorElement.style.display = 'none';
        resultsContainer.style.display = 'none';
        
        // In a real application, this would make an API call to a store database
        // For demo purposes, we'll use simulated data
        getStoresNearCoordinates(lat, lng)
            .then(stores => {
                // Hide loader
                loader.style.display = 'none';
                
                if (stores && stores.length > 0) {
                    // Display results
                    resultsContainer.style.display = 'block';
                    countElement.textContent = stores.length;
                    
                    // Clear previous results
                    resultsList.innerHTML = '';
                    
                    // Add each store to the list
                    stores.forEach(store => {
                        const storeItem = createStoreListItem(store);
                        resultsList.appendChild(storeItem);
                    });
                } else {
                    // Show no results error
                    errorElement.style.display = 'flex';
                    errorElement.querySelector('.store-finder__error-message').textContent = 
                        'No stores found in this area. Try expanding your search radius or try another location.';
                }
            })
            .catch(error => {
                // Handle errors
                loader.style.display = 'none';
                errorElement.style.display = 'flex';
                errorElement.querySelector('.store-finder__error-message').textContent = 
                    'Error finding stores. Please try again later.';
                console.error('Store search error:', error);
            });
    }
    
    /**
     * Simulate geocoding a text query to coordinates
     * In a real application, this would use an actual geocoding service
     * @param {string} query - Text query to geocode
     * @returns {Promise<Object>} Coordinates object with lat and lng
     */
    function simulateGeocode(query) {
        return new Promise((resolve, reject) => {
            // Simulate API delay
            setTimeout(() => {
                // Simple simulation for a few common locations
                const locations = {
                    'new york': { lat: 40.7128, lng: -74.0060 },
                    'los angeles': { lat: 34.0522, lng: -118.2437 },
                    'chicago': { lat: 41.8781, lng: -87.6298 },
                    'miami': { lat: 25.7617, lng: -80.1918 },
                    'san francisco': { lat: 37.7749, lng: -122.4194 },
                    'toronto': { lat: 43.6532, lng: -79.3832 },
                    'london': { lat: 51.5074, lng: -0.1278 },
                    'port of spain': { lat: 10.6573, lng: -61.5180 },
                    'trinidad': { lat: 10.6918, lng: -61.2225 },
                    'barbados': { lat: 13.1939, lng: -59.5432 },
                    'jamaica': { lat: 18.1096, lng: -77.2975 }
                };
                
                // Try to match the query to a known location
                const normalizedQuery = query.toLowerCase().trim();
                let coords = null;
                
                for (const [key, value] of Object.entries(locations)) {
                    if (normalizedQuery.includes(key)) {
                        coords = value;
                        break;
                    }
                }
                
                // If no match, check if it could be a postal code
                if (!coords && /^\d{5}$/.test(normalizedQuery)) {
                    // Simulate a random location for any 5-digit postal code
                    coords = {
                        lat: 40 + (Math.random() * 10 - 5),
                        lng: -80 + (Math.random() * 10 - 5)
                    };
                }
                
                // If still no match, just return a random point in the US for demo purposes
                if (!coords) {
                    coords = {
                        lat: 40 + (Math.random() * 10 - 5),
                        lng: -80 + (Math.random() * 10 - 5)
                    };
                }
                
                resolve(coords);
            }, 1000);
        });
    }
    
    /**
     * Get stores near given coordinates
     * In a real application, this would be an API call to a store database
     * @param {number} lat - Latitude
     * @param {number} lng - Longitude
     * @returns {Promise<Array>} Array of store objects
     */
    function getStoresNearCoordinates(lat, lng) {
        return new Promise((resolve) => {
            // Simulate API delay
            setTimeout(() => {
                // Dummy store data for demonstration
                const stores = [
                    {
                        id: 1,
                        name: 'Luxury Spirits Emporium',
                        address: '123 Main St, New York, NY 10001',
                        distance: '0.8 miles',
                        phone: '(212) 555-1234',
                        hours: 'Mon-Sat: 10am-10pm, Sun: 12pm-8pm',
                        products: ['Silver Rum', 'Spiced Rum', 'London Dry Gin'],
                        website: 'https://example.com/luxury-spirits'
                    },
                    {
                        id: 2,
                        name: 'Caribbean Delights',
                        address: '456 Broadway, New York, NY 10013',
                        distance: '1.2 miles',
                        phone: '(212) 555-5678',
                        hours: 'Mon-Sun: 9am-11pm',
                        products: ['Silver Rum', 'Guava Rum', 'Spiced Rum', 'Limited Editions'],
                        website: 'https://example.com/caribbean-delights'
                    },
                    {
                        id: 3,
                        name: 'The Nightcap',
                        address: '789 Park Ave, New York, NY 10021',
                        distance: '1.5 miles',
                        phone: '(212) 555-9012',
                        hours: 'Mon-Thu: 12pm-9pm, Fri-Sat: 12pm-11pm, Sun: Closed',
                        products: ['Guava Rum', 'London Dry Gin'],
                        website: 'https://example.com/nightcap'
                    },
                    {
                        id: 4,
                        name: 'Island Time Liquors',
                        address: '101 Lexington Ave, New York, NY 10016',
                        distance: '2.3 miles',
                        phone: '(212) 555-3456',
                        hours: 'Mon-Sun: 10am-12am',
                        products: ['Silver Rum', 'Spiced Rum', 'London Dry Gin', 'Gift Sets'],
                        website: 'https://example.com/island-time'
                    },
                    {
                        id: 5,
                        name: 'Premium Spirits & Wines',
                        address: '222 5th Ave, New York, NY 10010',
                        distance: '2.8 miles',
                        phone: '(212) 555-7890',
                        hours: 'Mon-Sat: 10am-9pm, Sun: 12pm-7pm',
                        products: ['All Products'],
                        website: 'https://example.com/premium-spirits'
                    }
                ];
                
                // Randomize the distances a bit based on the provided coordinates
                const randomizedStores = stores.map(store => {
                    // Calculate a pseudo-random distance based on coordinates
                    const randomFactor = (Math.sin(lat + lng) * 10) % 5;
                    const distance = ((Math.abs(Math.sin(store.id)) * 3) + randomFactor).toFixed(1);
                    
                    return {
                        ...store,
                        distance: `${distance} miles`
                    };
                });
                
                // Sort by distance
                randomizedStores.sort((a, b) => {
                    const distA = parseFloat(a.distance);
                    const distB = parseFloat(b.distance);
                    return distA - distB;
                });
                
                resolve(randomizedStores);
            }, 1500);
        });
    }
    
    /**
     * Create a list item for a store result
     * @param {Object} store - Store data object
     * @returns {HTMLElement} List item element
     */
    function createStoreListItem(store) {
        const item = document.createElement('li');
        item.className = 'store-finder__store';
        
        // Create availability badge based on products
        const productName = document.querySelector('.store-finder__product').textContent;
        const hasProduct = store.products.includes(productName) || store.products.includes('All Products');
        const availabilityClass = hasProduct ? 'store-finder__availability--in-stock' : 'store-finder__availability--limited';
        const availabilityText = hasProduct ? 'In Stock' : 'Limited Availability';
        
        item.innerHTML = `
            <div class="store-finder__store-header">
                <h4 class="store-finder__store-name">${store.name}</h4>
                <span class="store-finder__distance">
                    <i class="fas fa-map-marker-alt"></i> ${store.distance}
                </span>
            </div>
            <div class="store-finder__store-address">
                ${store.address}
            </div>
            <div class="store-finder__store-details">
                <div class="store-finder__store-contact">
                    <div class="store-finder__store-phone">
                        <i class="fas fa-phone"></i> ${store.phone}
                    </div>
                    <div class="store-finder__store-hours">
                        <i class="fas fa-clock"></i> ${store.hours}
                    </div>
                </div>
                <div class="store-finder__store-products">
                    <span class="store-finder__availability ${availabilityClass}">
                        ${availabilityText}
                    </span>
                </div>
            </div>
            <div class="store-finder__store-actions">
                <a href="https://maps.google.com/?q=${encodeURIComponent(store.address)}" target="_blank" class="button button--outlined">
                    <i class="fas fa-directions"></i> Directions
                </a>
                <a href="tel:${store.phone.replace(/\D/g, '')}" class="button button--outlined">
                    <i class="fas fa-phone"></i> Call
                </a>
                ${store.website ? `
                    <a href="${store.website}" target="_blank" class="button button--outlined">
                        <i class="fas fa-globe"></i> Website
                    </a>
                ` : ''}
            </div>
        `;
        
        return item;
    }
    
    /**
     * Add the necessary styles for the store finder
     */
    function addStorefinderStyles() {
        // Check if styles already exist
        if (document.getElementById('store-finder-styles')) return;
        
        const styleElement = document.createElement('style');
        styleElement.id = 'store-finder-styles';
        
        styleElement.textContent = `
            .store-finder-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
                display: none;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .store-finder-modal.active {
                display: flex;
                opacity: 1;
            }
            
            .store-finder__overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(5px);
            }
            
            .store-finder__container {
                position: relative;
                width: 90%;
                max-width: 900px;
                max-height: 80vh;
                background-color: var(--midnight-black, #0A0A0A);
                border-radius: 10px;
                margin: auto;
                overflow: hidden;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 30px rgba(255, 42, 109, 0.3);
                border: 1px solid rgba(255, 255, 255, 0.1);
                display: flex;
                flex-direction: column;
            }
            
            .store-finder__header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                background: linear-gradient(180deg, rgba(26, 11, 46, 0.8) 0%, rgba(10, 10, 10, 0.8) 100%);
            }
            
            .store-finder__title {
                font-size: 24px;
                font-weight: 700;
                color: var(--electric-blue, #05D9E8);
                margin: 0;
            }
            
            .store-finder__close {
                background: transparent;
                border: none;
                color: var(--starlight-pearl, #F0F0F0);
                font-size: 20px;
                cursor: pointer;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: background-color 0.3s ease;
            }
            
            .store-finder__close:hover {
                background-color: rgba(255, 255, 255, 0.1);
            }
            
            .store-finder__content {
                padding: 20px;
                overflow-y: auto;
                flex-grow: 1;
            }
            
            .store-finder__intro {
                margin-bottom: 20px;
                font-size: 16px;
                line-height: 1.5;
            }
            
            .store-finder__product {
                font-weight: 700;
                color: var(--neon-pink, #FF2A6D);
            }
            
            .store-finder__search {
                display: flex;
                gap: 10px;
                margin-bottom: 30px;
            }
            
            .store-finder__search-field {
                background-color: rgba(255, 255, 255, 0.05);
                border-radius: 5px;
                display: flex;
                align-items: center;
                padding: 0 15px;
                flex-grow: 1;
                position: relative;
                border: 1px solid rgba(255, 255, 255, 0.1);
                transition: border-color 0.3s ease;
            }
            
            .store-finder__search-field:focus-within {
                border-color: var(--electric-blue, #05D9E8);
            }
            
            .store-finder__search-field i {
                opacity: 0.7;
            }
            
            .store-finder__input {
                background: transparent;
                border: none;
                color: var(--starlight-pearl, #F0F0F0);
                font-size: 16px;
                padding: 12px;
                width: 100%;
                outline: none;
            }
            
            .store-finder__input::placeholder {
                color: rgba(255, 255, 255, 0.5);
            }
            
            .store-finder__geolocate {
                background: transparent;
                border: none;
                color: var(--electric-blue, #05D9E8);
                cursor: pointer;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0.7;
                transition: opacity 0.3s ease;
            }
            
            .store-finder__geolocate:hover {
                opacity: 1;
            }
            
            .store-finder__search-button {
                padding: 0 20px;
                white-space: nowrap;
                background: linear-gradient(45deg, var(--neon-pink, #FF2A6D), var(--neon-purple, #D264B6));
            }
            
            .store-finder__results {
                position: relative;
                min-height: 200px;
            }
            
            .store-finder__loader {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: none;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 30px;
                background-color: rgba(10, 10, 10, 0.7);
                z-index: 1;
            }
            
            .store-finder__spinner {
                width: 40px;
                height: 40px;
                border: 3px solid rgba(5, 217, 232, 0.3);
                border-top: 3px solid var(--electric-blue, #05D9E8);
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-bottom: 15px;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .store-finder__error {
                display: none;
                flex-direction: column;
                align-items: center;
                text-align: center;
                padding: 30px;
            }
            
            .store-finder__error i {
                font-size: 30px;
                color: var(--neon-pink, #FF2A6D);
                margin-bottom: 15px;
            }
            
            .store-finder__error-message {
                font-size: 16px;
                line-height: 1.5;
                max-width: 500px;
            }
            
            .store-finder__results-container {
                display: none;
            }
            
            .store-finder__results-title {
                font-size: 20px;
                font-weight: 600;
                color: var(--electric-blue, #05D9E8);
                margin-bottom: 5px;
            }
            
            .store-finder__results-count {
                font-size: 14px;
                opacity: 0.7;
                margin-bottom: 20px;
            }
            
            .store-finder__count {
                font-weight: 700;
                color: var(--neon-pink, #FF2A6D);
            }
            
            .store-finder__results-list {
                list-style: none;
                padding: 0;
                margin: 0;
                display: flex;
                flex-direction: column;
                gap: 15px;
            }
            
            .store-finder__store {
                background-color: rgba(26, 11, 46, 0.3);
                border-radius: 8px;
                padding: 15px;
                border: 1px solid rgba(255, 255, 255, 0.05);
                transition: transform 0.3s ease, border-color 0.3s ease;
            }
            
            .store-finder__store:hover {
                transform: translateY(-3px);
                border-color: rgba(5, 217, 232, 0.3);
            }
            
            .store-finder__store-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 8px;
            }
            
            .store-finder__store-name {
                font-size: 18px;
                font-weight: 600;
                color: var(--neon-pink, #FF2A6D);
                margin: 0;
            }
            
            .store-finder__distance {
                font-size: 14px;
                color: var(--electric-blue, #05D9E8);
                white-space: nowrap;
            }
            
            .store-finder__store-address {
                font-size: 14px;
                margin-bottom: 10px;
            }
            
            .store-finder__store-details {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
                font-size: 13px;
            }
            
            .store-finder__store-contact {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }
            
            .store-finder__store-phone,
            .store-finder__store-hours {
                display: flex;
                align-items: center;
                gap: 5px;
            }
            
            .store-finder__store-phone i,
            .store-finder__store-hours i {
                color: var(--electric-blue, #05D9E8);
                width: 15px;
                text-align: center;
            }
            
            .store-finder__availability {
                display: inline-block;
                padding: 3px 8px;
                border-radius: 4px;
                font-size: 12px;
                font-weight: 600;
            }
            
            .store-finder__availability--in-stock {
                background-color: rgba(0, 200, 100, 0.2);
                color: rgb(0, 220, 100);
                border: 1px solid rgba(0, 220, 100, 0.3);
            }
            
            .store-finder__availability--limited {
                background-color: rgba(255, 180, 0, 0.2);
                color: rgb(255, 180, 0);
                border: 1px solid rgba(255, 180, 0, 0.3);
            }
            
            .store-finder__store-actions {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
            }
            
            .store-finder__store-actions .button {
                flex: 1;
                min-width: 100px;
                max-width: 200px;
                font-size: 13px;
                padding: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 5px;
            }
            
            .pulse-animation {
                animation: pulse 2s infinite;
            }
            
            @keyframes pulse {
                0% {
                    transform: scale(1);
                    box-shadow: 0 0 0 0 rgba(5, 217, 232, 0.7);
                }
                
                70% {
                    transform: scale(1.1);
                    box-shadow: 0 0 0 10px rgba(5, 217, 232, 0);
                }
                
                100% {
                    transform: scale(1);
                    box-shadow: 0 0 0 0 rgba(5, 217, 232, 0);
                }
            }
            
            /* Responsive styles */
            @media (max-width: 768px) {
                .store-finder__search {
                    flex-direction: column;
                }
                
                .store-finder__store-details {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 10px;
                }
                
                .store-finder__store-actions {
                    justify-content: center;
                }
                
                .store-finder__store-actions .button {
                    flex: 1 1 calc(50% - 10px);
                }
            }
            
            @media (max-width: 480px) {
                .store-finder__container {
                    width: 95%;
                    max-height: 90vh;
                }
                
                .store-finder__content {
                    padding: 15px;
                }
                
                .store-finder__store-actions .button {
                    flex: 1 1 100%;
                    max-width: none;
                }
            }
        `;
        
        document.head.appendChild(styleElement);
    }
})();