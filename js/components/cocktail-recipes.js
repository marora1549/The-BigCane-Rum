/**
 * Cocktail Recipe Viewer
 * 
 * This module handles the cocktail recipe viewing functionality
 * on the website, including modal popups and recipe details.
 * 
 * @version 1.0.0
 * @updated 2025-05-18
 */

(function() {
    // Execute when DOM is fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        initCocktailRecipeViewer();
    });

    /**
     * Initialize the cocktail recipe viewer
     */
    function initCocktailRecipeViewer() {
        // Find all recipe view buttons
        const recipeButtons = document.querySelectorAll('.cocktail-recipe__link, [data-action="view-recipe"]');
        
        // Exit if no recipe buttons found
        if (!recipeButtons.length) return;
        
        // Attach event listeners to each button
        recipeButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Get recipe data from data attributes or use defaults
                const recipeName = button.getAttribute('data-recipe-name') || button.closest('.cocktail-card')?.querySelector('.cocktail-card__title').textContent || 'Cocktail Recipe';
                const recipeId = button.getAttribute('data-recipe-id') || generateRecipeId(recipeName);
                
                // Check if we need to fetch recipe or use predefined data
                const recipeDataEl = document.getElementById(`recipe-data-${recipeId}`);
                
                if (recipeDataEl) {
                    // Get recipe data from hidden element
                    try {
                        const recipeData = JSON.parse(recipeDataEl.textContent);
                        showRecipeModal(recipeData);
                    } catch (error) {
                        console.error('Error parsing recipe data:', error);
                        showFallbackRecipe(recipeName);
                    }
                } else {
                    // Fetch recipe by ID or name
                    fetchRecipeData(recipeId, recipeName)
                        .then(recipeData => {
                            showRecipeModal(recipeData);
                        })
                        .catch(error => {
                            console.error('Error fetching recipe:', error);
                            showFallbackRecipe(recipeName);
                        });
                }
            });
        });
    }
    
    /**
     * Generate a consistent ID from a recipe name
     * @param {string} name - Recipe name
     * @returns {string} Generated ID
     */
    function generateRecipeId(name) {
        return name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    }
    
    /**
     * Fetch recipe data from API or predefined data
     * @param {string} recipeId - Recipe ID
     * @param {string} recipeName - Recipe name
     * @returns {Promise<Object>} Recipe data object
     */
    function fetchRecipeData(recipeId, recipeName) {
        return new Promise((resolve) => {
            // In a real application, this would make an API call
            // For demo purposes, we'll use predefined data based on the recipe name or ID
            
            // Simulate API delay
            setTimeout(() => {
                // Sample recipes data (in a real app, this would come from an API)
                const recipes = {
                    'caribbean-sunset': {
                        name: 'Caribbean Sunset',
                        image: '../assets/images/cocktail-placeholder-1.jpg',
                        description: 'A vibrant, refreshing cocktail that captures the colors of a Caribbean sunset. Sweet mango and tangy lime blend perfectly with our Silver Rum for a tropical escape in a glass.',
                        ingredients: [
                            '2 oz The BigCane Silver Rum',
                            '1 oz fresh mango purée',
                            '3/4 oz lime juice',
                            '1/2 oz simple syrup',
                            '1/4 oz grenadine',
                            'Mango slice and lime wheel for garnish'
                        ],
                        instructions: [
                            'Add Silver Rum, mango purée, lime juice, and simple syrup to a shaker with ice.',
                            'Shake vigorously for 15 seconds until well-chilled.',
                            'Strain into a rocks glass filled with crushed ice.',
                            'Slowly pour grenadine down the side of the glass so it settles at the bottom.',
                            'Garnish with a mango slice and lime wheel.'
                        ],
                        difficulty: 'Easy',
                        prepTime: '5 minutes',
                        spiritType: 'Silver Rum',
                        glassType: 'Rocks Glass',
                        serveStyle: 'On crushed ice',
                        flavor: 'Sweet & Fruity'
                    },
                    'midnight-mojito': {
                        name: 'Midnight Mojito',
                        image: '../assets/images/cocktail-placeholder-2.jpg',
                        description: 'A dark twist on the classic mojito, featuring muddled blackberries and our Spiced Rum. The perfect balance of sweet, tart, and spice with a beautiful deep purple color.',
                        ingredients: [
                            '2 oz The BigCane Spiced Rum',
                            '6-8 fresh blackberries',
                            '8-10 mint leaves',
                            '3/4 oz lime juice',
                            '1/2 oz simple syrup',
                            'Soda water',
                            'Blackberries and mint sprig for garnish'
                        ],
                        instructions: [
                            'In a highball glass, muddle blackberries, mint leaves, lime juice, and simple syrup.',
                            'Add crushed ice to the glass.',
                            'Pour in the Spiced Rum and stir gently.',
                            'Top with soda water and stir once more.',
                            'Garnish with fresh blackberries and a mint sprig.'
                        ],
                        difficulty: 'Medium',
                        prepTime: '8 minutes',
                        spiritType: 'Spiced Rum',
                        glassType: 'Highball Glass',
                        serveStyle: 'Built in glass',
                        flavor: 'Berry & Herbal'
                    },
                    'guava-paradise': {
                        name: 'Guava Paradise',
                        image: '../assets/images/cocktail-placeholder-3.jpg',
                        description: 'A creamy, tropical cocktail that combines our Guava Rum with coconut cream for a luxurious island experience. The touch of nutmeg adds warmth and complexity to this paradise in a glass.',
                        ingredients: [
                            '2 oz The BigCane Guava Rum',
                            '1 oz coconut cream',
                            '2 oz pineapple juice',
                            '1/2 oz lime juice',
                            'Grated nutmeg',
                            'Pineapple wedge for garnish'
                        ],
                        instructions: [
                            'Add Guava Rum, coconut cream, pineapple juice, and lime juice to a shaker with ice.',
                            'Shake vigorously until well-chilled, about 15 seconds.',
                            'Strain into a chilled coupe or hurricane glass.',
                            'Grate fresh nutmeg on top.',
                            'Garnish with a pineapple wedge.'
                        ],
                        difficulty: 'Easy',
                        prepTime: '5 minutes',
                        spiritType: 'Guava Rum',
                        glassType: 'Coupe or Hurricane Glass',
                        serveStyle: 'Up (no ice)',
                        flavor: 'Tropical & Creamy'
                    },
                    'botanist-g-t': {
                        name: 'Caribbean G&T',
                        image: '../assets/images/cocktail-placeholder-4.jpg',
                        description: 'Our Caribbean take on the classic Gin & Tonic, featuring our London Dry Gin with its unique island botanical blend. The addition of fresh herbs and tropical citrus elevates this refreshing staple.',
                        ingredients: [
                            '2 oz The BigCane London Dry Gin',
                            '4 oz premium tonic water',
                            '2 slices of star fruit',
                            '1 sprig of fresh lemongrass',
                            '1 lime wheel',
                            'Ice cubes'
                        ],
                        instructions: [
                            'Fill a balloon glass with large ice cubes.',
                            'Pour in The BigCane London Dry Gin.',
                            'Slowly add tonic water, pouring down the side of the glass.',
                            'Gently stir once to combine.',
                            'Garnish with star fruit slices, lemongrass sprig, and lime wheel.'
                        ],
                        difficulty: 'Easy',
                        prepTime: '3 minutes',
                        spiritType: 'London Dry Gin',
                        glassType: 'Balloon Glass',
                        serveStyle: 'Over ice',
                        flavor: 'Botanical & Citrus'
                    },
                    'hibiscus-martini': {
                        name: 'Hibiscus Martini',
                        image: '../assets/images/cocktail-placeholder-5.jpg',
                        description: 'An elegant, floral cocktail that showcases our Silver Rum infused with hibiscus tea. The result is a stunning deep pink martini with subtle floral notes and a perfect balance of sweet and tart.',
                        ingredients: [
                            '2 oz hibiscus-infused BigCane Silver Rum*',
                            '3/4 oz elderflower liqueur',
                            '1/2 oz lime juice',
                            '1/4 oz simple syrup',
                            'Dried hibiscus flower for garnish',
                            '*To infuse: steep 2 tbsp dried hibiscus flowers in 8 oz rum for 3 hours, then strain'
                        ],
                        instructions: [
                            'Add all ingredients to a shaker filled with ice.',
                            'Shake vigorously until well-chilled, about 20 seconds.',
                            'Double strain into a chilled martini glass.',
                            'Float a dried hibiscus flower on top as garnish.'
                        ],
                        difficulty: 'Advanced',
                        prepTime: '3 hours for infusion, 5 minutes to prepare',
                        spiritType: 'Infused Silver Rum',
                        glassType: 'Martini Glass',
                        serveStyle: 'Up (no ice)',
                        flavor: 'Floral & Elegant'
                    },
                    'island-negroni': {
                        name: 'Island Negroni',
                        image: '../assets/images/cocktail-placeholder-6.jpg',
                        description: 'Our Caribbean twist on the classic Negroni substitutes traditional gin with our London Dry Gin and adds a float of Spiced Rum for added complexity and warmth. A sophisticated sipper with tropical undertones.',
                        ingredients: [
                            '1 oz The BigCane London Dry Gin',
                            '1 oz Campari',
                            '1 oz sweet vermouth',
                            '1/4 oz The BigCane Spiced Rum (float)',
                            'Orange peel for garnish'
                        ],
                        instructions: [
                            'Add gin, Campari, and sweet vermouth to a mixing glass with ice.',
                            'Stir for 30 seconds until well-chilled.',
                            'Strain into a rocks glass over a large ice cube.',
                            'Float the Spiced Rum on top by pouring it slowly over the back of a bar spoon.',
                            'Express an orange peel over the drink and use as garnish.'
                        ],
                        difficulty: 'Medium',
                        prepTime: '5 minutes',
                        spiritType: 'London Dry Gin & Spiced Rum',
                        glassType: 'Rocks Glass',
                        serveStyle: 'On the rocks',
                        flavor: 'Complex & Bitter-Sweet'
                    }
                };
                
                // Try to find by ID first
                if (recipes[recipeId]) {
                    resolve(recipes[recipeId]);
                    return;
                }
                
                // If not found by ID, try to match by name (case-insensitive)
                const normalizedName = recipeName.toLowerCase();
                for (const [id, recipe] of Object.entries(recipes)) {
                    if (recipe.name.toLowerCase().includes(normalizedName)) {
                        resolve(recipe);
                        return;
                    }
                }
                
                // If nothing found, create a fallback recipe
                resolve(createFallbackRecipe(recipeName));
            }, 500);
        });
    }
    
    /**
     * Create a fallback recipe when a specific recipe can't be found
     * @param {string} recipeName - Recipe name
     * @returns {Object} Fallback recipe data
     */
    function createFallbackRecipe(recipeName) {
        return {
            name: recipeName,
            image: '../assets/images/cocktail-placeholder-1.jpg',
            description: 'A delicious cocktail featuring The BigCane spirits. This signature drink combines tropical flavors with premium Caribbean rum for a taste of island luxury.',
            ingredients: [
                '2 oz The BigCane Silver Rum',
                '3/4 oz lime juice',
                '1/2 oz simple syrup',
                'Club soda',
                'Lime wheel for garnish'
            ],
            instructions: [
                'Add Silver Rum, lime juice, and simple syrup to a shaker with ice.',
                'Shake until well-chilled.',
                'Strain into a glass filled with ice.',
                'Top with club soda.',
                'Garnish with a lime wheel.'
            ],
            difficulty: 'Easy',
            prepTime: '5 minutes',
            spiritType: 'Silver Rum',
            glassType: 'Highball Glass',
            serveStyle: 'On the rocks',
            flavor: 'Refreshing & Citrus'
        };
    }
    
    /**
     * Show a fallback recipe in case of error
     * @param {string} recipeName - Recipe name
     */
    function showFallbackRecipe(recipeName) {
        const fallbackRecipe = createFallbackRecipe(recipeName);
        showRecipeModal(fallbackRecipe);
    }
    
    /**
     * Show the recipe modal with the provided recipe data
     * @param {Object} recipe - Recipe data object
     */
    function showRecipeModal(recipe) {
        // Create modal if it doesn't exist
        if (!document.querySelector('.recipe-modal')) {
            createRecipeModal();
        }
        
        // Get modal elements
        const modal = document.querySelector('.recipe-modal');
        const nameElement = modal.querySelector('.recipe-modal__name');
        const imageElement = modal.querySelector('.recipe-modal__image');
        const descriptionElement = modal.querySelector('.recipe-modal__description');
        const ingredientsList = modal.querySelector('.recipe-modal__ingredients-list');
        const instructionsList = modal.querySelector('.recipe-modal__instructions-list');
        const difficultyElement = modal.querySelector('.recipe-modal__difficulty-value');
        const prepTimeElement = modal.querySelector('.recipe-modal__prep-time-value');
        const spiritTypeElement = modal.querySelector('.recipe-modal__spirit-value');
        const glassTypeElement = modal.querySelector('.recipe-modal__glass-value');
        const serveStyleElement = modal.querySelector('.recipe-modal__serve-value');
        const flavorElement = modal.querySelector('.recipe-modal__flavor-value');
        
        // Update modal content with recipe data
        nameElement.textContent = recipe.name;
        imageElement.src = recipe.image;
        imageElement.alt = recipe.name;
        descriptionElement.textContent = recipe.description;
        
        // Clear and populate ingredients list
        ingredientsList.innerHTML = '';
        recipe.ingredients.forEach(ingredient => {
            const li = document.createElement('li');
            li.textContent = ingredient;
            ingredientsList.appendChild(li);
        });
        
        // Clear and populate instructions list
        instructionsList.innerHTML = '';
        recipe.instructions.forEach((instruction, index) => {
            const li = document.createElement('li');
            li.textContent = instruction;
            instructionsList.appendChild(li);
        });
        
        // Update details
        difficultyElement.textContent = recipe.difficulty || 'Easy';
        prepTimeElement.textContent = recipe.prepTime || '5 minutes';
        spiritTypeElement.textContent = recipe.spiritType || 'The BigCane Rum';
        glassTypeElement.textContent = recipe.glassType || 'Rocks Glass';
        serveStyleElement.textContent = recipe.serveStyle || 'On the rocks';
        flavorElement.textContent = recipe.flavor || 'Balanced & Refreshing';
        
        // Show modal
        modal.classList.add('active');
        
        // Scroll to top of modal content
        const modalContent = modal.querySelector('.recipe-modal__content');
        if (modalContent) {
            modalContent.scrollTop = 0;
        }
    }
    
    /**
     * Create the recipe modal elements
     */
    function createRecipeModal() {
        // Create modal container
        const modal = document.createElement('div');
        modal.className = 'recipe-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-labelledby', 'recipe-modal-title');
        modal.setAttribute('aria-modal', 'true');
        
        // Add modal HTML structure
        modal.innerHTML = `
            <div class="recipe-modal__overlay"></div>
            <div class="recipe-modal__container">
                <button class="recipe-modal__close" aria-label="Close recipe">
                    <i class="fas fa-times"></i>
                </button>
                
                <div class="recipe-modal__content">
                    <div class="recipe-modal__header">
                        <h2 id="recipe-modal-title" class="recipe-modal__name"></h2>
                    </div>
                    
                    <div class="recipe-modal__image-container">
                        <img src="" alt="" class="recipe-modal__image">
                        <div class="recipe-modal__badge">The BigCane Signature</div>
                    </div>
                    
                    <div class="recipe-modal__details">
                        <div class="recipe-modal__detail">
                            <span class="recipe-modal__detail-label">Difficulty:</span>
                            <span class="recipe-modal__difficulty-value"></span>
                        </div>
                        <div class="recipe-modal__detail">
                            <span class="recipe-modal__detail-label">Prep Time:</span>
                            <span class="recipe-modal__prep-time-value"></span>
                        </div>
                        <div class="recipe-modal__detail">
                            <span class="recipe-modal__detail-label">Spirit:</span>
                            <span class="recipe-modal__spirit-value"></span>
                        </div>
                        <div class="recipe-modal__detail">
                            <span class="recipe-modal__detail-label">Glass:</span>
                            <span class="recipe-modal__glass-value"></span>
                        </div>
                        <div class="recipe-modal__detail">
                            <span class="recipe-modal__detail-label">Serve:</span>
                            <span class="recipe-modal__serve-value"></span>
                        </div>
                        <div class="recipe-modal__detail">
                            <span class="recipe-modal__detail-label">Flavor:</span>
                            <span class="recipe-modal__flavor-value"></span>
                        </div>
                    </div>
                    
                    <div class="recipe-modal__description"></div>
                    
                    <div class="recipe-modal__section">
                        <h3 class="recipe-modal__section-title">
                            <i class="fas fa-list"></i> Ingredients
                        </h3>
                        <ul class="recipe-modal__ingredients-list"></ul>
                    </div>
                    
                    <div class="recipe-modal__section">
                        <h3 class="recipe-modal__section-title">
                            <i class="fas fa-cocktail"></i> Instructions
                        </h3>
                        <ol class="recipe-modal__instructions-list"></ol>
                    </div>
                    
                    <div class="recipe-modal__sharing">
                        <span class="recipe-modal__sharing-label">Share this recipe:</span>
                        <div class="recipe-modal__sharing-buttons">
                            <button class="recipe-modal__share-button recipe-modal__share-button--twitter">
                                <i class="fab fa-twitter"></i>
                            </button>
                            <button class="recipe-modal__share-button recipe-modal__share-button--facebook">
                                <i class="fab fa-facebook-f"></i>
                            </button>
                            <button class="recipe-modal__share-button recipe-modal__share-button--pinterest">
                                <i class="fab fa-pinterest-p"></i>
                            </button>
                            <button class="recipe-modal__share-button recipe-modal__share-button--email">
                                <i class="fas fa-envelope"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="recipe-modal__cta">
                        <a href="#" class="button recipe-modal__button">Find Ingredients Near You</a>
                        <a href="#" class="button button--secondary recipe-modal__button">See More Recipes</a>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal to document
        document.body.appendChild(modal);
        
        // Add modal styles
        addRecipeModalStyles();
        
        // Add event listeners
        const closeButton = modal.querySelector('.recipe-modal__close');
        const overlay = modal.querySelector('.recipe-modal__overlay');
        const shareButtons = modal.querySelectorAll('.recipe-modal__share-button');
        const findIngredientsButton = modal.querySelector('.recipe-modal__button');
        const moreRecipesButton = modal.querySelector('.button--secondary');
        
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
        
        // Share buttons
        shareButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                const recipe = {
                    name: modal.querySelector('.recipe-modal__name').textContent,
                    description: modal.querySelector('.recipe-modal__description').textContent
                };
                
                const shareUrl = window.location.href;
                const shareText = `${recipe.name} - ${recipe.description.substring(0, 100)}...`;
                
                let shareLink = '';
                
                if (button.classList.contains('recipe-modal__share-button--twitter')) {
                    shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
                } else if (button.classList.contains('recipe-modal__share-button--facebook')) {
                    shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
                } else if (button.classList.contains('recipe-modal__share-button--pinterest')) {
                    const imageUrl = modal.querySelector('.recipe-modal__image').src;
                    shareLink = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&media=${encodeURIComponent(imageUrl)}&description=${encodeURIComponent(shareText)}`;
                } else if (button.classList.contains('recipe-modal__share-button--email')) {
                    shareLink = `mailto:?subject=${encodeURIComponent(`The BigCane Cocktail Recipe: ${recipe.name}`)}&body=${encodeURIComponent(`Check out this delicious cocktail recipe from The BigCane:\n\n${recipe.name}\n\n${recipe.description}\n\nGet the full recipe at: ${shareUrl}`)}`;
                }
                
                if (shareLink) {
                    window.open(shareLink, '_blank');
                }
            });
        });
        
        // Find ingredients link
        if (findIngredientsButton) {
            findIngredientsButton.addEventListener('click', (e) => {
                e.preventDefault();
                
                // If we have a store locator function, use it
                if (typeof window.showStoreFinderModal === 'function') {
                    window.showStoreFinderModal('The BigCane Rum');
                } else {
                    // Fallback to notification
                    if (typeof window.showNotification === 'function') {
                        window.showNotification(
                            'Find Ingredients',
                            'Visit our store locator page to find The BigCane spirits near you.',
                            'info'
                        );
                    }
                    
                    // Redirect to contact page as fallback
                    setTimeout(() => {
                        window.location.href = '../contact.html';
                    }, 1500);
                }
            });
        }
        
        // More recipes link
        if (moreRecipesButton) {
            moreRecipesButton.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Close modal
                modal.classList.remove('active');
                
                // Redirect to cocktail finder page
                window.location.href = '../cocktail-finder.html';
            });
        }
    }
    
    /**
     * Add the styles for the recipe modal
     */
    function addRecipeModalStyles() {
        // Check if styles already exist
        if (document.getElementById('recipe-modal-styles')) return;
        
        const styleElement = document.createElement('style');
        styleElement.id = 'recipe-modal-styles';
        
        styleElement.textContent = `
            .recipe-modal {
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
            
            .recipe-modal.active {
                display: flex;
                opacity: 1;
            }
            
            .recipe-modal__overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(5px);
            }
            
            .recipe-modal__container {
                position: relative;
                width: 90%;
                max-width: 800px;
                max-height: 90vh;
                background-color: var(--midnight-black, #0A0A0A);
                border-radius: 10px;
                margin: auto;
                overflow: hidden;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 30px rgba(255, 42, 109, 0.3);
                border: 1px solid rgba(255, 255, 255, 0.1);
                display: flex;
                flex-direction: column;
            }
            
            .recipe-modal__close {
                position: absolute;
                top: 20px;
                right: 20px;
                background: rgba(0, 0, 0, 0.5);
                border: none;
                width: 36px;
                height: 36px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 16px;
                cursor: pointer;
                z-index: 2;
                transition: background-color 0.3s ease;
            }
            
            .recipe-modal__close:hover {
                background-color: rgba(255, 42, 109, 0.5);
            }
            
            .recipe-modal__content {
                padding: 0;
                overflow-y: auto;
                max-height: 90vh;
            }
            
            .recipe-modal__header {
                padding: 20px;
                padding-bottom: 0;
            }
            
            .recipe-modal__name {
                font-size: 28px;
                font-weight: 700;
                color: var(--electric-blue, #05D9E8);
                margin: 0;
                line-height: 1.3;
            }
            
            .recipe-modal__image-container {
                position: relative;
                width: 100%;
                height: 300px;
                overflow: hidden;
                margin-bottom: 20px;
            }
            
            .recipe-modal__image {
                width: 100%;
                height: 100%;
                object-fit: cover;
                object-position: center;
                transition: transform 0.3s ease;
            }
            
            .recipe-modal__content:hover .recipe-modal__image {
                transform: scale(1.05);
            }
            
            .recipe-modal__badge {
                position: absolute;
                bottom: 20px;
                right: 20px;
                background: linear-gradient(45deg, var(--neon-pink, #FF2A6D), var(--neon-purple, #D264B6));
                color: white;
                padding: 8px 15px;
                border-radius: 5px;
                font-size: 12px;
                font-weight: 600;
                letter-spacing: 1px;
                text-transform: uppercase;
                box-shadow: 0 2px 10px rgba(255, 42, 109, 0.5);
            }
            
            .recipe-modal__details {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 10px;
                padding: 0 20px;
                margin-bottom: 20px;
            }
            
            .recipe-modal__detail {
                background-color: rgba(26, 11, 46, 0.3);
                padding: 10px;
                border-radius: 5px;
                text-align: center;
            }
            
            .recipe-modal__detail-label {
                display: block;
                font-size: 12px;
                color: var(--neon-pink, #FF2A6D);
                margin-bottom: 5px;
                text-transform: uppercase;
                letter-spacing: 1px;
                font-weight: 600;
            }
            
            .recipe-modal__difficulty-value,
            .recipe-modal__prep-time-value,
            .recipe-modal__spirit-value,
            .recipe-modal__glass-value,
            .recipe-modal__serve-value,
            .recipe-modal__flavor-value {
                font-size: 14px;
                font-weight: 500;
            }
            
            .recipe-modal__description {
                padding: 0 20px;
                margin-bottom: 25px;
                font-size: 16px;
                line-height: 1.6;
                color: var(--starlight-pearl, #F0F0F0);
            }
            
            .recipe-modal__section {
                padding: 0 20px;
                margin-bottom: 25px;
            }
            
            .recipe-modal__section-title {
                font-size: 20px;
                font-weight: 600;
                color: var(--electric-blue, #05D9E8);
                margin-bottom: 15px;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .recipe-modal__section-title i {
                color: var(--neon-pink, #FF2A6D);
            }
            
            .recipe-modal__ingredients-list {
                list-style: none;
                padding: 0;
                margin: 0;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            
            .recipe-modal__ingredients-list li {
                position: relative;
                padding-left: 25px;
                font-size: 16px;
            }
            
            .recipe-modal__ingredients-list li::before {
                content: '';
                position: absolute;
                left: 0;
                top: 10px;
                width: 8px;
                height: 8px;
                background-color: var(--neon-pink, #FF2A6D);
                border-radius: 50%;
            }
            
            .recipe-modal__instructions-list {
                padding-left: 25px;
                margin: 0;
                display: flex;
                flex-direction: column;
                gap: 15px;
            }
            
            .recipe-modal__instructions-list li {
                font-size: 16px;
                padding-left: 10px;
            }
            
            .recipe-modal__instructions-list li::marker {
                color: var(--electric-blue, #05D9E8);
                font-weight: 600;
            }
            
            .recipe-modal__sharing {
                padding: 15px 20px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                flex-wrap: wrap;
                gap: 15px;
            }
            
            .recipe-modal__sharing-label {
                font-size: 14px;
                font-weight: 600;
                color: var(--electric-blue, #05D9E8);
            }
            
            .recipe-modal__sharing-buttons {
                display: flex;
                gap: 10px;
            }
            
            .recipe-modal__share-button {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: rgba(255, 255, 255, 0.1);
                color: white;
                border: none;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .recipe-modal__share-button:hover {
                transform: translateY(-3px);
            }
            
            .recipe-modal__share-button--twitter:hover {
                background-color: #1DA1F2;
            }
            
            .recipe-modal__share-button--facebook:hover {
                background-color: #4267B2;
            }
            
            .recipe-modal__share-button--pinterest:hover {
                background-color: #E60023;
            }
            
            .recipe-modal__share-button--email:hover {
                background-color: #239C57;
            }
            
            .recipe-modal__cta {
                padding: 0 20px 20px;
                display: flex;
                flex-wrap: wrap;
                gap: 15px;
            }
            
            .recipe-modal__button {
                flex: 1 1 auto;
                text-align: center;
                min-width: 200px;
            }
            
            /* Responsive Styles */
            @media (max-width: 768px) {
                .recipe-modal__container {
                    width: 95%;
                    max-height: 95vh;
                }
                
                .recipe-modal__details {
                    grid-template-columns: repeat(2, 1fr);
                }
                
                .recipe-modal__name {
                    font-size: 24px;
                }
                
                .recipe-modal__image-container {
                    height: 250px;
                }
            }
            
            @media (max-width: 480px) {
                .recipe-modal__close {
                    top: 10px;
                    right: 10px;
                    width: 32px;
                    height: 32px;
                }
                
                .recipe-modal__details {
                    grid-template-columns: 1fr;
                }
                
                .recipe-modal__header {
                    padding: 15px;
                    padding-right: 50px;
                }
                
                .recipe-modal__image-container {
                    height: 200px;
                }
                
                .recipe-modal__description,
                .recipe-modal__section {
                    padding: 0 15px;
                }
                
                .recipe-modal__sharing {
                    padding: 15px;
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 10px;
                }
                
                .recipe-modal__sharing-buttons {
                    width: 100%;
                    justify-content: center;
                }
                
                .recipe-modal__cta {
                    padding: 0 15px 15px;
                    flex-direction: column;
                }
            }
        `;
        
        document.head.appendChild(styleElement);
    }
})();