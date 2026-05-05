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
    // Load user from localStorage
    try {
      const storedUser = localStorage.getItem('user');
      this.currentUser = storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
      console.error('Error parsing stored user:', e);
      this.currentUser = null;
    }
    // Load restaurants and normalize
    this.restaurants = await API.getRestaurants();
    this.filteredRestaurants = [...this.restaurants];
    // Load favorites if authenticated
    if (this.currentUser) {
      this.favorites = await API.getFavorites();
    }
  },

  /**
   * Apply search, city, and company filters to restaurant list
   */
  applyFilters() {
    this.filteredRestaurants = this.restaurants.filter(restaurant => {
      // Search filter (case-insensitive)
      const matchesSearch = !this.filters.search || 
        restaurant.name.toLowerCase().includes(this.filters.search.toLowerCase());
      // City filter
      const matchesCity = !this.filters.city || 
        restaurant.city.toLowerCase() === this.filters.city.toLowerCase();
      // Company filter (case-insensitive, trimmed)
      const matchesCompany = !this.filters.company || 
        restaurant.company?.toLowerCase().trim() === this.filters.company.toLowerCase().trim();
      
      return matchesSearch && matchesCity && matchesCompany;
    });
  },

  /**
   * Find nearest restaurant to user (defaults to Espoo if no geolocation)
   */
  getNearestRestaurant() {
    if (!this.restaurants?.length) return null;
    // Default coordinates (Espoo Metropolia)
    const userLat = 60.2055;
    const userLon = 24.8548;

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371; // Earth's radius in km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat / 2) ** 2 +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon / 2) ** 2;
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };

    let nearest = this.restaurants[0];
    let minDistance = calculateDistance(
      userLat, userLon, 
      nearest.latitude, nearest.longitude
    );

    for (let i = 1; i < this.restaurants.length; i++) {
      const r = this.restaurants[i];
      const distance = calculateDistance(
        userLat, userLon,
        r.latitude, r.longitude
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearest = r;
      }
    }

    return nearest;
  },

  /**
   * Check if a restaurant is in user's favorites
   */
  isFavorite(restaurantId) {
    if (!Array.isArray(this.favorites)) return false;
    return this.favorites.some(fav => 
      fav.restaurantId === restaurantId || 
      fav._id === restaurantId ||
      fav.id === restaurantId
    );
  }
};

