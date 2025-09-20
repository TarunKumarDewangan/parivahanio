// import axios from "axios";

// const apiClient = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL,
//   withCredentials: true,
// });

// export default apiClient;

import axios from "axios";

const apiClient = axios.create({
  // ✅ FINAL FIX: Add the '/api' prefix to the base URL
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
  withCredentials: true,
});

export default apiClient;
