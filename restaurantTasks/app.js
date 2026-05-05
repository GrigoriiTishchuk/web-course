/**
 * Main Application Logic for StudentDiscountFOOD
 * Handles restaurant listing, filtering, favorites, profile, and map integration
 */
import API from './api.js';

const AppState = {
  restaurants: [],
  filteredRestaurants: [],
  favorites: [],
  currentUser: null,
  filters: {
    search: '',
    city: '',
    company: ''
  },
  currentRestaurantId: null,

  async init() {
    this.currentUser = JSON.parse(localStorage.getItem('user')) || null;
    this.restaurants = await API.getRestaurants();
    this.filteredRestaurants = [...this.restaurants];
    if (this.currentUser) {
      this.favorites = await API.getFavorites();
    }
  },


  applyFilters() {
    this.filteredRestaurants = this.restaurants.filter(restaurant => {
      const matchesSearch = restaurant.name
        .toLowerCase()
        .includes(this.filters.search.toLowerCase());
      const matchesCity = !this.filters.city || restaurant.city === this.filters.city;
      const matchescompany = !this.filters.company || restaurant.company === this.filters.company;
      
      return matchesSearch && matchesCity && matchescompany;
    });
  },

  getNearestRestaurant() {
    if (!this.restaurants.location.coordinates) return null;
    // Default to Espoo Metropolia if no geolocation
    const userLat = 60.2055;
    const userLon = 24.8548;

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371; // Earth's radius in km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };

    let nearest = this.restaurants[0];
    let minDistance = calculateDistance(userLat, userLon, nearest.location.coordinates[0], nearest.location.coordinates[1]);

    for (let i = 1; i < this.restaurants.length; i++) {
      const distance = calculateDistance(
        userLat,
        userLon,
        this.restaurants[i].location.coordinates[0],
        this.restaurants[i].location.coordinates[1]
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearest = this.restaurants[i];
      }
    }

    return nearest;
  },

  /**
   * Check if restaurant is in favorites
   */
  isFavorite(restaurantId) {
    return this.favorites.some(fav => fav.restaurantId === restaurantId || fav.companyId === restaurantId);
  }
};

