import React, { createContext, useContext, useState, useCallback } from 'react';
import { LS_USER, LS_DRIVE_TOKEN } from '../constants';

const AuthContext = createContext();

const loadUser = () => {
  try {
    const raw = localStorage.getItem(LS_USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(loadUser);
  const [driveToken, setDriveToken] = useState(() => localStorage.getItem(LS_DRIVE_TOKEN) || null);

  const login = useCallback((userData, token) => {
    setUser(userData);
    setDriveToken(token);
    localStorage.setItem(LS_USER, JSON.stringify(userData));
    localStorage.setItem(LS_DRIVE_TOKEN, token);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setDriveToken(null);
    localStorage.removeItem(LS_USER);
    localStorage.removeItem(LS_DRIVE_TOKEN);
  }, []);

  const isLoggedIn = Boolean(user && driveToken);

  return (
    <AuthContext.Provider value={{ user, driveToken, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
