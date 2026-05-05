import API from './api.js';

const MenuPage = {
  restaurantId: null,
  menuType: 'daily',
  currentUser: null,
  
  async init() {
    const params = new URLSearchParams(window.location.search);
    this.restaurantId = params.get('id');
    this.menuType = params.get('view') || 'daily';

    if (!this.restaurantId) {
      document.getElementById('menu-content').innerHTML = '<p class="error">Restaurant not found</p>';
      return;
    }
    
    this.currentUser = JSON.parse(localStorage.getItem('user'));
    await this.loadMenu();
    this.attachEventListeners();
  },

  async loadMenu() {
    const loadingElement = document.getElementById('menu-content');
    loadingElement.innerHTML = '<p>Loading menu...</p>';

    try {
      let menuData;
      if (this.menuType === 'daily') {
        menuData = await API.getDailyMenu(this.restaurantId, 'en');
      } else {
        menuData = await API.getWeeklyMenu(this.restaurantId, 'en');
      }

      this.renderMenu(menuData);
    } catch (error) {
      console.error('Error loading menu:', error);
      loadingElement.innerHTML = '<p class="error">Failed to load menu. Please try again.</p>';
    }
  },

  renderMenu(menuData) {
    const menuContent = document.getElementById('menu-content');

    if (!menuData || (menuData.error && !menuData.courses && !menuData.days)) {
      menuContent.innerHTML = '<p class="error">Menu not available</p>';
      return;
    }

    if (Array.isArray(menuData)) {
      menuContent.innerHTML = this.renderMealsList(menuData);
    } else if (menuData.courses) { 
      // Daily menu
      menuContent.innerHTML = this.renderMealsList(menuData.courses);
    } else if (menuData.days) {
      // Weekly menu
      menuContent.innerHTML = this.renderWeeklyMenu(menuData.days);
    } else {
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
            <h3>${meal.name || 'Meal'}</h3>
            ${meal.price ? `<p class="price">${meal.price}</p>` : ''}
            ${meal.diets ? `<p class="diets"><small>Diets: ${meal.diets}</small></p>` : ''}
          </div>
        `).join('')}
      </div>
    `;
  },

  renderWeeklyMenu(days) {
    if (!days || days.length === 0) {
      return '<p>No weekly menu available</p>';
    }

    return `
      <div class="weekly-menu">
        ${days.map((day) => `
          <div class="day-section">
            <h3>${day.date || 'Day'}</h3>
            <div class="day-meals">
              ${Array.isArray(day.courses) ? day.courses.map(meal => `
                <div class="meal-item">
                  <h4>${meal.name || 'Meal'}</h4>
                  ${meal.price ? `<p class="price">${meal.price}</p>` : ''}
                  ${meal.diets ? `<p class="diets"><small>Diets: ${meal.diets}</small></p>` : ''}
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

    document.querySelectorAll('.menu-type-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    event.target.classList.add('active');

    this.loadMenu();
  },

  attachEventListeners() {
    const menuTypeBtns = document.querySelectorAll('.menu-type-btn');
    menuTypeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => this.handleMenuTypeChange(e));
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  MenuPage.init();
});

export default MenuPage;