const UI = {
  renderRestaurants() {
    const listContainer = document.getElementById('list-container');
    listContainer.innerHTML = '';

    const nearest = AppState.getNearestRestaurant();

    AppState.filteredRestaurants.forEach(restaurant => {
      const card = this.createRestaurantCard(restaurant, nearest);
      listContainer.appendChild(card);
    });
  },

  createRestaurantCard(restaurant, nearest) {
    const article = document.createElement('article');
    article.className = 'card restaurant-card';
    if (nearest && restaurant.companyId === nearest.companyId) {
      article.classList.add('highlighted');
    }
    const isFavorite = AppState.isFavorite(restaurant.companyId);

    article.innerHTML = `
      <div class="card-header">
        <h3>${restaurant.name}</h3>
        ${nearest && restaurant.companyId=== nearest.companyId ? '<span class="badge">Nearest</span>' : ''}
      </div>
      <p class="address">${restaurant.address}</p>
      <p class="meta"><strong>${restaurant.company}</strong> • ${restaurant.city}</p>
      <div class="card-actions">
        <a href="menu.html?id=${restaurant.companyId}&view=daily" class="btn-sm">Daily Menu</a>
        <a href="menu.html?id=${restaurant.companyId}&view=weekly" class="btn-sm outline">Weekly</a>
        <button class="btn-fav ${isFavorite ? 'active' : ''}" 
                data-id="${restaurant.companyId}" 
                title="${isFavorite ? 'Remove from favorites' : 'Add to favorites'}">
          ${isFavorite ? '❤️' : '🤍'}
        </button>
      </div>
    `;

    return article;
  },

  updateAuthUI() {
    const loginBtn = document.getElementById('login-nav-btn');
    const registerBtn = document.getElementById('register-nav-btn');
    const profileSection = document.getElementById('profile');
    const displayName = document.getElementById('display-name');
    const displayEmail = document.getElementById('display-email');

    if (AppState.currentUser) {
      if (loginBtn) loginBtn.style.display = 'none';
      if (registerBtn) registerBtn.style.display = 'none';
      
      if (displayName) displayName.value = AppState.currentUser.name || '';
      if (displayEmail) displayEmail.value = AppState.currentUser.email || '';
      
      this.updateFavoritesCount();
    } else {
      if (loginBtn) loginBtn.style.display = 'inline-block';
      if (registerBtn) registerBtn.style.display = 'inline-block';
    }
  },


  updateFavoritesCount() {
    const favCount = document.getElementById('fav-count');
    if (favCount) {
      const count = AppState.favorites.length;
      favCount.textContent = count === 0
        ? 'You have 0 favorites saved.'
        : `You have ${count} favorite restaurant${count !== 1 ? 's' : ''} saved.`;
    }
  },

  showMenuModal(content) {
    const modal = document.getElementById('menu-modal');
    const modalBody = document.getElementById('modal-body');
    
    if (modalBody) {
      modalBody.innerHTML = content;
    }
    
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  },

  closeModal() {
    const modal = document.getElementById('menu-modal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
};


const Events = {
  handleSearch(event) {
    AppState.filters.search = event.target.value;
    AppState.applyFilters();
    UI.renderRestaurants();
  },

  handleCityFilter(event) {
    AppState.filters.city = event.target.value;
    AppState.applyFilters();
    UI.renderRestaurants();
  },

  handlecompanyFilter(event) {
    AppState.filters.company = event.target.value;
    AppState.applyFilters();
    UI.renderRestaurants();
  },

  async handleFavoriteClick(event) {
    if (!event.target.classList.contains('btn-fav')) return;
    if (!AppState.currentUser) {
      alert('Please login to add favorites');
      window.location.href = 'login.html';
      return;
    }

    const restaurantId = parseInt(event.target.dataset.id);
    const isFavorite = AppState.isFavorite(restaurantId);

    try {
      if (isFavorite) {
        await API.removeFavorite(restaurantId);
        AppState.favorites = AppState.favorites.filter(f => f.id !== restaurantId && f.restaurantId !== restaurantId);
      } else {
        await API.addFavorite(restaurantId);
        AppState.favorites.push({ id: restaurantId, restaurantId });
      }
      UI.renderRestaurants();
      UI.updateFavoritesCount();
    } catch (error) {
      console.error('Error updating favorite:', error);
      alert('Failed to update favorite');
    }
  },

  async handleProfileUpdate(event) {
    event.preventDefault();

    if (!AppState.currentUser) {
      alert('Please login to update profile');
      return;
    }

    const displayName = document.getElementById('display-name').value;
    const displayEmail = document.getElementById('display-email').value;

    try {
      const updated = await API.updateUserProfile({
        name: displayName,
        email: displayEmail
      });

      AppState.currentUser = updated;
      localStorage.setItem('user', JSON.stringify(updated));
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  },

  async handleProfilePictureUpload(event) {
    if (!AppState.currentUser) {
      alert('Please login to upload picture');
      return;
    }

    const files = event.target.files;
    if (files.length === 0) return;

    const formData = new FormData();
    formData.append('picture', files[0]);

    try {
      const result = await API.uploadProfilePicture(formData);
      const avatarPlaceholder = document.querySelector('.avatar-placeholder');
      
      if (avatarPlaceholder && result.pictureUrl) {
        avatarPlaceholder.style.backgroundImage = `url('${result.pictureUrl}')`;
      }
      
      alert('Picture uploaded successfully');
    } catch (error) {
      console.error('Error uploading picture:', error);
      alert('Failed to upload picture');
    }
  },

  handleModalClose() {
    UI.closeModal();
  },

  handleModalBackdropClick(event) {
    if (event.target.id === 'menu-modal') {
      UI.closeModal();
    }
  }
};

const MapController = {
  map: null,
  markers: {},

  initMap() {
    // Map is initialized in map.js
    this.map = window.map;

    if (!this.map) {
      console.warn('Map not initialized. Make sure map.js is loaded first.');
      return;
    }

    this.addMarkers();
    this.highlightNearestRestaurant();
  },

  addMarkers() {
    AppState.restaurants.forEach(restaurant => {
      const marker = L.marker([restaurant.latitude, restaurant.longitude])
        .bindPopup(`
          <strong>${restaurant.name}</strong><br>
          ${restaurant.address}<br>
          <a href="menu.html?id=${restaurant.id}&view=daily" target="_blank">View Menu</a>
        `)
        .addTo(this.map);

      this.markers[restaurant.id] = marker;
    });
  },

  highlightNearestRestaurant() {
    const nearest = AppState.getNearestRestaurant();
    if (nearest && this.markers[nearest.id]) {
      const marker = this.markers[nearest.id];
      marker.openPopup();
      this.map.setView([nearest.latitude, nearest.longitude], 13);
    }
  }
};

async function initializeApp() {
  try {
    // Initialize app state
    await AppState.init();

    // Render initial UI
    UI.renderRestaurants();
    UI.updateAuthUI();

    // Initialize map if available
    if (document.getElementById('map')) {
      setTimeout(() => MapController.initMap(), 100);
    }

    // Attach event listeners
    attachEventListeners();

    console.log('App initialized successfully');
  } catch (error) {
    console.error('Error initializing app:', error);
  }
}

function attachEventListeners() {
  // Search and filter listeners
  const searchInput = document.getElementById('restaurant-search');
  if (searchInput) searchInput.addEventListener('input', Events.handleSearch);

  const cityFilter = document.getElementById('city-filter');
  if (cityFilter) cityFilter.addEventListener('change', Events.handleCityFilter);

  const companyFilter = document.getElementById('company-filter');
  if (companyFilter) companyFilter.addEventListener('change', Events.handlecompanyFilter);

  // Restaurant card listeners
  const listContainer = document.getElementById('list-container');
  if (listContainer) {
    listContainer.addEventListener('click', Events.handleFavoriteClick);
  }

  // Profile form listeners
  const profileForm = document.getElementById('update-profile-form');
  if (profileForm) profileForm.addEventListener('submit', Events.handleProfileUpdate);

  const uploadPic = document.getElementById('upload-pic');
  if (uploadPic) uploadPic.addEventListener('change', Events.handleProfilePictureUpload);

  // Modal listeners
  const closeModal = document.querySelector('.close-modal');
  if (closeModal) closeModal.addEventListener('click', Events.handleModalClose);

  const modal = document.getElementById('menu-modal');
  if (modal) modal.addEventListener('click', Events.handleModalBackdropClick);
}

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);

// Export for testing and external use
export { AppState, UI, Events, MapController };
