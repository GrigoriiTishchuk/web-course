import API from './api.js';

const AuthForm = {
  /**
   * Handle login form submission
   * @param {Event} event - Form submit event
   */
  async handleLoginSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const usernameInput = form.querySelector('#username');
    const passwordInput = form.querySelector('#password');
    const submitBtn = form.querySelector('button[type="submit"]');
    const username = usernameInput?.value.trim();
    const password = passwordInput?.value;
    
    // Validation
    if (!username || !password) {
      this.showFormError(form, 'Please fill in all fields');
      return;
    }

    try {
      // Show loading state
      this.setLoadingState(submitBtn, true, 'Logging in...');
      this.clearFormError(form);
      // API returns: { message, token, data: { user object } }
      const result = await API.login({ username, password });
      // Extract user from nested "data" field per API docs
      const user = result.data || result.user || result;
      
      // Store auth data
      if (result.token) {
        localStorage.setItem('authToken', result.token);
      }
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }

      // Redirect with success message
      const userName = user?.username || user?.name || username;
      this.showSuccess(`Welcome back, ${userName}!`);
      
      // Redirect to home or previous page
      const returnUrl = new URLSearchParams(window.location.search).get('returnTo') || 'index.html';
      window.location.href = returnUrl;
      
    } catch (error) {
      console.error('Login error:', error);
      this.showFormError(form, error.message || 'Login failed. Please check your credentials.');
    } finally {
      // Restore button state
      this.setLoadingState(submitBtn, false, 'Login');
    }
  },

  /**
   * Handle registration form submission
   * @param {Event} event - Form submit event
   */
  async handleRegisterSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    // Get form values
    const name = form.querySelector('#full-name')?.value.trim();
    const email = form.querySelector('#email')?.value.trim();
    const username = form.querySelector('#username')?.value.trim();
    const password = form.querySelector('#password')?.value;
    const confirmPassword = form.querySelector('#confirm-password')?.value;

    // Validation
    if (!name || !email || !username || !password || !confirmPassword) {
      this.showFormError(form, 'Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      this.showFormError(form, 'Passwords do not match');
      return;
    }
    if (password.length < 6) {
      this.showFormError(form, 'Password must be at least 6 characters');
      return;
    }
    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.showFormError(form, 'Please enter a valid email address');
      return;
    }

    try {
      // Show loading state
      this.setLoadingState(submitBtn, true, 'Creating account...');
      this.clearFormError(form);

      // API expects: { username, password, email }
      const result = await API.register({
        username,
        password,
        email
      });

      // Show activation URL if backend provides one
      if (result.activationUrl) {
        this.showSuccess(
          `Account created! Please check your email or visit:\n\n${result.activationUrl}`,
          true // Allow newlines
        );
      } else {
        this.showSuccess('Registration successful! Please login with your credentials.');
      }

      // Redirect to login after short delay
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 2000);
      
    } catch (error) {
      console.error('Registration error:', error);
      this.showFormError(form, error.message || 'Registration failed. Please try again.');
    } finally {
      // Restore button state
      this.setLoadingState(submitBtn, false, 'Register');
    }
  },

  /**
   * Show error message in form
   * @param {HTMLFormElement} form 
   * @param {string} message 
   */
  showFormError(form, message) {
    // Remove existing error
    const existingError = form.querySelector('.form-error');
    if (existingError) existingError.remove();
    
    // Create and insert error element
    const errorEl = document.createElement('p');
    errorEl.className = 'form-error';
    errorEl.style.color = '#dc3545';
    errorEl.style.margin = '8px 0';
    errorEl.style.fontSize = '0.9rem';
    errorEl.textContent = message;
    
    // Insert before submit button
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn?.parentNode) {
      submitBtn.parentNode.insertBefore(errorEl, submitBtn);
    }
    
    // Auto-clear after 5 seconds
    setTimeout(() => errorEl.remove(), 5000);
  },

  /**
   * Clear form errors
   * @param {HTMLFormElement} form 
   */
  clearFormError(form) {
    const error = form.querySelector('.form-error');
    if (error) error.remove();
  },

  /**
   * Show success message (alert or custom UI)
   * @param {string} message 
   * @param {boolean} allowNewlines 
   */
  showSuccess(message, allowNewlines = false) {
    // Option 1: Simple alert (replace with custom modal for production)
    if (allowNewlines) {
      alert(message);
    } else {
      alert('✅ ' + message);
    }
  },

  /**
   * Set loading state on button
   * @param {HTMLButtonElement} btn 
   * @param {boolean} loading 
   * @param {string} loadingText 
   */
  setLoadingState(btn, loading, loadingText) {
    if (!btn) return;
    if (loading) {
      btn.disabled = true;
      btn.dataset.originalText = btn.textContent;
      btn.textContent = loadingText;
      btn.style.opacity = '0.7';
      btn.style.cursor = 'wait';
    } else {
      btn.disabled = false;
      btn.textContent = btn.dataset.originalText || loadingText;
      btn.style.opacity = '1';
      btn.style.cursor = 'pointer';
    }
  },

  /**
   * Check username availability in real-time (optional enhancement)
   * @param {string} username 
   * @returns {Promise<boolean>}
   */
  async checkUsernameAvailability(username) {
    if (!username || username.length < 3) return false;
    
    try {
      return await API.checkUsernameAvailability(username);
    } catch {
      return false; // Fail silently, assume available
    }
  }
};

// ============ INITIALIZATION ============
document.addEventListener('DOMContentLoaded', () => {
  // Login form
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => AuthForm.handleLoginSubmit(e));
    
    // Optional: Add "show password" toggle
    const togglePassword = loginForm.querySelector('.toggle-password');
    if (togglePassword) {
      togglePassword.addEventListener('click', (e) => {
        e.preventDefault();
        const passwordInput = loginForm.querySelector('#password');
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        togglePassword.textContent = type === 'password' ? '👁️' : '🙈';
      });
    }
  }

  // Register form
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => AuthForm.handleRegisterSubmit(e));
    // Real-time username availability check
    const usernameInput = registerForm.querySelector('#username');
    const availabilityHint = document.createElement('small');
    availabilityHint.id = 'username-availability';
    availabilityHint.style.display = 'block';
    availabilityHint.style.marginTop = '4px';
    
    if (usernameInput) {
      usernameInput.parentNode?.insertBefore(availabilityHint, usernameInput.nextSibling);
      
      let debounceTimer;
      usernameInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        const username = e.target.value.trim();
        
        if (username.length >= 3) {
          availabilityHint.textContent = 'Checking...';
          availabilityHint.style.color = '#6c757d';
          
          debounceTimer = setTimeout(async () => {
            try {
              const available = await AuthForm.checkUsernameAvailability(username);
              availabilityHint.textContent = available 
                ? 'Username available' 
                : 'Username already taken';
              availabilityHint.style.color = available ? '#198754' : '#dc3545';
            } catch {
              availabilityHint.textContent = '';
            }
          }, 300);
        } else {
          availabilityHint.textContent = '';
        }
      });
    }
  }

  // Auto-redirect if already logged in (on login/register pages)
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const authToken = localStorage.getItem('authToken');
  
  if (currentUser && authToken && (loginForm || registerForm)) {
    // User is already logged in, redirect to home
    window.location.href = 'index.html';
  }
});

export default AuthForm;