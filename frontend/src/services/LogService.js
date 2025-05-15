// src/services/LogService.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/logs/';

class LogService {
  constructor() {
    // Set up request interceptor for handling token expiration
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // If error is due to expired token and we haven't tried refreshing yet
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          // Import here to avoid circular dependency
          const AuthService = await import('./AuthService').then(module => module.default);
          
          const refreshSuccess = await AuthService.refreshToken();
          if (refreshSuccess) {
            return axios(originalRequest);
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  // Get all logs with optional filtering
  async getLogs(threatLevel = 'All', searchTerm = '') {
    let url = API_URL;
    const params = new URLSearchParams();
    
    if (threatLevel && threatLevel !== 'All') {
      params.append('threat_level', threatLevel);
    }
    
    if (searchTerm) {
      params.append('search', searchTerm);
    }
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    return axios.get(url);
  }

  // Create a new log
  async createLog(sourceIp, content) {
    return axios.post(API_URL, {
      source_ip: sourceIp,
      content
    });
  }

  // Trigger a response for a specific log
  async triggerResponse(logId) {
    return axios.post(`${API_URL}${logId}/respond/`);
  }
}

export default new LogService();