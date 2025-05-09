const isDevelopment = import.meta.env.MODE === 'development';

const env = {
  API_URL: isDevelopment ? 'http://localhost:8080' : import.meta.env.VITE_API_URL,
  FRONTEND_URL: isDevelopment ? 'http://localhost:5173' : import.meta.env.VITE_FRONTEND_URL,
  MICROSOFT_CLIENT_ID: import.meta.env.VITE_MICROSOFT_CLIENT_ID,
  AUTH_ENDPOINTS: {
    MICROSOFT_LOGIN: '/oauth2/authorization/microsoft',
    LOGOUT: '/api/auth/logout',
    USER: '/api/auth/user'
  },
  API_ENDPOINTS: {
    PROFILE: (userId) => `/api/users/${userId}/profile`,
    MATCHES: (userId) => `/api/users/${userId}/matches`,
    MESSAGES: (matchId, userId) => `/api/matches/${matchId}/messages?userId=${userId}`,
    UPLOAD_PROFILE: '/api/upload-profile-picture',
    FIRST_TIME: (userId) => `/api/users/${userId}/first-time`,
    MATCH_STATUS: (matchId) => `/api/matches/${matchId}/status`,
    ATTACHMENTS: (matchId) => `/api/matches/${matchId}/attachments`
  }
};

export default env; 