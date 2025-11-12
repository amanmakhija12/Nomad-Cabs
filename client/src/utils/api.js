import axios from "axios";

// 1. Create the master Axios instance
const api = axios.create({
  // This is the *only* place you need to define your main URL
  // It points to our API Gateway
  baseURL: "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Create the "Interceptor" (This is the most important part)
// This function runs *before* every single request is sent.
api.interceptors.request.use(
  (config) => {
    // Get the token from wherever you store it (e.g., localStorage)
    const token = localStorage.getItem("accessToken");

    if (token) {
      // If the token exists, add it to the 'Authorization' header
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// 3. (Optional but recommended) Add a response interceptor
// This can catch 401 (Unauthorized) errors and automatically log the user out.
api.interceptors.response.use(
  (response) => {
    // Any status code 2xx is a success, just return the response
    return response;
  },
  (error) => {
    // Handle errors
    if (error.response && error.response.status === 401) {
      // This means the JWT is expired or invalid
      console.error("Authentication Error: Token is invalid or expired.");
      // Here you would clear localStorage and redirect to the login page
      // localStorage.removeItem('accessToken');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
