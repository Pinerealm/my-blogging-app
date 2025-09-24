import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  // Register a new user
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const formData = new FormData();
    formData.append("username", credentials.email);
    formData.append("password", credentials.password);

    const response = await api.post("/auth/jwt/login", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await api.post("/auth/jwt/logout");
    return response.data;
  },

  // Get current user profile
  getProfile: async () => {
    const response = await api.get("/users/me");
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await api.put("/users/me", userData);
    return response.data;
  },

  // Get public user profile by username
  getUserByUsername: async (username) => {
    const response = await api.get(`/users/${username}`);
    return response.data;
  },

  // Get user's posts
  getUserPosts: async (username, skip = 0, limit = 10) => {
    const response = await api.get(
      `/users/${username}/posts?skip=${skip}&limit=${limit}`
    );
    return response.data;
  },

  // Get user statistics
  getUserStats: async (username) => {
    const response = await api.get(`/users/${username}/stats`);
    return response.data;
  },
};

export default api;
