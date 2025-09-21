const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");
if (hamburger) {
  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const filterSelect = document.getElementById('filterSelect');
  const searchBtn = document.getElementById('searchBtn');
  const recipesContainer = document.getElementById('recipes-container');
  const detail = document.getElementById('recipe-detail');
  const closeBtn = document.getElementById('close-btn');

  let allRecipes = [];

  // Load recipes from JSON
  fetch('recipes.json')
    .then(res => res.json())
    .then(data => {
      allRecipes = data;
      displayRecipes(allRecipes);
    })
    .catch(err => console.error("Error loading recipes.json", err));

  // Display recipe cards
  function displayRecipes(recipes) {
    recipesContainer.innerHTML = '';
    if (recipes.length === 0) {
      recipesContainer.innerHTML = "<p>No recipes found.</p>";
      return;
    }

    recipes.forEach(recipe => {
      const card = document.createElement('div');
      card.className = 'recipe-card';
      card.innerHTML = `
        <img src="${recipe.image}" alt="${recipe.title}">
        <h3>${recipe.title}</h3>
        <p>${recipe.description ? recipe.description : ''}</p>
      `;
      // Click event to show recipe detail
      card.addEventListener('click', () => showDetail(recipe));
      recipesContainer.appendChild(card);
    });
  }

  // Filter recipes
  function filterRecipes() {
    const query = searchInput.value.toLowerCase();
    const category = filterSelect.value;

    const filtered = allRecipes.filter(recipe => {
      const matchesQuery = recipe.title.toLowerCase().includes(query) ||
                           (recipe.description && recipe.description.toLowerCase().includes(query));
      const matchesCategory = category === "all" || recipe.category === category;
      return matchesQuery && matchesCategory;
    });

    displayRecipes(filtered);
  }

  // Event listeners for search/filter
  if (searchBtn) searchBtn.addEventListener('click', filterRecipes);
  if (searchInput) searchInput.addEventListener('keyup', filterRecipes);
  if (filterSelect) filterSelect.addEventListener('change', filterRecipes);

  // Show recipe detail popup
  function showDetail(recipe) {
    document.getElementById('detail-title').textContent = recipe.title;

    // Ingredients
    const ingList = document.getElementById('detail-ingredients');
    ingList.innerHTML = '';
    recipe.ingredients.forEach(i => {
      const li = document.createElement('li');
      li.textContent = i;
      ingList.appendChild(li);
    });

    // Nutrition
    const nutrition = recipe.nutrition;
    document.getElementById('detail-nutrition').innerHTML =
      `Calories: ${nutrition.calories}<br>
       Protein: ${nutrition.protein}<br>
       Carbs: ${nutrition.carbs}<br>
       Fat: ${nutrition.fat}`;

    // Instructions
    const instList = document.getElementById('detail-instructions');
    instList.innerHTML = '';
    recipe.instructions.forEach(step => {
      const li = document.createElement('li');
      li.textContent = step;
      instList.appendChild(li);
    });

    detail.classList.remove('hidden');
  }

  // Close popup
  closeBtn.addEventListener('click', () => {
    detail.classList.add('hidden');
  });
});
