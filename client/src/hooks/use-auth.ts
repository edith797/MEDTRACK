import { useState, useCallback } from 'react';
import { LocalUser, STORAGE_KEYS } from '@shared/schema';
import { getRandomId } from '@/lib/utils';
import { useToast } from './use-toast';
import { createSampleMedications } from '@/lib/storage';

export function useAuth() {
  const [user, setUser] = useState<LocalUser | null>(null);
  const { toast } = useToast();

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

  return {
    user,
    login,
    logout,
    checkAuth,
    createGuestUser
  };
}
