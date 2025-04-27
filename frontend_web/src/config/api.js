const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const AUTH_URL = `${API_URL}/oauth2/authorization/microsoft`;

export { API_URL, AUTH_URL }; 