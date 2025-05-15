// src/services/AuthService.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/auth/';

class AuthService {
  // Register a new user
  async register(username, email, password, role = 'viewer') {
    return axios.post(API_URL + 'register/', {
      username,
      email,
      password,
      role
    });
  }

  // Login user and store token
  async login(username, password) {
    const response = await axios.post(API_URL + 'token/', {
      username,
      password
    });
    
    if (response.data.access) {
      localStorage.setItem('user', JSON.stringify(response.data));
      this.setAuthHeader();
    }
    
    return response.data;
  }

  // Logout user and remove token
  logout() {
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  }

  // Get current user token
  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }

  // Set auth token for all requests
  setAuthHeader() {
    const user = this.getCurrentUser();
    if (user && user.access) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.access}`;
    }
  }

  // Check if user is logged in
  isLoggedIn() {
    const user = this.getCurrentUser();
    return !!user && !!user.access;
  }

  // Refresh token
  async refreshToken() {
    const user = this.getCurrentUser();
    if (!user || !user.refresh) {
      return false;
    }

    try {
      const response = await axios.post(API_URL + 'token/refresh/', {
        refresh: user.refresh
      });

      if (response.data.access) {
        user.access = response.data.access;
        localStorage.setItem('user', JSON.stringify(user));
        this.setAuthHeader();
        return true;
      }
    } catch (error) {
      this.logout();
      return false;
    }

    return false;
  }
}

export default new AuthService();