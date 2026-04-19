import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  onAuthChange,
  signInWithGoogle,
  signInWithEmail,
  firebaseSignOut,
  logAnalyticsEvent,
} from '../firebase.js';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  // Listen to Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthChange((firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
      if (firebaseUser) {
        logAnalyticsEvent('user_authenticated', { uid: firebaseUser.uid });
      }
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = useCallback(async () => {
    setAuthError('');
    const result = await signInWithGoogle();
    if (!result) setAuthError('Google sign-in failed. Please try again.');
    return result;
  }, []);

  const loginWithEmail = useCallback(async (email, password) => {
    setAuthError('');
    try {
      return await signInWithEmail(email, password);
    } catch (e) {
      const msg =
        e.code === 'auth/invalid-credential'
          ? 'Invalid email or password.'
          : e.code === 'auth/user-not-found'
          ? 'No account found with this email.'
          : 'Sign-in failed. Please try again.';
      setAuthError(msg);
      return null;
    }
  }, []);

  const logout = useCallback(async () => {
    await firebaseSignOut();
    logAnalyticsEvent('admin_logout');
  }, []);

  const isAdmin = !!user; // Any authenticated user is treated as admin in this demo

  return (
    <AuthContext.Provider value={{ user, authLoading, authError, isAdmin, loginWithGoogle, loginWithEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
