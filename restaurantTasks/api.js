// Helper: Normalize restaurant data from API format to app-friendly format
function normalizeRestaurant(restaurant) {
  const [longitude, latitude] = restaurant.location?.coordinates || [];
  return {
    ...restaurant,
    id: restaurant._id,           // Alias for easier access throughout app
    latitude,                     // Flatten for map/filter usage
    longitude,
  };
}

const API = {
  // API endpoints
  BASE_URL: 'https://media2.edu.metropolia.fi/restaurant/api/v1',
  /**
   * Fetch all restaurants and normalize coordinates
   */
  async getRestaurants() {
    try {
      const response = await fetch(`${this.BASE_URL}/restaurants`);
      if (!response.ok) throw new Error(`Failed to fetch restaurants: ${response.status}`);
      const data = await response.json();
      // Normalize all restaurants for consistent app usage
      return Array.isArray(data) ? data.map(normalizeRestaurant) : [];
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      return this.getMockRestaurants(); // Fallback to mock data
    }
  },

  /**
   * Fetch single restaurant by ID
   * @param {string} id - Restaurant _id from API
   */
  async getRestaurant(id) {
    try {
      const response = await fetch(`${this.BASE_URL}/restaurants/${id}`);
      if (!response.ok) throw new Error(`Failed to fetch restaurant: ${response.status}`);
      const data = await response.json();
      return normalizeRestaurant(data);
    } catch (error) {
      console.error(`Error fetching restaurant ${id}:`, error);
      return null;
    }
  },

  /**
   * Fetch daily menu for a restaurant
   * @param {string} id - Restaurant _id
   * @param {string} lang - Language code ('en' or 'fi')
   */
  async getDailyMenu(id, lang = 'en') {
    try {
      const response = await fetch(`${this.BASE_URL}/restaurants/daily/${id}/${lang}`);
      if (!response.ok) throw new Error(`Failed to fetch daily menu: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching daily menu for ${id}:`, error);
      return { error: 'Could not load daily menu' };
    }
  },

  /**
   * Fetch weekly menu for a restaurant
   * @param {string} id - Restaurant _id
   * @param {string} lang - Language code ('en' or 'fi')
   */
  async getWeeklyMenu(id, lang = 'en') {
    try {
      const response = await fetch(`${this.BASE_URL}/restaurants/weekly/${id}/${lang}`);
      if (!response.ok) throw new Error(`Failed to fetch weekly menu: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching weekly menu for ${id}:`, error);
      return { error: 'Could not load weekly menu' };
    }
  },

  /**
   * Register a new user
   * @param {Object} userData - { username, password, email }
   * @returns {Object} Registration result with activationUrl if applicable
   */
  async register(userData) {
    try {
      const response = await fetch(`${this.BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Registration failed');
      }
      
      return result; // Includes { message, data, activationUrl }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  /**
   * Login user and store auth token + user data
   * @param {Object} credentials - { username, password }
   * @returns {Object} User data from response.data
   */
  async login(credentials) {
    try {
      const response = await fetch(`${this.BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Login failed');
      }
      
      // Store token if provided
      if (result.token) {
        localStorage.setItem('authToken', result.token);
      }
      // Extract and store user data from nested "data" field
      if (result.data) {
        localStorage.setItem('user', JSON.stringify(result.data));
        return result.data;
      }
      
      return result;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * Logout: clear auth data
   */
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  /**
   * Get current user profile using token
   */
  async getUserProfile() {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return null;
      
      const response = await fetch(`${this.BASE_URL}/users/token`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Failed to fetch profile');
      return await response.json();
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  },

  /**
   * Update current user profile
   */
  async updateUserProfile(userData) {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Not authenticated');
      
      const response = await fetch(`${this.BASE_URL}/users`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to update profile');
      }
      // Update local storage with new user data
      if (result.data) {
        localStorage.setItem('user', JSON.stringify(result.data));
      }
      return result.data || result;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  /**
   * Upload avatar image
   */
  async uploadProfilePicture(file) {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Not authenticated');
      
      const formData = new FormData();
      formData.append('avatar', file); 
      const response = await fetch(`${this.BASE_URL}/users/avatar`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || result.message || 'Failed to upload picture');
      }
      
      return result;
    } catch (error) {
      console.error('Error uploading picture:', error);
      throw error;
    }
  },

    isFavoriteRestaurant(restaurantId, user = null) {
    // Use provided user or get from localStorage
    const currentUser = user || JSON.parse(localStorage.getItem('user'));
    if (!currentUser?.favouriteRestaurant) return false;
    // Compare as strings (both _id and favouriteRestaurant are strings)
    return currentUser.favouriteRestaurant.toString() === restaurantId.toString();
 },
    /**
     * Set a restaurant as user's favorite
     * @param {string} restaurantId - Restaurant _id to set as favorite
     */
    async setFavoriteRestaurant(restaurantId) {
      return await this.updateUserProfile({ 
        favouriteRestaurant: restaurantId 
      });
    },

    /**
     * Remove user's favorite restaurant
     */
    async removeFavoriteRestaurant() {
      return await this.updateUserProfile({ 
        favouriteRestaurant: null 
      });
    },

  /**
   * Check if username is available
   * @param {string} username 
   * @returns {Promise<boolean>}
   */
  async checkUsernameAvailability(username) {
    try {
      const response = await fetch(`${this.BASE_URL}/users/available/${encodeURIComponent(username)}`);
      if (!response.ok) return false;
      const data = await response.json();
      return data.available === true;
    } catch (error) {
      console.error('Error checking username:', error);
      return false;
    }
  },

  /**
   * Delete current user account
   */
  async deleteCurrentUser() {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Not authenticated');
      
      const response = await fetch(`${this.BASE_URL}/users`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete account');
      }
      
      // Clear local data on success
      this.logout();
      return result;
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  },

  /**
   * Mock data for development/fallback
   */
  getMockRestaurants() {
    return [
      {
        _id: "mock_6470d38ecb12107db6fe24c1",
        companyId: 68,
        name: 'Metropolia Karamalmi',
        address: 'Karaportti 2, 02610 Espoo',
        postalCode: '02610',
        city: 'Espoo',
        phone: '+358 9 8707 1',
        company: 'Sodexo',
        location: {
          type: "Point",
          coordinates: [24.8548, 60.2055] // [longitude, latitude]
        }
      },
      {
        _id: "mock_6470d38ecb12107db6fe24c2",
        companyId: 1580536,
        name: 'Sodexo Valimo',
        address: 'Valimotie 8, 00380 Helsinki',
        postalCode: '00380',
        city: 'Helsinki',
        phone: '+358 9 4763 8000',
        company: 'Sodexo',
        location: {
          type: "Point",
          coordinates: [24.9633, 60.1627]
        }
      },
      {
        _id: "mock_6470d38ecb12107db6fe24c3",
        companyId: 42,
        name: 'Compass Meilahti',
        address: 'Haartmaninkatu 1, 00290 Helsinki',
        postalCode: '00290',
        city: 'Helsinki',
        phone: '+358 9 4711',
        company: 'Compass Group',
        location: {
          type: "Point",
          coordinates: [24.9338, 60.1941]
        }
      },
      {
        _id: "mock_6470d38ecb12107db6fe24c4",
        companyId: 99,
        name: 'Metropolia Myyrmäki',
        address: 'Metsänneidonkuja 1, 01600 Vantaa',
        postalCode: '01600',
        city: 'Vantaa',
        phone: '+358 9 8707 2',
        company: 'Sodexo',
        location: {
          type: "Point",
          coordinates: [25.0387, 60.2540]
        }
      }
    ].map(normalizeRestaurant); // Applied normalization to mocks too
  }
};

export default API;