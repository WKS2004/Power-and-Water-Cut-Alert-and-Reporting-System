import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

/**
 * Auth Context
 * Provides authentication state and helpers to the entire React app.
 * Decodes and restores JWT session from localStorage on mount.
 */
const AuthContext = createContext(null);

/**
 * Decode JWT payload without verification (client-side only, for display purposes)
 */
function decodeJwt(token) {
  try {
    const base64Payload = token.split('.')[1];
    const payload = atob(base64Payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('token');
    if (stored) {
      const decoded = decodeJwt(stored);
      // Verify token hasn't expired
      if (decoded && decoded.exp * 1000 > Date.now()) {
        return {
          id: decoded.id,
          username: decoded.username,
          role: decoded.role,
          area: decoded.area || null,
        };
      }
      // Expired — clear it
      localStorage.removeItem('token');
      return null;
    }
    return null;
  });

  /**
   * Called after a successful login or register API response.
   * Stores the token and hydrates user state from the JWT payload.
   */
  const login = useCallback((jwtToken, userData) => {
    localStorage.setItem('token', jwtToken);
    setToken(jwtToken);
    setUser(userData || decodeJwt(jwtToken));
  }, []);

  /**
   * Clears auth state and removes token from storage.
   */
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);

  /** True if the user is authenticated */
  const isAuthenticated = !!user;

  /** True if the authenticated user is an admin */
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to consume auth context — throws if used outside AuthProvider
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

export default AuthContext;
