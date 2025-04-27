const isDevelopment = import.meta.env.MODE === 'development';

const config = {
  // Base URLs
  API_BASE_URL: isDevelopment ? 'http://localhost:8080' : import.meta.env.VITE_API_URL,
  FRONTEND_URL: isDevelopment ? 'http://localhost:5173' : import.meta.env.VITE_FRONTEND_URL,

  // Auth endpoints
  AUTH: {
    MICROSOFT_LOGIN: '/oauth2/authorization/microsoft',
    LOGOUT: '/api/auth/logout',
    USER: '/api/auth/user',
  },

  // User endpoints
  USER: {
    PROFILE: (userId) => `/api/users/${userId}/profile`,
    POTENTIAL_MATCHES: (userId) => `/api/users/${userId}/potential-matches`,
    MATCHES: (userId) => `/api/users/${userId}/matches`,
    FIRST_TIME: (userId) => `/api/users/${userId}/first-time`,
  },

  // Match endpoints
  MATCH: {
    MESSAGES: (matchId, userId) => `/api/matches/${matchId}/messages?userId=${userId}`,
    STATUS: (matchId) => `/api/matches/${matchId}/status`,
    DELETE: (matchId) => `/api/matches/${matchId}`,
    ATTACHMENTS: (matchId) => `/api/matches/${matchId}/attachments`,
  },

  // Upload endpoints
  UPLOAD: {
    PROFILE_PICTURE: '/api/upload-profile-picture',
  },

  getFullUrl: function(endpoint) {
    return `${this.API_BASE_URL}${endpoint}`;
  }
};

export default config; 