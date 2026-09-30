import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SignupForm } from './components/SignupForm';
import { HeroSection } from './components/HeroSection';
import { AdminPortal } from './components/AdminPortal';
import { RegisteredUser } from './types';

const CLIENT_ADMIN_EMAIL = 'web.studio.by.ahmed@gmail.com';
const CLIENT_ADMIN_PASSWORD = 'Apex@2026';

const USER_SESSION_KEY = 'spidey_connect_active_user';
const ADMIN_AUTH_KEY = 'spidey_connect_admin_session';

export default function App() {
  // Requirement 5: Always load root route "/" (Create Account) first, not /admin
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [currentUser, setCurrentUser] = useState<RegisteredUser | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(ADMIN_AUTH_KEY) === 'authorized';
    } catch {
      return false;
    }
  });

  // Safe navigation helper without breaking iframe history
  const navigate = (path: string) => {
    setCurrentPath(path);
    try {
      if (typeof window !== 'undefined' && window.location.pathname !== path) {
        window.history.pushState(null, '', path);
      }
    } catch {
      // Ignore iframe cross-origin history restriction
    }
  };

  // Listen to popstate safely without infinite loops
  useEffect(() => {
    const handlePopState = () => {
      try {
        const path = window.location.pathname;
        if (path === '/welcome' || path === '/admin') {
          setCurrentPath(path);
        } else {
          setCurrentPath('/');
        }
      } catch {
        setCurrentPath('/');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Restore user session on mount safely
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(USER_SESSION_KEY);
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed && parsed.email) {
          setCurrentUser(parsed);
        }
      }
    } catch {
      // Storage access check
    }
  }, []);

  const handleSignupSuccess = (user: RegisteredUser) => {
    setCurrentUser(user);
    try {
      localStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
    } catch {
      // Ignore storage quota
    }
    navigate('/welcome');
  };

  // Requirement 3 & 4: Hardcoded check, no supabase.auth for admin login
  const handleAdminLogin = (email: string, pass: string): boolean => {
    if (
      email.trim().toLowerCase() === CLIENT_ADMIN_EMAIL.toLowerCase() &&
      pass.trim() === CLIENT_ADMIN_PASSWORD
    ) {
      setIsAdminAuthenticated(true);
      try {
        sessionStorage.setItem(ADMIN_AUTH_KEY, 'authorized');
      } catch {
        // Ignore storage error
      }
      return true;
    }
    return false;
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    try {
      sessionStorage.removeItem(ADMIN_AUTH_KEY);
    } catch {
      // Ignore storage error
    }
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white text-[#0B2A4A] flex flex-col justify-between selection:bg-[#E30613]/10 selection:text-[#E30613]">
      {/* Top Header with Apex Webworks Logo */}
      <Header
        currentPath={currentPath}
        onNavigate={navigate}
        isAdminAuthenticated={isAdminAuthenticated}
        onAdminLogout={handleAdminLogout}
      />

      {/* Main View: "/" is directly the Create Account / Sign In page */}
      <main className="flex-1 flex flex-col justify-center">
        {currentPath === '/' && (
          <SignupForm onSuccess={handleSignupSuccess} />
        )}

        {currentPath === '/welcome' && (
          <HeroSection user={currentUser} />
        )}

        {currentPath === '/admin' && (
          <AdminPortal
            isAdminAuthenticated={isAdminAuthenticated}
            onAdminLogin={handleAdminLogin}
            onAdminLogout={handleAdminLogout}
            onNavigateHome={() => navigate('/')}
          />
        )}
      </main>

      {/* Minimal clean footer */}
      <footer className="w-full border-t border-[#0B2A4A]/10 bg-white py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs text-[#0B2A4A]/50">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#0B2A4A]">Apex Webworks</span>
            <span>·</span>
            <span>Spidey Connect</span>
          </div>

          <div className="text-[11px]">
            &copy; {new Date().getFullYear()} All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
