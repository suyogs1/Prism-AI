import axios from 'axios'

/**
 * Axios instance pre-configured for the Prism AI backend.
 * Base URL is proxied via Vite to http://localhost:8000.
 */
const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor — attach JWT when available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('prism_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor — normalise errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.detail || error.message || 'Unknown error'
    return Promise.reject(new Error(message))
  }
)

export default api
