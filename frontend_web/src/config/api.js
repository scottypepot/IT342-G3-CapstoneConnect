const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '');
const AUTH_URL = `${API_URL}/oauth2/authorization/microsoft`;
const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173';

export { API_URL, AUTH_URL, FRONTEND_URL };