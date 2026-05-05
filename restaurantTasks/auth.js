import API from './api.js';

const AuthForm = {
  async handleLoginSubmit(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const result = await API.login({ username, password });
      
      // Store user data
      localStorage.setItem('user', JSON.stringify(result.user));
      if (result.token) {
        localStorage.setItem('authToken', result.token);
      }

      alert('Login successful!');
      window.location.href = 'index.html';
    } catch (error) {
      alert(`Login failed: ${error.message}`);
    }
  },

  async handleRegisterSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('full-name').value;
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Validation
    if (!name || !email || !username || !password || !confirmPassword) {
      alert('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    try {
      const result = await API.register({
        name,
        email,
        username,
        password
      });

      alert('Registration successful! Please login.');
      window.location.href = 'login.html';
    } catch (error) {
      alert(`Registration failed: ${error.message}`);
    }
  }
};

// Initialize auth forms on page load
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', AuthForm.handleLoginSubmit);
  }

  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', AuthForm.handleRegisterSubmit);
  }
});

export default AuthForm;