const UI = {
  renderRestaurants() {
    const listContainer = document.getElementById('list-container');
    if (!listContainer) return;
    
    listContainer.innerHTML = '';
    
    if (!AppState.filteredRestaurants.length) {
      listContainer.innerHTML = '<p class="no-results">No restaurants match your filters.</p>';
      return;
    }
    
    const nearest = AppState.getNearestRestaurant();
    
    AppState.filteredRestaurants.forEach(restaurant => {
      const card = this.createRestaurantCard(restaurant, nearest);
      listContainer.appendChild(card);
    });
  },

 
  createRestaurantCard(restaurant, nearest) {
    const article = document.createElement('article');
    article.className = 'card restaurant-card';
    article.dataset.id = restaurant._id;
    
    // Highlight nearest restaurant
    if (nearest && restaurant._id === nearest._id) {
      article.classList.add('highlighted');
    }
    
    const isFavorite = AppState.isFavorite(restaurant._id);

    article.innerHTML = `
      <div class="card-header">
        <h3>${this.escapeHtml(restaurant.name)}</h3>
        ${nearest && restaurant._id === nearest._id ? '<span class="badge">Nearest</span>' : ''}
      </div>
      <p class="address">${this.escapeHtml(restaurant.address)}</p>
      <p class="meta">
        <strong>${this.escapeHtml(restaurant.company)}</strong> • 
        ${this.escapeHtml(restaurant.city)}
      </p>
      <div class="card-actions">
        <a href="menu.html?id=${restaurant._id}&view=daily" class="btn-sm">Daily Menu</a>
        <a href="menu.html?id=${restaurant._id}&view=weekly" class="btn-sm outline">Weekly</a>
        <button class="btn-fav ${isFavorite ? 'active' : ''}" 
                data-id="${restaurant._id}" 
                title="${isFavorite ? 'Remove from favorites' : 'Add to favorites'}"
                aria-label="${isFavorite ? 'Remove from favorites' : 'Add to favorites'}">
          ${isFavorite ? '❤️' : '🤍'}
        </button>
      </div>
    `;

    return article;
  },

  populateCompanyFilter() {
    const companyFilter = document.getElementById('company-filter');
    if (!companyFilter) return;
    // Get unique, sorted company names
    const companies = [...new Set(
      AppState.restaurants
        .map(r => r.company)
        .filter(c => c && c.trim())
    )].sort();
    // Build options
    companyFilter.innerHTML = '<option value="">All Companies</option>' + 
      companies.map(company => 
        `<option value="${this.escapeHtml(company)}">${this.escapeHtml(company)}</option>`
      ).join('');
  },

  /**
   * Update UI based on authentication state
   */
  updateAuthUI() {
    const loginBtn = document.getElementById('login-nav-btn');
    const registerBtn = document.getElementById('register-nav-btn');
    const profileSection = document.getElementById('profile');
    const displayName = document.getElementById('display-name');
    const displayEmail = document.getElementById('display-email');
    if (AppState.currentUser) {
      // Hide auth buttons, show profile
      if (loginBtn) loginBtn.style.display = 'none';
      if (registerBtn) registerBtn.style.display = 'none';
      if (profileSection) profileSection.style.display = 'block';
      // Fill profile form
      if (displayName) displayName.value = AppState.currentUser.username || AppState.currentUser.name || '';
      if (displayEmail) displayEmail.value = AppState.currentUser.email || '';
      this.updateFavoritesCount();
    } else {
      // Show auth buttons, hide profile
      if (loginBtn) loginBtn.style.display = 'inline-block';
      if (registerBtn) registerBtn.style.display = 'inline-block';
      if (profileSection) profileSection.style.display = 'none';
    }
  },

  updateFavoritesCount() {
    const favCount = document.getElementById('fav-count');
    if (favCount) {
      const count = AppState.favorites?.length || 0;
      favCount.textContent = count === 0
        ? 'You have 0 favorites saved.'
        : `You have ${count} favorite restaurant${count !== 1 ? 's' : ''} saved.`;
    }
  },

  showMenuModal(content) {
    const modal = document.getElementById('menu-modal');
    const modalBody = document.getElementById('modal-body');
    
    if (modalBody) modalBody.innerHTML = content;
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
  },

  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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
  handleCompanyFilter(event) {
    AppState.filters.company = event.target.value;
    AppState.applyFilters();
    UI.renderRestaurants();
  },

  async handleFavoriteClick(event) {
    const btn = event.target.closest('.btn-fav');
    if (!btn) return;
    
    if (!AppState.currentUser) {
      alert('Please login to add favorites');
      window.location.href = 'login.html';
      return;
    }

    const restaurantId = btn.dataset.id;
    const isFavorite = AppState.isFavorite(restaurantId);

    try {
      if (isFavorite) {
        await API.removeFavorite(restaurantId);
        AppState.favorites = AppState.favorites.filter(f => 
          f.restaurantId !== restaurantId && 
          f._id !== restaurantId &&
          f.id !== restaurantId
        );
      } else {
        await API.addFavorite(restaurantId);
        AppState.favorites.push({ restaurantId, _id: restaurantId, id: restaurantId });
      }
      
      UI.renderRestaurants();
      UI.updateFavoritesCount();
    } catch (error) {
      console.error('Error updating favorite:', error);
      alert('Failed to update favorite. Please try again.');
    }
  },

  async handleProfileUpdate(event) {
    event.preventDefault();

    if (!AppState.currentUser) {
      alert('Please login to update profile');
      return;
    }

    const displayName = document.getElementById('display-name')?.value;
    const displayEmail = document.getElementById('display-email')?.value;
    try {
      const updated = await API.updateUserProfile({
        username: displayName,
        email: displayEmail
      });
      // Update local state
      AppState.currentUser = updated;
      localStorage.setItem('user', JSON.stringify(updated));
      
      alert('Profile updated successfully');
      UI.updateAuthUI();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(error.message || 'Failed to update profile');
    }
  },

  async handleProfilePictureUpload(event) {
    if (!AppState.currentUser) {
      alert('Please login to upload picture');
      return;
    }
    const files = event.target.files;
    if (!files?.length) return;
    const file = files[0];
    // Basic validation
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('Image must be smaller than 5MB');
      return;
    }
    try {
      // Show loading state
      const uploadBtn = event.target.closest('label');
      if (uploadBtn) {
        uploadBtn.style.opacity = '0.6';
        uploadBtn.style.pointerEvents = 'none';
      }

      const result = await API.uploadProfilePicture(file);
      
      // Update avatar display if result contains avatar info
      if (result?.data?.avatar) {
        const avatarPlaceholder = document.querySelector('.avatar-placeholder');
        if (avatarPlaceholder) {
          // Assuming avatar is served from /uploads/
          const avatarUrl = `https://media2.edu.metropolia.fi/restaurant/uploads/${result.data.avatar}`;
          avatarPlaceholder.style.backgroundImage = `url('${avatarUrl}')`;
        }
        // Update local user data
        AppState.currentUser.avatar = result.data.avatar;
        localStorage.setItem('user', JSON.stringify(AppState.currentUser));
      }
      
      alert('Picture uploaded successfully');
    } catch (error) {
      console.error('Error uploading picture:', error);
      alert(error.message || 'Failed to upload picture');
    } finally {
      // Restore button state
      const uploadBtn = event.target.closest('label');
      if (uploadBtn) {
        uploadBtn.style.opacity = '1';
        uploadBtn.style.pointerEvents = 'auto';
      }
    }
  },

  handleModalClose() {
    UI.closeModal();
  },

  handleModalBackdropClick(event) {
    if (event.target.id === 'menu-modal') {
      UI.closeModal();
    }
  },

  async handleRegister(event) {
    event.preventDefault();
    const form = event.target;
    const username = form.querySelector('[name="username"]')?.value;
    const password = form.querySelector('[name="password"]')?.value;
    const email = form.querySelector('[name="email"]')?.value;
    if (!username || !password || !email) {
      alert('Please fill in all fields');
      return;
    }

    try {
      // Show loading state
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Creating account...';
      }

      const result = await API.register({ username, password, email });
      
      //Show activation URL if provided
      if (result.activationUrl) {
        alert(`Account created! Please check your email or visit:\n\n${result.activationUrl}`);
      } else {
        alert('Account created successfully! You can now log in.');
      }
      
      // Redirect to login or clear form
      form.reset();
      window.location.href = 'login.html';
      
    } catch (error) {
      console.error('Registration error:', error);
      alert(error.message || 'Registration failed. Please try again.');
    } finally {
      // Restore button
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Register';
      }
    }
  },

  async handleLogin(event) {
    event.preventDefault();
    const form = event.target;
    const username = form.querySelector('[name="username"]')?.value;
    const password = form.querySelector('[name="password"]')?.value;
    if (!username || !password) {
      alert('Please enter username and password');
      return;
    }

    try {
      // Show loading state
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Logging in...';
      }
      const user = await API.login({ username, password });
      // Update app state and UI
      AppState.currentUser = user;
      UI.updateAuthUI();
      // Redirect to home or show success
      alert(`Welcome back, ${user.username || user.name}!`);
      window.location.href = 'index.html';
      
    } catch (error) {
      console.error('Login error:', error);
      alert(error.message || 'Login failed. Please check your credentials.');
    } finally {
      // Restore button
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Login';
      }
    }
  },

  handleLogout() {
    API.logout();
    AppState.currentUser = null;
    AppState.favorites = [];
    UI.updateAuthUI();
    UI.renderRestaurants();
    alert('Logged out successfully');
    window.location.href = 'index.html';
  }
};

