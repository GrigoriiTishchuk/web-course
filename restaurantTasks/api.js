const API = {
  // API endpoints - Update these to match your actual API
  BASE_URL: 'https://your-api-endpoint.com/api',
  
  async getRestaurants() {
    try {
      const response = await fetch(`${this.BASE_URL}/restaurants`);
      if (!response.ok) throw new Error('Failed to fetch restaurants');
      return await response.json();
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      return this.getMockRestaurants(); // Fallback to mock data
    }
  },


  async getDailyMenu(restaurantId) {
    try {
      const response = await fetch(`${this.BASE_URL}/restaurants/${restaurantId}/menu/daily`);
      if (!response.ok) throw new Error('Failed to fetch daily menu');
      return await response.json();
    } catch (error) {
      console.error(`Error fetching daily menu for ${restaurantId}:`, error);
      return { error: 'Could not load menu' };
    }
  },

  async getWeeklyMenu(restaurantId) {
    try {
      const response = await fetch(`${this.BASE_URL}/restaurants/${restaurantId}/menu/weekly`);
      if (!response.ok) throw new Error('Failed to fetch weekly menu');
      return await response.json();
    } catch (error) {
      console.error(`Error fetching weekly menu for ${restaurantId}:`, error);
      return { error: 'Could not load menu' };
    }
  },

  async register(userData) {
    try {
      const response = await fetch(`${this.BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }
      return await response.json();
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  async login(credentials) {
    try {
      const response = await fetch(`${this.BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }
      const data = await response.json();
      // Store token if provided
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },


  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },


  async getUserProfile() {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return null;
      
      const response = await fetch(`${this.BASE_URL}/auth/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch profile');
      return await response.json();
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  },


  async updateUserProfile(userData) {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${this.BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });
      if (!response.ok) throw new Error('Failed to update profile');
      return await response.json();
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },


  async uploadProfilePicture(formData) {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${this.BASE_URL}/auth/profile/picture`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (!response.ok) throw new Error('Failed to upload picture');
      return await response.json();
    } catch (error) {
      console.error('Error uploading picture:', error);
      throw error;
    }
  },

 
  async getFavorites() {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return [];
      
      const response = await fetch(`${this.BASE_URL}/favorites`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error('Error fetching favorites:', error);
      return [];
    }
  },


  async addFavorite(restaurantId) {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${this.BASE_URL}/favorites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ restaurantId })
      });
      if (!response.ok) throw new Error('Failed to add favorite');
      return await response.json();
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw error;
    }
  },

  async removeFavorite(restaurantId) {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${this.BASE_URL}/favorites/${restaurantId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to remove favorite');
      return await response.json();
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw error;
    }
  },

  getMockRestaurants() {
    return [
      {
        id: 1,
        name: 'Metropolia Karamalmi',
        address: 'Karaportti 2, 02610 Espoo',
        city: 'Espoo',
        provider: 'Sodexo',
        latitude: 60.2055,
        longitude: 24.8548,
        phone: '+358 9 8707 1'
      },
      {
        id: 2,
        name: 'Sodexo Valimo',
        address: 'Valimotie 8, 00380 Helsinki',
        city: 'Helsinki',
        provider: 'Sodexo',
        latitude: 60.1627,
        longitude: 24.9633,
        phone: '+358 9 4763 8000'
      },
      {
        id: 3,
        name: 'Compass Meilahti',
        address: 'Haartmaninkatu 1, 00290 Helsinki',
        city: 'Helsinki',
        provider: 'Compass Group',
        latitude: 60.1941,
        longitude: 24.9338,
        phone: '+358 9 4711'
      },
      {
        id: 4,
        name: 'Metropolia Myyrmäki',
        address: 'Metsänneidonkuja 1, 01600 Vantaa',
        city: 'Vantaa',
        provider: 'Sodexo',
        latitude: 60.2540,
        longitude: 25.0387,
        phone: '+358 9 8707 2'
      }
    ];
  }
};

export default API;
