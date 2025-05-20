// Cocktail Finder - JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Recipe Modal
    const modal = document.getElementById('recipe-modal');
    const modalClose = document.querySelector('.cocktail-modal__close');
    const viewRecipeButtons = document.querySelectorAll('.view-recipe');
    
    // Recipe data (in a real application, this would come from a database)
    const recipes = {
        'caribbean-sunset': {
            title: 'Caribbean Sunset',
            image: 'assets/images/cocktail-placeholder-1.jpg',
            description: 'A refreshing tropical cocktail that captures the vibrant colors of a Caribbean sunset. The combination of fresh mango, zesty lime, and a splash of grenadine creates a stunning gradient effect reminiscent of the sun setting over island waters.',
            ingredients: [
                { amount: '2 oz', name: 'The BigCane Silver Rum' },
                { amount: '1 oz', name: 'Fresh mango purée' },
                { amount: '3/4 oz', name: 'Fresh lime juice' },
                { amount: '1/2 oz', name: 'Simple syrup' },
                { amount: '1/2 oz', name: 'Grenadine' },
                { amount: 'Garnish', name: 'Orange slice and maraschino cherry' }
            ],
            steps: [
                'Fill a cocktail shaker with ice.',
                'Add the Silver Rum, mango purée, lime juice, and simple syrup.',
                'Shake vigorously for 15 seconds until well chilled.',
                'Strain into a chilled hurricane glass filled with crushed ice.',
                'Slowly pour the grenadine into the glass, allowing it to sink to the bottom creating the sunset effect.',
                'Garnish with an orange slice and maraschino cherry.'
            ],
            tags: ['Sweet', 'Fruity', 'Tropical', 'Beginner-Friendly']
        },
        'midnight-mojito': {
            title: 'Midnight Mojito',
            image: 'assets/images/cocktail-placeholder-2.jpg',
            description: 'A dark and mysterious twist on the classic mojito. The BigCane Spiced Rum pairs perfectly with muddled blackberries and fresh mint for a cocktail that\'s equally refreshing and complex.',
            ingredients: [
                { amount: '2 oz', name: 'The BigCane Spiced Rum' },
                { amount: '6-8', name: 'Blackberries' },
                { amount: '8-10', name: 'Fresh mint leaves' },
                { amount: '3/4 oz', name: 'Fresh lime juice' },
                { amount: '1/2 oz', name: 'Demerara syrup' },
                { amount: 'Top with', name: 'Soda water' },
                { amount: 'Garnish', name: 'Mint sprig and blackberries' }
            ],
            steps: [
                'In a highball glass, muddle blackberries, mint leaves, lime juice, and demerara syrup.',
                'Add crushed ice to the glass.',
                'Pour in The BigCane Spiced Rum and stir gently to combine.',
                'Top with soda water and stir again.',
                'Garnish with a mint sprig and a few blackberries.',
                'Serve with a straw and enjoy!'
            ],
            tags: ['Herbal', 'Refreshing', 'Berry', 'Spiced']
        },
        'guava-paradise': {
            title: 'Guava Paradise',
            image: 'assets/images/cocktail-placeholder-3.jpg',
            description: 'A tropical escape in a glass featuring our Guava Rum with coconut cream, pineapple juice, and a sprinkle of nutmeg for an exotic flavor profile with a creamy texture.',
            ingredients: [
                { amount: '2 oz', name: 'The BigCane Guava Rum' },
                { amount: '1 oz', name: 'Coconut cream' },
                { amount: '2 oz', name: 'Pineapple juice' },
                { amount: '1/2 oz', name: 'Fresh lime juice' },
                { amount: 'Pinch', name: 'Freshly grated nutmeg' },
                { amount: 'Garnish', name: 'Pineapple wedge and edible flower' }
            ],
            steps: [
                'Add all ingredients to a cocktail shaker with ice.',
                'Shake vigorously for 15-20 seconds until well chilled and frothy.',
                'Strain into a chilled coupe or hurricane glass.',
                'Grate fresh nutmeg over the top.',
                'Garnish with a pineapple wedge and an edible flower.',
                'Serve immediately and enjoy!'
            ],
            tags: ['Sweet', 'Creamy', 'Tropical', 'Fruity']
        },
        'electric-blue-gin-fizz': {
            title: 'Electric Blue Gin Fizz',
            image: 'assets/images/cocktail-placeholder-4.jpg',
            description: 'A vibrant twist on the classic gin fizz with a stunning electric blue color. The BigCane London Dry Gin provides the botanical backbone for this refreshing, fizzy cocktail.',
            ingredients: [
                { amount: '2 oz', name: 'The BigCane London Dry Gin' },
                { amount: '1/2 oz', name: 'Blue curaçao' },
                { amount: '3/4 oz', name: 'Fresh lemon juice' },
                { amount: '1/2 oz', name: 'Simple syrup' },
                { amount: '1', name: 'Egg white (optional)' },
                { amount: 'Top with', name: 'Club soda' },
                { amount: 'Garnish', name: 'Lemon twist and edible blue flower' }
            ],
            steps: [
                'Add gin, blue curaçao, lemon juice, simple syrup, and egg white (if using) to a cocktail shaker.',
                'Dry shake (without ice) for 15 seconds to emulsify the egg white.',
                'Add ice and shake again for 15 seconds until well chilled.',
                'Strain into a chilled highball glass filled with fresh ice.',
                'Top with club soda and stir gently.',
                'Garnish with a lemon twist and edible blue flower.',
                'Serve immediately with a straw.'
            ],
            tags: ['Citrus', 'Fizzy', 'Colorful', 'Refreshing']
        },
        'island-old-fashioned': {
            title: 'Island Old Fashioned',
            image: 'assets/images/cocktail-placeholder-5.jpg',
            description: 'A Caribbean take on the classic cocktail, substituting bourbon with our aged Spiced Rum and adding richness with demerara sugar. The flamed orange peel adds an aromatic finishing touch.',
            ingredients: [
                { amount: '2 oz', name: 'The BigCane Spiced Rum' },
                { amount: '1 tsp', name: 'Demerara sugar' },
                { amount: '3 dashes', name: 'Angostura bitters' },
                { amount: '1 dash', name: 'Orange bitters' },
                { amount: '1 tsp', name: 'Water' },
                { amount: 'Garnish', name: 'Orange peel and cinnamon stick' }
            ],
            steps: [
                'In an old fashioned glass, add demerara sugar, water, and bitters.',
                'Stir until the sugar is mostly dissolved.',
                'Add a large ice cube or several smaller cubes.',
                'Pour in The BigCane Spiced Rum and stir gently for 30 seconds to chill and dilute.',
                'Cut a piece of orange peel and express the oils over the drink by twisting it.',
                'Flame the orange peel (carefully!) over the drink to caramelize the oils.',
                'Drop the peel into the glass and add a cinnamon stick for garnish.'
            ],
            tags: ['Strong', 'Complex', 'Aromatic', 'Spirit-Forward']
        },
        'tropical-gin-tonic': {
            title: 'Tropical Gin & Tonic',
            image: 'assets/images/cocktail-placeholder-6.jpg',
            description: 'Our elevated G&T celebrating the botanical profile of our London Dry Gin with exotic garnishes that complement and enhance the flavors in the spirit.',
            ingredients: [
                { amount: '2 oz', name: 'The BigCane London Dry Gin' },
                { amount: '4 oz', name: 'Premium tonic water' },
                { amount: '1 slice', name: 'Star fruit' },
                { amount: '2', name: 'Lychees' },
                { amount: 'Several', name: 'Pink peppercorns' },
                { amount: '1 slice', name: 'Lime' },
                { amount: 'Garnish', name: 'Edible flower (optional)' }
            ],
            steps: [
                'Fill a balloon glass or large wine glass with ice.',
                'Pour in The BigCane London Dry Gin.',
                'Add the star fruit slice, lychees, and pink peppercorns to the glass.',
                'Squeeze the lime slice into the drink and drop it in.',
                'Slowly pour in the tonic water, allowing it to cascade through the garnishes.',
                'Gently stir to combine.',
                'Top with an edible flower if desired.'
            ],
            tags: ['Refreshing', 'Botanical', 'Exotic', 'Aromatic']
        }
    };
    
    // Open modal and load recipe data
    viewRecipeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const recipeId = this.dataset.recipe;
            const recipe = recipes[recipeId];
            
            if (recipe) {
                // Update modal with recipe details
                document.querySelector('.cocktail-modal__title').textContent = recipe.title;
                document.querySelector('.cocktail-modal__image').src = recipe.image;
                document.querySelector('.cocktail-modal__image').alt = recipe.title;
                document.querySelector('.cocktail-modal__description p').textContent = recipe.description;
                
                // Update ingredients
                const ingredientList = document.querySelector('.cocktail-modal__ingredient-list');
                ingredientList.innerHTML = '';
                
                recipe.ingredients.forEach(ingredient => {
                    const li = document.createElement('li');
                    li.className = 'cocktail-modal__ingredient';
                    
                    const amountSpan = document.createElement('span');
                    amountSpan.className = 'cocktail-modal__ingredient-amount';
                    amountSpan.textContent = ingredient.amount;
                    
                    const nameSpan = document.createElement('span');
                    nameSpan.textContent = ingredient.name;
                    
                    li.appendChild(amountSpan);
                    li.appendChild(nameSpan);
                    ingredientList.appendChild(li);
                });
                
                // Update steps
                const stepList = document.querySelector('.cocktail-modal__step-list');
                stepList.innerHTML = '';
                
                recipe.steps.forEach(step => {
                    const li = document.createElement('li');
                    li.className = 'cocktail-modal__step';
                    li.textContent = step;
                    stepList.appendChild(li);
                });
                
                // Update tags
                const tagsContainer = document.querySelector('.cocktail-modal__tags');
                tagsContainer.innerHTML = '';
                
                recipe.tags.forEach(tag => {
                    const span = document.createElement('span');
                    span.className = 'cocktail-modal__tag';
                    span.textContent = tag;
                    tagsContainer.appendChild(span);
                });
                
                // Show modal
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // Close modal
    modalClose.addEventListener('click', function() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Cocktail Filtering
    const filterForm = document.getElementById('cocktail-filter-form');
    const cocktailItems = document.querySelectorAll('.cocktail-item');
    const noResults = document.querySelector('.no-results');
    const resetFiltersBtn = document.getElementById('reset-filters');
    
    filterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const baseFilter = document.getElementById('base').value;
        const flavorFilter = document.getElementById('flavor').value;
        const difficultyFilter = document.getElementById('difficulty').value;
        const searchTerm = document.getElementById('search').value.toLowerCase();
        
        let visibleCount = 0;
        
        cocktailItems.forEach(item => {
            // Get item data
            const itemBase = item.dataset.base;
            const itemFlavors = item.dataset.flavor ? item.dataset.flavor.split(',') : [];
            const itemDifficulty = item.dataset.difficulty;
            const itemTitle = item.querySelector('.cocktail-item__title').textContent.toLowerCase();
            const itemDescription = item.querySelector('.cocktail-item__description').textContent.toLowerCase();
            
            // Check if item passes all filters
            const passesBase = baseFilter === 'all' || itemBase === baseFilter;
            const passesFlavor = flavorFilter === 'all' || itemFlavors.includes(flavorFilter);
            const passesDifficulty = difficultyFilter === 'all' || itemDifficulty === difficultyFilter;
            const passesSearch = searchTerm === '' || itemTitle.includes(searchTerm) || itemDescription.includes(searchTerm);
            
            // Show or hide item based on filter results
            if (passesBase && passesFlavor && passesDifficulty && passesSearch) {
                item.style.display = 'block';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });
        
        // Show "No Results" message if no items are visible
        if (visibleCount === 0) {
            noResults.style.display = 'block';
        } else {
            noResults.style.display = 'none';
        }
    });
    
    // Reset filters
    resetFiltersBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        document.getElementById('base').value = 'all';
        document.getElementById('flavor').value = 'all';
        document.getElementById('difficulty').value = 'all';
        document.getElementById('search').value = '';
        
        cocktailItems.forEach(item => {
            item.style.display = 'block';
        });
        
        noResults.style.display = 'none';
    });
    
    // Favorite functionality (in a real app, this would store data to a server/localStorage)
    const favoriteButtons = document.querySelectorAll('.add-favorite');
    
    favoriteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const icon = this.querySelector('i');
            
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                this.innerHTML = this.innerHTML.replace('Save', 'Saved');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                this.innerHTML = this.innerHTML.replace('Saved', 'Save');
            }
        });
    });
    
    // Print recipe functionality
    const printButtons = document.querySelectorAll('.print-recipe');
    
    printButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // In a real app, this would open a print dialog
            alert('Print functionality would be implemented here!');
        });
    });
    
    // Pagination (simple demo - not functional)
    const paginationNumbers = document.querySelectorAll('.pagination__number');
    const prevButton = document.querySelector('.pagination__button--prev');
    const nextButton = document.querySelector('.pagination__button--next');
    
    paginationNumbers.forEach(button => {
        button.addEventListener('click', function() {
            paginationNumbers.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update prev/next buttons
            const activePage = parseInt(this.textContent);
            prevButton.classList.toggle('disabled', activePage === 1);
            nextButton.classList.toggle('disabled', activePage === paginationNumbers.length);
            
            // In a real app, this would load the next page of results
        });
    });
    
    prevButton.addEventListener('click', function() {
        const activePage = document.querySelector('.pagination__number.active');
        const pageNumber = parseInt(activePage.textContent);
        
        if (pageNumber > 1) {
            document.querySelector(`.pagination__number:nth-child(${pageNumber - 1})`).click();
        }
    });
    
    nextButton.addEventListener('click', function() {
        const activePage = document.querySelector('.pagination__number.active');
        const pageNumber = parseInt(activePage.textContent);
        
        if (pageNumber < paginationNumbers.length) {
            document.querySelector(`.pagination__number:nth-child(${pageNumber + 1})`).click();
        }
    });
});