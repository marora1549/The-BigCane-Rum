// THE BIGCANE EXPERIMENTAL - RECIPE MODAL COMPONENT
// Author: Claude AI
// Date: May 2025

document.addEventListener('DOMContentLoaded', function() {
  // Recipe Modal Functionality
  const recipeModal = document.querySelector('.recipe-modal');
  const recipeButtons = document.querySelectorAll('.recipe-btn');
  const closeButton = document.querySelector('.recipe-modal__close');
  
  // Debug log to confirm modal initialization
  console.log('Recipe modal initialized with:', recipeButtons.length, 'buttons');
  
  if (!recipeModal || recipeButtons.length === 0) {
    console.error('Recipe modal elements not found');
    return;
  }
  
  // Recipe data
  const recipes = {
    'caribbean-sunset': {
      name: 'Caribbean Sunset',
      image: 'assets/images/cocktail-placeholder-1.jpg',
      badge: 'Staff Favorite',
      prepTime: '5 mins',
      difficulty: 'Easy',
      serves: '1',
      ingredients: [
        '2 oz The Big Cane Silver Rum',
        '1 oz fresh mango puree',
        '1/2 oz fresh lime juice',
        '1/2 oz grenadine',
        'Ice cubes',
        'Mango slice and lime wheel for garnish',
        'Optional: 1 tsp sugar (adjust to taste)'
      ],
      instructions: [
        'Fill a cocktail shaker halfway with ice cubes.',
        'Add The Big Cane Silver Rum, mango puree, lime juice, and optional sugar.',
        'Shake vigorously for about 15 seconds until well-chilled.',
        'Strain into a chilled glass filled with fresh ice.',
        'Slowly pour grenadine down the inside of the glass to create a layered sunset effect.',
        'Garnish with a mango slice and lime wheel on the rim.'
      ],
      notes: 'For a non-alcoholic version, substitute the rum with coconut water and a splash of vanilla extract. The grenadine should be added last for the signature sunset gradient effect.',
      tags: ['Tropical', 'Sweet', 'Fruity', 'Summer', 'Silver Rum']
    },
    'midnight-mojito': {
      name: 'Midnight Mojito',
      image: 'assets/images/cocktail-placeholder-2.jpg',
      badge: 'Premium Mix',
      prepTime: '8 mins',
      difficulty: 'Medium',
      serves: '1',
      ingredients: [
        '2 oz The Big Cane Spiced Rum',
        '8-10 fresh blackberries',
        '8-10 mint leaves',
        '1 oz fresh lime juice',
        '1/2 oz simple syrup',
        'Soda water',
        'Crushed ice',
        'Blackberries and mint sprig for garnish'
      ],
      instructions: [
        'In a cocktail shaker, muddle the blackberries, mint leaves, and simple syrup.',
        'Add The Big Cane Spiced Rum, lime juice, and a handful of ice.',
        'Shake well until chilled and properly combined.',
        'Fill a highball glass with crushed ice.',
        'Strain the mixture into the glass, leaving some room at the top.',
        'Top with soda water and gently stir.',
        'Garnish with fresh blackberries and a mint sprig.'
      ],
      notes: 'The key to this cocktail is fresh blackberries – frozen won't give you the same vibrant color and flavor. For a more intense blackberry flavor, let the muddled berries sit with the rum for about 5 minutes before shaking.',
      tags: ['Refreshing', 'Berry', 'Spiced Rum', 'Herbal', 'Signature']
    },
    'guava-paradise': {
      name: 'Guava Paradise',
      image: 'assets/images/cocktail-placeholder-3.jpg',
      badge: 'Limited Edition',
      prepTime: '5 mins',
      difficulty: 'Easy',
      serves: '1',
      ingredients: [
        '2 oz The Big Cane Guava Rum',
        '1 oz coconut cream',
        '2 oz pineapple juice',
        '1/4 tsp freshly grated nutmeg, plus more for garnish',
        'Ice cubes',
        'Pineapple wedge for garnish',
        'Optional: 1/2 oz lime juice for extra tartness'
      ],
      instructions: [
        'Add The Big Cane Guava Rum, coconut cream, pineapple juice, and nutmeg to a cocktail shaker with ice.',
        'Shake vigorously for about 20 seconds until well-chilled and frothy.',
        'Fill a rocks glass with fresh ice.',
        'Strain the mixture into the glass.',
        'Grate additional fresh nutmeg on top.',
        'Garnish with a pineapple wedge.'
      ],
      notes: 'For the best results, use real coconut cream rather than cream of coconut, which contains added sugar. The natural sweetness of the guava rum and pineapple juice is usually sufficient, but you can add a touch of simple syrup if you prefer it sweeter.',
      tags: ['Tropical', 'Creamy', 'Fruity', 'Guava Rum', 'Island Style']
    }
  };
  
  // Open modal when clicking on a recipe button
  recipeButtons.forEach(button => {
    button.addEventListener('click', e => {
      e.preventDefault();
      
      const recipeId = button.getAttribute('data-recipe');
      console.log('Opening recipe modal for:', recipeId);
      
      const recipe = recipes[recipeId];
      
      if (recipe) {
        // Update modal content
        document.querySelector('.recipe-modal__title').textContent = recipe.name;
        document.querySelector('.recipe-modal__badge').textContent = recipe.badge;
        document.querySelector('.recipe-modal__image').src = recipe.image;
        document.querySelector('.recipe-modal__image').alt = recipe.name;
        document.querySelector('.recipe-prep-time').textContent = recipe.prepTime;
        document.querySelector('.recipe-difficulty').textContent = recipe.difficulty;
        document.querySelector('.recipe-serves').textContent = recipe.serves;
        
        // Update ingredients list
        const ingredientsList = document.querySelector('.recipe-ingredients');
        ingredientsList.innerHTML = '';
        recipe.ingredients.forEach((ingredient, index) => {
          const li = document.createElement('li');
          li.textContent = ingredient;
          li.style.animationDelay = `${index * 0.1}s`;
          li.classList.add('recipe-animate-in');
          ingredientsList.appendChild(li);
        });
        
        // Update instructions list
        const instructionsList = document.querySelector('.recipe-instructions');
        instructionsList.innerHTML = '';
        recipe.instructions.forEach((instruction, index) => {
          const li = document.createElement('li');
          li.textContent = instruction;
          li.style.animationDelay = `${(index + recipe.ingredients.length) * 0.1}s`;
          li.classList.add('recipe-animate-in');
          instructionsList.appendChild(li);
        });
        
        // Update notes
        document.querySelector('.recipe-notes').textContent = recipe.notes;
        
        // Update tags
        const tagsContainer = document.querySelector('.recipe-tag__container');
        tagsContainer.innerHTML = '';
        recipe.tags.forEach(tag => {
          const span = document.createElement('span');
          span.classList.add('recipe-tag');
          span.textContent = tag;
          tagsContainer.appendChild(span);
        });
        
        // Show modal
        recipeModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
      }
    });
  });
  
  // Close modal when clicking close button
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      recipeModal.classList.remove('active');
      document.body.style.overflow = ''; // Restore scrolling
    });
  }
  
  // Close modal when clicking outside the content
  recipeModal.addEventListener('click', e => {
    if (e.target === recipeModal) {
      recipeModal.classList.remove('active');
      document.body.style.overflow = ''; // Restore scrolling
    }
  });
  
  // Close modal with Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && recipeModal.classList.contains('active')) {
      recipeModal.classList.remove('active');
      document.body.style.overflow = ''; // Restore scrolling
    }
  });
});
