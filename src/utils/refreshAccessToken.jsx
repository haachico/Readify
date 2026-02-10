// refreshToken.js - Create this as a separate utility file
export const refreshAccessToken = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/refresh-token`, {
      method: 'POST',
      credentials: 'include', // This sends cookies automatically
    });
    const result = await response.json();
    
    if (response.ok && result.encodedToken) {
      // Also store in context if you're using it
      localStorage.setItem('token', result.encodedToken);
      return result.encodedToken;
    } else {
      localStorage.removeItem('token');
      return null;
    }
  } catch (error) {
    console.error('Refresh token failed:', error);
    localStorage.removeItem('token');
    return null;
  }
};