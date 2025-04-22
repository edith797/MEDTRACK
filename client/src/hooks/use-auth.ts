import { useState, useCallback } from 'react';
import { LocalUser, STORAGE_KEYS } from '@shared/schema';
import { getRandomId } from '@/lib/utils';
import { useToast } from './use-toast';
import { createSampleMedications } from '@/lib/storage';

// Adding these properties to support our modified app
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export function useAuth() {
  const [user, setUser] = useState<LocalUser | null>(null);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const checkAuth = useCallback(() => {
    try {
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
    }
  }, []);

  const login = useCallback((user: LocalUser) => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      setUser(user);
      toast({
        title: "Login Successful",
        description: `Welcome back${user.isGuest ? ' (Guest mode)' : ''}!`,
      });
    } catch (error) {
      console.error('Error during login:', error);
      toast({
        title: "Login Failed",
        description: "There was an error logging in. Please try again.",
        variant: "destructive"
      });
    }
  }, [toast]);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER);
      setUser(null);
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out."
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }, [toast]);

  const createGuestUser = useCallback(() => {
    try {
      const guestUser: LocalUser = {
        id: getRandomId(),
        username: 'Guest',
        isGuest: true
      };
      
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(guestUser));
      
      // Create sample medications for guest user
      createSampleMedications();
      
      setUser(guestUser);
      
      toast({
        title: "Guest Access",
        description: "You are now using MedTrack as a guest. Your data will be stored locally."
      });
    } catch (error) {
      console.error('Error creating guest user:', error);
      toast({
        title: "Error",
        description: "Failed to create guest session. Please try again.",
        variant: "destructive"
      });
    }
  }, [toast]);

  // Create mock mutation objects to satisfy the API
  const loginMutation = {
    mutate: (credentials: any) => {
      console.log("Mock login with:", credentials);
      // Hardcoded login for edith
      if (credentials.username === "edith@gmail.com" && credentials.password === "edith") {
        console.log("Login credentials matched, creating user");
        const user = {
          id: '1',
          username: 'Edith',
          email: credentials.username,
          isGuest: false
        };
        // Store in localStorage
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        // Update state
        setUser(user);
        
        console.log("User set:", user);
        
        toast({
          title: "Login Successful",
          description: "Welcome back, Edith!",
        });
        
        // Force a navigation after successful login
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 500);
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid credentials. Use edith@gmail.com with password 'edith'",
          variant: "destructive"
        });
      }
    },
    isPending: false
  };

  const registerMutation = {
    mutate: (credentials: any) => {
      console.log("Mock register with:", credentials);
      login({
        id: getRandomId(),
        username: credentials.username,
        email: credentials.email,
        isGuest: false
      });
    },
    isPending: false
  };

  return {
    user,
    isLoading,
    error: null,
    login,
    logout,
    checkAuth,
    createGuestUser,
    loginMutation,
    registerMutation
  };
}
