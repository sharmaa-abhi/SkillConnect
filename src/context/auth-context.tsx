'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '@/types/auth';
import {
  getActiveUser,
  setActiveUser,
  switchDemoRole,
  defaultCustomerUser,
  defaultWorkerUser,
  defaultAdminUser,
} from '@/lib/demo-storage';

interface AuthContextType {
  user: UserProfile;
  role: UserRole;
  isAuthenticated: boolean;
  switchRole: (newRole: UserRole) => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
  login: (email: string, role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<UserProfile>(defaultCustomerUser);

  // Sync initial user from localStorage on mount
  useEffect(() => {
    const saved = getActiveUser();
    setUserState(saved);

    const handleStorageChange = () => {
      setUserState(getActiveUser());
    };

    window.addEventListener('skillconnect-storage-change', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('skillconnect-storage-change', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const switchRole = (newRole: UserRole) => {
    const updated = switchDemoRole(newRole);
    setUserState(updated);
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    const merged: UserProfile = { ...user, ...updated };
    setActiveUser(merged);
    setUserState(merged);
  };

  const login = (email: string, role: UserRole) => {
    let base = defaultCustomerUser;
    if (role === 'worker') base = defaultWorkerUser;
    if (role === 'admin') base = defaultAdminUser;

    const loggedUser: UserProfile = {
      ...base,
      email,
      role,
    };
    setActiveUser(loggedUser);
    setUserState(loggedUser);
  };

  const logout = () => {
    // Reset to demo customer
    setActiveUser(defaultCustomerUser);
    setUserState(defaultCustomerUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user.role,
        isAuthenticated: Boolean(user),
        switchRole,
        updateProfile,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
