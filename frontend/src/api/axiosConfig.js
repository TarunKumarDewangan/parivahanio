import axios from "axios";

// Create a centralized Axios instance.
// It will read the VITE_API_BASE_URL from your .env.development file
// and use it as the base for all API requests.
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// Use an interceptor to dynamically add the Authorization header to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
