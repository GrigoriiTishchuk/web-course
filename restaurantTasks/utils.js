/**
 * Utility Functions for StudentDiscountFOOD
 * Common helper functions used throughout the application
 */

export const Utils = {
  /**
   * Debounce function - prevents function from being called too often
   * Usage: const debouncedSearch = debounce(handleSearch, 300);
   */
  debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Throttle function - limits function calls
   */
  throttle(func, limit = 1000) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  /**
   * Format currency value
   */
  formatCurrency(value, currency = 'EUR') {
    const formatter = new Intl.NumberFormat('fi-FI', {
      style: 'currency',
      currency: currency
    });
    return formatter.format(value);
  },

  /**
   * Format date
   */
  formatDate(date, locale = 'fi-FI') {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Intl.DateTimeFormat(locale, options).format(new Date(date));
  },

  /**
   * Calculate distance between two coordinates (Haversine formula)
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 100) / 100; // Round to 2 decimals
  },

  /**
   * Validate email format
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate username format
   */
  isValidUsername(username) {
    return username.length >= 3 && username.length <= 32 && /^[a-zA-Z0-9_-]+$/.test(username);
  },

  /**
   * Validate password strength
   */
  validatePassword(password) {
    return {
      isValid: password.length >= 6,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumbers: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*]/.test(password),
      length: password.length
    };
  },

  /**
   * Safe JSON parse with fallback
   */
  safeJsonParse(json, fallback = null) {
    try {
      return JSON.parse(json);
    } catch (error) {
      console.error('JSON parse error:', error);
      return fallback;
    }
  },

  /**
   * Local storage management with expiration
   */
  storage: {
    set(key, value, expiresInMinutes = null) {
      const data = {
        value,
        timestamp: Date.now(),
        expiresIn: expiresInMinutes ? expiresInMinutes * 60000 : null
      };
      localStorage.setItem(key, JSON.stringify(data));
    },

    get(key) {
      const item = localStorage.getItem(key);
      if (!item) return null;

      const data = Utils.safeJsonParse(item);
      if (!data) return null;

      // Check if expired
      if (data.expiresIn && Date.now() - data.timestamp > data.expiresIn) {
        localStorage.removeItem(key);
        return null;
      }

      return data.value;
    },

    remove(key) {
      localStorage.removeItem(key);
    },

    clear() {
      localStorage.clear();
    }
  },

  /**
   * Session storage helpers
   */
  session: {
    set(key, value) {
      sessionStorage.setItem(key, JSON.stringify(value));
    },

    get(key) {
      const item = sessionStorage.getItem(key);
      return Utils.safeJsonParse(item);
    },

    remove(key) {
      sessionStorage.removeItem(key);
    }
  },

  dom: {
    /**
     * Get element by ID with error handling
     */
    getElementById(id) {
      const element = document.getElementById(id);
      if (!element) {
        console.warn(`Element with ID '${id}' not found`);
      }
      return element;
    },

    /**
     * Toggle class on element
     */
    toggleClass(element, className) {
      if (element) {
        element.classList.toggle(className);
      }
    },

    /**
     * Add class to element
     */
    addClass(element, className) {
      if (element) {
        element.classList.add(className);
      }
    },

    /**
     * Remove class from element
     */
    removeClass(element, className) {
      if (element) {
        element.classList.remove(className);
      }
    },

    /**
     * Check if element has class
     */
    hasClass(element, className) {
      return element && element.classList.contains(className);
    },

    /**
     * Set multiple attributes at once
     */
    setAttributes(element, attributes) {
      if (element) {
        Object.keys(attributes).forEach(key => {
          element.setAttribute(key, attributes[key]);
        });
      }
    },

    /**
     * Clear element content
     */
    clear(element) {
      if (element) {
        element.innerHTML = '';
      }
    },

    /**
     * Show element
     */
    show(element) {
      if (element) {
        element.style.display = '';
      }
    },

    /**
     * Hide element
     */
    hide(element) {
      if (element) {
        element.style.display = 'none';
      }
    }
  },

  /**
   * String utilities
   */
  string: {
    /**
     * Capitalize first letter
     */
    capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },

    /**
     * Truncate string to specified length
     */
    truncate(str, length = 50) {
      return str.length > length ? str.substring(0, length) + '...' : str;
    },

    /**
     * Convert camelCase to Title Case
     */
    toTitleCase(str) {
      return str
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (char) => char.toUpperCase())
        .trim();
    },

    /**
     * Remove special characters
     */
    sanitize(str) {
      return str.replace(/[<>\"'&]/g, (char) => {
        const entities = {
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;',
          '&': '&amp;'
        };
        return entities[char];
      });
    }
  },

  /**
   * Array utilities
   */
  array: {
    /**
     * Get unique values from array
     */
    unique(arr) {
      return [...new Set(arr)];
    },

    /**
     * Remove duplicates from array of objects
     */
    uniqueByProperty(arr, property) {
      const seen = new Set();
      return arr.filter(item => {
        const value = item[property];
        if (seen.has(value)) return false;
        seen.add(value);
        return true;
      });
    },

    /**
     * Flatten nested array
     */
    flatten(arr) {
      return arr.reduce((flat, item) => {
        return flat.concat(Array.isArray(item) ? this.flatten(item) : item);
      }, []);
    },

    /**
     * Chunk array into smaller arrays
     */
    chunk(arr, size) {
      const chunks = [];
      for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
      }
      return chunks;
    }
  },

  /**
   * Error handling
   */
  error: {
    /**
     * Handle API errors
     */
    handleApiError(error) {
      if (error instanceof TypeError) {
        return 'Network error - please check your connection';
      }
      if (error.response?.status === 401) {
        return 'Unauthorized - please login again';
      }
      if (error.response?.status === 403) {
        return 'Forbidden - you do not have permission';
      }
      if (error.response?.status === 404) {
        return 'Resource not found';
      }
      if (error.response?.status === 500) {
        return 'Server error - please try again later';
      }
      return error.message || 'An error occurred';
    },

    /**
     * Log error with context
     */
    logError(context, error) {
      console.error(`[${context}] Error:`, {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
    }
  }
};

export default Utils;
