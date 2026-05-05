import API from './api.js';

const MenuPage = {
  restaurantId: null,
  menuType: 'daily', // 'daily' or 'weekly'
  currentUser: null,


  async init() {
    // Get query parameters
    const params = new URLSearchParams(window.location.search);
    this.restaurantId = params.get('id');
    this.menuType = params.get('view') || 'daily';

    if (!this.restaurantId) {
      document.getElementById('menu-content').innerHTML = '<p class="error">Restaurant not found</p>';
      return;
    }

    // Load current user
    this.currentUser = JSON.parse(localStorage.getItem('user'));

    // Load menu
    await this.loadMenu();

    // Attach event listeners
    this.attachEventListeners();
  },

  async loadMenu() {
    const loadingElement = document.getElementById('menu-content');
    loadingElement.innerHTML = '<p>Loading menu...</p>';

    try {
      let menuData;
      if (this.menuType === 'daily') {
        menuData = await API.getDailyMenu(this.restaurantId);
      } else {
        menuData = await API.getWeeklyMenu(this.restaurantId);
      }

      this.renderMenu(menuData);
    } catch (error) {
      console.error('Error loading menu:', error);
      loadingElement.innerHTML = '<p class="error">Failed to load menu. Please try again.</p>';
    }
  },

  renderMenu(menuData) {
    const menuContent = document.getElementById('menu-content');

    if (!menuData || (menuData.error && !menuData.meals && !menuData.days)) {
      menuContent.innerHTML = '<p class="error">Menu not available</p>';
      return;
    }

    // Handle different API response formats
    if (Array.isArray(menuData)) {
      // Array of meals
      menuContent.innerHTML = this.renderMealsList(menuData);
    } else if (menuData.meals) {
      // Daily menu with meals array
      menuContent.innerHTML = this.renderMealsList(menuData.meals);
    } else if (menuData.days) {
      // Weekly menu with days
      menuContent.innerHTML = this.renderWeeklyMenu(menuData.days);
    } else {
      // Try to display raw data
      menuContent.innerHTML = `<pre>${JSON.stringify(menuData, null, 2)}</pre>`;
    }
  },

  renderMealsList(meals) {
    if (!meals || meals.length === 0) {
      return '<p>No meals available</p>';
    }

    return `
      <div class="meals-list">
        ${meals.map(meal => `
          <div class="meal-item">
            <h3>${meal.name || meal.title || 'Meal'}</h3>
            ${meal.price ? `<p class="price">€${parseFloat(meal.price).toFixed(2)}</p>` : ''}
            ${meal.description ? `<p class="description">${meal.description}</p>` : ''}
            ${meal.allergens ? `<p class="allergens"><small>Allergens: ${meal.allergens}</small></p>` : ''}
          </div>
        `).join('')}
      </div>
    `;
  },

  renderWeeklyMenu(days) {
    if (!days || days.length === 0) {
      return '<p>No weekly menu available</p>';
    }

    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return `
      <div class="weekly-menu">
        ${days.map((day, index) => `
          <div class="day-section">
            <h3>${dayNames[index] || `Day ${index + 1}`}</h3>
            <div class="day-meals">
              ${Array.isArray(day.meals) ? day.meals.map(meal => `
                <div class="meal-item">
                  <h4>${meal.name || meal.title || 'Meal'}</h4>
                  ${meal.price ? `<p class="price">€${parseFloat(meal.price).toFixed(2)}</p>` : ''}
                  ${meal.description ? `<p class="description">${meal.description}</p>` : ''}
                </div>
              `).join('') : '<p>No meals for this day</p>'}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  handleMenuTypeChange(event) {
    const newType = event.target.dataset.type;
    this.menuType = newType;

    // Update button states
    document.querySelectorAll('.menu-type-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Load new menu
    this.loadMenu();
  },

  attachEventListeners() {
    const menuTypeBtns = document.querySelectorAll('.menu-type-btn');
    menuTypeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => this.handleMenuTypeChange(e));
    });
  }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  MenuPage.init();
});

export default MenuPage;