const MapController = {
  map: null,
  markers: {},

  initMap() {
    this.map = window.map;
    if (!this.map) {
      console.warn('Map not initialized. Ensure map.js loads first and sets window.map');
      return;
    }

    this.addMarkers();
    this.highlightNearestRestaurant();
  },

  addMarkers() {
    if (!AppState.restaurants?.length) return;
    AppState.restaurants.forEach(restaurant => {
      // Skip if coordinates are invalid
      if (!restaurant.latitude || !restaurant.longitude) return;
      const marker = L.marker([restaurant.latitude, restaurant.longitude])
        .bindPopup(`
          <strong>${UI.escapeHtml(restaurant.name)}</strong><br>
          ${UI.escapeHtml(restaurant.address)}<br>
          <small>${UI.escapeHtml(restaurant.company)} • ${UI.escapeHtml(restaurant.city)}</small><br>
          <a href="menu.html?id=${restaurant._id}&view=daily" target="_blank" style="margin-top:8px;display:inline-block">View Menu</a>
        `)
        .addTo(this.map);

      this.markers[restaurant._id] = marker;
    });
  },

  highlightNearestRestaurant() {
    const nearest = AppState.getNearestRestaurant();
    if (nearest && this.markers[nearest._id]) {
      const marker = this.markers[nearest._id];
      marker.openPopup();
      this.map.setView([nearest.latitude, nearest.longitude], 13);
    }
  },

  clearMarkers() {
    Object.values(this.markers).forEach(marker => this.map.removeLayer(marker));
    this.markers = {};
  }
};


async function initializeApp() {
  try {
    await AppState.init();
    // Render initial UI
    UI.renderRestaurants();
    UI.updateAuthUI();
    UI.populateCompanyFilter(); // Populate company filter after data loads
    // Initialize map if container exists
    if (document.getElementById('map')) {
      // Small delay to ensure map.js has initialized
      setTimeout(() => MapController.initMap(), 100);
    }
    // Attach event listeners
    attachEventListeners();

    console.log(' App initialized successfully');
  } catch (error) {
    console.error(' Error initializing app:', error);
    // Show user-friendly error
    const listContainer = document.getElementById('list-container');
    if (listContainer) {
      listContainer.innerHTML = '<p class="error">Failed to load restaurants. Please refresh the page.</p>';
    }
  }
}

function attachEventListeners() {
  // Search and filter listeners
  const searchInput = document.getElementById('restaurant-search');
  if (searchInput) searchInput.addEventListener('input', Events.handleSearch);
  const cityFilter = document.getElementById('city-filter');
  if (cityFilter) cityFilter.addEventListener('change', Events.handleCityFilter);
  // (PascalCase)
  const companyFilter = document.getElementById('company-filter');
  if (companyFilter) companyFilter.addEventListener('change', Events.handleCompanyFilter);
  // Restaurant card listeners (event delegation)
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
  // Auth form listeners (if on login/register pages)
  const registerForm = document.getElementById('register-form');
  if (registerForm) registerForm.addEventListener('submit', Events.handleRegister);
  const loginForm = document.getElementById('login-form');
  if (loginForm) loginForm.addEventListener('submit', Events.handleLogin);
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) logoutBtn.addEventListener('click', Events.handleLogout);
}
document.addEventListener('DOMContentLoaded', initializeApp);
// Export for testing and external use
export { AppState, UI, Events, MapController };